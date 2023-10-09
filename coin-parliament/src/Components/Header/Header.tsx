import UserContext from 'Contexts/User';
import Avatars from 'assets/avatars/Avatars';
import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
const Header = () => {
  const { userInfo } = useContext(UserContext);
  return (
    <header>
      <Navbar className='navColor' data-bs-theme="light" >
        <Container>
          <Navbar.Brand href="/" style={{ color: 'white' }}>
            <img src="/VTE logo.webp" alt="Vote to Earn" />{window.screen.width > 350 ? 'Vote to Earn' : ''}
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-center" style={{ color: 'white', cursor: 'pointer' }}>
            {userInfo && (
              userInfo?.avatar ?
                <Avatars type={userInfo?.avatar} /> :
                <span className="material-symbols-outlined d-flex align-items-center">
                  account_circle
                </span>
            )}
            <span className='ps-2' style={{ marginRight: '19em' }}>{userInfo?.displayName || userInfo?.email}</span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header >
  )
}

export default Header;