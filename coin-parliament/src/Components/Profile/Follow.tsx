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

export type Follower = {
  username: string;
  id: string;
};

const getLeaderUsersByIds = httpsCallable<{}, Leader[]>(
  functions,
  "getLeaderUsersByIds"
);

export const getUsers = async({
  users,
  setUsers,
  setIsLoading
}: {
  users?: string[];
  setIsLoading?:any
  setUsers: (newUsers: Leader[]) => void;
}) => {
  try {
     if (!users?.length)return;
    setIsLoading(true)
     await getLeaderUsersByIds({ userIds: users }).then((u) => {
      const data=u.data?.filter(value=>value?.displayName)
        setUsers(data);
        // if(setIsLoading){
          // }
        setIsLoading(false)
     }).catch(()=>{setIsLoading(false)})

  } catch (e) {
    setUsers([] as Leader[]);
    // if(setIsLoading){
      setIsLoading(false)
    // }
  }
};

const Follow = () => {
  const { user, userInfo } = useContext(UserContext);
  const translate = useTranslation();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [subscribers, setSubscribers] = useState<Leader[]>([]);
  const [isLoading,setIsLoading] = useState(true)

  // useEffect(() => {
  //   getUsers({ users: userInfo?.leader, setUsers: setLeaders });
  //   getUsers({ users: userInfo?.subscribers, setUsers: setSubscribers });
  // }, [userInfo?.leader, userInfo?.subscribers]);
  useEffect(() => {
    if (userInfo?.leader) {
      getUsers({ users: userInfo?.leader, setUsers: setLeaders,setIsLoading })
      setIsLoading(true)
    }
  }, [userInfo?.leader]);
  useEffect(() => {
    if (userInfo?.subscribers) {
      getUsers({ users: userInfo?.subscribers, setUsers: setSubscribers,setIsLoading });
      setIsLoading(true)
    }
  }, [userInfo?.subscribers]);
console.log('leaders',leaders,userInfo)
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

export default Follow;
