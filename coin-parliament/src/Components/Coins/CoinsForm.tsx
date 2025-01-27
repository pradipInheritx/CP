import {Container} from "react-bootstrap";
import React, {RefObject, useCallback, useContext, useMemo, useState} from "react";
import {Direction, useCanVote, voteConverter, VoteResultProps} from "../../common/models/Vote";
import UserContext from "../../Contexts/User";
import {addDoc, collection} from "firebase/firestore";
import {db} from "../../firebase";
import {Coin} from "../../common/models/Coin";
import AppContext from "../../Contexts/AppContext";
import VoteForm from "../VoteForm";
import {useTranslation} from "../../common/models/Dictionary";
import Bear from "../icons/Bear";
import Bull from "../icons/Bull";
import NotificationContext, {ToastType} from "../../Contexts/Notification";
import {voteProcedure} from "../Pairs/utils";

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
  setSelectedTimeFrame
}: {
  coin: Coin;
  setVoteId: (id: string) => void;
  setLoading: (bool: boolean) => void;
  setConfetti: (bool: boolean) => void;
  sound: RefObject<HTMLAudioElement>;
  selectedTimeFrame?:number;
  setSelectedTimeFrame?:(n:number)=>void;
}) => {
  const {user, userInfo} = useContext(UserContext);
  const {showToast} = useContext(NotificationContext);
  const translate = useTranslation();
  const [canVote, tooltipText] = useCanVote();
  const {timeframes} = useContext(AppContext);
  // const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>();
  const [selectedOption, setSelectedOption] = useState<number>();
  const id = "BullVsBearForm";
console.log('timeframe',selectedTimeFrame)
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
          CPMRangePercentage: coin?.CPMRangePercentage || 1,
          direction: selectedOption,
          status: userInfo?.status,
          timeframe: timeframes && chosenTimeframe,
          userId: user?.uid,
        } as VoteResultProps,
      );
      
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
    [selectedTimeFrame, canVote],
  );

  const throttled_vote = useMemo(() => voteProcedure({vote, sound, setConfetti}), [vote, sound, setConfetti]);

  return (
    <Container className='p-0'>
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
          submit: () => {
            if (selectedTimeFrame !== undefined && selectedOption !== undefined) {
              throttled_vote();
            }
          },
          option1: {
            image: <Bull />,
            alt: "bull",
            ...coin,
          },
          option2: {
            image: <Bear/>,
            alt: "bear",
            ...coin,
          },
          texts: {
            // yourVote: translate("BULL or BEAR, what’s your VOTE? Vote wisely!"),
            yourVote: translate("Your vote"),
            selectTimeFrame: translate("select time frame"),
            tooltip: translate(tooltipText),
          },
        }}
      />
    </Container>
  );
};

export default CoinsForm;
