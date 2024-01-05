import { showToast } from 'App';
import UserContext from 'Contexts/User';
import Avatars from 'assets/avatars/Avatars';
import { Logout } from 'common/models/Login';
import { useContext, useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import { auth } from 'firebase';
const Header = () => {
  const { userInfo, setUserInfo, setUser } = useContext(UserContext); 
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

  return (
    <header>
      <Navbar className='navColor' data-bs-theme="light" >
        <Container>
          <Navbar.Brand style={{ color: 'white' }}>
            <Link to={'/'} style={{ textDecoration: 'none', color: 'white' }}>
              <img src="/VTE logo.png" alt="Vote to Earn" className='pe-3' height={50} />{window.screen.width > 350 ? 'Vote to Earn' : ''}
            </Link>
          </Navbar.Brand>

          {(auth.currentUser&& userInfo) && (
            <Navbar.Collapse className="justify-content-end" style={{ color: 'white', cursor: 'pointer' }}>

            {userInfo?.avatar ?
              <Avatars type={userInfo?.avatar} /> :
              <span className="material-symbols-outlined d-flex align-items-center">
                account_circle
              </span>}

              <NavDropdown color='white' title={window.screen.width > 767 ? userInfo?.displayName || userInfo?.email : ""}
                id="basic-nav-dropdown"
                className={`${window.screen.width > 767 ? "BigDiv" : "SmallDiv"} justify-content-start textWhite`}
                style={{ color: 'white', cursor: 'pointer' }}
              
              >
              <NavDropdown.Item className='dropdown-item' onClick={() => navigate('/')} style={{ textDecoration: 'none', color: 'black', textAlign: 'start' }}>
                Top VTE Apps
              </NavDropdown.Item>
              <NavDropdown.Item className='dropdown-item' onClick={() => navigate('/profile')} style={{ textDecoration: 'none', color: 'black', textAlign: 'start' }}>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item className='dropdown-item' onClick={() => navigate('/profile/share')} style={{ textDecoration: 'none', color: 'black', textAlign: 'start' }}>
                Become Ambassador
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item style={{ textAlign: 'start' }} onClick={() => logOutHandler()}>Log out</NavDropdown.Item>
            </NavDropdown>
          </Navbar.Collapse>)}
        </Container>
      </Navbar>
    </header >
  )
}

export default Header;