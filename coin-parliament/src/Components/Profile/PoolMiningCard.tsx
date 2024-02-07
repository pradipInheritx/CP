import React from "react";
import { Leader } from "../../Contexts/CoinsContext";
import { Image } from "react-bootstrap";
import styled from "styled-components";
import { useTranslation } from "../../common/models/Dictionary";
import { importFile } from "../../assets/avatars/Avatars";
import { useNavigate } from "react-router-dom";
type PoolMiningCardProps = {
  user: Leader;
};

// const Avatar = styled(Image)`
//   // border: 3px solid var(--blue-violet);
// `;

// const UserData = styled.p`
//   min-height: 17px;
//   margin-top: 10px;
//   letter-spacing: 0.18px;
//   line-height: 15px;
//   white-space: nowrap;
//   margin-bottom: 0;
//   width: 100%;
// `;

const PoolMiningCard = ({ user }: PoolMiningCardProps) => {
  const translate = useTranslation();
  const navigate = useNavigate()
  const { avatar, displayName, status, subscribers, leaders, pct, score,isUserUpgraded} =
    user;

    const redirectTab = () => {
        window.localStorage.setItem('followerId', user?.userId)
      // @ts-ignore
        navigate('/followerProfile/mine')
    }
    
  return (
    <div className="user_card mx-auto shadow-sm" style={{boxShadow: '0px 3px 6px #00000029',width:window.screen.width<979?'322px':'40%'}} >
      <div className="row hstack">
        <div className="col-2"  onClick={e=>redirectTab()} style={{cursor:"pointer"}}>
          <Image
          style={{
            border:`${!isUserUpgraded && " 3px solid var(--blue-violet)"}`,
            boxShadow: `${isUserUpgraded && "1px 0px 5px #FAE481"}`,
            backgroundColor: `${isUserUpgraded && "#FAE481"}`,    
          }}
            roundedCircle={true}
            // src={avatar?importFile(`./The${avatar}`).default : importFile("./mystery", "png").default}
            src = {(avatar && !avatar.includes('http')) ? importFile(`./The${avatar}`).default: avatar}
            alt="avatar"
            className="avatar_sm"
           
          />
        </div>
        <div className="col-7">
          <div >
            <span className="username_sm vstack" style={{marginBottom:'2px'}}>{displayName}</span>{" "}
            <span className="badge_sm rounded-pill vstack " style={{marginBottom:'2px'}}>{status}</span>{" "}
            {/* <span className="sm_txt mt-1 pr-5" style={{marginRight:'15px'}}>
              {subscribers} {translate("Followers")}
            </span>
            <span className="sm_txt mt-1" style={{marginRight:'15px'}}>
              {leaders} {translate("Following")}
            </span>
            <span className="sm_txt">{pct}% </span> */}
            {/* <UserData style={{color:"grey"}}>
            <span className='mx-1'>
              {subscribers || 0} {translate("Followers")}
            </span>
            <span className='mx-1'>
              {leaders || 0} {translate("Following")}
            </span>
            
              <span className='mx-1'>
             
                {score === Math.floor(score) ? score  || 0 : (score).toFixed(4) || 0}&nbsp;Score
              </span>
          
            </UserData> */}
          </div>
        </div>
        <div className="col-3">
          {/* @ts-ignore */}
          <div className="text_prpl">{user?.refereeScrore ? user?.refereeScrore : 0} CMP</div>
        </div>
      </div>
    </div>
  );
};

export default PoolMiningCard;
