import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Container} from "react-bootstrap";
import CoinContext from "../Contexts/CoinsContext";
import UserContext from "../Contexts/User";
import Vote, {VoteResultProps} from "../common/models/Vote";
import PairsForm from "../Components/Pairs/PairsForm";
import {doc, onSnapshot, setDoc} from "firebase/firestore";
import {db, functions} from "../firebase";
import VotedCard from "../Components/VotedCard";
import Leaders from "../Components/Pairs/Leaders";
import {Other} from "./SingleCoin";
import {useTranslation} from "../common/models/Dictionary";
import Progress from "../Components/CPVI/Progress";
import {CardContainer, PageContainer} from "../Components/App/App";
import {remove, union} from "lodash";
import NotLoggedInPopup from "../Components/App/NotLoggedInPopup";
import {default as CPCard} from "../Components/Pairs/Card";
import NotificationContext from "../Contexts/Notification";
import {symbolCombination} from "../Components/Pairs/utils";
import Confetti from "react-confetti";
import {useWindowSize} from "../hooks/useWindowSize";
import CalculatingVotes from "../Components/CalculatingVotes";
import { httpsCallable } from "firebase/functions";
import AppContext from "../Contexts/AppContext";
import Countdown from "react-countdown";
import ModalForResult from "./ModalForResult";
import { Coin } from "../common/models/Coin";
import { decimal } from "../Components/Profile/utils";
const getCPVIForVote = httpsCallable(functions, "getCPVIForVote");
const SinglePair = () => {
  let params = useParams();
  const translate = useTranslation();
  const {coins, totals,ws,socket} = useContext(CoinContext);
  const [symbol1, symbol2] = (params?.id || "").split("-");
  const [coin1, coin2] = [coins[symbol1], coins[symbol2]];
  const {user, userInfo,votesLast24Hours} = useContext(UserContext);
  const {showModal} = useContext(NotificationContext);
  const [vote, setVote] = useState<VoteResultProps>({} as VoteResultProps);
  const [voteId, setVoteId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const favorites = useMemo(() => userInfo?.favorites || [], [userInfo]);
  const combination = symbolCombination([coin1?.symbol, coin2?.symbol]);
  const [confetti, setConfetti] = useState(false);
  const {width, height} = useWindowSize();
  const [pct,setPct]=useState(0)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>(0);
  const [selectedTimeFrameArray,setSelectedTimeFrameArray]=useState<any>([])
  const [graphLoading, setGraphLoading] = useState(false)
  const [voteNumber, setVoteNumber] = useState(0)
  const [coinUpdated,setCoinUpdated]=useState<{ [symbol: string]: Coin }>(coins)
  const {
    timeframes,
    setAllPariButtonTime,
    allPariButtonTime,
    setAllButtonTime,
    allButtonTime,
    remainingTimer,
    voteRules
  } = useContext(AppContext);
  const [popUpOpen, setpopUpOpen] = useState(false);
  
  const mountedRef = useRef(true);
  const newTimeframe:any= []
  const AllvoteValueObject: any = [];
  const getCpviData = useCallback(async () => {
    if (voteId) {
      // if (!mountedRef.current) return null;
      const data = await getCPVIForVote({ id: params?.id, voteForTimeInHour: vote.timeframe.seconds });
      
      return data;
    }
  }, [params?.id, voteId, vote,selectedTimeFrame]);
  useEffect(() => {
    if (!ws) return
    console.log('websocket connected')
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const symbol =message?.s?.slice(0, -4)
  
      if (symbol && (symbol == symbol1 || symbol == symbol2)) {      
        // @ts-ignore
      const dot=decimal[symbol]
      // @ts-ignore
      setCoinUpdated((prevCoins) => ({        
        ...prevCoins,
        [symbol]: {
          ...prevCoins[symbol],        
          price:Number(message?.c).toFixed(dot?.decimal || 2),
        },
      }));
    }
  
    };
  
   
  }, [ws])
  useEffect(() => {
    if (!socket) return
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
     
if (data?.result?.data[0].a){
      setCoinUpdated((prevCoins) => ({
        ...prevCoins,
        ['CRO']: {
          ...prevCoins['CRO'],
          price: data?.result?.data[0]?.a,
        },
      }));
    }
    };
  
  }, [socket])
  // useEffect(() => {
    
  //   if(vote.timeframe) {
  //     setTimeout(() => {
  //       getCpviData().then((data) => data && setPct(Number(data.data)));  
  //     }, 2000);
  //     }
   
  // }, [voteId, getCpviData]);
  useEffect(() => {
  
   
    // const timer = setInterval( async() => {
    
      if(vote.timeframe) {
        
        getCpviData().then((data) => data && setPct(Number(data.data)));  
    }
    // }, 5000);
  
  // return () => {
  //   clearInterval(timer);
  // }
}, [voteId, getCpviData, vote,totals,selectedTimeFrame])
const choseTimeFrame = async (timeframe:any) => {

  if (user?.uid && params?.id) {
    const v = await Vote.getVote({ userId: user?.uid, coin: params?.id ,timeFrame:timeframe});
    if (v) {
      
     return v
    }
  }
}

