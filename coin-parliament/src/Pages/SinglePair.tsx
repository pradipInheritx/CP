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
const getCPVIForVote = httpsCallable(functions, "getCPVIForVote");
const SinglePair = () => {
  let params = useParams();
  const translate = useTranslation();
  const {coins, totals} = useContext(CoinContext);
  const [symbol1, symbol2] = (params?.id || "").split("-");
  const [coin1, coin2] = [coins[symbol1], coins[symbol2]];
  const {user, userInfo} = useContext(UserContext);
  const {showModal} = useContext(NotificationContext);
  const [vote, setVote] = useState<VoteResultProps>({} as VoteResultProps);
  const [voteId, setVoteId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const favorites = useMemo(() => userInfo?.favorites || [], [userInfo]);
  const combination = symbolCombination([coin1.symbol, coin2.symbol]);
  const [confetti, setConfetti] = useState(false);
  const {width, height} = useWindowSize();
  const [pct,setPct]=useState(0)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>();
  const [graphLoading,setGraphLoading]=useState(false)
  const {timeframes} = useContext(AppContext);
  const mountedRef = useRef(true);
  const getCpviData = useCallback(async () => {
    if (voteId) {
      // if (!mountedRef.current) return null;
      const data = await getCPVIForVote({ id: params?.id, voteForTimeInHour: vote.timeframe.seconds });
      console.log('pair data',data)
      return data;
    }
  }, [params?.id, voteId, vote,selectedTimeFrame]);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);
  useEffect(() => {
    console.log('cpvidata api called',vote.timeframe)
    if(vote.timeframe) {
      setTimeout(() => {
        getCpviData().then((data) => data && setPct(Number(data.data)));  
      }, 2000);
      }
   
  }, [voteId, getCpviData]);
  useEffect(() => {
  
   
    // const timer = setInterval( async() => {
    //   console.log('settimeout1',vote.timeframe)
      if(vote.timeframe) {
        console.log('settimeout2')
        getCpviData().then((data) => data && setPct(Number(data.data)));  
    }
    // }, 5000);
  
  // return () => {
  //   clearInterval(timer);
  // }
}, [voteId, getCpviData, vote,totals,selectedTimeFrame])

  useEffect(() => {
    if (user?.uid && params?.id) {
      Vote.getVote({userId: user?.uid, coin: params?.id, timeFrame:timeframes[selectedTimeFrame || 0]?.seconds }).then((v) => {
        if (v) {
          if (v.data().timeframe?.seconds===3600) setSelectedTimeFrame(0)
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
                  coins={coins}
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
                        />
                      )}
                    </>
                  )}
                </div>
                <div className="text-center">
                  {!graphLoading&& !canVote && user && voteId && (
                    <>
                      <VotedCard
                        {...{vote, coins, totals, symbol1, symbol2, voteId,selectedTimeFrame,
                          setSelectedTimeFrame }}
                      />
                     {graphLoading? <CalculatingVotes/>:<Progress
                        totals={totals}
                        symbol1={symbol1}
                        symbol2={symbol2}
                        pct={pct}
                      />} 
                    </>
                  )}
                  <div className="d-flex justify-content-center align-items-center mt-5 pb-5 mb-5">
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
          texts={{ topInfluencers: "top influencers" }}
        />
      </Container>
    </>
  );
};

export default SinglePair;
