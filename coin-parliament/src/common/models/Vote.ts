import {WSnap} from "./Snapshot";
import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  where,
} from "firebase/firestore";
import isNumber from "lodash/isNumber";
import {UserType, UserTypeProps} from "./UserType";
import {useContext} from "react";
import UserContext from "../../Contexts/User";
import AppContext from "../../Contexts/AppContext";

export type VoteProps = {
  coin: string;
  userId: string;
  timeframe: TimeFrame;
  direction: Direction;
  valueVotingTime: number | number[];
  status: UserTypeProps;
};

export type VoteResultProps = VoteProps & {
  voteTime: number;
  expiration: number;
  valueExpirationTime?: number | number[];
  success?: boolean;
  score?: number;
  CPMRangePercentage?: number;
};

export type TimeFrame = {
  index: number;
  name: string;
  seconds: number;
  chosen?: boolean;
};

export enum Direction {
  BULL,
  BEAR,
}

class Vote implements VoteProps {
  coin: string;
  direction: Direction;
  status: UserType;
  timeframe: TimeFrame;
  userId: string;
  valueVotingTime: number;

  constructor(props: {
    coin: string;
    direction: Direction;
    status: UserType;
    timeframe: TimeFrame;
    userId: string;
    valueVotingTime: number;
  }) {
    const { coin, direction, status, timeframe, userId, valueVotingTime } =
      props;
    this.coin = coin;
    this.direction = direction;
    this.status = status;
    this.timeframe = timeframe;
    this.userId = userId;
    this.valueVotingTime = valueVotingTime;
  }

  static async getVote({ userId, coin,timeFrame }: { userId: string; coin: string; timeFrame?: number; }) {
   
    const db = getFirestore();
    let q = query(
      collection(db, "votes"),
      where("userId", "==", userId),
      where("coin", "==", coin),
      where("timeframe.seconds", "==", timeFrame || 3600)
    );

    const docsSnap = await getDocs(q.withConverter(voteConverter));

    if (!docsSnap.empty) {
      const v = docsSnap.docs.find(
        (d) =>
          d.data().expiration ===
          Math.max(...docsSnap.docs.map((doc) => doc.data().expiration))
      );

      const data = v?.data();
      console.log('voteapicalled1', timeFrame,data)
      if (!data) {
        return;
      }

      if (data.expiration - Date.now() < 0) {
        return;
      }

      return v;
    }
  }
}

export type VoteSnap = VoteResultProps & WSnap;
export type VotesResponse = { votes: VoteSnap[], total: number }
export type GetVotesResponse = { coins: VotesResponse, pairs: VotesResponse }

export const voteConverter = {
  toFirestore(vote: VoteResultProps): DocumentData {
    return vote;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): VoteResultProps {
    const data = snapshot.data(options)!;
    return data as VoteResultProps;
  },
};

export const timeframesConverter = {
  toFirestore(timeframes: { timeframes: TimeFrame[] }): DocumentData {
    return timeframes;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): { timeframes: TimeFrame[] } {
    const data = snapshot.data(options)!;
    return {
      timeframes: (data as { timeframes: TimeFrame[] }).timeframes.filter(
        (t) => isNumber(t.index) && t.seconds && t.name
      ),
    };
  },
};

export default Vote;

export const useCanVote: () => [boolean, string] = () => {
  const {
    voteRules: { maxVotes,timeLimit },
  } = useContext(AppContext);
  const {userInfo}=useContext(UserContext)
  const { votesLast24Hours, user } = useContext(UserContext);
  const updateExtravote= !!user && votesLast24Hours.length < Number(maxVotes) ;
  const voted=Number(votesLast24Hours.length) <Number(maxVotes)? Number(votesLast24Hours.length):Number(maxVotes)
  // @ts-ignore
 
  const valid = !!user && voted < Number(maxVotes) + Number(userInfo?.rewardStatistics?.extraVote || 0);
  // @ts-ignore
console.log('extravote12',Math.min(...votesLast24Hours.map((v) => v.voteTime)))
  const timeReturn = new Date(
    Math.min(...votesLast24Hours.map((v) => v.voteTime)) + timeLimit * 1000
  );

  const text = !user
    ? "Attention! You must be signed-in to cast your vote!"
    : `You have voted ${
        votesLast24Hours.length
      } times in the last ${timeLimit/3600} hours. ${maxVotes} time is given. please return ${timeReturn.toLocaleDateString()} at ${timeReturn.toLocaleTimeString()}`;

  return [valid, valid ? "" : text];
};

export const useNumTimeframes = () => {
  const { timeframes } = useContext(AppContext);
  return getNumTimeframes(timeframes);
};

export const getNumTimeframes = (timeframes: TimeFrame[]) =>
  !timeframes ? 0 : timeframes.filter((t) => t.chosen).length;

export const getChosenTimeframe = (id: string) => {
  const form = document.forms.namedItem(id) as HTMLFormElement;
  const list = form?.elements.namedItem("timeframe") as RadioNodeList;
  return (
    list &&
    (Array.isArray(list)
      ? ((
          Array.from(list)?.find(
            (t) => (t as HTMLInputElement).checked
          ) as HTMLInputElement
        )?.value as unknown as number)
      : list.value)
  );
};
