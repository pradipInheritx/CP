import { showToast } from 'App';
import UserContext from 'Contexts/User';
import Avatars, { AvatarType, defaultAvatar } from 'assets/avatars/Avatars';
import { Logout } from 'common/models/Login';
import { useContext, useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import { auth } from 'firebase';
import BackArrow from 'Components/icons/BackArrow';
import AppContext from 'Contexts/AppContext';
import styled from 'styled-components';
import { userInfo } from '../Coins/testData';

const HamburgerBut = styled.button`
 background:none;
 border:none;
 &:focus {
    outline:none;
  }
`;

const Header = (setMfaLogin?:any) => {
  const { userInfo, setUserInfo, setUser,user } = useContext(UserContext); 
  const { menuOpen, setMenuOpen, login, firstTimeLogin,showMenubar,setLogin,setShowMenuBar,selectBioEdit,firstTimeAvatarSlection} =
    useContext(AppContext);
  const navigate = useNavigate();
  const logOutHandler = async () => {
    const result = await Logout(setUser);
    if (result) {
      setUserInfo();
      navigate('/login');
    } else {
      showToast("Unable to log out please try again.");
    }
  }
  const BackLogout = () => {    
    setLogin(true);
    Logout(setUser);
    setShowMenuBar(false)
    setMfaLogin(false)
    navigate("/")
    // console.log("i am working error")	
    localStorage.removeItem("userId")    
};

  return (
    <header>
      <Navbar className='navColor' data-bs-theme="light" >
      <div style={{paddingLeft:'0px'}}>
           {(user || userInfo?.uid) && localStorage.getItem('mfa_passed') === 'true' && <HamburgerBut
                // variant='link'
                className='position-relative'
                onClick={BackLogout}
              >
                <BackArrow />
              </HamburgerBut>
            }
      </div>
        <Container className='header-container gap-3'>
       
          <Navbar.Brand style={{ color: 'white', margin: 0 }}>
            <Link to={'/'} style={{ textDecoration: 'none', color: 'white' }}>
              <img src="/VTE logo.png" alt="Vote to Earn" height={50} className='me-1' />
              {/* {window.screen.width > 370 ? ' */}
              Vote to Earn
              {/* ' : ''} */}
            </Link>
          </Navbar.Brand>

          {(auth.currentUser && userInfo) && (
            <Navbar.Collapse className="justify-content-end" style={{ color: 'white', cursor: 'pointer' }}>

            {auth.currentUser && userInfo?.avatar!!=='skipped' && userInfo?.avatar  ?
                <Avatars
                  // @ts-ignore
                  type={userInfo?.avatar || defaultAvatar as AvatarType}
                  style={{
                    width: "45px",
                    height: "45px",
                    // border: "1px solid #6352E8",
                    // @ts-ignore                    
                  }}
                /> :
              // <span className="material-symbols-outlined d-flex align-items-center">
              //   account_circle
              // </span>
              <div style={{
                borderRadius: '100%',
                height: '50px',
                width: '50px',
                fontSize:"1.5rem",
                border: 'solid 2px white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontWeight: 'bold',
              }}>
                  {userInfo?.email && userInfo?.email?.length >= 0 ? userInfo?.email[0].toUpperCase() : ""}
              </div>
              }
              {(userInfo?.uid && !firstTimeLogin && !firstTimeAvatarSlection && !selectBioEdit) ?
              <NavDropdown color='white' title={window.screen.width > 767 ? userInfo?.displayName || userInfo?.email : ""}
                id="basic-nav-dropdown"
                className={`${window.screen.width > 767 ? "BigDiv" : "SmallDiv"} justify-content-start textWhite`}
                style={{ color: 'white', cursor: 'pointer' }}
              
              >
              <NavDropdown.Item  style={{ color: 'black',textAlign: 'start'}}>
                 {window.screen.width <= 767 ? userInfo?.displayName || userInfo?.email : ""}
              </NavDropdown.Item>
              <NavDropdown.Divider style={{display: window.screen.width <= 767 ? "block":"none"}} /> 
              <NavDropdown.Item className='dropdown-item' onClick={() => navigate('/')} style={{ textDecoration: 'none', color: 'black', textAlign: 'start' }}>
                Top V2E Apps
              </NavDropdown.Item>
              <NavDropdown.Item className='dropdown-item' onClick={() => navigate('/profile/edit')} style={{ textDecoration: 'none', color: 'black', textAlign: 'start' }}>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item className='dropdown-item' onClick={() => navigate('/profile/share')} style={{ textDecoration: 'none', color: 'black', textAlign: 'start' }}>
                Become Ambassador
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item style={{ textAlign: 'start' }} onClick={() => logOutHandler()}>Log out</NavDropdown.Item>
            </NavDropdown>:<span className='line-clamp-2' style={{paddingLeft:"10px"}}>{userInfo?.displayName || userInfo?.email}</span>
            }
          </Navbar.Collapse>)}
        </Container>
      </Navbar>
    </header >
  )
}

export default Header;