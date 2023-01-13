import {Navbar} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {getAuth, signOut} from "firebase/auth";
import UserContext from "../Contexts/User";
import {Logout} from "../common/models/Login";
import AppContext from "../Contexts/AppContext";
import ContentContext from "../Contexts/ContentContext";
import Menu, {convertPageToMenuItem} from "./Menu";
import {ProfileTabs} from "../Pages/Profile";
import Logo, {Size} from "./Atoms/Logo";
import styled from "styled-components";
import {isV1} from "./App/App";
import {useWindowSize} from "../hooks/useWindowSize";

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
  const {user, setUser} = useContext(UserContext);
  const [mounted, setMounted] = useState(false);
  const {width} = useWindowSize();
  const desktop = width && width > 979;

  const {languages, setLang, setLogin, setSignup, setMenuOpen} =
    useContext(AppContext);
  const {pages} = useContext(ContentContext);

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
            console.log('logout',res)
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
        !isV1() && user && {
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
      {!desktop && <Title style={{width: pathname === "/" ? "50%" : "50%"}}>{mounted ? title : ""}</Title>}
      {logo ? (
        <div style={{
          flexBasis:'100%',
          textAlign:'center'
          // width: desktop ? "25%" : (pathname === "/" ? "75%" : "25%"),
          // textAlign: desktop ? undefined : "center",
        }}>
          <Navbar.Brand as={Link} to="/">
            <Logo size={Size.XSMALL}/>
          </Navbar.Brand>
        </div>
      ) : (
        (<div style={{width: "25%"}}>&nbsp;</div>)
      )}
      {/* {desktop && <Title style={{flexBasis: "50%", textAlign: "center"}}>{mounted ? title : ""}</Title>} */}
    </MenuContainer>
  );
};

export default Header;
