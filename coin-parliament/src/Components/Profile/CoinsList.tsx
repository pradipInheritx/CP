/** @format */

import React, { useContext, useState, useEffect } from "react";
import { Form, Image, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";

import firebase from "firebase/compat";
import { Buttons } from "Components/Atoms/Button/Button";

const CoinList = styled.div`
  // border:1px solid red;
   width:${window.screen.width < 767 ? "300px" : "400px"};
  background:white;
  color:black;
  padding:10px 15px;
  margin:10px 0px;
  border-radius:10px;
`;


const CoinsList = () => {
  const [coinsList, setCoinsList] = useState([])
  const [selectPayment, setSelectPayment] = useState(0);
  const [CheckCoin, setCheckCoin] = useState(0);
const [cardModalShow, setCardModalShow] = React.useState(false);

  
  const handleCardClose = () => setCardModalShow(false);      
  const handleCardShow = () => setCardModalShow(true);
  
  useEffect(() => {
    if(CheckCoin!=0) handleCardShow()
  }, [CheckCoin])
  

  useEffect(() => {
    const getCoinList = firebase
      .firestore()
      .collection("settings").doc("coins")
    getCoinList.get()
      .then((snapshot) => {
        const allList = snapshot.data()?.coins;
        setCoinsList(allList && allList);
      }).catch((error) => {
        console.log(error, "error");
      });

  }, [])
  const mybtn =(window as any).wldp.connectionWallet
  const CheckConnection =(window as any).wldp.isWalletConnected

//   console.log((window as any).wldp, "Checkconnect")
  
//   console.log(CheckConnection().then((data:any) => {
//   console.log(data,"alldata")
// }),"checkdataCheckConnection")

  return (
    <div
      style={{
        width: "100%",
      }}
    >            
      <div className="d-flex justify-content-center flex-column align-items-center">
  
        <div>
          <h4 className="text-center">Select Payment mode</h4>
          <div className="d-flex flex-column justify-content-center align-items-start px-5">
            <div className="d-flex  my-3">
              <Form.Check
                type={"radio"}
                onChange={() => {
                  setSelectPayment(1)
                }}
                checked={selectPayment == 1 ? true : false}
                id={`disabled-default-radio-1`}
              />
              <label htmlFor="disabled-default-radio-1" className="mx-3">Cryptocurrency</label>
            </div>
            <div className="d-flex my-3">
              <Form.Check
                disabled
                
                type={"radio"}
                onChange={() => {
                  setSelectPayment(2)
                }}
                checked={selectPayment == 2 ? true : false}
                id={`disabled-default-radio-2`}
              />
              <label
                style={{
                  color: "#dddddd"
                }}
                htmlFor="disabled-default-radio-2" className=" mx-3">Debit / Credit Card </label>
            </div>
          </div>
        </div>

        {selectPayment !=0 &&
        coinsList.map((item: any, index: any) => {
          return (
            
              <CoinList key={index}>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Image
                      src={process.env.PUBLIC_URL + `/images/logos/${item?.symbol?.toUpperCase()}.svg`}
                      style={{
                        margin: "0 auto",
                        width: 40,
                        height: 40,
                      }}
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src = "/images/no_logo.png")
                      }
                    />
                    <p className="mx-3">{item.name}</p>
                  </div>
                  {/* <Buttons.Primary onClick={()=>{}}>Connect</Buttons.Primary> */}
                  <Form.Check
                    style={{
                      fontSize: "20px"
                    }}
                    type={"radio"}

                    onChange={() => {
                      setCheckCoin(index + 1)
                    }}
                    checked={index + 1 == CheckCoin}
                    id={`disabled-default-radio-2`}
                  />
                </div>
              </CoinList>
            
          )
        })
      }
      </div>

      <div>
        
        {/* reward modal 5 */}
        <Modal
          className=""
          show={
            cardModalShow
          } onHide={handleCardClose}
          // fullscreen="sm-down"
          backdrop="static"          
          centered          
        >
          <div className="d-flex justify-content-end">
            <button type="button" className="btn-close" aria-label="Close" onClick={() => {handleCardClose()}}></button>
          </div>
          <Modal.Body>  
            {/* <div className="d-flex ">
              <p>Please use this button for Connect or Disconnect !</p>
            </div> */}
              <div className="d-flex justify-content-center pb-3" style={{ zIndex: '101' }}>
            <Buttons.Primary className="mx-2"
              onClick={() => {
                mybtn("connect")
                handleCardClose()
              }}
            >Connect</Buttons.Primary>
            <Buttons.Error className="mx-2"
              onClick={() => {
                mybtn("disconnect", "true")
                handleCardClose()
              }}
            >Disconnect</Buttons.Error>
          </div>  
          </Modal.Body>

                                          
        </Modal>
      
      </div>
    </div>

  );
};

export default CoinsList;
