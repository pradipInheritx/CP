import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "../../common/models/Dictionary";
import { texts } from "../LoginComponent/texts";
import CountUp from "react-countup";
import AppContext from "../../Contexts/AppContext";
import styled, { css } from "styled-components";
import { Modal, Ratio } from "react-bootstrap";
import { Buttons, Props } from "../Atoms/Button/Button";
import coinBg from "../../assets/images/coin_bg.png";
import coin_bgVET from "../../assets/images/coin_bgVET.png";
import { ZoomCss as ZoomCss2 } from "../App/App";
import CoinAnimation from "common/CoinAnimation/CoinAnimation";
import { claimRewardSound, handleExtraCoin, handleSoundWinCmp } from "common/utils/SoundClick";
// @ts-ignore
import WinCmp from '../../assets/sounds/WinCmp.mp3';
// @ts-ignore
import Wildwest from '../../assets/avatars/videos/Winter.mp4';
import useSound from "use-sound";
// @ts-ignore
import claimSound from '../../assets/sounds/claimReward.m4a';

type PAXCardProps = {
  walletId: string;
  PAX: number;
  rewardTimer?: any;
  countShow?: any;
  setCountShow?: any;
};

type ZoomProps = {
  inOutReward?: number,
  coinIncrement?: boolean,
  showCoinIncrement: number,
};

const ZoomCss = css`
    // transform: scale(1.1);    
    // z-index:2500;
//     animation: zoom-in-zoom-out 4s infinite ;
//     @keyframes zoom-in-zoom-out {
//   0% {
//     transform: scale(1);
//   }
//   50% {
//     transform: scale(1.4);
//   }
//   100% {
//     transform: scale(1);
//   }
// }
`;

const Popuphead = styled.p`
  font-size:25px;
  font-weight:600;
background: linear-gradient(180deg, #FFF8A6 29.44%, #FFC00B 73.33%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  // text-shadow: 0px 1px 3px #FFCB35;
font-family: Poppins;
font-size: 25px;
font-style: normal;
font-weight: 700;
line-height: normal;
letter-spacing: 2px;
text-transform: uppercase;
`;



const ForZoom = styled.div` 
 ${(props: ZoomProps) => `${(props.showCoinIncrement === 1) ? ZoomCss : ""}`} ;
 `;

const ForZoom2 = styled.div`
//  z-index:${(props: ZoomProps) => `${(props.showCoinIncrement === 1) ? "2200" : ""}`};  
//  isolation:${(props: ZoomProps) => `${(props.showCoinIncrement === 1) ? "isolate" : ""}`};  
 ${(props: ZoomProps) => `${(props.showCoinIncrement === 1 && window.screen.width < 450) ? ZoomCss2 : ""}`} ;
`;


const BoxSet = css`
background-color: rgba(0,0,0,0.8);
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height: 100%;
  z-index:2500;
`;
const BoxSet2 = css`
background-color:none;
  // position: fixed;
  // width:100%;
  // height: 100vh;
  // z-index:2000;
`;

const CoinPopup = styled.div`
${(props: ZoomProps) => `${(props.showCoinIncrement === 1) ? BoxSet : BoxSet2}`};   
`;
const HamburgerBut = styled.button`
background:none;
border:none;
 &:focus {
    outline:none;
  }
`;

const size = css`
  min-width: 100px;
  height: 76px;
`;

const Option = css`
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;
  // box-shadow: 0 3px 6px #00000029;
  box-shadow: rgb(67 47 229) 0px 4px 1px, rgba(0,0,0,0.22) 0px 6px 12px;
  transition: all .2s ease;

  & svg g path {    
  }
`;

const Option0 = styled(Buttons.RadiusTopRight)`
  ${size};
  ${Option};
  flex-direction: column;
  &:active{
    position: relative;
top: 2px;
  box-shadow: rgb(67 47 229) 0px 3px 1px, rgba(0,0,0,0.22) 0px 6px 12px;
  }
  &:disabled {
    pointer-events: none;  
    cursor:pointer;
  }
  &:not([disabled]) {
    animation: bull_shake_left 2s ease 2s infinite;
  }
//   &:hover {
//   background:#6352E8;
//   color:white;
//  box-shadow: rgb(67 47 229) 0px 4px 1px, rgb(170 164 220) 0px 8px 6px;
//   }
  `;

