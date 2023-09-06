import React, { useContext } from 'react'
import { Badge, Button, Col, Container, Modal, Row } from "react-bootstrap";
import copy from "copy-to-clipboard";
import NotificationContext, { ToastType } from 'Contexts/Notification';
import Copy from "Components/icons/copyShare";
import styled, { css } from "styled-components";

const I = styled.i`
  cursor: pointer;
  font-size:22px;
  color:#6352e9;
`;
const ShareModal: React.FC<{ shareModalShow: boolean, setShareModalShow: React.Dispatch<React.SetStateAction<boolean>>, url: string, shareText: string }> = ({ shareModalShow, setShareModalShow, url, shareText }) => {
    const { showModal, showToast } = useContext(NotificationContext);
    return (
        <div>
            <Modal
                className=""
                show={
                    shareModalShow
                } onHide={() => setShareModalShow(false)}
                // fullscreen="sm-down"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: "2200" }}
                contentClassName={window.screen.width > 767 ? "card-content modulebackground" : "card-contentMob modulebackground"}
            >
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => {
                        setShareModalShow(false);
                    }}
                    // style={{color:"white" , border:"1px solid red"}}
                    >

                    </button>
                </div>
                <Modal.Body
                >
                    {/* continue voting */}
                    {/* @ts-ignore */}
                    <div className="d-flex justify-content-center my-3">
                        <strong className="mx-4" style={{ fontSize: '14px', textAlign: 'center', color: "white" }}>SHARE YOUR CARD NOW</strong>
                    </div>
                    <div className="d-flex  mt-3 mb-5 m-auto d-flex justify-content-center ">
                        <div className="mx-3">
                            <span
                                onClick={() => {
                                    copy(url);
                                    showToast(
                                        'Your Card link is copied to the clipboard.',
                                        ToastType.SUCCESS
                                    );
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                <Copy />
                            </span>
                        </div>

                        <div className="mx-3">
                            <I
                                className="bi-whatsapp"

                                onClick={() =>
                                    window.open(
                                        `https://api.whatsapp.com/send/?phone&text=${`${shareText} ${url}`.replace(
                                            " ",
                                            "+"
                                        )}&app_absent=0`,
                                        "_blank"
                                    )
                                }
                            />
                        </div>
                        <div className="mx-3">
                            <I
                                className="bi-twitter"
                                onClick={() =>
                                    window.open(
                                        `https://twitter.com/intent/tweet?url=${url}?check_suite_focus=true&text=${shareText}`,
                                        "_blank"
                                    )
                                }
                            />
                        </div>
                        <div className="mx-3">
                            <I
                                className="bi bi-facebook"
                                onClick={() =>
                                    window.open(
                                        `https://www.facebook.com/sharer/sharer.php?u=${url}&t=${shareText}`,
                                        "_blank"
                                    )
                                }
                            />

                        </div>

                    </div>


                </Modal.Body>
            </Modal>
        </div >
    )
}

export default ShareModal