import React from 'react'
import Img404 from 'assets/images/404.svg';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
const Button = styled.button`
  flex-direction: column;
  justify-content: center;
  border:1px solid white;
  border-radius:5px;
  background-color:#160133;
  padding:1em;
  text-decoration: none;
  color:white;
  cursor:pointer;
  text-align:center;
  min-width:9em;
    &:hover {
    background:white;
    color:#160133;
    box-shadow: rgb(67 47 229) 0px 4px 1px, rgb(170 164 220) 0px 8px 6px;
  }
`;
function PageNotFound() {

    const navigate = useNavigate();
    return (
        <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '80vh' }}>
            <img src={Img404} alt="404" />
            <div className='ps-5'>
                <h1>Page Not Found</h1>
                <div className='pt-3'>You can return to the homepage and try again.</div>
                <Button className='d-block mt-3' type='button' onClick={() => navigate('/')} >
                    Go to home page
                </Button>
            </div>
        </div>
    )
}

export default PageNotFound