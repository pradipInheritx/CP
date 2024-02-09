import React, { SetStateAction, useContext, useEffect, useRef, useState } from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'

import styled from "styled-components";

import { Buttons, timeframeInitials } from '../Components/Atoms/Button/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { listData } from '../Components/Pairs/utils';
import UserContext from '../Contexts/User';
import { VoteButton } from '../common/utils/SoundClick';
// const silent = require("../assets/sounds/silent.mp3").default;

const CoinContainer = styled.div`
  border-top-color: ${(props: { winner: boolean }) =>
    props.winner ? "#6352E8" : "transparent"};
  border-top-style: solid;
  border-top-width: 4px;
`;

const CoinVoteTimer = styled.span`
  // font-size: 14px;
  color: #6352e8;
  `;
  // line-height: 14px;

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

interface ChildComponentProps {
  showPopUp?: any;
  setShowPopUp?: any;
  voteDirection?: number;
  coins?: any;
  voteLastPrice?:any
  startprice?:any
  activeTime?:any;
  impactValue?:any
}


const ModalForResult: React.FC<ChildComponentProps> = ({ showPopUp, setShowPopUp, coins, voteLastPrice,voteDirection,startprice,activeTime,impactValue }) => {

const [lastPrice, setLastPrice] = useState<any>(coins)

const twoDigitLastPrice = lastPrice && parseFloat(lastPrice)?.toFixed(2)
const twoDigitStartPrice = startprice && parseFloat(startprice)?.toFixed(2)



  useEffect(() => {
    if (showPopUp) {
      handleShow();    
    }
  VoteButton(true)
}, [showPopUp])

const [voteImpact, setVoteImpact] = useState('')


// console.log('4567', voteImpact);


  const [show, setShow] = useState(false);
  // const setVoteDetails = useContext(VoteDispatchContext);
  const handleShow = () => setShow(true);
  const handleClose = () => {
    // console.log("i am clickable")
  setShowPopUp(false)
    setShow(false);
  };
  let params = useParams();
  const {id} = params;
// @ts-ignore
  const cardData = { ...listData[0] }
  return (
    <div>      
      <Modal show={show} onHide={handleClose}
        backdrop="static"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ zIndex: 1060 }}
        animation={false}
      >
        <div className='d-flex justify-content-between'>
          {/* <div></div> */}
          <div className='text-center mb-2' style={{
            color: "#6352e8",
            fontWeight: "300",
            marginLeft: `${window.screen.width < 767 ? "10%" : ""}`
          }}>
          </div>
          {/* <div className="d-flex justify-content-end" > */}
            <button className="btn-close " aria-label="Close" 
              style={{
              cursor:"pointer"
              }}
            onClick={() => {
              handleClose()            
            }}
            ></button>
          {/* </div> */}
        </div>
        <Modal.Body>          
          
              <div className=' w-100 '
              // style={{boxShadow:" rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}
              >
                <div
                  // className={`${window.screen.width < 767 ? "" : ""}`}
                  className={`${window.screen.width < 767 ? "" : ""}  d-flex justify-content-between`}

                >
             
            </div>    
            <div style={{ minHeight: "100%" }} className=" text-center">
              {console.log("difference :: ",startprice,voteLastPrice,voteDirection)}
                  <div className=''
                    style={{ fontSize: "12px" }}
                  >
                    <img src={cardData.img1} alt=""  width={"80px"} style={{height:"50px"}} />
                    <p style={{marginBottom:"0rem",fontWeight:"Bold",fontSize:"20px"}}>{"Bitcoin"}</p>
                    <p style={{marginBottom:"0rem",fontSize:"17px"}}>{"BTC"}</p>
                    <p style={{marginBottom:"0rem",fontWeight:"Bold",fontSize:"20px"}}>{Math.floor(activeTime / 1000) + "Sec"}</p>
                    <p style={{fontSize:"20px"}}>{voteDirection === 1 ? "Bull " : "Bear "}{'$'+twoDigitStartPrice}</p>
                    <p  style={{marginBottom:"0rem",fontSize:"20px",color:"#6352e8"}}>{"Vote Result"}</p>
                    <p style={{fontSize:"20px",color:`${twoDigitLastPrice >= twoDigitStartPrice ? "green" : "red"}`}}>{voteDirection === 1 && twoDigitLastPrice >= twoDigitStartPrice ? "Bull " : "Bear "}{'$'+twoDigitLastPrice}</p>
                    <p style={{fontSize:"20px"}}>{"Vote impact :"} {impactValue.toUpperCase()}</p>
                  </div>
                </div>

            

            
          </div>  
        <div className='d-flex justify-content-center mt-2'>
            <Buttons.Primary
              onClick={() => {
                // setLogin(true)
            }}
            >
            Join The Parliament
          </Buttons.Primary>
          </div>
        </Modal.Body>      
      </Modal>
    </div>

    
  )
}

export default React.memo(ModalForResult);