const Option1 = styled(Buttons.RadiusBottomLeft)`
  ${size};
  ${Option};
  flex-direction: column;
  &:disabled {
    pointer-events: none;  
    cursor:pointer;
}
//  &:active{
//     position: relative;
//     top: 2px;
//       box-shadow: rgb(67 47 229) 0px 3px 1px, rgba(0,0,0,0.22) 0px 6px 12px;
//   }
  &:not([disabled]) {
    animation: bull_shake_right 2s ease 2s infinite ;
  }
  // &:hover {
  //   background:#6352E8;
  //   color:white;
  //      box-shadow: rgb(67 47 229) 0px 4px 1px, rgb(170 164 220) 0px 8px 6px;
  //   }
  //   &:hover .svg-path {
  //     stroke: white !important;
  //   }
`;


const PAXCard = ({ walletId, PAX, rewardTimer, countShow, setCountShow }: PAXCardProps) => {
  // const prevCountRef = useRef(PAX)
  //coin calculation
  const [prevCountRef, setPrevCountRef] = useState<number>(0);
  const [latestRewardCoins, setLatestRewardCoins] = useState<number>(0);
  const [showButtonMove, setShowButtonMove] = useState<boolean>(true);
  useEffect(() => {
    setLatestRewardCoins((rewardTimer?.data?.thirdRewardDiamonds || 0));
  }, [rewardTimer?.data?.thirdRewardDiamonds]);
  // console.log(latestRewardCoins,"setLatestRewardCoins")
  useEffect(() => {  
    
    setPrevCountRef((PAX || 0) - latestRewardCoins);

  }, [PAX, latestRewardCoins]);


  const { showReward, setShowReward, setHeaderExtraVote, rewardExtraVote, setRewardExtraVote, inOutReward, setInOutReward, setBackgrounHide, backgrounHide, extraVoteModule, setExtraVoteModule } = useContext(AppContext);
  // console.log(showReward, "CheckshowReward")
  const [modalShow, setModalShow] = React.useState(false);
  const [videoShow, setVideoShow] = React.useState(false);
  const handleClose = () => setExtraVoteModule(false);
  const handleShow = () => setExtraVoteModule(true);  
  const translate = useTranslation();
  const [showCoinIncrement, setShowCoinIncrement] = useState<number>(0); //1 =show 1>=hide
  const [showCountUp, setShowCountUp] = useState<number>(0); //1 =show 1>=hide
  const [sliverCoin, setSliverCoin] = useState(false);
  const [claimRewardSoundplay, { pause: claimRewardSoundpause }] = useSound(claimSound);
  const [handleSoundWinCmpplay, { pause: handleSoundWinCmppause }] = useSound(WinCmp)  
  //1 =show 1>=hide
  useEffect(() => {
    if (inOutReward === 1 && !extraVoteModule && !showCoinIncrement) {      
      //   setShowCoinIncrement(1);  
      // setBackgrounHide(true)
    //  var timer = setTimeout(() => {
    //     setShowCountUp(1)
    //   }, 3000);
      // setSliverCoin(true)      
    }
    if (extraVoteModule) {      
      setTimeout(() => {
        setShowButtonMove(false);
      }, 7000);
    }
    return () => {
      // clearTimeout(timer)
    }

  }, [extraVoteModule]);

  console.log(extraVoteModule, "rewardExtraVote")

  return (
    <ForZoom2 {...{ showCoinIncrement }} style={{
      marginTop: "7px",
    }}>
      <CoinPopup {...{ showCoinIncrement }} className="">

      </CoinPopup>
      <ForZoom className="cp_balance dark_prpl_bkgnd mx-auto mb-3 "
        {...{ showCoinIncrement }}
        style={{
          zIndex: 2500,
          // @ts-ignore
          position: `${window.screen.width > 767 && showCoinIncrement == 1 ? "absolute" : ""}`,
          height: "160px",
        }}
      >
        <h6 className="box_title card-header " style={{
          fontSize: '12px', paddingTop: '15px',
          // paddingBottom: '10px'
        }}>
          {texts.CoinParliamentBalance}
        </h6>
        <div
          style={{
            cursor: "pointer"
          }}
        //   onClick={() => {
        //     setVideoShow(true)
        // }}
        >
          <img src={coin_bgVET} alt="" width="90px" />
        </div>
        <span
          style={{ fontSize: "15px" }}
        >
          {showCountUp === 1 ?
            <>              
               <CountUp className={`PaxText`} start={(PAX || 0) - latestRewardCoins} end={PAX && PAX} duration={rewardTimer?.data?.thirdRewardDiamonds < 10 ? rewardTimer?.data?.thirdRewardDiamonds : 10} delay={2} useEasing={false}  
                onStart={() => {
                  // handleExtraCoin.play();                                                      
                }}
                onEnd={() => {
                  
                  // handleExtraCoin.pause();
                  handleShow();            
                  setShowCountUp(0);
                  setShowCoinIncrement(2);
                  setPrevCountRef(PAX);
                  setSliverCoin(false)
                  setBackgrounHide(false);
                  claimRewardSoundplay();
                  // handleSoundWinCmp.play()
                  // setTimeout(() => {
                  //   // handleShow();
                  //   setShowCoinIncrement(2);
                  //   setPrevCountRef(PAX);
                  //   setSliverCoin(false)
                  //   setBackgrounHide(false)
                  //   handleSoundWinCmp.play()
                  //   // setInOutReward((prev: number) => {
                  //   //   return 2;
                  //   //   // return prev == 1 ? 2 : prev;
                  //   // });
                  // }, 1000);
                }
                }
              /> VTE </>              
            :
            <>
              <span className="coinText">
                {prevCountRef || 0} VTE
              </span>
            </>
          }
        </span>        
        <div>
          <Modal
            show={videoShow}
            onHide={() => (
              setVideoShow(false)
            )}
            //   aria-labelledby="example-modal-sizes-title-sm"
            backdrop="static"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ backgroundColor: "rgb(0 0 0 / 80%)", zIndex: "2200" }}
            // @ts-ignore
            contentClassName={"modulebackground ForBigNft"}
          >
            <div className="d-flex justify-content-end">
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => {
                setVideoShow(false)
              }}
              >

              </button>
            </div>
            <Modal.Body>
              {/* <div>
                <Ratio               
                  // style={{
                  //   width:`300px`,          
                  // }}
                >
                  <embed type="" src={Wildwest} />
                </Ratio>
                </div> */}
              <p className="text-center"
                style={{
                  color: "white"
                }}
              >Coin Video Here</p>
            </Modal.Body>
          </Modal>
        </div>



        <div>
          {/* reward modal 3 */}
          <Modal
            show={
              extraVoteModule
            } onHide={handleClose}
            // size="sm"
            backdrop="static"
            // contentClassName={window.screen.width >767? "card-content" :"card-contentMob"}
            contentClassName={"modulebackground ForBigDiv"}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: "2200" }}
          >
            <Modal.Body className="d-flex  flex-column  justify-content-between align-items-center"
              style={{
                width: `${window.screen.width > 767 ? "500px" : "100%"}`,
                height: "400px"
              }}
            >
              {!showButtonMove ?<>              
              <Popuphead>Congrats!</Popuphead>
              {/* @ts-ignore */}
              <div className=''>
                <p style={{ fontSize: "24px", color: "white", fontWeight: "600" }}>You've won {rewardExtraVote} votes</p>
              </div>              
              {/* <Modal.Footer> */}
              <div className="d-flex justify-content-center ">
                <Buttons.Primary className="mx-2" onClick={() => {
                  handleSoundWinCmppause()
                  setCountShow(false)
                  // setShowReward((prev: number) => {
                  //   return 2;
                  //   // return prev == 1 ? 2 : prev
                  // });
                  // setInOutReward((prev: number) => {
                  //   return 2;
                  // });
                  setTimeout(() => {
                    setShowCoinIncrement(0);
                  }, 2000);
                  handleClose();
                  // setTimeout(() => {
                  //   setHeaderExtraVote((prev: any) => {
                  //     return {
                  //       ...prev,
                  //       collect: true
                  //     }
                  //   })
                  // }, 2800)


                  setInOutReward((prev: number) => {
                    // return prev == 2 ? 3 : prev
                    claimRewardSound.play();
                    return 3
                  });                  
                    setShowReward((prev: number) => {
                      return 3;
                    });                  
                  setHeaderExtraVote({
                    vote: 0,
                    collect: false
                  });
                  // setTimeout(() => {
                  //   setHeaderExtraVote({
                  //     vote: 0,
                  //     collect: false
                  //   });
                  // }, 3500)
                }}>Collect your Vote</Buttons.Primary>                
                {/* <Buttons.Default className="mx-2" onClick={handleClose}>No</Buttons.Default> */}
              </div>
              </> :
                <div className="w-100 d-flex justify-content-between align-items-center m-auto">
                <Option0>
                  <p className="opacity-0">hello</p>
                </Option0>
                <Option1>
                  <p className="opacity-0">hello</p>
                </Option1>
              </div>}
            </Modal.Body>
            {/* </Modal.Footer>       */}
          </Modal>
        </div>
      </ForZoom >
    </ForZoom2>
  );
};

export default PAXCard;
