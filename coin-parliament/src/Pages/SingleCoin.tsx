import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Container} from "react-bootstrap";
import CoinContext from "../Contexts/CoinsContext";

import {Coin} from "../common/models/Coin";
import VotedCard from "../Components/VotedCard";
import Vote, {VoteResultProps} from "../common/models/Vote";
import UserContext from "../Contexts/User";
import {doc, onSnapshot, setDoc} from "firebase/firestore";
import {db, functions} from "../firebase";
import Leaders from "../Components/Pairs/Leaders";
import {default as CPCard} from "../Components/Coins/Card";
import {useTranslation} from "../common/models/Dictionary";
import {remove, union} from "lodash";
import styled from "styled-components";
import {Buttons} from "../Components/Atoms/Button/Button";
import {CardContainer, PageContainer} from "../Components/App/App";
import {LineData} from "lightweight-charts";
import {httpsCallable} from "firebase/functions";
import Graph from "../Components/CPVI/Graph";
import CoinsForm from "../Components/Coins/CoinsForm";
import NotificationContext from "../Contexts/Notification";
import NotLoggedInPopup from "../Components/App/NotLoggedInPopup";
import {useWindowSize} from "../hooks/useWindowSize";
import Confetti from "react-confetti";
import CalculatingVotes from "../Components/CalculatingVotes";
import { setInterval } from "timers";
import AppContext from "../Contexts/AppContext";
import Countdown from "react-countdown";

export const Title = styled.h2`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-14) / 23px var(--font-family-poppins);
  font-size: var(--font-size-16);
  line-height: 23px;
  letter-spacing: var(--character-spacing-0);
  color: var(--color-160133);
  text-align: center;
  opacity: 1;
font-size:14px !important;
  &:first-letter {
    text-transform: capitalize;
  }
`;

export const Other = styled(Buttons.ClickableText)`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-14) / var(--line-spacing-14) var(--font-family-poppins);
  color: var(--color-6352e8);
  text-align: center;
  letter-spacing: 0.04px;
  text-transform: uppercase;
  opacity: 1;
  // text-decoration: underline;
`;

const getCPVIForVote = httpsCallable(functions, "getCPVIForVote");
// const getDatas = httpsCallable(functions, "getDatas");
const cpviRealTimeData = httpsCallable(functions, "cpviRealTimeData");
const getResultPrice = httpsCallable(functions, "getOldAndCurrentPriceAndMakeCalculation");

