import UserContext from 'Contexts/User';
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
            <div style={{ marginLeft: '-16em' }}>
              {userInfo?.avatar ?
                // @ts-ignore
                <img style={{ height: '35px', width: '35px', borderRadius: '50px' }} src={userInfo?.avatar} alt="Logo" referrerpolicy="no-referrer" /> :
                <span className="material-symbols-outlined d-flex align-items-center">
                  account_circle
                </span>}
              <span className='ps-2'>{userInfo?.displayName || userInfo?.email}</span>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header >
  )
}

export default Header;