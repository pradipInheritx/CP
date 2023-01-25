/** @format */

import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import UserContext from "../Contexts/User";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import UserCard from "../Components/Profile/UserCard";
import styled from "styled-components";
import { Gradient2 } from "../styledMixins";
import { isV1, PageContainer } from "../Components/App/App";
import ImageTabs from "../Components/Profile/ImageTabs";
import Votes from "../Components/icons/votes";
import Mine from "../Components/icons/mine";
import Share from "../Components/icons/share";
import Following from "../Components/icons/Following1";
import Notifications from "../Components/icons/notifications";
import NotificationContext, { ToastType } from "../Contexts/Notification";
import AvatarsModal from "../Components/Profile/AvatarsModal";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AvatarType } from "../assets/avatars/Avatars";
import { toast } from "react-toastify";
import { useTranslation } from "../common/models/Dictionary";
import Spinner from "../Components/Spinner";
import UserIcon from "../Components/icons/userIcon";
import SecurityIcon from "../Components/icons/securityIcon";
import ProfileNftGallery from "./ProfileNftGallery";

export enum ProfileTabs {
  profile = "profile",
  password = "password",
  followers = "followers",
  mine = "mine",
  edit = "edit",
  votes = "votes",
  notifications = "notifications",
  ProfileNftGallery = "Gallery",
  share = "share",
}

export const CardContainer = styled.div`

&.BigScreen{
${Gradient2};
  height: 127px;
  padding: 0;
  box-shadow: 0 3px 6px #00000029;
  border-radius: 0 0 87px 0;
}
  
`;

export const OuterContainer = styled.div`
  background: ${window.screen.width < 979 ? "var(--color-d4d0f3)" : ""};
  position: relative;
  z-index: 0;

`;

const Profile = () => {
  const { userInfo, user } = useContext(UserContext);
  const { showToast } = useContext(NotificationContext);
  const [avatarMode, setAvatarMode] = useState(false);
  const location = useLocation();
  const pathname = location.pathname.replace("/profile/", "");
  const [chosenByDefault, setChosenByDefault] = useState(pathname);
  let navigate = useNavigate();
  const translate = useTranslation();

  useEffect(() => {
    setChosenByDefault(pathname);
    return () => setAvatarMode(false);
  }, [pathname]);

  // if (!user) {
  //   return (
  //     <Navigate
  //       to="/"
  //       state={{
  //         from: location,
  //       }}
  //     />
  //   );
  // }

  const onSubmitAvatar = async (type: AvatarType) => {
    if (user?.uid) {
      const userRef = doc(db, "users", user?.uid);
      try {
        await setDoc(userRef, { avatar: type }, { merge: true });
        showToast(translate("user info was updated"));
        toast.dismiss();
      } catch (e) {
        showToast(translate("user failed to be updated"), ToastType.ERROR);
      }
    }
  };

  
  return user ? (
    <PageContainer fluid color='var(--pixie-powder)' radius={0} shadow='' className="">
      {avatarMode && (
        // <Container className="py-3" fluid>
        <AvatarsModal
          {...{
            onSubmit: onSubmitAvatar,
            onClose: () => setAvatarMode(false),
          }}
        />
        // </Container>
      )}
      {!avatarMode && (
        <OuterContainer>
          <CardContainer className={`${window.screen.width > 979? "BigScreen":""}`}>
            <>
              <UserCard user={userInfo} onClick={() => setAvatarMode(true)}>
                {window.screen.width < 979 && (
                  <Container
                    fluid                    
                    style={{
                      // paddingTop: 60,
                      paddingLeft: "0px",
                      paddingRight: "0px",
                    }}
                  >
                    {![
                      ProfileTabs.edit as string,
                      ProfileTabs.password as string,
                    ].includes(pathname) && (
                      <ImageTabs
                        {...{
                          chosenByDefault,
                          handleSelect: (eventKey: string | null) => {
                            if (isV1() && eventKey === ProfileTabs.mine) {
                              showToast(
                                translate("Feature will be available soon"),
                                ToastType.INFO
                              );
                              return;
                            }
                            navigate("./" + eventKey, { replace: true });
                          },
                          tabs: [
                            {
                              component: <></>,
                              label: ProfileTabs.mine,
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
                              icon: <Votes />,
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
                      window.screen.width < 979 && (
                        <ImageTabs
                          {...{
                            chosenByDefault,
                            handleSelect: (eventKey: string | null) => {
                              if (isV1() && eventKey === ProfileTabs.mine) {
                                showToast(
                                  translate("Feature will be available soon"),
                                  ToastType.INFO
                                );
                                return;
                              }
                              navigate("./" + eventKey, { replace: true });
                            },
                            tabs: [
                              {
                                component: <></>,
                                label: ProfileTabs.edit,
                                icon: <UserIcon />,
                                eventKey: ProfileTabs.edit,
                              },
                              {
                                component: <></>,
                                label: ProfileTabs.password,
                                icon: <SecurityIcon />,
                                eventKey: ProfileTabs.password,
                              },
                            ],
                          }}
                        />
                      )}
                  </Container>
                )}
              </UserCard>
            </>
          </CardContainer>
        </OuterContainer>
      )}
      <div
        className='p-0'
        style={{ minHeight: window.screen.width < 979 ? "60vh" : "70vh" }}
      >
        <div  className="w-100"  style={{ color: "var(--black)" }}>
          <div className='p-0 col'>
            {/* <Col > */}
            <Outlet />
          </div>
        </div>
      </div>
    </PageContainer>
  ) : (
    <div
      className='d-flex justify-content-center align-items-center'
      style={{ height: "100vh", width: "100vw" }}
    >
      <Spinner />
    </div>
  );
};

export default Profile;
