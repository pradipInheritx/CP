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
import VotedCard from "Components/Profile/voteHistory/VotedCard";
import { fetchCoins, subscribe, unsubscribe, ws } from "../../../common/models/Socket";
import AppContext from "../../../Contexts/AppContext";
import { texts } from "../../LoginComponent/texts";

const getVotesFunc = httpsCallable<{ start: number; end: number; userId: string }, GetVotesResponse>(functions, "getVotes");
const getPriceCalculation = httpsCallable(functions, "getOldAndCurrentPriceAndMakeCalculation");
const FwVotes = () => {
  const pageSize = useMemo(() => 3, []);
  const { user } = useContext(UserContext);
  // const {followerUserId } = useContext(AppContext);
  const followerUserId = localStorage.getItem("followerId")
  const translate = useTranslation();
  const [index, setIndex] = useState(0);
  const [allCoinsPrais, setAllCoinsPrais] = useState<any>([]);

  const [votes, setVotes] = useState<GetVotesResponse>({
    coins: { votes: [], total: 0 },
    pairs: { votes: [], total: 0 },
  } as GetVotesResponse);

  const [coinSubscription, setCoinSubscription] = useState([])
  const [coinSocketData, setCoinSocketData] = useState([])
const [runVote, setRunVote] = useState(false);
  const getVotes = useCallback(
    async (start: number) => {
      if (followerUserId) {
        const newVotes = await getVotesFunc({
          start,
          end: start + pageSize,
          // @ts-ignore
          userId: followerUserId,
        });
        // @ts-ignore
        let result = JSON.parse(newVotes?.data)
        if (newVotes?.data) {
          setVotes(result);
          const coinStat = newVotes?.data?.coins?.votes?.map(item => item?.coin);
          // const coinsArray = result?.map((item:any) => {
          //   item?.map((value:any) => {

          //   })
          // })
          // const pairStat=[]
          // @ts-ignore
          // setCoinSubscription(coinStat)
        }
      }
    },
    [followerUserId, pageSize]
  );
  console.log(votes, "all vote check")
  useEffect(() => {
    // @ts-ignore
    const { coins, pairs } = votes

    let AllCoins = coins?.votes.filter((item: any) => {
      if (item.expiration < Date.now() && !item.success) {

        return item
      }
    })

    let AllPairs = pairs?.votes.filter((item: any) => {
      if (item.expiration < Date.now() && !item.success) {

        return item
      }
    })

    let allCoinsPair = [...AllCoins, ...AllPairs]
    setAllCoinsPrais(allCoinsPair)
  }, [votes])

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
      getVotes(index).then(void 0);
    }
  }, [getVotes, user?.uid, index]);

  const callbackFun = () => {
    if (user?.uid) {

      getVotes(index).then(void 0);
    }
  }

  //  console.log(votes,"votescoins")

  return (
    <Tabs
      defaultActiveKey="pairs"
      id="profile-votes"
      onSelect={() => setIndex(0)}
      setRunVote={setRunVote}
      runVote={runVote}
      tabs={[
        {
          eventKey: "pairs",
          // title: capitalize(translate("pair")),
          title: capitalize(`${texts.Pair}`),
          pane: (
            <div className="d-flex justify-content-center align-items-center flex-column">
              {/* {votes.pairs.votes.map((v, i) => (
                <div className="mb-2" key={i}>
                  <MyVotedCard v={v} callbackFun={callbackFun} />
                </div>
              ))} */}
              {runVote && votes.pairs.votes.map((v, i) => {
                if (!v.score) {                
                  return <div className="mb-2" key={i}>
                    <MyVotedCard v={v} callbackFun={callbackFun} />
                  </div>
                }
              })}
              {!runVote && votes.pairs.votes.map((v, i) => {                
                  
               return  <div className="mb-2" key={i}>
                    <MyVotedCard v={v} callbackFun={callbackFun} />
                  </div>
                
              })}
              {getButtons(votes.pairs)}
            </div>
          ),
        },
        {
          eventKey: "coins",
          title: capitalize(`${texts.Coin}`),
          pane: (
            <div className="d-flex justify-content-center align-items-center flex-column">
              {/* {votes.coins.votes.map((v, i) => (
                <MyVotedCard v={v} coinSocketData={coinSocketData} callbackFun={callbackFun} />
              ))} */}
              {runVote && votes.coins.votes.map((v, i) => {
                if (!v.score) {                  
              return    <MyVotedCard key={i} v={v} coinSocketData={coinSocketData} callbackFun={callbackFun} />
                }                
              }
              )}

              {!runVote && votes.coins.votes.map((v, i) => {                
                return  <MyVotedCard key={i} v={v} coinSocketData={coinSocketData} callbackFun={callbackFun} />                
              }
              )}

              {getButtons(votes.coins)}
            </div>
          ),
        }
      ]}
    />
  );
};

export default FwVotes;
