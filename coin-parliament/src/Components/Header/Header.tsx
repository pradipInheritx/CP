import { showToast } from 'App';
import UserContext from 'Contexts/User';
import Avatars from 'assets/avatars/Avatars';
import { Logout } from 'common/models/Login';
import { useContext } from 'react';
import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import classes from './header.module.css'
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
              <img src="/VTE logo.webp" alt="Vote to Earn" className='pe-3' />{window.screen.width > 350 ? 'Vote to Earn' : ''}
            </Link>
          </Navbar.Brand>
          {userInfo && (<Navbar.Collapse className="justify-content-end" style={{ color: 'white', cursor: 'pointer' }}>

            {userInfo?.avatar ?
              <Avatars type={userInfo?.avatar} /> :
              <span className="material-symbols-outlined d-flex align-items-center">
                account_circle
              </span>}

            <NavDropdown color='white' title={userInfo?.displayName || userInfo?.email} id="basic-nav-dropdown" className='justify-content-start textWhite' style={{ color: 'white', cursor: 'pointer' }}>
              <NavDropdown.Item className='dropdown-item' onClick={() => navigate('/profile')} style={{ textDecoration: 'none', color: 'black', textAlign: 'start' }}>
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item className='dropdown-item' onClick={() => navigate('/profile/share')} style={{ textDecoration: 'none', color: 'black', textAlign: 'start' }}>
                Share
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