import { Container } from "react-bootstrap";
import React, { RefObject, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Direction, useCanVote, voteConverter, VoteResultProps } from "../../common/models/Vote";
import UserContext from "../../Contexts/User";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Coin } from "../../common/models/Coin";
import AppContext from "../../Contexts/AppContext";
import VoteForm from "../VoteForm";
import { useTranslation } from "../../common/models/Dictionary";
import Bear from "../icons/Bear";
import Bull from "../icons/Bull";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import { voteProcedure } from "../Pairs/utils";
import { UserProps } from "../../common/models/User";
// import { timeStamp } from "console";
import { cmpRangeCoin } from "../Profile/utils";

export const directions = {
  [Direction.BEAR]: { direction: "rise", name: "BEAR" },
  [Direction.BULL]: { direction: "fall", name: "BULL" },
};


const CoinsForm = ({
  coin,
  setVoteId,
  setLoading,
  sound,
  setConfetti,
  selectedTimeFrame,
  setSelectedTimeFrame,
  selectedTimeFrameArray,
  cssDegree,
  votePrice,
  votedDetails,
  coinUpdated,
  hideButton,
  setHideButton,
  setpopUpOpen,
  propVote
}: {
  coin: Coin;
  setVoteId: (id: string) => void;
  setLoading: (bool: boolean) => void;
  setConfetti: (bool: boolean) => void;
  sound: RefObject<HTMLAudioElement>;
  selectedTimeFrame?: number;
  setSelectedTimeFrame?: (n: number) => void;
  selectedTimeFrameArray: any;
  cssDegree?: any;
  votePrice?: any;
  votedDetails?: any;
  coinUpdated: any;
  hideButton?: any;
  setHideButton: (value: number[]) => void;
  setpopUpOpen: React.Dispatch<SetStateAction<boolean>>;
  propVote: VoteResultProps
}) => {
  const { votesLast24Hours, user, userInfo } = useContext(UserContext);
  const { showToast } = useContext(NotificationContext);
  const translate = useTranslation();
  const [canVote, tooltipText] = useCanVote();
  const { timeframes, voteRules: { maxVotes, timeLimit } } = useContext(AppContext);

  // console.log(timeframes,"timeframes")
  // const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>();
  const [selectedOption, setSelectedOption] = useState<number>();
  const id = "BullVsBearForm";

  // console.log()

  useEffect(() => {
    window.scrollTo(0, 0);

    return window.scrollTo(0, 0);
  }, []);

  const vote = useCallback(async () => {
    // console.log('coindata',coinUpdated[coin?.symbol]?.price)
    if (!(selectedOption !== undefined && selectedTimeFrame !== undefined)) {
      return;
    }
    const chosenTimeframe = timeframes[selectedTimeFrame];

    try {
      setLoading(true);
      if (!user?.uid) {
        throw new Error("Attention! You must be signed-in to cast your vote!");
      }
      // 1681801742363
      // 1681801734542
      // console.log('expirevotetime',Date.now() + chosenTimeframe.seconds * 1000 + 1597)
      const ref = await addDoc<VoteResultProps>(
        collection(db, "votes").withConverter(voteConverter),
        {
          coin: coin.symbol,
          // @ts-ignore
          CPMRangePercentage: cmpRangeCoin[chosenTimeframe?.index] || 10,
          direction: selectedOption,
          status: userInfo?.status,
          timeframe: timeframes && chosenTimeframe,
          userId: user?.uid,
          voteTime: Date.now(),
          // @ts-ignore
          valueVotingTime: coinUpdated[coin?.symbol]?.symbol == 'BTC' || coinUpdated[coin?.symbol]?.symbol == 'ETH' ? coinUpdated[coin?.symbol]?.price : coinUpdated[coin?.symbol]?.price + coinUpdated[coin?.symbol]?.randomDecimal,
          expiration: Date.now() + chosenTimeframe.seconds * 1000,
          voteId: `${coin.symbol}-` + `${userInfo?.uid?.slice(0, 5)}` + `${Date.now()}`
        } as VoteResultProps
      );
      const updateExtravote = !!user && votesLast24Hours.length < Number(maxVotes);
      if (!updateExtravote) {
        const userRef = doc(db, "users", user?.uid);
        const newUserInfo = {
          ...(userInfo as UserProps),
          rewardStatistics: {
            ...userInfo?.rewardStatistics,

            // @ts-ignore
            extraVote: userInfo?.rewardStatistics?.extraVote - 1,

          }
        };
        await updateDoc(userRef, newUserInfo);
      }
      // showToast(translate("voted successfully"));
      // await getMessaging();
      if (user?.uid) {
        setVoteId(ref.id);
      }
    } catch (e) {
      console.log(e);
      showToast((e as Error).message, ToastType.ERROR);
      setLoading(false);
    }
  }, [
    userInfo?.status,
    user?.uid,
    setVoteId,
    selectedOption,
    selectedTimeFrame,
    setLoading,
    coin.symbol,
    timeframes,
    showToast,
  ]);

  const disabled = useMemo(
    () => selectedTimeFrame === undefined || !canVote,
    [selectedTimeFrame, canVote]
  );

  const throttled_vote = useMemo(
    () => voteProcedure({ vote, sound, setConfetti }),
    [vote, sound, setConfetti]
  );

  return (
    <Container className='p-0 '>
      {/* @ts-ignore */}
      <VoteForm
        {...{
          hideButton,
          setHideButton,
          disabled,
          selectedTimeFrame,
          setSelectedTimeFrame,
          selectedOption,
          setSelectedOption,
          id,
          canVote,
          selectedTimeFrameArray,
          cssDegree,
          votePrice,
          votedDetails,
          submit: () => {
            // console.log('votebutton',selectedOption)
            if (
              selectedTimeFrame !== undefined &&
              selectedOption !== undefined
            ) {
              setTimeout(() => {
                throttled_vote();
              }, 700);

            }
          },
          option1: {
            buttonText: ["vote", "BULL"],
            image: <Bull />,
            alt: "bull",
            ...coin,
          },
          option2: {
            buttonText: ["vote", "BEAR"],
            image: <Bear />,
            alt: "bear",
            ...coin,
          },
          texts: {
            // yourVote: translate("BULL or BEAR, what’s your VOTE? Vote wisely!"),
            // yourVote: translate("Place your vote"),
            yourVote: translate("Vote for your winner").toUpperCase(),
            // selectTimeFrame: translate("Select voting time frame"),
            selectTimeFrame: translate("Select a time frame for your vote").toUpperCase(),
            tooltip: translate(tooltipText),
          },
          setpopUpOpen,
          vote: propVote
        }}
      />
    </Container>
  );
};

export default CoinsForm;
