import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {ButtonGroup} from "react-bootstrap";
import {functions} from "../../firebase";
import {GetVotesResponse, VoteSnap, VotesResponse} from "../../common/models/Vote";
import UserContext from "../../Contexts/User";
import {useTranslation} from "../../common/models/Dictionary";
import {capitalize} from "lodash";
import {httpsCallable} from "firebase/functions";
import Button from "../Atoms/Button/Button";
import Tabs from "./Tabs";
import VotedCard from "./VotedCard";
import { texts } from "../LoginComponent/texts";

const getVotesFunc = httpsCallable<{ start?: number; end?: number; userId: string }, GetVotesResponse>(functions, "getVotes");
const getPriceCalculation = httpsCallable(functions, "getOldAndCurrentPriceAndMakeCalculation");
const Votes = () => {
  const pageSize = useMemo(() => 3, []);
  const {user} = useContext(UserContext);
  const translate = useTranslation();
  const [index, setIndex] = useState(0);  
  // const [allCoinsPrais, setAllCoinsPrais] = useState<any>([]);
  
  const [votes, setVotes] = useState<GetVotesResponse>({
    coins: {votes: [], total: 0},
    pairs: {votes: [], total: 0},    
  } as GetVotesResponse);
  const [coinSocketData,setCoinSocketData]=useState([])
  const getVotes = useCallback(
    async (start: number) => {
      if (user?.uid) {
        const newVotes = await getVotesFunc({
          start,
          end: start + pageSize,
          userId: user?.uid,
        });
        // @ts-ignore
        let result = JSON.parse(newVotes?.data)      
        if (newVotes?.data) {
          setVotes(result);                    
        }
      }
    },
    [user?.uid, pageSize]
  );  
  console.log(votes,"all vote check")
  useEffect(() => {
    // @ts-ignore
    const { coins, pairs } = votes
    
    let AllCoins = coins?.votes.filter((item: any) => {
      if (item.expiration < Date.now() && item.success == undefined) {
        
        return item
      }    
    })

    let AllPairs = pairs?.votes.filter((item: any) => {
      if (item.expiration< Date.now() && item.success == undefined) {
        
        return item
      }
    })  

let allCoinsPair= [...AllCoins,...AllPairs]
let promiseArray:any =[]
     if (allCoinsPair.length > 0) {
      allCoinsPair?.forEach((voteItem:any) => {
        promiseArray.push(checkprice(voteItem))
        // checkprice(voteItem);
       })    
     }
     if (!promiseArray?.length) return
     Promise.all(promiseArray)
    .then(responses => {
      getVotes(index).then(void 0); 
    })
    .catch(error => {
      console.error('promiseAll',error);
    });
  }, [votes?.coins?.total,votes?.pairs?.total,pageSize])
  
  
  
  


  const checkprice = async (vote: any) => {
    const voteCoins = vote?.coin.split("-");
const coin1 = `${voteCoins[0]? voteCoins[0].toLowerCase() || "":""}`
  const coin2 = `${voteCoins[1]? voteCoins[1].toLowerCase() || "":""}`
   const data = await getPriceCalculation({            
        coin1: `${coin1 !="" ? coin1 + "usdt" :"" }`,
        coin2: `${coin2 !="" ? coin2 + "usdt" :"" }`,
        voteId:vote?.id,
        voteTime:vote?.voteTime,
        valueVotingTime: vote?.valueVotingTime,
        expiration: vote?.expiration,
        timestamp: Date.now(),
        userId: vote?.userId
    }).then((data:any)=>{
      if(data.data==null){
          // getVotes(index).then(void 0);     
      }
    }).catch((err:any )=> {
        if (err && err.message) {
            console.log(err.message);
        }        
    })
  }
      




//   useEffect(() => {
//     if(coinSubscription?.length)
//     {subscribe(coinSubscription)
//       console.count('subscriptionSocket')
//     }
     
// // return ()=> {
// //   unsubscribe(coinSubscription)
// // }

//   }, [coinSubscription])
  // useEffect(() => {
  //   console.count('messageSocket')
  //   ws.onmessage = ({data}) => {
  //     const [message] = JSON.parse(data);
  //   console.log('socketMessage',JSON.parse(data))
  //   setCoinSocketData(JSON.parse(data))
  //   // if(coindata[0]?.pair?.includes(coin?.symbol)){
  //   //   console.log('Data Compare', socketData[0]?.p, socketData[0]?.pair)
  //   // }
  //     // ws.send('{"action":"subscribe", "params":"AM.MSFT,A.MSFT"}');
    
  //     switch (message.ev) {
  //       case "AM":
  //         // your trade message handler
  //         break;
  //       case "A":
  //         // your trade message handler
  //         break;
  //     }
  //   };
  //   return () => {
  //     unsubscribe(coinSubscription)
  //      // @ts-ignore
  //     // ws.onclose(data=>console.log('coinCoinSocketDataClosed',data))
  //   }
  // }, [])
 
  const MyVotedCard = useCallback(({ v,coinSocketData,callbackFun }: { v: VoteSnap, coinSocketData?:any,callbackFun?:any }) => {
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

const callbackFun=()=>{
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
      tabs={[
        {
          eventKey: "pairs",
          title: capitalize(translate(`${texts.Pair}`)),
          pane: (
            <div className="d-flex justify-content-center align-items-center flex-column">
              {votes.pairs.votes.map((v, i) => (
                <div className="mb-2" key={i}>
                  <MyVotedCard v={v} callbackFun={callbackFun} />
                </div>
              ))}
              {getButtons(votes.pairs)}
            </div>
          ),
        },
        {
          eventKey: "coins",
          title: capitalize(translate(`${texts.Coin}`)),
          pane: (
            <div className="d-flex justify-content-center align-items-center flex-column">
              {votes.coins.votes.map((v, i) => (
                <div className="mb-2" key={i}>
                  <MyVotedCard v={v} coinSocketData={coinSocketData} callbackFun={callbackFun}/>
                </div>
              ))}
              {getButtons(votes.coins)}
            </div>
          ),
        }
      ]}
    />
  );
};

export default Votes;
