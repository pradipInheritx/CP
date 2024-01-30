import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import Share from "./Share";
import Info from "./Info";
import { getUsers } from "./FwFollow";
import { Leader } from "../../Contexts/CoinsContext";
import PoolMiningCard from "./PoolMiningCard";
import firebase from "firebase/compat/app";
import AppContext from "../../Contexts/AppContext";
const FwPool = () => {
  const { user } = useContext(UserContext);
  const{followerUserId}=useContext(AppContext)
  const[userInfo,setUserInfo]=useState<any>()
  const referralUrl = `${document.location.protocol}//${document.location.host}/?refer=${user?.uid}`;
  const [children, setChildren] = useState<Leader[]>([]);
  const getFollowerData =()=>{
    const getCollectionType = firebase
  .firestore()
  .collection("users")
  .where("uid", "==", followerUserId)
getCollectionType.get()
.then((snapshot) => {        

snapshot.docs?.map(doc=>setUserInfo(doc.data()))

 
 

}).catch((error) => {
console.log(error,"error");
});    
  }
  const childrenActivity = Number(
    Number(userInfo?.voteStatistics?.commission || 0).toFixed(2) || 0
  );
  useEffect(() => {
    getFollowerData()
  }, [])
  useEffect(() => {
    getUsers({ users: userInfo?.children, setUsers: setChildren });
    // getFollowerData()
  }, [userInfo?.children]);
 
  console.log('userInfo',userInfo)
  return (
    <>
      <div className={`${window.screen.width>767?"pt-4":""}`}>
        {/* <div className="mb-3">
          <Share
            url={referralUrl}
            text={"share & earn"}
            shareText={"coin parliament"}
          />
        </div> */}
        <div className="mb-3">
          <Info
            friends={userInfo?.children?.length || 0}
            cpm={childrenActivity || 0}
          />
        </div>
        <div>
          {children.map((child,i) => {
            return (
              <div className="mb-2">
                <PoolMiningCard user={child} key={i} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FwPool;
