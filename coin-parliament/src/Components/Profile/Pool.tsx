import React, { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import Share from "./Share";
import Info from "./Info";
import { getUsers } from "./Follow";
import { Leader } from "../../Contexts/CoinsContext";
import PoolMiningCard from "./PoolMiningCard";
import VBG from "assets/images/VBG.png"
import VBGM from "assets/images/VBGM.png"
import { texts } from "Components/LoginComponent/texts";
import { useNavigate } from "react-router-dom";

const Pool = () => {
  const { user, userInfo } = useContext(UserContext);
  const referralUrl = `${document.location.protocol}//${document.location.host}/?refer=${userInfo?.userName}`;
  const [children, setChildren] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const childrenActivity = Number(
    Number(userInfo?.voteStatistics?.commission || 0).toFixed(4) || 0
  );
  console.log(userInfo?.userName, userInfo,"userInfo?.userName")

  useEffect(() => {
    getUsers({ users: userInfo?.children, setUsers: setChildren, setIsLoading: setIsLoading });
    setIsLoading(true)
  }, [userInfo?.children]);
  const navigate = useNavigate()
  console.log(children, "userdata")
  const redirectTab = (chlidUserId:any) => {   
    // @ts-ignore
    if (chlidUserId) {
      window.localStorage.setItem('followerId', chlidUserId)
      navigate('/followerProfile/mine')
    } 
  }
  return (
    <>
      <div className={`${window.screen.width > 767 ? "pt-4" : ""}`}
        style={{
          // backgroundColor: '#160133'
          backgroundImage: `${window.screen.width > 767 ? `url(${VBG})` : `url(${VBGM})`}`,
          backgroundRepeat: `${window.screen.width > 767 ? "repeat" : "repeat"}`,
          backgroundPosition: "0 0 0 0",
          backgroundSize: "100%",
          // backgroundSize: "cover",
          backgroundAttachment: "fixed",
          
        }}
      
      >
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
          {isLoading ?
            <div className="w-100 text-center">
              <span className="loading " style={{
                color:"white",
              }}>{texts.waitForIt}</span>
            </div>
          :children.map((child) => {
            return (
              <div className="mb-2"
                style={{
                  cursor:"pointer"
              }}
                key={child?.userId}
                onClick={() => {
                  redirectTab(child?.userId)
              }}
              >
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
