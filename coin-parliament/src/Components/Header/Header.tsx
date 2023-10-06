import { auth } from 'firebase';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
const Header = () => {
  console.log(auth.currentUser, 'pkkk');

  return (
    <header>
      <Navbar className='navColor' data-bs-theme="light" >
        <Container>
          <Navbar.Brand href="/" style={{ color: 'white' }}>
            <img src="/VTE logo.webp" alt="Vote to Earn" /> Vote to Earn
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end" style={{ color: 'white', cursor: 'pointer' }}>
            {auth.currentUser?.photoURL ?
              <img style={{ height: '35px', width: '35px', borderRadius: '50px' }} src={"https://lh3.googleusercontent.com/a/ACg8ocLRz5z8krXbHkcMQR-HE3Y15BzEQPfiDkOJ-Y3P-lQaTw=s96-c"} alt="" /> :
              <span className="material-symbols-outlined d-flex align-items-center">
                account_circle
              </span>}
            <span className='ps-2'>{auth.currentUser?.displayName || auth.currentUser?.email}</span>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header >
  )
}

export default Header;