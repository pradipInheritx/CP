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
import { fetchCoins, subscribe, unsubscribe, ws } from "../../common/models/Socket";

const getVotesFunc = httpsCallable<{ start: number; end: number; userId: string }, GetVotesResponse>(functions, "getVotes");

const Votes = () => {
  const pageSize = useMemo(() => 3, []);
  const {user} = useContext(UserContext);
  const translate = useTranslation();
  const [index, setIndex] = useState(0);
  const [votes, setVotes] = useState<GetVotesResponse>({
    coins: {votes: [], total: 0},
    pairs: {votes: [], total: 0},
  } as GetVotesResponse);
  const [ coinSubscription,setCoinSubscription]=useState([])
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
        let result= JSON.parse(newVotes?.data)
        if (newVotes?.data) {          
          setVotes(result);
          const coinStat=newVotes?.data?.coins?.votes?.map(item=>item?.coin)
          // const pairStat=[]
           // @ts-ignore
          // setCoinSubscription(coinStat)
        }
      }
    },
    [user?.uid, pageSize]
  );
  
  
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
            Prev
          </Button>
          <Button
            disabled={index >= v.total - pageSize}
            onClick={() => setIndex(index + pageSize)}
          >
            Next
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

   
// console.log('vote',votes)
  return (
    <Tabs
      defaultActiveKey="coins"
      id="profile-votes"
      onSelect={() => setIndex(0)}
      tabs={[
        {
          eventKey: "pairs",
          title: capitalize(translate("pair")),
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
          title: capitalize(translate("coin")),
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
        },
      ]}
    />
  );
};

export default Votes;
