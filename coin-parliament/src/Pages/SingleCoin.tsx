import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import CoinContext from "../Contexts/CoinsContext";

import { Coin } from "../common/models/Coin";
import VotedCard from "../Components/VotedCard";
import Vote, { VoteResultProps } from "../common/models/Vote";
import UserContext from "../Contexts/User";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, functions } from "../firebase";
import Leaders from "../Components/Pairs/Leaders";
import { default as CPCard } from "../Components/Coins/Card";
import { useTranslation } from "../common/models/Dictionary";
import { remove, union } from "lodash";
import styled from "styled-components";
import { Buttons } from "../Components/Atoms/Button/Button";
import { CardContainer, PageContainer } from "../Components/App/App";
import { LineData } from "lightweight-charts";
import { HttpsCallableResult, httpsCallable } from "firebase/functions";
import Graph from "../Components/CPVI/Graph";
import CoinsForm from "../Components/Coins/CoinsForm";
import NotificationContext from "../Contexts/Notification";
import NotLoggedInPopup from "../Components/App/NotLoggedInPopup";
// import {useWindowSize} from "../hooks/useWindowSize";
// import Confetti from "react-confetti";
import CalculatingVotes from "../Components/CalculatingVotes";
import AppContext from "../Contexts/AppContext";
import Countdown from "react-countdown";
import ModalForResult from "./ModalForResult";
import { decimal } from "../Components/Profile/utils";
import Progress from "../Components/CPVI/Progress";
import { VoteContext, VoteDispatchContext } from "Contexts/VoteProvider";
import { Http2ServerResponse } from "http2";
// import Speedometer from "./Speedometer";

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

// const getCPVIForVote = httpsCallable(functions, "getCPVIForVote");
const getCPVIForVoteV2 = httpsCallable(functions, "CPVIForCoin");
// const getDatas = httpsCallable(functions, "getDatas");
// const cpviRealTimeData = httpsCallable(functions, "cpviRealTimeData");
// const getResultPrice = httpsCallable(functions, "getOldAndCurrentPriceAndMakeCalculation");

