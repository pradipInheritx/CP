/** @format */

import { Container, Navbar } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import UserContext from "../Contexts/User";
import { Logout } from "../common/models/Login";
import AppContext from "../Contexts/AppContext";
import ContentContext from "../Contexts/ContentContext";
import Menu, { convertPageToMenuItem } from "./Menu";
import { ProfileTabs } from "../Pages/Profile";
import Logo, { Size } from "./Atoms/Logo";
import styled from "styled-components";
import { isV1 } from "./App/App";
import { useWindowSize } from "../hooks/useWindowSize";
import UserCard from "./Profile/UserCard";
import ImageTabs from "./Profile/ImageTabs";

enum EventKeys {
  LOGIN = "login",
  LOGOUT = "logout",
  SIGNUP = "signup",
  ABOUT = "about",
  PROFILE = "profile",
  VOTES = "votes",
  NOTIFICATIONS = "notifications",
  PASSWORD = "password",
  EDIT = "edit",
  POOL_MINING = "pool",
  SHARE = "share",
  FOLLOWERS = "followers",
}

export const Title = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal) 20px/18px
    var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--white);
  text-align: left;
  opacity: 1;
  margin: 0;

  & h1 {
    text-align: center;
  }
`;

export const HeaderCenter = styled.div`
  background: white;
  color: #6352e8;
  width: 55%;
  height: 35px;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 75px;
   border-radius 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const HeaderCenterMob = styled.div` 
  background:white;
  color:#6352E8;
  width: 45%;
  height: 30px;
  
  margin-left:25px;
  border-radius 50px;
  display: flex;
  justify-content:space-around;
  align-items: center;
`;

export const PlusButton = styled.div`
  width: 27px;
  height: 27px;
  background: #6352e8;
  color: white;
  border-radius: 50px;
  padding-top: 3px;
  font-size: 15px;
`;
export const PlusButtonMob = styled.div`
  width: 20px;
  height: 20px;
  background: #6352e8;
  color: white;
  text-align: center;

  border-radius: 50px;
  font-size: 13px;
`;

export const OuterContainer = styled.div`
  background: ${window.screen.width < 979 ? "var(--color-d4d0f3)" : ""};
  position: relative;
  z-index: 0;
  padding-bottom: ${window.screen.width < 979 ? "100px" : ""};
`;

// export const CardContainer = styled.div`
//   ${Gradient2};
//   height: 127px;
//   padding: 0;
//   box-shadow: 0 3px 6px #00000029;
//   border-radius: 0 0 87px 0;
// `;

const MenuContainer = styled(Menu)``;

