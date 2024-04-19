import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { texts } from 'Components/LoginComponent/texts';
import { Modal } from 'react-bootstrap';
import VotingPaymentCopy from './VotingPaymentCopy';
import VBG from '../../../assets/images/VBG.png';
import VBGM from '../../../assets/images/VBGM.png';

export type paymentProps = {
  type: any;
  msg?: any;
  coinInfo?: any;
  setPayButton?: any;
  extraVote?: any;
  payType?: any;
  payamount?: any;
  setSelectCoin?: any;
  setShowOptionList?: any;
  user?: any;
  navigate?: any;

};

function PaymentFun({ isVotingPayment }: any) {
const [paymentStatus, setPaymentStatus] = useState<{ type: string, message: string }>({ type: '', message: '' });

  const [coinInfo, setCoinInfo] = useState<{ [key: string]: any }>({});
  const [payButton, setPayButton] = useState(false);
  const [selectCoin, setSelectCoin] = useState("none");
  const [showOptionList, setShowOptionList] = useState(false);
  const [showForWait, setShowForWait] = useState(false);  
  
  
  // @ts-ignore  
  const liveAmount = localStorage.getItem('CoinsPrice') && JSON.parse(localStorage.getItem('CoinsPrice'))

  return (
    <div className="bg_responisve_voting"
      style={{
        backgroundImage: `${window.screen.width > 767 ? `url(${VBG})` : `url(${VBGM})`}`,
        backgroundRepeat: `${window.screen.width > 767 ? "no-repeat" : "repeat"}`,
        backgroundPosition: "0 0",
        backgroundSize: "100%",
        height:"80vh"
      }}
    >
      <VotingPaymentCopy        
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
        coinInfo={coinInfo}
        setCoinInfo={setCoinInfo}
        payButton={payButton}
        setPayButton={setPayButton}
        showOptionList={showOptionList}
        setShowOptionList={setShowOptionList}
        selectCoin={selectCoin}
        setSelectCoin={setSelectCoin}        
      /> 
      {showForWait && <Modal
        show={showForWait}
        backdrop="static"
        centered
        style={{ zIndex: "2200", backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        contentClassName={window.screen.width > 767 ? "card-content modulebackground" : "card-contentMob modulebackground"}
      >
        <Modal.Body>
          <div style={{
            position: 'fixed',
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'center',
            top: '0px',
            right: '0px',
            bottom: '0px',
            zIndex: '9999',
            overflow: 'hidden',
            width: '100%',
            alignItems: 'center',

          }}>
            <span className="loading" style={{ color: "white", zIndex: "2220px", fontSize: '1.5em' }}>
              {texts.waitForIt}
            </span>
          </div>
        </Modal.Body>
      </Modal>}
    </div>
  )
}

export default PaymentFun