const SingleCoin = () => {
  let params = useParams();
  const translate = useTranslation();
  const [symbol1, symbol2] = (params?.id || "").split("-");
  const { user, userInfo, votesLast24Hours } = useContext(UserContext);
  const { coins, setCoins, myCoins, setMyCoins, totals, ws, socket, socketConnect } = useContext(CoinContext);
  const { showModal } = useContext(NotificationContext);
  const [vote, setVote] = useState<VoteResultProps>({} as VoteResultProps);
  const [voteId, setVoteId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [allActiveVotes, setAllActiveVotes] = useState<VoteResultProps[]>([]);
  const [cpviData, setCpviData] = useState<any>();
  const mountedRef = useRef(true);
  // const {width, height} = useWindowSize();
  const [searchParams] = useSearchParams();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>(0);
  useEffect(() => {
    setSelectedTimeFrame(parseInt(searchParams.get('timeFrame') || '0'));
  }, [JSON.stringify(searchParams.get('timeFrame'))]);
  const [selectedTimeFrameArray, setSelectedTimeFrameArray] = useState<any>([])
  const [graphLoading, setGraphLoading] = useState(false)
  // const [cssDegree, setcssDegree] = useState<any>([]);
  // const [votePrice, setvotePrice] = useState<any>([]);
  const [votedDetails, setVotedDetails] = useState<any>([]);
  const [voteNumber, setVoteNumber] = useState<any>([]);
  const [votingTimer, setVotingTimer] = useState(0)
  const [coinUpdated, setCoinUpdated] = useState<{ [symbol: string]: Coin }>({});
  useEffect(() => {
    setCoinUpdated(coins);
  }, [coins])
  // const [graphLoading,setGraphLoading]=useState(false)
  const { timeframes, setAllButtonTime, allButtonTime, forRun, setForRun, remainingTimer, voteRules, voteNumberEnd } = useContext(AppContext);
  const voteDetails = useContext(VoteContext);
  const setVoteDetails = useContext(VoteDispatchContext);
  // @ts-ignore
  const getCoinPrice = localStorage.getItem('CoinsPrice') ? JSON.parse(localStorage.getItem('CoinsPrice')) : {}
  const singleLivePrice = useRef<{ [symbol: string]: Coin }>(Object.keys(getCoinPrice).length ? getCoinPrice : coins)    
  useEffect(() => {
    if (coinUpdated) {
      setMyCoins(coinUpdated)      
    }
  }, [coinUpdated])

  const newTimeframe: any = []
  // const AllcssDegree: any = [];
  // const AllvotePrice: any = [];
  const AllvoteValueObject: any = [];
  const updateRandomDecimal = () => {
    setCoinUpdated((prevCoins) => ({
      ...prevCoins,
      [symbol1]: {
        ...prevCoins[symbol1],
        randomDecimal: (prevCoins[symbol1]?.randomDecimal || 5) + (Math.random() < 5 ? -1 : 1)
      },
    }));
    if (Object.keys(singleLivePrice.current).length && coins != singleLivePrice.current) {
      setCoins(singleLivePrice.current)
    }
  }
  useEffect(() => {
    if (symbol1 == 'BTC' || symbol1 == 'ETH') return
    const interval = setInterval(function () {
      updateRandomDecimal()
    }, 1500);

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (!ws) return

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const symbol = message?.s?.slice(0, -4)
      
      if (symbol && symbol == params?.id) {
        // console.log('coinprice',message?.c)
        const dot = decimal[symbol]
        setCoinUpdated((prevCoins) => ({
          ...prevCoins,
          [symbol]: {
            ...prevCoins[symbol],
            price: Number(message?.c).toFixed(dot?.decimal || 2),
            randomDecimal: Number(Number(message?.c).toFixed(dot?.decimal || 2)) == Number(prevCoins[symbol]?.price) ? prevCoins[symbol].randomDecimal : 5
          },
        }));
      }      
      if (symbol && Object.keys(coins).includes(symbol)) {

        // @ts-ignore
        const dot = decimal[symbol]
        singleLivePrice.current = {
          ...singleLivePrice.current,
          [symbol]: {
            ...singleLivePrice.current[symbol],
            name: singleLivePrice.current[symbol].name,
            symbol: symbol,
            price: Number(message?.c).toFixed(dot?.decimal || 2),
            randomDecimal: Number(Number(message?.c).toFixed(dot?.decimal || 2)) == Number(singleLivePrice.current[symbol]?.price) ? singleLivePrice.current[symbol]?.randomDecimal : 5
          },
        }
        if (Object.keys(singleLivePrice.current).length) {
          localStorage.setItem('CoinsPrice', JSON.stringify(singleLivePrice.current));
        }
      }
      
    };
  }, [ws, socketConnect])


  useEffect(() => {
    if (!socket) return
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data?.result?.data[0].a && Object.keys(coins).includes("CRO")) {
        setCoinUpdated((prevCoins) => ({
          ...prevCoins,
          ['CRO']: {
            ...prevCoins['CRO'],
            price: data?.result?.data[0]?.a,
            randomDecimal: 5
          },
        }));
        singleLivePrice.current = {
          ...singleLivePrice.current,
          ['CRO']: {
            ...singleLivePrice.current['CRO'],
            name: singleLivePrice.current['CRO'].name,
            symbol: "CRO",
            // @ts-ignore   
            price: Number(data?.result?.data[0]?.a).toFixed(dot?.decimal || 2),
            randomDecimal: 5
          },
        }
      }
    };

  }, [socket, socketConnect])
  
  useEffect(() => {    
    if (!socketConnect && getCoinPrice) {
      singleLivePrice.current = {
        ...singleLivePrice.current,
        ...getCoinPrice
      }
    }
    // @ts-ignore
  }, [JSON.parse(localStorage.getItem('CoinsPrice'))])

  const getCpviData = useCallback(async () => {

    if (voteId) {
      // if (!mountedRef.current) return null;

      // const data = await getCPVIForVote({ id: params?.id, voteForTimeInHour: 86400 });
      const data2 = await getCPVIForVoteV2({ coinName: params?.id });      

      console.log(data2,"data2")

      // return data.data as unknown as LineData[];
      return data2.data;
    }
  }, [params?.id, voteId, vote?.voteTime]);


  // useEffect(() => {
  //   if(vote.timeframe) {
  //     setTimeout(() => {
  //       getCpviData().then((data) => data && setCpviData(data));  
  //     }, 2000);
  //     }
  // }, [voteId, getCpviData, vote]);

  useEffect(() => {
    // if (vote.timeframe) {

      getCpviData().then((data) => data && setCpviData(data));
    // }
  }, [voteId, getCpviData, vote?.voteTime, totals[params?.id ?? 'BTC']?.total, selectedTimeFrame])

  useEffect(() => {
    const voted = Number(votesLast24Hours.length) < Number(voteRules?.maxVotes) ? Number(votesLast24Hours.length) : Number(voteRules?.maxVotes)
    setVoteNumber(Number(voteRules?.maxVotes) + Number(userInfo?.rewardStatistics?.extraVote || 0) - Number(voted) || 0)

  }, [voteRules?.maxVotes, userInfo?.rewardStatistics?.extraVote, votesLast24Hours.length])



  const calcVote = useCallback(async () => {

    // if (!mountedRef.current) return null;    
    if (user?.uid && params?.id) {
      const v = await Vote.getVote({ userId: user?.uid, coin: params?.id, timeFrame: timeframes[selectedTimeFrame || 0]?.seconds });
      if (v) {
        // if (v.data().timeframe?.seconds===3600) setSelectedTimeFrame(0)
        // console.log(v.data(), "checkallv.data")
        // if (v.data().timeframe?.seconds === 3600) setSelectedTimeFrameArray([...newTimeframe, 0])
        setVote(v.data());
        setVoteId(v.id);
      } else setVote({} as VoteResultProps);
    }
  }, [user?.uid, params?.id, selectedTimeFrame]);


  const choseTimeFrame = async (timeframe: any) => {

    if (user?.uid && params?.id) {
      const v = await Vote.getVote({ userId: user?.uid, coin: params?.id, timeFrame: timeframe });
      if (v) {
        console.log(v.id, "checkallv.data")
        return v
      }
    }
  }

  useEffect(() => {
    Promise.all([choseTimeFrame(timeframes[0]?.seconds), choseTimeFrame(timeframes[1]?.seconds), choseTimeFrame(timeframes[2]?.seconds), choseTimeFrame(timeframes[3]?.seconds)])
      .then(responses => {
        let tempAllActiveVotes: VoteResultProps[] = [];
        Promise.all(responses.map((res, index) => {
          if (res) {
            // getLeftTime(res.data(), index); 
            tempAllActiveVotes = [...tempAllActiveVotes, { ...res.data(), id: res.id }];
            AllvoteValueObject[index] = res.data();
            setAllButtonTime(AllvoteValueObject);
            setVotedDetails(AllvoteValueObject);
            newTimeframe.push(index)

            setSelectedTimeFrameArray(newTimeframe)
          }
          else {

            setSelectedTimeFrameArray(newTimeframe)
            // AllvoteValueObject.splice(index, 1);               
            // setAllButtonTime(AllvoteValueObject);
            //  setVotedDetails(AllvoteValueObject);
            //  newTimeframe.splice(index, 1);  

            //  setSelectedTimeFrameArray(newTimeframe)

          }
        }))

        
        setAllActiveVotes(() => {
          return tempAllActiveVotes.filter((value: VoteResultProps) => value !== undefined);
        });
      })
      .catch(error => {
        console.error('promiseAll', error);
      });

  }, [user?.uid, params?.id, selectedTimeFrame, forRun, voteId, vote])



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

    calcVote().then(void 0);

    return () => {
      mountedRef.current = false;
    };
  }, [selectedTimeFrame]);

  useEffect(() => {


    if (voteId) {
      // getResultForPendingVote()
      onSnapshot(doc(db, "votes", voteId), (doc) => {
        // if () {

        setVote(doc.data() as VoteResultProps);
        // }
        // AllvoteValueObject = [];  
        // setAllButtonTime([...allButtonTime,viewData]);
      });
      // setForRun(forRun + 1)
    }
  }, [voteId]);





  const sound = useRef<HTMLAudioElement>(null);
  // const src = require("../assets/sounds/applause.mp3").default;
  const [hideButton, setHideButton] = useState<number[]>([]);

  const showVoteButton = useMemo(() => {
    return (
      vote?.timeframe?.index == selectedTimeFrame
    )
  }, [vote]);






  const canVote = useMemo(() => {
    return !!!voteDetails?.activeVotes[`${symbol1}_${timeframes[selectedTimeFrame]?.seconds}`];    
  }, [vote.expiration, vote.success, selectedTimeFrame, voteDetails]);
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



  const [popUpOpen, setpopUpOpen] = useState(false);






  // open modal
  useEffect(() => {
    let data: { [key: string]: VoteResultProps } = {};
    allActiveVotes.map((value: VoteResultProps | undefined) => {
      if (value) {
        data = {
          ...data,
          [`${value.coin}_${value?.timeframe?.seconds}`]: { ...value, voteType: 'coin' }
        }
      }
    });

    console.log(allActiveVotes,'allActiveVotesabc');
    setVoteDetails((prev) => {
      
      return {
        ...prev,
        voteNot: voteNumberEnd,
        activeVotes: { ...prev.activeVotes, ...data }
      }
    })
  }, [allActiveVotes]);
  useEffect(() => {
    setVoteDetails((prev) => {
      return {
        ...prev,
        voteImpact: {
          timeFrame: selectedTimeFrame,
          impact: null
        }
      }
    })
  }, [selectedTimeFrame]);

  useEffect(() => {
    setVotingTimer(remainingTimer)
  }, [remainingTimer])

  //open modal
  return (
    <>
      {/* <audio className="d-none" ref={sound}>
        <source src={src} type="audio/mpeg"/>
      </audio> */}
      {/* {confetti && <Confetti
        width={width}
        height={height}
      />} */}
      <PageContainer fluid radius={87} >
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
                      showModal(<NotLoggedInPopup />);
                    }
                  }}
                  symbol={coin.symbol}
                  coins={coinUpdated}
                  totals={totals}
                  isHeader={true}
                />
              </CardContainer>
              <Container>
                {canVote && (
                  <>{loading ? (
                    <CalculatingVotes />
                  ) : (
                    <CoinsForm
                      hideButton={hideButton}
                      setHideButton={setHideButton}
                      sound={sound}
                      coin={coin}
                      coinUpdated={coinUpdated}
                      setVoteId={setVoteId}
                      setLoading={setLoading}
                      setConfetti={setConfetti}
                      selectedTimeFrame={selectedTimeFrame}
                      setSelectedTimeFrame={setSelectedTimeFrame}
                      selectedTimeFrameArray={selectedTimeFrameArray}
                      setpopUpOpen={setpopUpOpen}
                      propVote={vote}
                    />
                  )}</>
                )}
                <div className="text-center">
                  {/* @ts-ignore */}
                  {!graphLoading && !canVote && user && voteId && (
                    <>
                      <VotedCard
                        {...{
                          vote: voteDetails?.activeVotes[`${symbol1}_${timeframes[selectedTimeFrame]?.seconds}`] || {},
                          coins: coinUpdated,
                          totals,
                          symbol1,
                          symbol2,
                          voteId,
                          selectedTimeFrame,
                          setSelectedTimeFrame,
                          selectedTimeFrameArray,
                          setpopUpOpen,
                          setHideButton,
                          hideButton
                        }}
                      />
                      {/* <Speedometer/> */}

                      {cpviData?.bull && params?.id && (
                        graphLoading ? <CalculatingVotes /> :
                          <>
                            {/* Temporary commented   */}
                            <Progress
                              totals={totals}
                              progressData={totals[`${symbol1}`]}
                              symbol1={'BULL'}
                              symbol2={'BEAR'}
                              pct={cpviData?.bull || 0}
                              isSingleCoinVote={true}
                            />

                            {/* <Graph
                              data={cpviData}
                              totals={totals}
                              symbol={params?.id}
                            /> */}
                          </>
                      )}

                    </>
                  )}
                  {
                    // // @ts-ignore
                    // // hideButton.includes(selectedTimeFrame) &&
                    // modalData && <ModalForResult
                    //   popUpOpen={popUpOpen}
                    //   // selectedTimeFrame={selectedTimeFrame}
                    //   setpopUpOpen={setpopUpOpen}
                    //   // setHideButton={setHideButton}
                    //   // hideButton={hideButton}
                    //   vote={modalData}
                    //   setModalData={setModalData}
                    //   type={"coin"}
                    // // setVoteDetails={setVoteDetails}
                    // />
                  }
                </div>
                {/* <div>
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>      */}
              </Container >
              <div className="d-flex justify-content-center align-items-center mt-5">
                <Link to="" style={{ textDecoration: 'none' }}>
                  <Other>
                    {user && !voteNumber && votingTimer && !!new Date(votingTimer).getDate() && false ?
                      <span style={{ marginLeft: '20px' }}>
                        {/* @ts-ignore */}
                        <Countdown date={votingTimer}
                          renderer={({ hours, minutes, seconds, completed }) => {

                            return (
                              <span style={{ color: '#6352e8', fontSize: '12px', fontWeight: 400 }}>
                                {/* {hours < 10 ? `0${hours}` : hours}: */}
                                {Number(voteRules?.maxVotes)} votes in {' '}
                                {hours < 1 ? null : `${hours}:`}
                                {minutes < 10 ? `0${minutes}` : minutes}:
                                {seconds < 10 ? `0${seconds}` : seconds}
                              </span>
                            );

                          }}
                        /></span>
                      : ""}

                  </Other>
                </Link>
              </div>
              <div className="d-flex justify-content-center align-items-center mt-5 pb-5 mb-5">
                <Link to="/coins" style={{ textDecoration: 'none' }}>
                  <Other>{translate("vote for other coins")}</Other>
                </Link>
              </div>
            </>
          ) : (
            <>No coin found</>
          )}
        </>
      </PageContainer >
      <Container style={{ marginTop: '-15px' }}>
        <div className="text-center">
          <div>
            <Leaders
              symbol={coin.symbol}
              texts={{ topInfluencers: ("top Influencers").toUpperCase() }}
            />
          </div>
        </div>
      </Container>
    </>
  );
};

export default SingleCoin;
