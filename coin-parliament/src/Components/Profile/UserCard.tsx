/** @format */

import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { UserProps } from "../../common/models/User";
import { useTranslation } from "../../common/models/Dictionary";
import Avatar from "../Users/Avatar";
import { StatusContainer } from "../Users/UserCard";
import Avatars, { AvatarType } from "../../assets/avatars/Avatars";
import ImageTabs from "./ImageTabs";
import { isV1 } from "../App/App";
import UserIcon from "../icons/userIcon";
import SecurityIcon from "../icons/securityIcon";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import Votes from "../icons/votes";
import Mine from "../icons/mine";
import Share from "../icons/share";
import Following from "../icons/Following";
import Gallery from "../icons/Gallery";
import Notifications from "../icons/notifications";
import Wallet from "../icons/Wallet";
import { texts } from "../LoginComponent/texts";

const OverlapGroup1 = styled.div`
  
  position: relative;
  display: flex;
  padding: 10px 14px;
  align-items: center;
  min-width: 321px;
  border-radius: 6px;
  justify-content: center;
  margin: 0 auto;
`;

const Component515 = styled.div`
  width: 100%;
  min-width: 321px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &.component-51-5.component-51-5-1 {
    margin-top: 12px;
  }
`;

const FlexCol = styled.div`
  width: 173px;
  align-self: flex-end;
  margin-left: 14px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 49px;
`;

const UsernameUnique = styled.div`
  font-family: var(--font-family-poppins);
  font-weight: 400;
  color: var(--white);
  font-size: var(--font-size-16);
  letter-spacing: 0;
  line-height: 19px;
  white-space: nowrap;
  margin-bottom: 1px;
`;

const Group4092 = styled(StatusContainer)`
  height: 19px;
  background: var(--moon-raker);
`;

const Minister = styled.div`
  font-family: var(--font-family-poppins);
  font-weight: 500;
  color: var(--blue-violet);
  font-size: var(--font-size-xl2);
  line-height: 19px;
  letter-spacing: 0;
  white-space: nowrap;
`;

const ElementsAvatarAImage1 = styled.div`
  width: 60px;
  margin-top: 1px;
  display: flex;
`;
export enum ProfileTabs {
  profile = "profile",
  password = "password",
  wallet = "wallet",
  followers = "followers",
  mine = "mine",
  edit = "edit",
  votes = "votes",
  notifications = "notifications",
  share = "share",
  ProfileNftGallery = "Album",
  ProfileNftGalleryType = "Album/:name",
}
export type UserCardProps = {
  user?: UserProps;
  onClick: () => void;
  children?: React.ReactNode;
};

const UserCard = ({ user, onClick, children }: UserCardProps) => {
  const translate = useTranslation();
  const location = useLocation();
  const pathname = location.pathname.replace("/profile/", "");
  const [chosenByDefault, setChosenByDefault] = useState(pathname);
  const { showToast } = useContext(NotificationContext);
  let navigate = useNavigate();
  useEffect(() => {
    setChosenByDefault(pathname);
  }, [pathname]);
  return (
    <>
    
      <Component515>
        <OverlapGroup1>
           
          {/* <ElementsAvatarAImage1 onClick={onClick} role="button">
            {user?.avatar && (
              <Avatars type={user?.avatar as AvatarType} width={60}/>
            )}
            {!user?.avatar && <Avatar/>}
          </ElementsAvatarAImage1>
          <FlexCol>
            <UsernameUnique>
              {user?.displayName || user?.firstName}
            </UsernameUnique>
            <Group4092>
              <Minister>{translate(user?.status?.name || "")}</Minister>
            </Group4092>
          </FlexCol> */}
          <div className='mt-4'>
            {![
              ProfileTabs.edit as string,
              ProfileTabs.password as string,
            ].includes(pathname) &&
              window.screen.width > 979 && (
                <ImageTabs
                  {...{
                    chosenByDefault,
                    handleSelect: (eventKey: string | null) => {
                      if (isV1() && eventKey === ProfileTabs.mine) {
                        showToast(
                          translate(texts.FeatureAvailableSoon),
                          ToastType.INFO
                        );
                        return;
                      }
                      navigate("./" + eventKey, { replace: true });
                    },
                    tabs: [
                      {
                        component: <></>,
                        label: "Mining",
                        icon: <Mine />,
                        eventKey: ProfileTabs.mine,
                      },
                      {
                        component: <></>,
                        label: "Pool Mining",
                        icon: <Share />,
                        eventKey: ProfileTabs.share,
                      },
                      {
                        component: <></>,
                        label: ProfileTabs.votes,
                        icon: <Votes />,
                        eventKey: ProfileTabs.votes,
                      },
                      {
                        component: <></>,
                        label: ProfileTabs.ProfileNftGallery,
                        icon: <Gallery />,
                        eventKey: ProfileTabs.ProfileNftGallery,
                      },
                      
                      
                      {
                        component: <></>,
                        label: ProfileTabs.followers,
                        icon: <Following />,
                        eventKey: ProfileTabs.followers,
                      },
                      {
                        component: <></>,
                        label: ProfileTabs.notifications,
                        icon: <Notifications />,
                        eventKey: ProfileTabs.notifications,
                      },
                      
                    ],
                  }}
                />
              )}
            {[
              ProfileTabs.edit as string,
              ProfileTabs.password as string,
            ].includes(pathname) &&
              window.screen.width > 979 && (
                <ImageTabs
                  {...{
                    chosenByDefault,
                    handleSelect: (eventKey: string | null) => {
                      if (isV1() && eventKey === ProfileTabs.mine) {
                        showToast(
                          translate(texts.FeatureAvailableSoon),
                          ToastType.INFO
                        );
                        return;
                      }
                      navigate("./" + eventKey, { replace: true });
                    },
                    tabs: [
                      {
                        component: <></>,
                        label: "info",
                        icon: <UserIcon />,
                        eventKey: ProfileTabs.edit,
                      },
                      {
                        component: <></>,
                        label:"security",
                        icon: <SecurityIcon />,
                        eventKey: ProfileTabs.password,
                      },
                      {
                        component: <></>,
                        label: ProfileTabs.wallet,
                        icon: <Wallet/>,
                        eventKey: ProfileTabs.wallet,
                      },
                    ],
                  }}
                />
              )}
          </div>
        </OverlapGroup1>
      </Component515>
      {children}
    </>
  );
};

export default UserCard;