const SingleCoin = () => {
  let params = useParams();
  const translate = useTranslation();
  const {user, userInfo,votesLast24Hours} = useContext(UserContext);
  const {coins, totals} = useContext(CoinContext);
  const {showModal} = useContext(NotificationContext);
  const [symbol1, symbol2] = (params?.id || "").split("-");
  const [vote, setVote] = useState<VoteResultProps>({} as VoteResultProps);
  const [voteId, setVoteId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const [cpviData, setCpviData] = useState<LineData[]>();
  const mountedRef = useRef(true);
  const {width, height} = useWindowSize();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>(0);
  const [selectedTimeFrameArray,setSelectedTimeFrameArray]=useState<any>([])
  const [graphLoading,setGraphLoading]=useState(false)
  const [cssDegree, setcssDegree] = useState<any>([]);
  const [votePrice, setvotePrice] = useState<any>([]);
  const [votedDetails, setVotedDetails] = useState<any>([]);
  const [voteNumber, setVoteNumber] = useState<any>([]);
  // const [graphLoading,setGraphLoading]=useState(false)
  const { timeframes, setAllButtonTime, allButtonTime, forRun, setForRun,
    remainingTimer,
    voteRules} = useContext(AppContext);
  // console.log('choseTimeFrame1',selectedTimeFrameArray)
  const newTimeframe: any = []
  const AllcssDegree: any = [];
  const AllvotePrice: any = [];
  const AllvoteValueObject: any = [];

  const getCpviData = useCallback(async () => {

    if (voteId) {
      // if (!mountedRef.current) return null;
      // console.log('timeframeforcpvi',{vote})
      const data = await getCPVIForVote({ id: params?.id, voteForTimeInHour: vote.timeframe.seconds });
     
      return data.data as unknown as LineData[];
    }
  }, [params?.id, voteId, vote]);
  
// const getResultForPendingVote=async()=>{
//   const data = await getResultPrice({
//     coin1: "ETH",
//     coin2: "",
//     voteId: 'kJEjAQa6IwmwZGS3DRMI',
//     voteTime: '1677839924282',
//     valueVotingTime: '1563.00',
//     expiration: '1677839984282',
//     timestamp: '1677839984282'
// });
     
//       return data.data as unknown as LineData[];
// }
  useEffect(() => {
    // 
    // console.log('cpvidata api called',vote.timeframe)
    if(vote.timeframe) {
      setTimeout(() => {
        getCpviData().then((data) => data && setCpviData(data));  
      }, 2000);
      // getDatas()
      
      

      }
   
  }, [voteId, getCpviData, vote]);
// useEffect(() => {
//   console.log('livedata',vote.timeframe)
//   if(vote.timeframe && cpviData?.length) {
//   var timer = setInterval( async() => {
//     //  @ts-ignore
//      console.log('livedata1',cpviData[50])
    
//       //  @ts-ignore
//         cpviRealTimeData({id: params?.id, lastTimeFrame: cpviData[50].time}).then((data) => console.log('live data',data));  
    
//     }, 10000);
//   }
//   return () => {
//     clearInterval(timer);
//   }
// }, [voteId,cpviData])
useEffect(() => {
  
   
    // const timer = setInterval( async() => {
    //   console.log('settimeout1',vote.timeframe)
      if(vote.timeframe) {
      //  console.log('getcpvi',vote.timeframe)
        getCpviData().then((data) => data && setCpviData(data));  
    }
    // }, 5000);
  
  // return () => {
  //   clearInterval(timer);
  // }
}, [voteId, getCpviData, vote, totals[params?.id ?? 'BTC']?.total, selectedTimeFrame])
  
  useEffect(() => {
    const voted=Number(votesLast24Hours.length) <Number(voteRules?.maxVotes)? Number(votesLast24Hours.length):Number(voteRules?.maxVotes)
  setVoteNumber(Number(voteRules?.maxVotes)  + Number(userInfo?.rewardStatistics?.extraVote)  - Number(voted) || 0)
    
  }, [voteRules?.maxVotes ,userInfo?.rewardStatistics?.extraVote,votesLast24Hours.length])
  
// console.log('selected time frame',cpviData)
 
const calcVote = useCallback(async () => {
    // console.log('getVote called 3')
    // if (!mountedRef.current) return null;
    // console.log('getVote called 2')
    if (user?.uid && params?.id) {
      const v = await Vote.getVote({ userId: user?.uid, coin: params?.id ,timeFrame:timeframes[selectedTimeFrame || 0]?.seconds});
      if (v) {console.log('timeframe',v.data())
        if (v.data().timeframe?.seconds===3600) setSelectedTimeFrame(0)
        if (v.data().timeframe?.seconds===3600) setSelectedTimeFrameArray([...newTimeframe,0])
        setVote(v.data());
        setVoteId(v.id);
      }else  setVote({} as VoteResultProps);
    }
  }, [user?.uid, params?.id,selectedTimeFrame]);


  const choseTimeFrame = async (timeframe:any) => {

    if (user?.uid && params?.id) {
      const v = await Vote.getVote({ userId: user?.uid, coin: params?.id ,timeFrame:timeframe});
      if (v) {
        // console.log('timeframe',v.data())
       return v
      }
    }
  }

  useEffect(() => {

    // console.log("it is not run")
    Promise.all([choseTimeFrame(timeframes[0]?.seconds),choseTimeFrame(timeframes[1]?.seconds), choseTimeFrame(timeframes[2]?.seconds),choseTimeFrame(timeframes[3]?.seconds)])
    .then(responses => {
      return Promise.all(responses.map((res,index) => {
        if (res) {                  
          // console.log('choseTimeFrame',res,index)        
          // getLeftTime(res.data(), index);          
          AllvoteValueObject[index] = res.data();
          setAllButtonTime(AllvoteValueObject);
          setVotedDetails(AllvoteValueObject);
          newTimeframe.push(index)
          // console.log('choseTimeFrame1',newTimeframe)
          setSelectedTimeFrameArray(newTimeframe)
        }
        else{                    
          // setAllButtonTime();
          // console.log('choseTimeFramesdfasd',allButtonTime)
        }
      }))
    })
    .catch(error => {
      console.error('promiseAll',error);
    });
   
  }, [user?.uid, params?.id, selectedTimeFrame,forRun,voteId,vote])
  


  useEffect(() => {
    return () => {
      setAllButtonTime();
      mountedRef.current = false;
    };
  }, []);
  // useEffect(() => {
  //   mountedRef.current = false;
  //   setVote({} as VoteResultProps);
  //   setVoteId('');
  // }, [selectedTimeFrame]);
  useEffect(() => {
    // console.log('get vote fun called')
    calcVote().then(void 0);
    
    return () => {
      mountedRef.current = false;
    };    
  }, [calcVote,selectedTimeFrame]);



  useEffect(() => {
    if (voteId) {
      // getResultForPendingVote()
      onSnapshot(doc(db, "votes", voteId), (doc) => {

        // if () {
          
          setVote(doc.data() as VoteResultProps);
        // }

        // console.log(doc.data(), "doc.data()")  
        
          // AllvoteValueObject = [];  
          // setAllButtonTime([...allButtonTime,viewData]);
        
        

      });
        // setForRun(forRun + 1)
    }

  }, [voteId]);



  const getLeftTime = (value: any,index:number) => {
    // console.log(value, "CheckvalueId", index);
    let t = value.voteTime / 1000; //mili
    let d = value.timeframe.seconds; //second already
    let liveTime = Date.now() / 1000;
    let ori = t + d;
    let val = (ori - liveTime) / d;
    let deg = val * 360;
    AllcssDegree[index] = Math.round(deg);
    AllvotePrice[index] =  value.valueVotingTime;
    // console.log(vote,"all vote check")
    if (deg >0) {
      setcssDegree(AllcssDegree);
      setvotePrice(AllvotePrice);
    }
  }
  
  const sound = useRef<HTMLAudioElement>(null);
  const src = require("../assets/sounds/applause.mp3").default;
// console.log('i am rendering')
  const canVote = useMemo(() => {
    return (
      (!vote.expiration && vote.success === undefined) ||
      (vote.expiration && vote.success !== undefined) ||
      Date.now() >= vote?.expiration
    );
  }, [vote.expiration, vote.success,selectedTimeFrame ]);
  // console.log('canvote',canVote,vote)
  useEffect(() => {
    if (!canVote && loading) {
      setLoading(false);
    }
  }, [canVote, loading]);
  useEffect(() => {
    
    setGraphLoading(true);
      setTimeout(() => {
      
        setGraphLoading(false);
        
      }, 2400);
    
  }, [selectedTimeFrame]);
console.log('vote',vote)
  const favorites = useMemo(() => userInfo?.favorites || [], [userInfo]);
  const coin = coins[params?.id || ""] || ({} as Coin);

console.log(cpviData,"cpviData")

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
          {coin ? (
            <>
              <CardContainer>
                <CPCard
                  single={true}
                  favorite={favorites.includes(coin.symbol)}
                  setFavorite={async (add) => {
                    if (user) {
                      let favs;
                      if (add) {
                        favs = union(favorites, [coin.symbol]);
                      } else {
                        favs = remove(favorites, coin.symbol);
                      }
                      const userRef = user?.uid && doc(db, "users", user?.uid);
                      userRef &&
                        (await setDoc(
                          userRef,
                          { favorites: favs },
                          { merge: true }
                        ));
                    } else {
                      showModal(<NotLoggedInPopup/>);
                    }
                  }}
                  symbol={coin.symbol}
                  coins={coins}
                  totals={totals}
                />
              </CardContainer>
              <Container>
                {canVote && (
                  <>{loading  ? (
                    <CalculatingVotes/>
                  ) : (
                    <CoinsForm
                      sound={sound}
                      coin={coin}
                      setVoteId={setVoteId}
                      setLoading={setLoading}
                      setConfetti={setConfetti}
                      selectedTimeFrame={selectedTimeFrame}
                      setSelectedTimeFrame={setSelectedTimeFrame}
                      selectedTimeFrameArray={selectedTimeFrameArray}
                    />
                  )}</>
                )}
                <div className="text-center">
                  {!graphLoading && !canVote && user && voteId && (
                    <>
                      <VotedCard
                        {...{
                          vote,
                          coins,
                          totals,
                          symbol1,
                          symbol2,
                          voteId,
                          selectedTimeFrame,
                          setSelectedTimeFrame,
                          selectedTimeFrameArray
                        }}
                      />

                      { cpviData?.length && params?.id && (
                        graphLoading?  <CalculatingVotes/>: 
                        
                        <Graph
                          data={cpviData}
                          totals={totals}
                          symbol={params?.id}
                        />
                      )}
                    </>
                  )}
                </div>
              </Container>
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
              <div className="d-flex justify-content-center align-items-center mt-5 pb-5 mb-5">
                <Link to="/coins" style={{textDecoration:'none'}}>
                  <Other>{translate("vote for other coins")}</Other>
                </Link>
              </div>
            </>
          ) : (
            <>No coin found</>
          )}
        </>
      </PageContainer>
      <Container style={{marginTop:'-15px'}}>
        <div className="text-center">
          <div>
            <Leaders
              symbol={coin.symbol}
              texts={{ topInfluencers: "top Influencers" }}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default SingleCoin;
