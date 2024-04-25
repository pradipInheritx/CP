import React, { useContext, useEffect } from 'react';
import bannerImage from "../assets/images/homeBg.webp";
import { Buttons } from 'Components/Atoms/Button/Button';
import UserContext from 'Contexts/User';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();
    const joinHandler = () => {
        sessionStorage.setItem("landing", "true");
        if (userInfo) {
            navigate('/');
        } else {
            navigate('/sign-up');
        }
    }


    return (
        <div className='vte-landing' style={{ backgroundColor: "white", height: "100vh", position: 'fixed', top: '0px', left: '0px' }}>
            <div className='container'>
                <div className='row'>
                    <div className='col-12 text-center p-2'>
                        <div className='logo'><img src="vte_logo.png" alt='Vote to earn' /></div>
                    </div>
                </div>
            </div>

            <div className='text-center py-2 mb-2 mb-md-4'>
                <img src={bannerImage} alt='Vote to earn' />
            </div>

            <div className='container'>
                <div className='row'>
                    <div className='col-12 text-center p-2 text-black'>
                        <div className='d-flex align-items-center flex-column'>
                            <h2 className='mb-4 title-sec'>HERE'S YOUR CHANCE TO VOTE, IMPACT & EARN!</h2>
                            <Buttons.Primary onClick={joinHandler} style={{ maxWidth: '200px', marginBottom: '0px', width: '100%', fontSize: '16px' }}>
                                {!userInfo ? "Join Now" : "Vote Now"}
                            </Buttons.Primary>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage