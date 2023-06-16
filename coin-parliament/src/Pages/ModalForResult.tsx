import React, { SetStateAction, useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import { Logo } from '../Components/Pairs/Card';
import styled from "styled-components";
import Trend from '../Components/Atoms/utils/Trend';
import CoinsContext from '../Contexts/CoinsContext';
import { formatCurrency } from '../common/models/Coin';
import moment from "moment";
import Line from '../Components/icons/line';
import { timeframeInitials } from '../Components/Atoms/Button/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Other } from './SingleCoin';
import AppContext from '../Contexts/AppContext';
import { Prev } from 'react-bootstrap/esm/PageItem';
import { listData } from '../Components/Pairs/utils';
// const silent = require("../assets/sounds/silent.mp3").default;
const CoinContainer = styled.div`
  border-top-color: ${(props: { winner: boolean }) =>
    props.winner ? "#6352E8" : "transparent"};
  border-top-style: solid;
  border-top-width: 4px;
`;

const CoinVoteTimer = styled.span`
  // font-size: 14px;
  // line-height: 14px;
  color: #6352e8;
`;

const LineImg = styled.div`
  // height: 60px;
  // width: 19px;
`;

interface Rdiv {
  // submit: boolean,
  backcolor: string
}


const PairsVoteVs = styled.span`
  font-size: ${window.screen.width > 676 ? "14px" : "10px"};
  color: #6352e8;
`;
function ModalForResult(showPopUp?:any, setShowPopUp?:any) {

  const navigate = useNavigate();
//   const setVoteDetails = useContext(VoteDispatchContext);
//   const setLessTimeVoteDetails = useContext(lessTimeVoteDispatchContext);
  useEffect(() => {
    if (showPopUp) {
      handleShow();    
    }
  }, [showPopUp])


  const [show, setShow] = useState(false);
  // const setVoteDetails = useContext(VoteDispatchContext);

  const handleShow = () => setShow(true);
  const handleClose = () => {
  setShowPopUp(false)
    setShow(false);
  };
  let params = useParams();
  const {id} = params;
// @ts-ignore
  const cardData = { ...listData[id] }
  return (
    <div>      
      <Modal show={show} onHide={handleClose}
        backdrop="static"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ zIndex: 100 }}
        animation={false}
      >
        <div className='d-flex justify-content-between'>
          <div></div>
          <div className='text-center mb-2' style={{
            color: "#6352e8",
            fontWeight: "300",
            marginLeft: `${window.screen.width < 767 ? "10%" : ""}`
          }}>
            {/* {type == "pair" && vote ? <p> {timeframeInitials(vote?.timeframe?.name)} VOTE</p> : ""} */}
          </div>
          <div className="d-flex justify-content-end">
            <button type="button" className="btn-close " aria-label="Close" onClick={handleClose}></button>
          </div>
        </div>
        <Modal.Body>          
          
              <div className=' w-100 '
              // style={{boxShadow:" rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}
              >
                <div
                  // className={`${window.screen.width < 767 ? "" : ""}`}
                  className={`${window.screen.width < 767 ? "" : ""}  d-flex justify-content-between`}

                >
                  <div className=' text-center' style={{ width: `${window.screen.width < 767 ? "100%" : "30%"}` }}>
                <CoinContainer
                  winner={true}>
                      <div className=" ">
                        <div className='p-2'>
                          {/* @ts-ignore */}                                          
                          <img src={cardData.img1} alt="" width="50px" />
                        </div>
                        <div className="" style={{ lineHeight: '20px' }}>
                      <div>             
                        {/* @ts-ignore */}
                            <strong>{cardData.name1}</strong>
                          </div>                                                
                        </div>
                      </div>
                    </CoinContainer>
                  </div>


                  <div className=' text-center ' style={{ width: `${window.screen.width < 767 ? "100%" : "30%"}` }}>
                    <Col className="">
                      <div className="">
                        <LineImg>
                          <Line />
                        </LineImg>
                      </div>                      
                      <div className="">
                        <div className='d-flex  justify-content-center'>                      
                        </div>
                        <div style={{ minHeight: "100%" }}>
                          <PairsVoteVs>                            

                          </PairsVoteVs>
                        </div>

                      </div>
                    </Col>
                  </div>

                  <div className=' text-center ' style={{ width: `${window.screen.width < 767 ? "100%" : "30%"}` }}>
                <CoinContainer
                  winner={false}                    
                >
                      <div className="">
                        <div className='p-2'>                          
                            <img src={cardData.img2} alt="" width="50px" />
                        </div>
                        <div className="" style={{ lineHeight: '20px' }}>
                          <div>
                            {/* @ts-ignore */}
                            <strong>{cardData.name2}</strong>
                          </div>
                        </div>
                      </div>
                    </CoinContainer>
                  </div>
                </div>              
              </div>          
        </Modal.Body>      
      </Modal>
    </div>

    // <div>
    // <Modal
    //     show={show}
    //     onHide={handleClose}
    //     backdrop="static"
    //     keyboard={false}
    //   >
    //     <Modal.Header closeButton>
    //       <Modal.Title>Modal title</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       I will not close if you click outside me. Don not even try to press
    //       escape key.
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button variant="secondary" onClick={handleClose}>
    //         Close
    //       </Button>
    //       <Button variant="primary">Understood</Button>
    //     </Modal.Footer>
    //   </Modal>
    // </div>
  )
}

export default React.memo(ModalForResult);