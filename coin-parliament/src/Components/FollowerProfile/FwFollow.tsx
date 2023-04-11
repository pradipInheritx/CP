import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../Contexts/User";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import Tabs from "./Tabs";
import { useTranslation } from "../../common/models/Dictionary";
import { capitalize } from "lodash";
import { follow, Leader } from "../../Contexts/CoinsContext";
import UserCard from "../Users/UserCard";
import { toFollow } from "../../common/models/User";
import firebase from "firebase/compat";
import AppContext from "../../Contexts/AppContext";
export type Follower = {
  username: string;
  id: string;
};

const getLeaderUsersByIds = httpsCallable<{}, Leader[]>(
  functions,
  "getLeaderUsersByIds"
);

export const getUsers = ({
  users,
  setUsers,
}: {
  users?: string[];
  setUsers: (newUsers: Leader[]) => void;
}) => {
  try {
    users?.length &&
      getLeaderUsersByIds({ userIds: users }).then((u) => {
        setUsers(u.data);
      });
  } catch (e) {
    setUsers([] as Leader[]);
  }
};

const FwFollow = () => {
  const { user } = useContext(UserContext);
  const[userInfo,setUserInfo]=useState<any>()
  const{followerUserId}=useContext(AppContext)
  const translate = useTranslation();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [subscribers, setSubscribers] = useState<Leader[]>([]);
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
  useEffect(() => {
    getUsers({ users: userInfo?.leader, setUsers: setLeaders });
    getUsers({ users: userInfo?.subscribers, setUsers: setSubscribers });
    getFollowerData()
  }, [userInfo?.leader?.length, userInfo?.subscribers?.length]);

  return (
    <Tabs
      defaultActiveKey="following"
      id="profile-follow"
      onSelect={() => {}}
      tabs={[
        {
          eventKey: "following",
          title: capitalize(translate("following")),
          pane: (
            <div>
              {(leaders || []).map((u, i) => {
                return (
                  <div className="mb-2" style={{maxWidth:'85vw', margin:'auto'}}>
                    <UserCard
                      key={i}
                      leader={u}
                      checked={!!userInfo?.leader?.includes(u.userId)}
                      setChecked={() =>
                        user &&
                        follow(
                          u,
                          user,
                          toFollow(userInfo?.leader || [], u.userId)
                        )
                      }
                    />
                  </div>
                );
              })}
            </div>
          ),
        },
        {
          eventKey: "followers",
          title: capitalize(translate("followers")),
          pane: (
            <>
              {(subscribers || []).map((s, i) => {
                return (
                  <div className="mb-2" style={{maxWidth:'85vw', margin:'auto'}}>
                  <UserCard
                    key={i}
                    leader={s}
                    checked={!!userInfo?.leader?.includes(s.userId)}
                    setChecked={() =>
                      user &&
                      follow(
                        s,
                        user,
                        toFollow(userInfo?.leader || [], s.userId)
                      )
                    }
                  />
                  </div>
                );
              })}
            </>
          ),
        },
      ]}
    />
  );
};

export default FwFollow;
