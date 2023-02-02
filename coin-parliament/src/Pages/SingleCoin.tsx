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
const SingleCoin = () => {
  let params = useParams();
  const translate = useTranslation();
  const {user, userInfo} = useContext(UserContext);
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
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>();
  const [selectedTimeFrameArray,setSelectedTimeFrameArray]=useState<any>([])
  const [graphLoading,setGraphLoading]=useState(false)
  const {timeframes} = useContext(AppContext);
  console.log('choseTimeFrame1',selectedTimeFrameArray)
  const newTimeframe:any= []
  const getCpviData = useCallback(async () => {

    if (voteId) {
      // if (!mountedRef.current) return null;
      console.log('timeframeforcpvi',{vote})
      const data = await getCPVIForVote({ id: params?.id, voteForTimeInHour: vote.timeframe.seconds });
     
      return data.data as unknown as LineData[];
    }
  }, [params?.id, voteId, vote]);

  useEffect(() => {
    console.log('cpvidata api called',vote.timeframe)
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
       console.log('getcpvi',vote.timeframe)
        getCpviData().then((data) => data && setCpviData(data));  
    }
    // }, 5000);
  
  // return () => {
  //   clearInterval(timer);
  // }
}, [voteId, getCpviData, vote,totals[params?.id ?? 'BTC']?.total,selectedTimeFrame])
console.log('selected time frame',cpviData)
  const calcVote = useCallback(async () => {
    console.log('getVote called 3')
    // if (!mountedRef.current) return null;
console.log('getVote called 2')
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
    console.log('getVote called 3')
    // if (!mountedRef.current) return null;
console.log('getVote called 2')
    if (user?.uid && params?.id) {
      const v = await Vote.getVote({ userId: user?.uid, coin: params?.id ,timeFrame:timeframe});
      if (v) {console.log('timeframe',v.data())
        // if (v.data().timeframe?.seconds===3600) setSelectedTimeFrame(0)
       return v
      }
    }
  }

  useEffect(() => {
    Promise.all([choseTimeFrame(timeframes[0]?.seconds), choseTimeFrame(timeframes[1]?.seconds), choseTimeFrame(timeframes[2]?.seconds),choseTimeFrame(timeframes[3]?.seconds)])
    .then(responses => {
      return Promise.all(responses.map((res,index) => {

        if(res) {
          console.log('choseTimeFrame',res,index)
          
          newTimeframe.push(index)
          console.log('choseTimeFrame1',newTimeframe)
          setSelectedTimeFrameArray(newTimeframe)
        }
        // else{
        //   console.log('choseTimeFrame',res,index)
        //   setSelectedTimeFrameArray(selectedTimeFrameArray?.filter((item:any)=> item!=index))
        // }
      }))
    })
    // .then(data => {
    //   console.log('promiseAll',data[0]);
    //   console.log('promiseAll',data[1]);
    //   console.log('promiseAll',data[2]);
    //   console.log('promiseAll',data[3]);
    // })
    .catch(error => {
      console.error('promiseAll',error);
    });
   
  }, [user?.uid, params?.id,selectedTimeFrame])
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  // useEffect(() => {
  //   mountedRef.current = false;
  //   setVote({} as VoteResultProps);
  //   setVoteId('');
  // }, [selectedTimeFrame]);
  useEffect(() => {
    console.log('get vote fun called')
    calcVote().then(void 0);
    return () => {
      mountedRef.current = false;
    };
  }, [calcVote,selectedTimeFrame]);

  useEffect(() => {
    if (voteId) {
      onSnapshot(doc(db, "votes", voteId), (doc) => {
        setVote(doc.data() as VoteResultProps);
      });
    }
  }, [voteId]);

  const sound = useRef<HTMLAudioElement>(null);
  const src = require("../assets/sounds/applause.mp3").default;

  const canVote = useMemo(() => {
    return (
      (!vote.expiration && vote.success === undefined) ||
      (vote.expiration && vote.success !== undefined) ||
      Date.now() >= vote.expiration
    );
  }, [vote.expiration, vote.success,selectedTimeFrame]);
console.log('vote',vote)
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

  const favorites = useMemo(() => userInfo?.favorites || [], [userInfo]);
  const coin = coins[params?.id || ""] || ({} as Coin);

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