const Header = ({
  title,
  logo = true,
  pathname,
}: {
  title?: React.ReactNode;
  logo?: boolean;
  pathname: string;
}) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [mounted, setMounted] = useState(false);
  const { width } = useWindowSize();
  const desktop = width && width > 979;

  const { languages, setLang, setLogin, setSignup, setMenuOpen } =
    useContext(AppContext);
  const { pages } = useContext(ContentContext);

  useEffect(() => {
    if (pages) {
      setMounted(true);
    }
  }, [pages]);

  const onSelect = (eventKey: string | null) => {
    const auth = getAuth();

    switch (eventKey) {
      case EventKeys.LOGIN:
        setLogin(true);
        setSignup(false);
        break;
      case EventKeys.SIGNUP:
        setLogin(true);
        setSignup(true);
        break;
      case EventKeys.LOGOUT:
        signOut(auth)
          .then((res) => {
            console.log("logout", res);
            Logout(setUser);
          })
          .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
          });
        break;
      case EventKeys.EDIT:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.edit, {
          replace: true,
        });
        break;
      case EventKeys.POOL_MINING:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.mine, {
          replace: true,
        });
        break;
      case EventKeys.SHARE:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.share, {
          replace: true,
        });
        break;
      case EventKeys.FOLLOWERS:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.followers, {
          replace: true,
        });
        break;
      case EventKeys.PASSWORD:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.password, {
          replace: true,
        });
        break;
      case EventKeys.NOTIFICATIONS:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.notifications, {
          replace: true,
        });
        break;
      case EventKeys.VOTES:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.votes, {
          replace: true,
        });
        break;
      default:
        if (eventKey && languages.includes(eventKey)) {
          setLang(eventKey);
        }
    }

    setMenuOpen(false);
  };

  return (
    <div>
      <div className=''>
        <MenuContainer
          pathname={pathname}
          onSelect={onSelect}
          items={[
            {
              href: "/",
              label: "Home",
            },
            {
              href: "/coins",
              label: "Coin Vote",
            },
            {
              href: "/pairs",
              label: "Pairs Vote",
            },
            {
              href: "/influencers",
              label: "Top Influencers",
            },
            {
              label: "",
            },
            user && {
              eventKey: EventKeys.VOTES,
              label: "Votes",
            },
            !isV1() &&
              user && {
                eventKey: EventKeys.POOL_MINING,
                label: "Pool Mining",
              },
            user && {
              eventKey: EventKeys.SHARE,
              label: "Share",
            },
            user && {
              eventKey: EventKeys.FOLLOWERS,
              label: "Followers",
            },
            user && {
              eventKey: EventKeys.NOTIFICATIONS,
              label: "Notifications",
            },
            user && {
              eventKey: EventKeys.PASSWORD,
              label: "Password",
            },
            user && {
              eventKey: EventKeys.EDIT,
              label: "Edit",
            },
            {
              label: "",
            },
            {
              label: "",
            },
            ...(pages || []).map(convertPageToMenuItem),
            {
              label: "-",
            },
            !user && {
              eventKey: EventKeys.LOGIN,
              label: "Login",
            },
            user && {
              eventKey: EventKeys.LOGOUT,
              label: "Logout",
            },
            !user && {
              eventKey: EventKeys.SIGNUP,
              label: "Signup",
            },
          ].map((i) => (i ? i : undefined))}
        >
          {/* {!desktop && (
        <Title style={{ width: pathname === "/" ? "50%" : "50%" }}>
          {mounted ? title : ""}
        </Title>
      )} */}

          {/* {for center modile size} */}

          {!desktop && (
            <div className='' style={{ width: "75%" }}>
              <div className=''>
                <div
                  className='d-flex justify-content-between align-items-center '
                  style={{ position: "relative", height: "80px" }}
                >
                  <div
                    className=''
                    style={{
                      position: "absolute",
                      // marginLeft: "20px",
                      // marginTop: "2px",
                    }}
                  >
                    <img
                      src='https://mdbcdn.b-cdn.net/img/new/avatars/1.webp'
                      className='rounded-circle shadow-4'
                      style={{
                        width: "45px",
                        boxShadow: "1px 0px 5px #6352E8",
                      }}
                      alt='Avatar'
                    />
                  </div>
                  <HeaderCenterMob className=''>
                    <div></div>
                    <p className='ml-4'>VOTES 999</p>
                    <PlusButtonMob>
                      <span>+</span>
                    </PlusButtonMob>
                  </HeaderCenterMob>
                  <div>
                    <Title style={{ width: pathname === "/" ? "50%" : "50%" }}>
                      {mounted ? title : ""}
                    </Title>
                  </div>
                </div>
                {/* <div className=''>
                  <p>{"unique_Username"}</p>
                  <strong>{"MEMBER"}</strong>
                </div> */}
              </div>
            </div>
          )}

          {/* {for center web size} */}

          {logo ? (
            <div
              style={{
                flexBasis: "100%",
                textAlign: "center",
                // width: desktop ? "25%" : (pathname === "/" ? "75%" : "25%"),
                // textAlign: desktop ? undefined : "center",
              }}
            >
              <div className=''>
                <div
                  className='d-flex   w-25 mx-auto '
                  style={{ position: "relative", height: "100px" }}
                >
                  <div
                    className=''
                    style={{
                      position: "absolute",
                      marginLeft: "40px",
                      // marginTop: "px",
                    }}
                  >
                    <img
                      src='https://mdbcdn.b-cdn.net/img/new/avatars/1.webp'
                      className='rounded-circle shadow-4'
                      style={{
                        width: "60px",
                        boxShadow: "1px 0px 5px #6352E8",
                      }}
                      alt='Avatar'
                    />
                  </div>
                  <div className='w-100'>
                    <HeaderCenter className=''>
                      <div></div>
                      <p className='ml-5'>VOTES 999</p>
                      <PlusButton>
                        <span>+</span>
                      </PlusButton>
                    </HeaderCenter>
                    <div
                      className=' '
                      style={{
                        width: "50%",
                        marginLeft: "100px",
                        textAlign: "left",
                      }}
                    >
                      <p className='mb-1'>{"unique_Username"}</p>
                      <strong
                        style={{
                          padding: "2px 10px 2px 10px ",
                          background: "#D4D0F3",
                          color: "#6352E8",
                          borderRadius: "10px",
                          marginTop: "10px",
                        }}
                      >
                        {"MEMBER"}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
              {/* <Navbar.Brand as={Link} to='/'>
                <Logo size={Size.XSMALL} />
              </Navbar.Brand> */}
            </div>
          ) : (
            <div style={{ width: "25%" }}>&nbsp;</div>
          )}
          {/* {desktop && <Title style={{flexBasis: "50%", textAlign: "center"}}>{mounted ? title : ""}</Title>} */}
        </MenuContainer>
      </div>
    </div>
  );
};

export default Header;
