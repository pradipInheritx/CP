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

const HamburgerBut = styled.button`
 background:none;
 border:none;
 &:focus {
    outline:none;
  }
`;

const Header = (setMfaLogin?:any) => {
  const { userInfo, setUserInfo, setUser,user } = useContext(UserContext); 
  const { menuOpen, setMenuOpen, login, firstTimeLogin,showMenubar,setLogin,setShowMenuBar } =
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
    
    Logout(setUser);
    navigate("/")
    setLogin(true);
    setShowMenuBar(false)
    setMfaLogin(false)
    // console.log("i am working error")	
    localStorage.removeItem("userId")    
};

  return (
    <header>
      <Navbar className='navColor' data-bs-theme="light" >
      <div style={{paddingLeft:'10px'}}>
           {(user || userInfo?.uid) && localStorage.getItem('mfa_passed') === 'true' && <HamburgerBut
                // variant='link'
                onClick={BackLogout}
                className='position-relative'
              >
                <BackArrow />
              </HamburgerBut>
            }
      </div>
        <Container>
       
          <Navbar.Brand style={{ color: 'white' }}>
            <Link to={'/'} style={{ textDecoration: 'none', color: 'white' }}>
              <img src="/VTE logo.png" alt="Vote to Earn" className='pe-3' height={50} />{window.screen.width > 350 ? 'Vote to Earn' : ''}
            </Link>
          </Navbar.Brand>

          {(auth.currentUser && userInfo) && (
            <Navbar.Collapse className="justify-content-end" style={{ color: 'white', cursor: 'pointer' }}>

            {auth.currentUser && userInfo?.avatar ?
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
              <span className="material-symbols-outlined d-flex align-items-center">
                account_circle
              </span>
              }
              {(userInfo?.uid) && localStorage.getItem('mfa_passed') === 'false' ?
              <NavDropdown color='white' title={window.screen.width > 767 ? userInfo?.displayName || userInfo?.email : ""}
                id="basic-nav-dropdown"
                className={`${window.screen.width > 767 ? "BigDiv" : "SmallDiv"} justify-content-start textWhite`}
                style={{ color: 'white', cursor: 'pointer' }}
              
              >
              <NavDropdown.Item className='dropdown-item' onClick={() => navigate('/')} style={{ textDecoration: 'none', color: 'black', textAlign: 'start' }}>
                Top V2E Apps
              </NavDropdown.Item>
              <NavDropdown.Item className='dropdown-item' onClick={() => navigate('/profile')} style={{ textDecoration: 'none', color: 'black', textAlign: 'start' }}>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item className='dropdown-item' onClick={() => navigate('/profile/share')} style={{ textDecoration: 'none', color: 'black', textAlign: 'start' }}>
                Become Ambassador
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item style={{ textAlign: 'start' }} onClick={() => logOutHandler()}>Log out</NavDropdown.Item>
            </NavDropdown>:<span style={{paddingLeft:"10px"}}>{userInfo?.displayName || userInfo?.email}</span>
            }
          </Navbar.Collapse>)}
        </Container>
      </Navbar>
    </header >
  )
}

export default Header;