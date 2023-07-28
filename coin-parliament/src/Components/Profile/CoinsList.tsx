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
  const [selectCoin, setSelectCoin] = useState("none");
  const [connectCheck, setConnectCheck] = useState();
const [cardModalShow, setCardModalShow] = React.useState(false);

  
  const handleCardClose = () => {
    setCardModalShow(false)
    setCheckCoin(0)
  };      
  const handleCardShow = () => setCardModalShow(true);
  
  useEffect(() => {
    if(CheckCoin!=0) handleCardShow()
  }, [CheckCoin])
  
console.log(selectCoin,"selectCoin")
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
  const mybtn =(window as any)?.wldp?.connectionWallet
  // const CheckConnection =(window as any)?.wldp?.isWalletConnected
  // const getWalletConnectedAddress =(window as any)?.wldp?.getWalletConnectedAddress

  console.log((window as any).wldp ,"(window as any).wldp")

// const Checkconnect = () => {
//   (window as any)?.wldp?.isWalletConnected().then((data:any) => {
//    setConnectCheck(data)
//  })   
// }
  
  // console.log(CheckConnection().then((data:any) => {
  //   setConnectCheck(data)
  // }))
  

  // useEffect(() => {
  // Checkconnect()    
  // CheckConnection().then((data:any) => {
  //   setConnectCheck(data)
  // })
  // }, [selectCoin])
  
    // console.log(connectCheck, "checkdataCheckConnection")
  
  
  // console.log(getWalletConnectedAddress().then((data:any) => {
  //   console.log(data,"getWalletConnectedAddress")
  // }).catch((err:any) => {
  //   console.log(err,"errgetWalletConnectedAddress")
  // })
  
  // )

  return (
    <div
      style={{
        width: "100%",
      }}
      className="d-flex justify-content-center"
    >            
      <div className="d-flex justify-content-center flex-column align-items-center mt-5  p-4"
      
      
      >
  
       {selectCoin =="none" && <div>
          <h1 className="text-center mb-3">Select Payment mode</h1>
          <div className="d-flex flex-column justify-content-center align-items-start "
            style={{
            paddingLeft:`${window.screen.width >767 ? "60px" : "30px"}`
          }}
          >  
            <div className="d-flex">
              <div className="d-flex justify-content-center align-items-start  mt-3 mb-2 w-100"
              
              >              
              <Form.Check
                type={"radio"}
                onChange={() => {
                  setSelectPayment(1)
                }}                
                checked={selectPayment == 1 ? true : false}
                id={`disabled-default-radio-1`}
                  style={{
                    fontSize: "17px",                    
                  }}              
              />
              <label htmlFor="disabled-default-radio-1" className="mx-3"
                style={{
                fontSize:"17px"
              }}
              >Cryptocurrency</label>  
              </div>
            {selectPayment !=0 && <div className="my-3">
              <Form.Select aria-label="Default select example"              
                  onChange={(e) => { setSelectCoin(e.target.value) }}
                  style={{
                    width:"150px"
                  }}
              >
                  <option value="none">Select Coin</option>
                {coinsList.map((item: any, index: any) => {
                  return <option value={item.name}>{item.name}</option>
                })}               
                </Form.Select>
              </div>}                                       

            </div> 

            <div className="d-flex my-2 mt-3">
              <Form.Check
                disabled
                
                type={"radio"}
                onChange={() => {
                  setSelectPayment(2)
                }}
                checked={selectPayment == 2 ? true : false}
                id={`disabled-default-radio-2`}
                  style={{
                fontSize:"17px"
              }}
              />
              <label
                style={{
                  color: "#dddddd",
                  fontSize:"17px"
                }}
                htmlFor="disabled-default-radio-2" className="mx-3"
                              
              >Debit / Credit Card </label>
            </div>
          </div>
        </div>  }                     
        
        {/* For pay button div */}
        

        {selectCoin != "none" &&
          <>
              <div className=""
                style={{
                
              }}
              >            
            <p
              className="pb-3"
              style={{
              fontSize:"27px"
            }}
            >Pay 99$ using {selectCoin}</p>
            <div className="d-flex justify-content-around mt-3">
          <Buttons.Default className="mx-3"
              onClick={() => {
                setSelectCoin("none")
              }}
              >
                Back
              </Buttons.Default>
            <Buttons.Primary className=""
              onClick={() => {
                setCheckCoin(1)
              }}>
                    Pay Now
            </Buttons.Primary>
            </div>
            

          </div>    
        </>}

        
        {/* Module for connect  */}
        

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
            <button type="button" className="btn-close" aria-label="Close" onClick={() => {
              handleCardClose()
              setCheckCoin(0)
            }}></button>
          </div>
          <Modal.Body>  
            <div className="d-flex ">
              {/* <p>Please Use this button for Connect</p> */}
            </div>
              <div className="d-flex justify-content-center pb-3" style={{ zIndex: '101' }}>
              <Buttons.Primary className="mx-2"
                // disabled={connectCheck && connectCheck==true}
              onClick={() => {
                mybtn("connect")
                handleCardClose()                  
                setSelectCoin("none")
                // setConnectCheck(false)
              }}
            >Connect</Buttons.Primary>
              <Buttons.Error className="mx-2"
                // disabled={connectCheck == undefined || connectCheck == false}
              onClick={() => {
                mybtn("disconnect", "true")
                handleCardClose()                
                setSelectCoin("none")
                // setConnectCheck(true)
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
