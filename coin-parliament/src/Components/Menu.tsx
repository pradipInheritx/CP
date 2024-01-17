/** @format */

import { Button, Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../common/models/Dictionary";
import { ContentPage } from "../Contexts/ContentContext";
import AppContext from "../Contexts/AppContext";
import styled from "styled-components";
import { Gradient2 } from "../styledMixins";
import Hamburger from "./Atoms/Hamburger";
import { useWindowSize } from "../hooks/useWindowSize";
import UserContext from "../Contexts/User";
import { isHomeBg } from "./App/App";
import BackArrow from "./icons/BackArrow";
import { Logout } from "common/models/Login";

export const convertPageToMenuItem = (page: ContentPage) => {
  return {
    label: page.title,
    href: `/${page.slug}`,
  } as MenuItem;
};

export type MenuProps = {
  title?: string;
  onSelect: (eventKey: string | null) => void;
  children?: React.ReactNode;
  items: (MenuItem | undefined)[];
  pathname: string;
  setMfaLogin:any;
};

export type MenuItem = {
  eventKey?: string;
  label: string;
  href?: string;
};

const MenuContainer = styled(Offcanvas)`
  & a {
    font: var(--font-style-normal) normal var(--font-weight-normal)
      var(--font-size-13) / 29px var(--font-family-poppins);
    text-align: left;
    letter-spacing: 0.26px;
    color: var(--white);
    text-transform: capitalize;
    opacity: 1;
    &:hover {
      opacity: 0.7;
      color: var(--white);
    }
    &:focus {
      opacity: 0.7;
      color: var(--white);
    }
  }
  ${Gradient2}
`;

const NavContainer = styled(Navbar)`
  position: fixed;
  overflow: hidden;
  width: 100%;
  z-index: 1000;
`;
const HamburgerBut = styled.button`
background:none;
border:none;
 &:focus {
    outline:none;
  }
`;

const Dot = styled.div`
  border-radius: 50%;
  position: absolute;
  font-size: 40px;
  top: -20px;
  right: 3px;
  text-shadow: -1px 0 1px white;
  color: ${(props: { loggedIn: boolean }) =>
    `${props.loggedIn ? "green" : "red"}`};
`;
const Menu = ({
  onSelect,
  children,
  items = [],
  title,
  pathname,
  setMfaLogin,
}: MenuProps) => {
  const { menuOpen, setMenuOpen, login, firstTimeLogin,showMenubar,setLogin,setShowMenuBar } =
    useContext(AppContext);
  const navigate = useNavigate();
  const { user, userInfo, setUser } = useContext(UserContext);
  var urlName = window.location.pathname.split('/');
  const followerPage = urlName.includes("followerProfile")
  const { width } = useWindowSize();
  const handleClose = () => setMenuOpen(false);
  const { backgrounHide } = useContext(AppContext);
  const handleShow = () => {
    if (followerPage) {
      navigate(-1)
    }
    else {
      setMenuOpen(true)
    }
  };

  const BackLogout = () => {
    
    setLogin(true);
    Logout(setUser);
    setShowMenuBar(false)
    setMfaLogin(false)
    navigate("/")
    // console.log("i am working error")	
    localStorage.removeItem("userId")    
};

  const translate = useTranslation();
  
  const desktop = width && width > 979;
  // return <></>;
  return (
    <>
      <NavContainer
        pathname={pathname}
        collapseOnSelect
        expand='lg'
        style={{
          paddingRight: window.screen.width > 979 ? "20px" : "",
          paddingLeft: window.screen.width > 979 ? "20px" : "",
          // background:
          //   login || firstTimeLogin || (width && width > 979)
          //     ? "linear-gradient(180deg, rgba(93,70,224,1) 40%, rgba(99,82,232,1) 80%)"
          //     : undefined,
          // boxShadow: width && width > 979 ? "1px 1px 4px #6352e8" : undefined,
        }}
      >
        {
          backgrounHide &&
          <div style={{
          position: 'fixed',
          height: '120px',
          display: 'flex',          
          borderRadius:" 0px 0px 80px 0px",
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: '1001',
          overflow: 'hidden',
          
          width: '100%',
          
        }} />}
        <Container
          className='text-capitalize align-items-center px-2 justify-content-start'
          fluid={true}
        >
          {!desktop && (
            <div
              className='d-flex justify-content-start'
              style={{ flexBasis: "20%" }}
            >
              {!showMenubar && localStorage.getItem('mfa_passed') != 'true' && <HamburgerBut
                // variant='link'
                onClick={() => {
                  handleShow()
                  // handleSoundClick()
                }}
                className='position-relative'
                style={{

                }}
              >

                {followerPage ? <BackArrow /> : <Hamburger />}
                {/* <Dot {...{loggedIn: !!user}}>•</Dot> */}
              </HamburgerBut>}
              {(user || userInfo?.uid) && localStorage.getItem('mfa_passed') === 'true' && <HamburgerBut
                // variant='link'
                onClick={BackLogout}
                className='position-relative'
              >
                <BackArrow />
              </HamburgerBut>}
            </div>
          )}
          {desktop && (
            <div className='d-flex justify-content-start check'>
              {!showMenubar && localStorage.getItem('mfa_passed') != 'true' && <HamburgerBut
                // variant='link'
                onClick={handleShow}
                className='position-relative'
              >
                {/* <Hamburger /> */}
                {followerPage ? <BackArrow /> : <Hamburger />}                
                {/* <Dot {...{loggedIn: !!user}}>•</Dot> */}
              </HamburgerBut>}
              {(user || userInfo?.uid) && localStorage.getItem('mfa_passed') === 'true' &&  <HamburgerBut
                // variant='link'
                onClick={BackLogout}
                className='position-relative'
              >
                <BackArrow />
              </HamburgerBut>}
            </div>
          )}

          {children}
        </Container>
      </NavContainer>

      <MenuContainer show={menuOpen} onHide={handleClose}>
        <Offcanvas.Header closeButton closeVariant='white'>
          {title && <Offcanvas.Title>{title}</Offcanvas.Title>}
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Nav onSelect={onSelect} className='flex-column'>
            {items
              .filter((item) => item)
              .map((item, i) => {
                if (item?.label === "-") {
                  return <React.Fragment key={i} />;
                }
                if (item?.label === "x") {
                  return <React.Fragment key={i} />;
                }
                if (item?.label === "---") {
                  return <hr key={i} />;
                }
                return item?.href ? (
                  <Nav.Link
                    key={i}
                    as={Link}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {translate(item.label)}
                  </Nav.Link>
                ) : (
                  <Nav.Link key={i} eventKey={item?.eventKey}>
                    {item && translate(item.label)}
                  </Nav.Link>
                );
              })}
          </Nav>
        </Offcanvas.Body>
      </MenuContainer>
    </>
  );
};

export default Menu;
