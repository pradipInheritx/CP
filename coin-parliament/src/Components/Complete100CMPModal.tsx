import AppContext from 'Contexts/AppContext';
import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { Other } from "Pages/SingleCoin";
import { VoteContext } from 'Contexts/VoteProvider';
import UserContext from 'Contexts/User';
import { CurrentCMPContext, CurrentCMPDispatchContext } from 'Contexts/CurrentCMP';

const Complete100CMPModal: React.FC<{
    setCurrentCMP: React.Dispatch<React.SetStateAction<number>>,
    showComplete100CMP: boolean,
    setShowComplete100CMP: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setCurrentCMP, showComplete100CMP, setShowComplete100CMP }) => {
    const { setShowBack } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <>
            <Modal show={showComplete100CMP} onHide={() => {
                setShowComplete100CMP(false);
                setCurrentCMP(0);
            }}
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn-close " aria-label="Close" onClick={() => setShowComplete100CMP(false)}></button>
                </div>
                <Modal.Body>
                    <p className="text-center">Congratulations 🎉</p>
                    <p className="text-center"> You've reached your  goal! </p>
                    <div className='py-2  d-flex  justify-content-center'>
                        <span style={{ textDecoration: 'none', cursor: 'pointer' }}
                            onClick={() => {
                                setShowComplete100CMP(false)
                                navigate('/profile/mine');
                                setShowBack(true);
                            }}
                        >
                            <Other>{("CHECK IT OUT")}</Other>
                        </span>
                    </div>

                </Modal.Body>

            </Modal>
        </>
    )
}

export default React.memo(Complete100CMPModal);