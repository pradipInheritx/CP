import React, { useCallback, useContext, useEffect, useState } from "react";
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
  setIsLoading,
}: {
  users?: string[];
  setIsLoading?: any;
  setUsers: (newUsers: Leader[]) => void;
}) => {
  try {
    // setIsLoading(true)
    getLeaderUsersByIds({ userIds: users }).then((u) => {
      console.log(u.data, "checkdata")
      setUsers(u.data);
      if(setIsLoading){
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

const Follow = () => {
  const { user, userInfo } = useContext(UserContext);
  const translate = useTranslation();
  const [leaders, setLeaders] = useState<Leader[] | undefined>();
  const [subscribers, setSubscribers] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    if (userInfo?.leader) {
      getUsers({ users: userInfo?.leader, setUsers: setLeaders,setIsLoading })
      setIsLoading(true)
    }else{
      setLeaders([]);
    }
  }, [userInfo?.leader]);
  useEffect(() => {
    if (userInfo?.subscribers) {
      getUsers({ users: userInfo?.subscribers, setUsers: setSubscribers,setIsLoading });
      setIsLoading(true)
    }else{
      setSubscribers([])
    }
  }, [userInfo?.subscribers]);

  return (
    <Tabs
      defaultActiveKey="following"
      id="profile-follow"
      onSelect={() => { }}
      tabs={[
        {
          eventKey: "following",
          title: capitalize(translate(`${texts.Following}`)),
          pane: (
            <div>
                {isLoading && <div style={{
                position: 'fixed',
                height: '68%',
                // border: "2px solid red",
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
              }):!isLoading && leaders?.length === 0 ?(
                <div style={{display:"flex", justifyContent:"center", justifyItems:"center" , textTransform:"uppercase"}}>No record found</div>
              ) : null}
            </div>
              

          ),
        },
        {
          eventKey: "followers",
          title: capitalize(translate(`${texts.Followers}`)),
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
              }) :  !isLoading && subscribers.length === 0 ? (
                <div style={{display:"flex", justifyContent:"center", justifyItems:"center" , textTransform:"uppercase"}}>No record found</div>
              ) : null}
            </>
          ),
        },
      ]}

    
    />

    
  );
};

export default Follow;
