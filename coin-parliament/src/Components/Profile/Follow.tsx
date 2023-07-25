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
import { texts } from "../LoginComponent/texts";

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
      getLeaderUsersByIds({ userIds: users }).then((u) => {
        console.log(u.data,"checkdata")
        setUsers(u.data);
      });
  } catch (e) {
    setUsers([] as Leader[]);
  }
};

const Follow = () => {
  const { user, userInfo } = useContext(UserContext);
  const translate = useTranslation();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [subscribers, setSubscribers] = useState<Leader[]>([]);

console.log(userInfo,"userInfo")

  useEffect(() => {
    getUsers({ users: userInfo?.leader, setUsers: setLeaders });
    // getUsers({ users: userInfo?.subscribers, setUsers: setSubscribers });
  }, [userInfo?.leader]);
  useEffect(() => {
    // getUsers({ users: userInfo?.leader, setUsers: setLeaders });
    getUsers({ users: userInfo?.subscribers, setUsers: setSubscribers });
  }, [userInfo?.subscribers]);


console.log(leaders,subscribers,"allleaders")
  return (
    <Tabs
      defaultActiveKey="following"
      id="profile-follow"
      onSelect={() => {}}
      tabs={[
        {
          eventKey: "following",
          title: capitalize(translate(`${texts.Following}`)),
          pane: (
            <div>
              {leaders && leaders.map((u, i) => {
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
          title: capitalize(translate(`${texts.Followers}`)),
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
