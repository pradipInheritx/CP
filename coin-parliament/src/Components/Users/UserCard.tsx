/** @format */

import React, { useContext } from "react";
import styled from "styled-components";
import {
  HelveticaneueRegularNormalBlack13px,
  PoppinsMediumWhite7px,
  PoppinsNormalGunsmoke10px,
} from "../../styledMixins";
import { getAvatar } from "../../common/models/User";
import Avatar from "./Avatar";
import { Leader } from "../../Contexts/CoinsContext";
import Icon from "../Atoms/Checkbox/Icon";
import AddFollower from "../icons/AddFollower";
import Following from "../icons/Following";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "../../common/models/Dictionary";
import AppContext from "../../Contexts/AppContext";

const OverlapGroup1 = styled.div`
  height: 50px;
  position: relative;
  display: flex;
  // padding: 10px 0;
  align-items: center;
  background-color: var(--white);
  border-radius: 6px;
  box-shadow: ${(props: { expanded?: boolean }) =>
    `${props.expanded ? "0 3px 6px #00000029" : "0 3px 6px #00000029"}`};
  margin: 0 auto;
  width: 100%;
  justify-content: space-evenly;
`;

const Component515 = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 0px 3px 6px #00000029;
  max-width: 400px;
  margin: auto;
  &.component-51-5.component-51-5-1 {
    margin-top: 12px;
  }
`;

const FlexCol = styled.div`
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 5px;
`;

const UsernameUnique = styled.div`
  ${HelveticaneueRegularNormalBlack13px};

  letter-spacing: 0;
  line-height: 13px;
  white-space: nowrap;
  font-size: 12px;
`;

export const StatusContainer = styled.div`
  display: flex;
  padding: 0 4px;
  justify-content: flex-end;
  align-items: flex-end;
  min-width: 43px;
  background-color: var(--blue-violet);
  border-radius: 38px;
`;

const Group4092 = styled(StatusContainer)`
  height: 13px;
  background-color: var(--blue-violet);
`;

const Minister = styled.div`
  ${PoppinsMediumWhite7px};
  min-height: 11px;
  margin-bottom: -2px;
  min-width: 33px;
  letter-spacing: 0;
  line-height: 5px;
  white-space: nowrap;
`;

const Address = styled.p`
  ${PoppinsNormalGunsmoke10px};
  min-height: 17px;
  margin-top: 2px;
  letter-spacing: 0.18px;
  line-height: 15px;
  white-space: nowrap;
  margin-bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ElementsAvatarAImage1 = styled.div`
  width: 40px;
  margin-top: 1px;
  display: flex;
`;

const Component5031 = styled.div`
  height: 28px;
  margin-top: 3px;
  display: flex;
  padding: 6.2px 3.3px;
  justify-content: flex-end;
  align-items: flex-start;
  min-width: 28px;
  background-color: var(--moon-raker);
  border: 1px solid #6352e8;
  border-radius: 14px;
`;

const ViewAll = styled(Link)`
  font: var(--font-style-normal) normal medium 9px / var(--line-spacing-13)
    var(--font-family-poppins);
  font-size: var(--font-size-9);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-6352e8);
  text-align: center;
  padding-left: 12px;
  text-decoration: blink;
  text-transform: uppercase;
`;
export type UserCardProps = {
  leader: Leader;
  checked: boolean;
  setChecked: (c: boolean) => void;
  viewAllLink?: string;
  expanded?: boolean;
};

const UserCard = ({
  leader,
  setChecked,
  checked,
  viewAllLink,
  expanded,
}: UserCardProps) => {
  const translate = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate()
  const{setFollowerUserId}=useContext(AppContext)
  return (
    <Component515
      style={{ boxShadow: !pathname?.includes("/followers") ? "none" : "" }}
    >
      <OverlapGroup1
        expanded={expanded}
        style={{
          boxShadow: !pathname?.includes("/followers") ? "none" : "",
          height: pathname?.includes("/influencers") ? "75px" : "",
          padding: pathname?.includes("/influencers") ? "10px 0" : "",
        }}
      >
        <ElementsAvatarAImage1 onClick={e=>{
          if(leader!=undefined && setFollowerUserId!=undefined)setFollowerUserId(leader?.userId)
          navigate('/followerProfile/mine')
      
      }}>
          <Avatar url={getAvatar(leader)} />
        </ElementsAvatarAImage1>
        <FlexCol>
          <UsernameUnique>{leader.displayName}</UsernameUnique>
          <Group4092>
            <Minister>{translate(leader?.status || "")}</Minister>
            {/* <Minister>{translate(leader?.status?.name || "")}</Minister> */}
          </Group4092>
          <Address>
            <span className='mx-1'>
              {leader.subscribers} {translate("Followers")}
            </span>
            <span className='mx-1'>
              {leader.leaders} {translate("Following")}
            </span>
            {expanded && (
              <span className='mx-1'>
                {Number(Number(leader.pct * 100).toFixed(2))}%
              </span>
            )}
            {!expanded && <span className='mx-1'></span>}
          </Address>
        </FlexCol>
        <Component5031 style={{ background: checked ? "" : "white" }}>
          <Icon
            setChecked={setChecked}
            checked={checked}
            iconOff={<AddFollower />}
            iconOn={<Following />}
            name={`leader-${leader.userId}`}
          />
        </Component5031>
        {viewAllLink && (
          <div>
            <ViewAll to={viewAllLink}>{translate("view all")}</ViewAll>
          </div>
        )}
      </OverlapGroup1>
    </Component515>
  );
};

export default UserCard;
