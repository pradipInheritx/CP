import React from "react";
import styled from "styled-components";
import { UserTypeProps } from "../../common/models/UserType";
import { UserProps } from "../../common/models/User";
import { useTranslation } from "../../common/models/Dictionary";
import { texts } from "../LoginComponent/texts";

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

  console.log(userTypes, userInfo,"userTypescehck")
  const translate = useTranslation();
  const [tooltipShow, setTooltipShow] = React.useState(false);
  return (
    <div className=" cp_level dark_prpl_bkgnd mx-auto pb-4" style={{ position: 'relative' }}>
      {
        tooltipShow &&
          <div
            style={{
            display:"relative"
          }}
          >
              <div className="newtooltip"
              style={{
                
                // marginLeft: "16%",
                // marginTop:"0%",
                width:`${window.screen.width > 767 ? "150%":"150%"}`,
                marginLeft: `${window.screen.width > 767 ? "":"-20%"}`,
                marginTop:`${window.screen.width > 767 ? "15%":"15%"}`,
                }}
              >
            {/* <p>User type level</p> */}            
                  <p className="mt-3 text-end lh-base">Your level reflects your recent voting activities. Regular participation helps maintain or elevate your level.</p>
                  <p className="mt-3 text-end lh-base">Should your voting frequency decrease, you might move down the levels. </p>
                  <p className="mt-3 text-end lh-base">The good news? You can always climb back up.</p>
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
        <h6 className="mt-1 box_title card-header mb-2" style={{ fontSize: '12px' }}>
          {/* {translate("Your Level")} */}
          {texts.YourLevel}
        </h6>
        {userTypes.sort((a, b) => b.index - a.index).map((userType, i) => {          
          // @ts-ignore
          const opacity = userInfo?.status && userInfo?.status?.name === userType?.name ? "" : " opacity-50";
          return (
            <Badge className={"rounded-pill mt-1 w-50 d-flex justify-content-center" + opacity} key={i} >
              {userType?.name}
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
