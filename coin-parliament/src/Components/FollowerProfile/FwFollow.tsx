import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../Contexts/User";
import { httpsCallable } from "firebase/functions";
import { firestore, functions } from "../../firebase";
import Tabs from "./Tabs";
import { useTranslation } from "../../common/models/Dictionary";
import { capitalize } from "lodash";
import { follow, Leader } from "../../Contexts/CoinsContext";
import UserCard from "../Users/UserCard";
import { toFollow } from "../../common/models/User";
import firebase from "firebase/compat/app";
import AppContext from "../../Contexts/AppContext";
import { texts } from "../LoginComponent/texts";
import { collection, getDocs, query, where } from "firebase/firestore";
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
  setIsLoading,
}: {
  users?: string[];
  setIsLoading?: any;
  setUsers: (newUsers: Leader[]) => void;
}) => {
  try {
    setIsLoading(true)
    users?.length &&
      getLeaderUsersByIds({ userIds: users }).then((u) => {
        setUsers(u.data);
        if(setIsLoading ){
          setIsLoading(false)
        }
      });
  } catch (e) {
    setUsers([] as Leader[]);
    if(setIsLoading){
      setIsLoading(false)
    }
  }
};

const FwFollow = () => {
  const { user } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState<any>()
  // const { followerUserId } = useContext(AppContext)
  const followerUserId = localStorage.getItem("followerId")
  const translate = useTranslation();
  const [leaders, setLeaders] = useState<Leader[] | undefined>();
  const [subscribers, setSubscribers] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const getFollowerData = () => {
  //   const getCollectionType = firebase
  //     .firestore()
  //     .collection("users")
  //     .where("uid", "==", followerUserId)
  //   getCollectionType.get()
  //     .then((snapshot) => {
  //       snapshot.docs?.map(doc => setUserInfo(doc.data()))
  //     }).catch((error) => {
  //       console.log(error, "error");
  //     });
  // }
  const getFollowerData = async () => {
    const usersCollectionRef = collection(firestore, 'users');
    const followerQuery = query(usersCollectionRef, where('uid', '==', followerUserId));

    try {
      const snapshot = await getDocs(followerQuery);
      snapshot.docs?.forEach((doc:any) => setUserInfo(doc.data()));
    } catch (error) {
      console.error("Error fetching follower data:", error);
    }
  };
  useEffect(() => {
    getUsers({ users: userInfo?.leader, setUsers: setLeaders,setIsLoading });
    getUsers({ users: userInfo?.subscribers, setUsers: setSubscribers,setIsLoading });
    getFollowerData()
  }, [userInfo?.leader?.length, userInfo?.subscribers?.length]);

  return (
    <Tabs
      defaultActiveKey="following"
      id="profile-follow"
      onSelect={() => { }}
      tabs={[
        {
          eventKey: "following",
          title: capitalize(translate("following")),
          pane: (
            <div>
               {isLoading && <div style={{
                position: 'fixed',
                height: '68%',                
                display: 'flex',
                textAlign: 'center',
                justifyContent: 'center',
                // top: '0px',
                right: '0px',
                bottom: '0px',
                zIndex: '9999',
                overflow: 'hidden',
                width: '100%',
                alignItems: 'center',

            }}>
                <span className="loading" style={{
                  color: "#7767f7", zIndex: "2220px", fontSize: '1.5em',
                  // marginTop: `${window.screen.width > 767 ? "50px" : "240px"}`
                }}>
                    {texts.waitForIt}
                </span>
            </div>}

            {leaders && leaders.length > 0 ?  leaders.map((u, i) => {
                return (
                  <div className="mb-2" style={{ maxWidth: '85vw', margin: 'auto' }}>                     
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
              }):!isLoading && !leaders ?(
                <div style={{display:"flex", justifyContent:"center", justifyItems:"center" , textTransform:"uppercase"}}>No record found</div>
              ) : null}
            </div>
          ),
        },
        {
          eventKey: "followers",
          title: capitalize(translate("followers")),
          pane: (
            <>
               {subscribers && subscribers.length > 0 ? subscribers.map((s, i) => {
                return (
                  <div className="mb-2" style={{ maxWidth: '85vw', margin: 'auto' }}>
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
              }) :  !isLoading && !subscribers.length ? (
                <div style={{display:"flex", justifyContent:"center", justifyItems:"center" , textTransform:"uppercase"}}>No record found</div>
              ) : null}
            </>
          ),
        },
      ]}
    />
  );
};

export default FwFollow;