useEffect(() => {
  Promise.all([choseTimeFrame(timeframes[0]?.seconds), choseTimeFrame(timeframes[1]?.seconds), choseTimeFrame(timeframes[2]?.seconds),choseTimeFrame(timeframes[3]?.seconds)])
  .then(responses => {
    return Promise.all(responses.map((res,index) => {

      if(res) {
        
        
        AllvoteValueObject[index] = res.data();
        // setAllPariButtonTime(AllvoteValueObject);
        setAllButtonTime(AllvoteValueObject);
        
        newTimeframe.push(index)
        
        setSelectedTimeFrameArray(newTimeframe)
      }
      // else{
      
      //   setSelectedTimeFrameArray(selectedTimeFrameArray?.filter((item:any)=> item!=index))
      // }
    }))
  })
  .catch(error => {
    console.error('promiseAll',error);
  });
 
}, [user?.uid, params?.id, selectedTimeFrame,voteId,vote])
  useEffect(() => {
    return () => {
      setAllButtonTime();
      setAllPariButtonTime();
      mountedRef.current = false;
    };
  }, []);
  console.log('selectedTimeframe',selectedTimeFrameArray)
  useEffect(() => {
    if (user?.uid && params?.id) {
      Vote.getVote({userId: user?.uid, coin: params?.id, timeFrame:timeframes[selectedTimeFrame || 0]?.seconds }).then((v) => {
        if (v) {
          // if (v.data().timeframe?.seconds===3600) setSelectedTimeFrame(0)
          setVote(v.data());
          setVoteId(v.id);
        }else setVote({} as VoteResultProps);
      });
    }
  }, [user?.uid, params?.id,selectedTimeFrame]);

  const canVote =
    vote &&
    ((!vote.expiration && vote.success === undefined) ||
      (vote.expiration && vote.success !== undefined));

  useEffect(() => {
    if (!canVote && loading) {
      setLoading(false);
    }
  }, [canVote, loading]);
  useEffect(() => {
    if (voteId) {
      onSnapshot(doc(db, "votes", voteId), (doc) => {
        setVote(doc.data() as VoteResultProps);
      });
    }
  }, [voteId]);
  useEffect(() => {
    
    setGraphLoading(true);
      setTimeout(() => {
      
        setGraphLoading(false);
        
      }, 2400);
    
  }, [selectedTimeFrame]);
  useEffect(() => {
    const voted=Number(votesLast24Hours.length) <Number(voteRules?.maxVotes)? Number(votesLast24Hours.length):Number(voteRules?.maxVotes)
  setVoteNumber(Number(voteRules?.maxVotes)  + Number(userInfo?.rewardStatistics?.extraVote)  - Number(voted) || 0)
    
  }, [voteRules?.maxVotes ,userInfo?.rewardStatistics?.extraVote,votesLast24Hours.length])
  
  const sound = useRef<HTMLAudioElement>(null);
  const src = require("../assets/sounds/applause.mp3").default;

  return (
    <>
      <audio className="d-none" ref={sound}>
        <source src={src} type="audio/mpeg"/>
      </audio>
      {confetti && <Confetti
        width={width}
        height={height}
      />}
      <PageContainer fluid radius={87}>
        <>
          {coin1 && coin2 ? (
            <div>
              <CardContainer>
                <CPCard
                  coins={coinUpdated}
                  single={true}
                  onClick={() => {
                  }}
                  favorite={favorites.includes(combination)}
                  setFavorite={async (add) => {
                    if (user) {
                      let favs;
                      if (add) {
                        favs = union(favorites, [combination]);
                      } else {
                        favs = remove(favorites, combination);
                      }
                      const userRef = user?.uid && doc(db, "users", user?.uid);
                      userRef &&
                        (await setDoc(
                          userRef,
                          {favorites: favs},
                          {merge: true},
                        ));
                    } else {
                      showModal(<NotLoggedInPopup/>);
                    }
                  }}
                  coin1={coin1}
                  coin2={coin2}
                />
              </CardContainer>
              <Container>
                <div>
                  {canVote && (
                    <>
                      {loading ? (
                        <CalculatingVotes/>
                      ) : (
                        <PairsForm
                          sound={sound}
                          coin1={coin1}
                          coin2={coin2}
                          setVoteId={setVoteId}
                          setLoading={setLoading}
                          setConfetti={setConfetti}
                          selectedTimeFrame={selectedTimeFrame}
                          setSelectedTimeFrame={setSelectedTimeFrame}
                          coinUpdated={coinUpdated}
                        />
                      )}
                    </>
                  )}
                </div>
                <div className="text-center">
                  {!graphLoading&& !canVote && user && voteId && (
                    <>
                      <VotedCard
                        {...{vote, coins:coinUpdated, totals, symbol1, symbol2, voteId,selectedTimeFrame,
                          setSelectedTimeFrame,selectedTimeFrameArray , setpopUpOpen}}
                      />
                     {graphLoading? <CalculatingVotes/>:
                     <Progress
                        totals={totals}
                        symbol1={symbol1}
                        symbol2={symbol2}
                        pct={pct}
                      />} 
                    </>
                  )}
                  {vote && vote?.valueVotingTime && vote?.valueExpirationTime &&  <ModalForResult
                    popUpOpen={popUpOpen}
                    setpopUpOpen={setpopUpOpen}
                    vote={vote && vote}
                    type={"pair"}
                  />}
                  <div className="d-flex justify-content-center align-items-center mt-5 ">
                    <Link to="" style={{textDecoration:'none'}}>
                      <Other>
                      {!voteNumber && remainingTimer ?                          
                          <span style={{ marginLeft: '20px' }}>
                            {/* @ts-ignore */}
                            <Countdown date={remainingTimer} 
                         renderer={({ hours, minutes, seconds, completed }) => {
                        
                          return (
                            <span style={{color:'#6352e8',fontSize:'12px',fontWeight:400}}>
                              {/* {hours < 10 ? `0${hours}` : hours}: */}
                              {Number(voteRules?.maxVotes)} votes in {' '}
                              {hours < 1 ? null : `${hours} :` }
                              {minutes < 10 ? `0${minutes}` : minutes}:
                              {seconds < 10 ? `0${seconds}` : seconds}
                            </span>
                          );
                        
                      }}
                          /></span>
                         :""}

                      </Other>
                    </Link>
                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-3 pb-5 mb-5">
                    <Link to="/pairs" style={{textDecoration:'none'}}>
                      <Other>{translate("vote for other pairs")}</Other>
                    </Link>
                  </div>
                </div>
              </Container>
            </div>
          ) : (
            <>No coin found</>
          )}
        </>
      </PageContainer>
      <Container style={{marginTop:'-15px'}}>
        <Leaders
          symbol={params?.id || ""}
          texts={{ topInfluencers: ("top influencers").toUpperCase() }}
        />
      </Container>
    </>
  );
};

export default SinglePair;
