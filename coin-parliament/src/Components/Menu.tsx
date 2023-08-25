/** @format */

import { Button, Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "../common/models/Dictionary";
import { ContentPage } from "../Contexts/ContentContext";
import AppContext from "../Contexts/AppContext";
import styled, { css } from "styled-components";
import { Gradient2 } from "../styledMixins";
import Hamburger from "./Atoms/Hamburger";
import { useWindowSize } from "../hooks/useWindowSize";
import UserContext from "../Contexts/User";
import { isHomeBg } from "./App/App";
import BackArrow from "./icons/BackArrow";
import { handleSoundClick } from "../common/utils/SoundClick";

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
  // border:1px solid red;  
`;
type ZoomProps = {
  inOutReward?: number,
  coinIncrement?: boolean,
  showCoinIncrement: number,
};

const BoxSet = css`
background-color: rgba(0,0,0,0.8);
  position: fixed;
  width:100%;
  height: 100vh;
  z-index:2000;
`;
const BoxSet2 = css`
background-color:none;
  // position: fixed;
  // width:100%;
  // height: 100vh;
  // z-index:2000;
`;

const CoinPopup = styled.div`
${(props: ZoomProps) => `${(props.showCoinIncrement === 1) ? BoxSet : BoxSet2}`};   
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
}: MenuProps) => {  
  const { menuOpen, setMenuOpen, login,showMenubar} =
    useContext(AppContext);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  var urlName = window.location.pathname.split('/');
  const followerPage = urlName.includes("followerProfile")
  const [showCoinIncrement, setShowCoinIncrement] = useState<number>(0); 
  const { width } = useWindowSize();
  const {backgrounHide} = useContext(AppContext);
  const handleClose = () => {
    setMenuOpen(false);
    // handleSoundClick()
  }
  // console.log("hello")
  const handleShow = () => {
    if (followerPage) {
      navigate(-1)
    }
    else {
      setMenuOpen(true)
    }
  };
  const translate = useTranslation();


  const desktop = width && width > 979;
  
    useEffect(() => {
      if (backgrounHide) {
        setShowCoinIncrement(1)
      } else {
        setShowCoinIncrement(0)
      }
    
  }, [backgrounHide]);



  return (
    <>
      <CoinPopup {...{ showCoinIncrement }} className="">
        
        </CoinPopup>
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
        <Container
          className='text-capitalize align-items-center px-2 justify-content-start'
          fluid={true}
        >
          {!desktop && (
            <div
              className='d-flex justify-content-start'
              style={{ flexBasis: "20%" }}
            >
              {!showMenubar && <HamburgerBut
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
            </div>
          )}
          {desktop &&(
            <div className='d-flex justify-content-start check'>
              {!showMenubar && <HamburgerBut
                // variant='link'
                onClick={handleShow}
                className='position-relative'
              >
                {/* <Hamburger /> */}
                {followerPage ? <BackArrow /> : <Hamburger />}
                {/* <Dot {...{loggedIn: !!user}}>•</Dot> */}
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
                    onClick={() => {
                      setMenuOpen(false)
                      // handleSoundClick()
                    }}
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
