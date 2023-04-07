import {Container} from "react-bootstrap";
import React, {RefObject, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Direction, useCanVote, voteConverter, VoteResultProps} from "../../common/models/Vote";
import UserContext from "../../Contexts/User";
import {addDoc, collection, doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {Coin} from "../../common/models/Coin";
import AppContext from "../../Contexts/AppContext";
import VoteForm from "../VoteForm";
import {useTranslation} from "../../common/models/Dictionary";
import Bear from "../icons/Bear";
import Bull from "../icons/Bull";
import NotificationContext, {ToastType} from "../../Contexts/Notification";
import {voteProcedure} from "../Pairs/utils";
import { UserProps } from "../../common/models/User";

export const directions = {
  [Direction.BEAR]: {direction: "rise", name: "BEAR"},
  [Direction.BULL]: {direction: "fall", name: "BULL"},
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
}) => {
  const { votesLast24Hours,user, userInfo } = useContext(UserContext);
  const { showToast } = useContext(NotificationContext);
  const translate = useTranslation();
  const [canVote, tooltipText] = useCanVote();
  const { timeframes , voteRules: { maxVotes,timeLimit }} = useContext(AppContext);
 
  // const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>();
  const [selectedOption, setSelectedOption] = useState<number>();
  const id = "BullVsBearForm";
  useEffect(() => {
    window.scrollTo(0, 0);
    
    return window.scrollTo(0, 0);
  }, []);
  
  const vote = useCallback(async () => {
    if (!(selectedOption !== undefined && selectedTimeFrame !== undefined)) {
      return;
    }
    const chosenTimeframe = timeframes[selectedTimeFrame];

    try {
      setLoading(true);
      if (!user?.uid) {
        throw new Error("Attention! You must be signed-in to cast your vote!");
      }
      const ref = await addDoc<VoteResultProps>(
        collection(db, "votes").withConverter(voteConverter),
        {
          coin: coin.symbol,
          CPMRangePercentage: coin?.CPMRangePercentage || 10,
          direction: selectedOption,
          status: userInfo?.status,
          timeframe: timeframes && chosenTimeframe,
          userId: user?.uid,
          expiration:Date.now() + chosenTimeframe.seconds * 1000 + 1597
        } as VoteResultProps
      );
      const updateExtravote= !!user && votesLast24Hours.length < Number(maxVotes) ;
      if(!updateExtravote){
        const userRef = doc(db, "users", user?.uid);
        const newUserInfo = {
          ...(userInfo as UserProps),
          rewardStatistics:{
            ...userInfo?.rewardStatistics,

          // @ts-ignore
            extraVote: userInfo?.rewardStatistics?.extraVote-1,
           
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
            if (
              selectedTimeFrame !== undefined &&
              selectedOption !== undefined
            ) {
              throttled_vote();
            }
          },
          option1: {
            buttonText:["vote","BULL"],
            image: <Bull />,
            alt: "bull",
            ...coin,
          },
          option2: {
            buttonText:["vote","BEAR"],
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
        }}
      />
    </Container>
  );
};

export default CoinsForm;
