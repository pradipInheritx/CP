import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ButtonGroup } from "react-bootstrap";
import { functions } from "../../../firebase";
import { GetVotesResponse, VoteSnap, VotesResponse } from "../../../common/models/Vote";
import UserContext from "../../../Contexts/User";
import { useTranslation } from "../../../common/models/Dictionary";
import { capitalize } from "lodash";
import { httpsCallable } from "firebase/functions";
import Button from "../../Atoms/Button/Button";
import Tabs from "../Tabs";
import VotedCard from "./VotedCard";
import { texts } from "../../LoginComponent/texts";
import { CompletedVotesContext } from "Contexts/CompletedVotesProvider";
import axios from "axios";

const getVotesFunc = httpsCallable<{ start?: number; end?: number; userId: string, isOpenVote: boolean }, GetVotesResponse>(functions, "getVotes");
const getPriceCalculation = httpsCallable(functions, "getOldAndCurrentPriceAndMakeCalculation");
const checkAndUpdateRewardTotal = httpsCallable(functions, "checkAndUpdateRewardTotal");
const Votes = () => {
  const completedVotes = useContext(CompletedVotesContext);
  const pageSize = useMemo(() => 5, []);
  const { user,userInfo } = useContext(UserContext);
  const translate = useTranslation();
  const [index, setIndex] = useState(0);
  const [runVote, setRunVote] = useState(false);
  const [paxDistribution, setPaxDistribution] = useState(0)
  // const [allCoinsPrais, setAllCoinsPrais] = useState<any>([]);

  const [votes, setVotes] = useState<GetVotesResponse>({
    coins: { votes: [], total: 0 },
    pairs: { votes: [], total: 0 },
  } as GetVotesResponse);
  const [isLoading, setIsLoading] = useState(false);
  const [coinSocketData, setCoinSocketData] = useState([])
  const getVotes = useCallback(
    async (start: number, isOpenVote: boolean) => {
      if (user?.uid) {
        setIsLoading(true)
        const newVotes = await getVotesFunc({
          start,
          end: start + pageSize,
          userId: user?.uid,
          isOpenVote
        }).then((res) => {          
          setVotes(res?.data)
          setIsLoading(false)          
        }).catch((error) => {
          setIsLoading(false)  
          console.log(error,"error vote")
        });                
      }
    },
    [user?.uid, pageSize]
  );
  console.log(votes, isLoading,"allvotes")
  useEffect(() => {
    // @ts-ignore
    const { coins, pairs } = votes
    console.log(coins, pairs,"coinspairsboth")
    let AllCoins = coins?.votes.filter((item: any) => {
      if (item.expiration < Date.now() && item.success == undefined) {

        return item
      }
    })
    let AllPairs = pairs?.votes.filter((item: any) => {
      if (item.expiration < Date.now() && item.success == undefined) {
        return item
      }
    })
    let allCoinsPair = [...AllCoins, ...AllPairs]
    console.log(allCoinsPair,"allCoinsPair")
    let promiseArray: any = []
    console.log(allCoinsPair.length, paxDistribution, userInfo?.uid,"yes i am calling")
    if (allCoinsPair.length > 0 && paxDistribution > 0) {
      allCoinsPair?.forEach((voteItem: any) => {
        promiseArray.push(checkprice(voteItem))
        // checkprice(voteItem);
      })
    }
    if (!promiseArray?.length) return
    Promise.all(promiseArray)
      .then(responses => {
        getVotes(index, runVote).then(void 0);
      })
      .catch(error => {
        console.error('promiseAll', error);
      });        
  }, [votes?.coins?.total, votes?.pairs?.total, pageSize, paxDistribution])


  useEffect(() => {
    if (userInfo?.uid) {
      axios.post("https://us-central1-votetoearn-9d9dd.cloudfunctions.net/getCurrentPaxDistribution", {
        data: {}
      }).then((res) => {        
        setPaxDistribution(res.data.result.paxDistribution)
      }).catch((err) => {
        console.log(err, "votingresultdataerror")
      })
    }
  }, [userInfo?.uid])
    
  const checkprice = async (vote: any) => {
    console.log("yes i am calling ")
    const voteCoins = vote?.coin.split("-");
    const coin1 = `${voteCoins[0] ? voteCoins[0].toLowerCase() || "" : ""}`
    const coin2 = `${voteCoins[1] ? voteCoins[1].toLowerCase() || "" : ""}`
    const data = await getPriceCalculation({
      coin1: `${coin1 != "" ? coin1 + "usdt" : ""}`,
      coin2: `${coin2 != "" ? coin2 + "usdt" : ""}`,
      voteId: vote?.id,
      voteTime: vote?.voteTime,
      valueVotingTime: vote?.valueVotingTime,
      // valueExpirationTimeOfCoin1: vote?.valueVotingTime[0] || null,
      // valueExpirationTimeOfCoin2: vote?.valueVotingTime[1] || null, 
      paxDistributionToUser: {
        userId: vote?.userId,
        currentPaxValue: Number(paxDistribution),
        isUserUpgraded: userInfo?.isUserUpgraded == true ? true : false,
        mintForUserAddress: userInfo?.paxAddress?.address || "",
        eligibleForMint: userInfo?.paxAddress?.address ? true : false
      },
      expiration: vote?.expiration,
      timestamp: Date.now(),
      userId: vote?.userId
    }).then((data: any) => {
      const raw = {
        userId: vote?.userId
      }
      checkAndUpdateRewardTotal(raw).then((res) => {
        // console.log(res.data, "checkAndUpdateRewardTotal")
      }).catch((error) => {
        console.log(error, "checkAndUpdateRewardTotal")
      })
      if (data.data == null) {
        // getVotes(index).then(void 0);     
      }
    }).catch((err: any) => {
      const raw = {
        userId: vote?.userId
      }
      checkAndUpdateRewardTotal(raw).then((res) => {
        // console.log(res.data, "checkAndUpdateRewardTotal")
      }).catch((error) => {
        console.log(error, "checkAndUpdateRewardTotal")
      })
      if (err && err.message) {
        console.log(err.message);
      }
    })
  }

  const MyVotedCard = useCallback(({ v, coinSocketData, callbackFun }: { v: VoteSnap, coinSocketData?: any, callbackFun?: any }) => {
    return <VotedCard vote={v} id={v.id} coinSocketData={coinSocketData} callbackFun={callbackFun} />;
  }, []);

  const getButtons = useCallback(
    (v: VotesResponse) => {
      return (
        <ButtonGroup>
          <Button
            disabled={index < pageSize}
            onClick={() => setIndex(index - pageSize)}
          >
            {texts.Prev}
          </Button>
          <Button
            disabled={index >= v.total - pageSize}
            onClick={() => setIndex(index + pageSize)}
          >
            {texts.Next}
          </Button>
        </ButtonGroup>
      );
    },
    [index, pageSize]
  );

  useEffect(() => {
    if (user?.uid) {
      getVotes(index, runVote).then(void 0);
      console.log('called vote count');

    }
  }, [getVotes, user?.uid, index]);


  useEffect(() => { // here
    if (completedVotes?.length > 0) {
      console.log('completedVotes');

      getVotes(index, runVote).then(void 0).catch(() => { });
    }
  }, [JSON.stringify(completedVotes)]);
  const callbackFun = () => {
    if (user?.uid) {
      // getVotes(index).then(void 0); // to make change 148 so no need this
    }
  }

  return (
    <>
      <Tabs
        defaultActiveKey="pairs"
        id="profile-votes"
        onSelect={() => setIndex(0)}
        setRunVote={setRunVote}
        runVote={runVote}
        getVotes={getVotes}
        isLoading={isLoading}
        tabs={[
          {
            eventKey: "pairs",
            title: capitalize(translate(`${texts.Pair}`)),
            pane: (
              <div className="d-flex justify-content-center align-items-center flex-column">
                {!isLoading && votes?.pairs && votes?.pairs.votes.map((v, i) => {
                  return (
                    <div className="mb-2" key={i}>
                      <MyVotedCard v={v} callbackFun={callbackFun} />
                    </div>
                  )

                })}
                <div style={{display: !isLoading ? 'block' : 'none' }}>

                {getButtons(votes.pairs)}
                </div>
              </div>
            ),
          },
          {
            eventKey: "coins",
            title: capitalize(translate(`${texts.Coin}`)),
            pane: (
              <div className="d-flex justify-content-center align-items-center flex-column">

                { !isLoading &&votes?.coins && votes?.coins.votes.map((v, i) => {
                  return <MyVotedCard key={i} v={v} coinSocketData={coinSocketData} callbackFun={callbackFun} />
                }
                )}
                 <div style={{display: !isLoading ? 'block' : 'none' }}>

                {getButtons(votes.coins)}
                </div>
              </div>
            ),
          }
        ]}
      />
    </>
  );
};

export default Votes;
