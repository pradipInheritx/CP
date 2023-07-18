/** @format */

import React, { useEffect, useState } from "react";
import Button, { Buttons } from "../Atoms/Button/Button";
import { useTranslation } from "../../common/models/Dictionary";
import { capitalize } from "lodash";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import { Form, Modal } from "react-bootstrap";
import {useNavigate } from "react-router-dom";

const Upgrade = (openPop: any,
  setClicked: any
) => {
  const translate = useTranslation();
  const [modleShow, setModleShow] = useState(false)
  const [selectPayment, setSelectPayment] = useState(0)
  const handleModleClose = () => {
    setModleShow(false)
    setClicked(false)
  };
  const handleModleShow = () => setModleShow(true);
let navigate = useNavigate();
useEffect(() => {
  if (openPop) {
    handleModleShow()
  }
}, [openPop])


  return (
    // <Container fluid style={{ background: "var(--black)", padding: 10 }}>
    <div>

     <Modal
          className=""
          show={
            modleShow
          } onHide={handleModleClose}
          // fullscreen="sm-down"
          backdrop="static"
          aria-labelledby="contained-modal-title-vcenter"
          centered                    
        >
        <div className="d-flex justify-content-end">
          
            <button type="button" className="btn-close" aria-label="Close" onClick={() => {
              handleModleClose()
            }}
            // style={{color:"white" , border:"1px solid red"}}
            >

            </button>
          </div>
          <Modal.Body
        >      
        <h4 className="text-center">Select Payment mode</h4>  
          <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex  my-3">
        <Form.Check            
          type={"radio"}
          // label={`disabled radio`}
                onChange={() => {
                setSelectPayment(1)
              }}
          checked={selectPayment==1 ? true:false}             
          id={`disabled-default-radio-1`}
          />
              <label htmlFor="disabled-default-radio-1" className="mx-3">Cryptocurrency</label>
          </div>
          <div className="d-flex my-3">
              <Form.Check      
        disabled        
          type={"radio"}
          // label={`disabled radio`}
                onChange={() => {
                setSelectPayment(2)
              }}
            checked={selectPayment==2 ? true:false}
          id={`disabled-default-radio-2`}
          />
          <label htmlFor="disabled-default-radio-2" className="mx-3">Debit / Credit Card </label>
          </div>
        </div>
        </Modal.Body>
        < div className="d-flex justify-content-center " >
          <Buttons.Primary
            disabled={selectPayment==0}
            className="mx-2" onClick={() => {            
            navigate("/paymentList")
            }}>Submit</Buttons.Primary>
          </div >
        </Modal>  
    </div>
      
      
      // {/* <Title>Coming soon</Title> */}

      // {/* <Title>Upgrade your account <strong>To Earn Crypto & NFT</strong></Title>
      // <Buttons.Primary fullWidth={true}>{capitalize(translate("upgrade account"))}</Buttons.Primary> */}

    // </Container>
  );
};

export default Upgrade;
