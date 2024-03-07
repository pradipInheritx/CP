import React, { useContext, useEffect, useState } from "react";
import {Buttons} from "../../Atoms/Button/Button";
import {useTranslation} from "../../../common/models/Dictionary";

import styled from "styled-components";

import { texts } from "Components/LoginComponent/texts";
import SelectTextfield from "Components/Forms/SelectTextfield";
import firebase from "firebase/compat/app";

import { Col, Form, FormControl, Modal, Row } from "react-bootstrap";

import UserContext from "Contexts/User";
import { useLocation, useNavigate } from "react-router-dom";
import WalletValidation from "./WalletValidation";
import WalletInfo from "./WalletInfo";
import Tabs from "../Tabs";
import WalletBalance from "./WalletBalance";
import AppContext from "Contexts/AppContext";

// var WAValidator = require('wallet-address-validator');

const Errorsapn = styled.span`
  color:red;
`;

const Wallet = () => {
  const { userInfo, } = useContext(UserContext);  
  const {walletTab, setWalletTab } = useContext(AppContext);
  let navigate = useNavigate();  
  const [modleShow, setModleShow] = useState(false)
  const [selectTab, setSelectTab] = useState("Balance")
  
  const [mfaLogin, setMfaLogin] = useState(false)  
  const [index, setIndex] = useState(0);  
  const [regexList, setRegexList] = useState({
    bitcoin: "/^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$/",
    ethereum : "/^0x[a-fA-F0-9]{40}$/",
  })  

  const handleModleClose = () => setModleShow(false);
  const handleModleShow = () => setModleShow(true);
  const searchParams = new URLSearchParams(useLocation().search);

  // console.log(searchParams.get('name'),"window.location.search")
  // useEffect(() => {
  //   // @ts-ignore    
  //   if (userInfo?.mfa !== undefined && !userInfo?.mfa) {
  //     handleModleShow()
  //   }  
  // }, [])  
  useEffect(() => {
    if (walletTab) {      
      setSelectTab(walletTab)
    }
    }, [walletTab])
  console.log(walletTab,"walletTab")
  
  return (    
    <>      
      
      {
      // userInfo?.mfa == true &&
       <Tabs
          defaultActiveKey={selectTab}
          activeKey={selectTab}
          id="Wallet"
          onSelect={() => {            
            setSelectTab(selectTab == "Balance" ? "setting" : "Balance")
            setWalletTab("")            
          }}
        tabs={[
          {
            eventKey: "Balance",
            title: "Balance",
            pane: (
              <>
                <WalletBalance />
              </>
              // 
            ),
          },
          {
            eventKey: "setting",
            title: "setting",
            pane: (         
              <>
                {
                // userInfo?.mfa &&
                  <WalletInfo/>
              }
              </>
            ),
          },
          
        ]}
      />  }    

    {/* <Container> */}
      {/* {userInfo?.mfa &&
        <WalletInfo/>
        } */}


      {/* {userInfo?.mfa == false &&
      //   <WalletValidation
      //   setMfaLogin={setMfaLogin}
        // />    
        <div
          style={{
          minHeight:"70vh"
          }}
          className="d-flex  justify-content-center flex-column align-items-center"
        >
        <div className="d-flex flex-column align-items-center">
          <strong className="" style={{
            fontSize: "20px",
            textAlign: "center"
          }}>Enable your Two-factor authentication</strong>
          <p className="mt-3 tex-center"
            style={{
              textAlign: "center"
            }}
          >Befor update your wallet info Please Enable your Two-factor authentication</p>
        </div>
        < div className="d-flex justify-content-center " >
          <Buttons.Primary
            // disabled={selectPayment == 0}
            // className="mx-2"
            onClick={() => {
              navigate("/profile/password")
            }}
          >Enable</Buttons.Primary>
        </div >
      </div>
      } */}
        

      <div>
        <Modal
          className=""
          show={
            modleShow
          } onHide={handleModleClose}
          
          backdrop="static"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{ backgroundColor: "rgb(0 0 0 / 80%)", zIndex: "2200" }}
          // @ts-ignore
          // contentClassName={"modulebackground ForBigNft"}
        >
          <div className="d-flex justify-content-end"
            style={{
              cursor: "pointer",
              color:"gray"
            }}
            onClick={handleModleClose}
          >
            X
          </div>
          <Modal.Body
          >
            <div className="d-flex flex-column align-items-center">
              <strong className="" style={{
                fontSize: "20px",
                textAlign:"center"                
              }}>Enable your Two-factor authentication</strong>
              <p className="mt-3 tex-center"
                style={{                
                  textAlign: "center"
                }}
              >Befor update your wallet info Please Enable your Two-factor authentication</p>
            </div>
          </Modal.Body>
          < div className="d-flex justify-content-center " >
            <Buttons.Primary
              // disabled={selectPayment == 0}
              // className="mx-2"
              onClick={() => {
                navigate("/profile/password")
              }}
            >Enable</Buttons.Primary>
          </div >
        </Modal>
      </div>      
    </>
  );
};

export default Wallet;
