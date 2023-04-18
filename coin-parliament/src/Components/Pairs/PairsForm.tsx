import React, {RefObject, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {useCanVote, voteConverter, VoteResultProps} from "../../common/models/Vote";
import {Coin} from "../../common/models/Coin";
import {addDoc, collection} from "firebase/firestore";
import {db} from "../../firebase";
import UserContext from "../../Contexts/User";
import VoteForm from "../VoteForm";
import AppContext from "../../Contexts/AppContext";
import {symbolCombination, voteProcedure} from "./utils";
import {useTranslation} from "../../common/models/Dictionary";
import styled from "styled-components";
import NotificationContext, {ToastType} from "../../Contexts/Notification";

// export const VS = styled(Col)`
//   flex-grow: 0;
//   flex-basis: 40px;
//   min-width: 0;
//   color: red;
// `;
export const VS = styled.div`
flex-grow: 0;
   flex-basis: 10px;
   min-width: 0;
  color: red;
  left: 0;
  font-family: var(--font-family-poppins);
  font-weight: 700;
  color: var(--blue-violet);
  font-size: var(--font-size-l);
  letter-spacing: 0;
  line-height: 0px;
  white-space: nowrap;
  position: relative;

  &::before {
    content: "";
    position: absolute;
   top:40px;
    left: 9px;
    width: 0;
    height: 30px;
    border: 1px solid var(--blue-violet);
    opacity: 1;
  }

  &::after {
    content: "";
    position: absolute;
    width: 8px;
    height: 0;
    border: 1px solid var(--blue-violet);
    opacity: 1;
    bottom: flex-end;
    top: 40px;
    bottom:-2px;
    left: 6px;
  }
`;

const PairsForm = ({
  coin1,
  coin2,
  setLoading,
  setVoteId,
  sound,
  setConfetti,
  selectedTimeFrame,
  setSelectedTimeFrame,
  coinUpdated
}: {
  coin1: Coin;
  coin2: Coin;
  setVoteId: (id: string) => void;
  setLoading: (bool: boolean) => void;
  sound: RefObject<HTMLAudioElement>;
  setConfetti: (bool: boolean) => void;
  selectedTimeFrame?:number;
  setSelectedTimeFrame?:(n:number)=>void;
  coinUpdated:any;
}) => {
  const { user, userInfo } = useContext(UserContext);
  const { timeframes } = useContext(AppContext);
  const { showToast } = useContext(NotificationContext);
  const id = "PairsForm";
  // const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>();
  const [selectedOption, setSelectedOption] = useState<number>();
  const [canVote, tooltipText] = useCanVote();
  const translate = useTranslation();
  useEffect(() => {
    window.scrollTo(0, 0)
    return window.scrollTo(0, 0)
}, [])
  
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
          coin: symbolCombination([coin1.symbol, coin2.symbol]),
          direction: selectedOption,
          status: userInfo?.status,
          timeframe: timeframes && chosenTimeframe,
          userId: user?.uid,
          valueVotingTime:[coinUpdated[coin1?.symbol]?.price,coinUpdated[coin2?.symbol]?.price],
          voteTime:Date.now(),
          expiration:Date.now() + chosenTimeframe.seconds * 1000 
        } as VoteResultProps
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
    timeframes,
    coin1.symbol,
    coin2.symbol,
    showToast,
  ]);

  const disabled = useMemo(
    () => selectedTimeFrame === undefined,
    [selectedTimeFrame]
  );

  const throttled_vote = useMemo(() => voteProcedure({vote, sound, setConfetti}), [vote, sound, setConfetti]);


  return (
    <Container className="">
      {/* @ts-ignore */}
      <VoteForm
        {...{
          submit: () => {
            if (selectedTimeFrame !== undefined && selectedOption !== undefined) {
              setTimeout(() => {
                throttled_vote();  
              }, 700);
              
            }
          },
          width: 306,
          disabled,
          selectedTimeFrame,
          setSelectedTimeFrame,
          selectedOption,
          setSelectedOption,
          id,
          canVote,
          option1: {
            // buttonText:["vote","BULL"],
            alt: coin1.symbol,
            image: <span style={{fontWeight:'600',fontSize:'24px'}}>{coin1.symbol}</span>,
            title: (
              <div>
                <span >{coin1.name}</span>
                <span className="text-muted m-2">{coin1.symbol}</span>
              </div>
            ),
            ...coin1,
          },
          option2: {
            // buttonText:["vote","BEAR"],
            alt: coin2.symbol,
            image: <span style={{fontWeight:'600',fontSize:'24px'}}>{coin2.symbol}</span>,
            title: (
              <div>
                <span>{coin2.name}</span>
                <span className="text-muted m-2">{coin2.symbol}</span>
              </div>
            ),
            ...coin2,
          },
          texts: {
            // yourVote: translate("Place your vote"),
            yourVote: translate("Vote for your winner").toUpperCase(),
            // selectTimeFrame: translate("Select voting time frame"),
            selectTimeFrame: translate("Select a time frame for your vote").toUpperCase(),
            tooltip: translate(tooltipText),
          },
        }}
      >
        <VS>
         <div style={{position:'absolute', top:'40%',left:window.screen.width<979?'4%':'-10%',fontSize:window.screen.width<979?'':'20px'}}> VS</div>
          
        </VS>
      </VoteForm>
    </Container>
  );
};

export default PairsForm;
