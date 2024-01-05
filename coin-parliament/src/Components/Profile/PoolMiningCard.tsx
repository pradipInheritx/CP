import React from "react";
import { Leader } from "../../Contexts/CoinsContext";
import { Image } from "react-bootstrap";
import styled from "styled-components";
import { useTranslation } from "../../common/models/Dictionary";
import { importFile } from "../../assets/avatars/Avatars";
type PoolMiningCardProps = {
  user: Leader;
};

export const Avatar = styled(Image)`
  border: 3px solid var(--blue-violet);
`;

const PoolMiningCard = ({ user }: PoolMiningCardProps) => {
  const translate = useTranslation();
  const { avatar, displayName, status, subscribers, leaders, pct, score } =
    user;
    
    
  return (
    <div className="user_card mx-auto shadow-sm" style={{boxShadow: '0px 3px 6px #00000029',width:window.screen.width<979?'322px':'40%'}} >
      <div className="row hstack">
        <div className="col-2">
          <Avatar
            roundedCircle={true}
            src={avatar?importFile(`./The${avatar}`).default : importFile("./mystery", "png").default}
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
