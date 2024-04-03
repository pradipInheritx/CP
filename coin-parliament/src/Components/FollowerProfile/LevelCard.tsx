import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { UserTypeProps } from "../../common/models/UserType";
import { UserProps } from "../../common/models/User";
import { useTranslation } from "../../common/models/Dictionary";
import './Style.css';
import CoinsContext from "Contexts/CoinsContext";

type LevelCardProps = {
  userTypes: UserTypeProps[];
  userInfo?: UserProps;
};

const Badge = styled.span`
  background-color: #6352E8;
  font-weight: lighter;
  color: white;
  font-size: 10px;
  text-transform: uppercase;
  // width: 90px;
  text-align: center;
  display: inline-block;
  padding: 0.35em 0.65em;
  white-space: nowrap;
  vertical-align: baseline;
  line-height: 1;
  min-width:150px;
`;
const I = styled.i`
  border-radius: 50%;
  position: absolute;
  font-size: 11px;
  top: 7px;
  right: 7px;
  
  font-weight:300;
  color: #6352E8;
 
    width: 16px;
    height: 16px;

    text-align: center;

    
`;
const LevelCard = ({ userInfo, userTypes }: LevelCardProps) => {
  const translate = useTranslation();
  const [tooltipShow, setTooltipShow] = React.useState(false);
  const [userRank, setUserRank] = React.useState(0);
  const { leaders } = useContext(CoinsContext);

  useEffect(() => {
    if (userInfo?.uid) {     
      console.log(userInfo?.uid, leaders ,"userId")
      const ourUser = leaders.filter((item) => item?.userId == userInfo?.uid)      
      if (ourUser && ourUser[0]?.rank) {
        setUserRank(ourUser[0]?.rank)
      }
    }

    return () => {

    }
  }, [userInfo?.uid])

  console.log(userInfo?.uid,"userInfo?.uid")

  return (
    <div className=" cp_level dark_prpl_bkgnd mx-auto pb-4" style={{ position: 'relative' }}>
      {tooltipShow &&
        <div
          style={{
            display: "relative"
          }}
        >
          <div className="newtooltip2"
            style={{
              // right: "0%",
              // marginLeft: "16%",
              // marginTop:"0%",
              width: `${window.screen.width > 767 ? "150%" : "150%"}`,
              marginLeft: `${window.screen.width > 767 ? "" : "-20%"}`,
              marginTop: `${window.screen.width > 767 ? "15%" : "15%"}`,
            }}
          >
            {/* <p>Your CMP count</p> */}
            <p className="mt-3 lh-base"
            style={{
              textAlign:"left",
            }}
            >Your level reflects your recent voting activities. Regular participation helps maintain or elevate your level.</p>
            <p className="mt-3 lh-base"
            style={{
              textAlign:"left",
            }}
            >Should your voting frequency decrease, you might move down the levels. </p>
            <p className="mt-3 lh-base"
            style={{
              textAlign:"left",
            }}
            >The good news? You can always climb back up.</p>
          </div>
        </div>
      }
      <I className="bi bi-info-circle"
        onMouseDown={(e) => {
          setTooltipShow(false)
        }}
        onMouseUp={(e) => {
          setTooltipShow(true)
        }}
        onMouseEnter={() => setTooltipShow(true)}
        onMouseLeave={() => setTooltipShow(false)}
      ></I>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h6 className="mt-1 box_title card-header mb-2" style={{ fontSize: '12px', padding: "0.5rem 1rem"}}>
          {translate("User Level")}
        </h6>
        {userTypes.sort((a, b) => b.index - a.index).map((userType, i) => {
          const opacity =
            userInfo?.status?.name === userType.name ? "" : " opacity-50";
          return (
            <Badge className={"rounded-pill mt-1 d-flex justify-content-around " + opacity} key={i} >
              <span className="opacity-0">{opacity == "" && userRank > 0 ? <>&nbsp; #{userRank}</> : ""}</span><span> {userType?.name}</span> <span>{opacity == "" && userRank > 0 ? <>&nbsp; #{userRank}</> : ""}</span>
            </Badge>
          );
        })}
        {/* <ul className="list-group mx-auto mb-3">
          {userTypes.sort((a,b) => b.index - a.index).map((userType, i) => {
            const opacity =
              userInfo?.status?.name === userType.name ? "" : " opacity-50";
            return (
              <Badge className={"rounded-pill mt-1" + opacity}>
                {userType.name}
              </Badge>
            );
          })}
        </ul> */}
      </div>
    </div>
  );
};

export default LevelCard;
