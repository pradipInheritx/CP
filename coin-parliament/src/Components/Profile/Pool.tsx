import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import Share from "./Share";
import Info from "./Info";
import { getUsers } from "./Follow";
import { Leader } from "../../Contexts/CoinsContext";
import PoolMiningCard from "./PoolMiningCard";

const Pool = () => {
  const { user, userInfo } = useContext(UserContext);
  const referralUrl = `${document.location.protocol}//${document.location.host}/?refer=${user?.uid}`;
  const [children, setChildren] = useState<Leader[]>([]);
  const childrenActivity = Number(
    Number(userInfo?.voteStatistics?.commission || 0).toFixed(3) || 0
  );

  useEffect(() => {
    getUsers({ users: userInfo?.children, setUsers: setChildren });
  }, [userInfo?.children]);

  return (
    <>
      <div className={`${window.screen.width > 767 ? "pt-4" : ""}`} style={{ backgroundColor: '#160133' }}>
        <div>
          <Share
            url={referralUrl}
            text={"share & earn"}
            shareText={`Hey,%0ajoin me on Coin Parliament and earn rewards for your opinion!%0aLet's vote together!`}
          />
        </div>
        <div className="mb-3">
          <Info
            friends={userInfo?.children?.length || 0}
            cpm={childrenActivity || 0}
          />
        </div>
        <div className='pb-2'>
          {children.map((child) => {
            return (
              <div className="mb-2" key={child?.userId}>
                <PoolMiningCard user={child} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Pool;
