/** @format */

import React, { useContext, useState, useEffect } from "react";
import { Form, Image, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";

import firebase from "firebase/compat";

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

  

  
useEffect(() => {
const script = document.createElement("script")
  if (script) {
    script.src =
      "https://bridgeapp-dev.welldapp.com/widget/wldp-widget.js?application=votetoearn&init=true&autoconnect=false&visible=true"
    script.async = true;
    document.body.appendChild(script)     
}

    return () => {
      // clean up the script when the component in unmounted
      document.body.removeChild(script)
    }
  }, [coinsList])



//   const ButtonCheck = () => {
//   //   return (
//   //   <p>
//   //       <label htmlFor="wldpbtn">Button</label>
//   //       <button
//   //         name='wldpbtn'
//   //         id='wldpbtn'>
//   //         hello
//   //       </button>
//   //   </p>
//   // )
    
//     return React.createElement(
//     "div",
//     {style:{color:"red"}, id: 'wldpbtn', className: "wldpbtn"},
//     "Here I am",
//   );
// }

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      {
        // ButtonCheck()
        <p>
        <label htmlFor="wldpbtn">Button</label>
        <button
          name='wldpbtn'
          id='wldpbtn'>
          
        </button>
    </p>
    }
      
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
      // :
      // <>
      // Please First Select Payment mode
      // </>
      }
      </div>
      {/* <p className="mx-4">
        <label htmlFor="wldpbtn">Button</label>
        <div
          // name='wldpbtn'
          id='wldpbtn'>
        Hello      
      </div>
      </p> */}
    </div>

  );
};

export default CoinsList;
