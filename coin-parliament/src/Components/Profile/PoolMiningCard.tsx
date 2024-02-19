import React, { useContext } from "react";
import { Leader } from "../../Contexts/CoinsContext";
import { Image } from "react-bootstrap";
import styled from "styled-components";
import { useTranslation } from "../../common/models/Dictionary";
import { importFile } from "../../assets/avatars/Avatars";
import UserContext from "Contexts/User";
type PoolMiningCardProps = {
  user: Leader;
};

const Avatar = styled(Image)`
  border: 3px solid var(--blue-violet);
`;

const PoolMiningCard = ({ user }: PoolMiningCardProps) => {
  const { userInfo, user: u, setUserInfo, setUser } = useContext(UserContext);
  const translate = useTranslation();
  const { avatar, displayName, status, subscribers, leaders, pct, score } =
    user;
    console.log(user,"display656",avatar)
    
  return (
    <div className="user_card mx-auto shadow-sm" style={{boxShadow: '0px 3px 6px #00000029',width:window.screen.width<979?'322px':'40%'}} >
      <div className="row hstack">
        <div className="col-2">
          {avatar!=="skipped"?<>
          <Avatar
            roundedCircle={true}
            // src={avatar?importFile(`./The${avatar}`).default : importFile("./mystery", "png").default}
            src={(avatar && !avatar.includes('http')) ? importFile(`./The${avatar}`).default : !avatar ? importFile("./mystery", "png").default:avatar
          }
            alt="avatar"
            className="avatar_sm"
          />
          </>:<>
            <div style={{
              borderRadius: '100%',
              height: '44px',
              width: '44px',
              fontSize:"1.5rem",
              border: 'solid 3px #6352e8',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              background:"#6352e8",
              // fontWeight: 'bold',
            }}>
                {user?.email && user?.email?.length >= 0 ? user?.email[0].toUpperCase() : ""}
            </div>
            </>}
          
        </div>
        <div className="col-7">
          <div >
            <span className="username_sm vstack text_prpl" style={{marginBottom:'2px',color:"#6352e8"}}>{displayName}</span>{" "}
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
          <div className="text_prpl">{score} CMP</div>
        </div>
      </div>
    </div>
  );
};

export default PoolMiningCard;
