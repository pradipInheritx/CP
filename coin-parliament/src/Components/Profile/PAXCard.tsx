import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "../../common/models/Dictionary";
import { texts } from "../LoginComponent/texts";
import CountUp from "react-countup";
import AppContext from "../../Contexts/AppContext";
import styled, { css } from "styled-components";
import { Modal, Ratio } from "react-bootstrap";
import { Buttons } from "../Atoms/Button/Button";
import coinBg from "../../assets/images/coin_bg.png";
import coin_bgVET from "../../assets/images/coin_bgVET.png";
import { ZoomCss as ZoomCss2 } from "../App/App";
import CoinAnimation from "common/CoinAnimation/CoinAnimation";
import { handleExtraCoin, handleSoundWinCmp } from "common/utils/SoundClick";
// @ts-ignore
import Wildwest from '../../assets/avatars/videos/Winter.mp4';

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


const PAXCard = ({ walletId, PAX, rewardTimer, countShow, setCountShow }: PAXCardProps) => {
  // const prevCountRef = useRef(PAX)
  //coin calculation
  const [prevCountRef, setPrevCountRef] = useState<number>(0);
  const [latestRewardCoins, setLatestRewardCoins] = useState<number>(0);
  useEffect(() => {
    setLatestRewardCoins((rewardTimer?.data?.thirdRewardDiamonds || 0));
  }, [rewardTimer?.data?.thirdRewardDiamonds]);
  useEffect(() => {
    setPrevCountRef((PAX || 0) - latestRewardCoins);
  }, [PAX, latestRewardCoins]);


  const { showReward, setShowReward, setHeaderExtraVote, rewardExtraVote, setRewardExtraVote, inOutReward, setInOutReward, setBackgrounHide, backgrounHide } = useContext(AppContext);
  console.log(showReward, "CheckshowReward")
  const [modalShow, setModalShow] = React.useState(false);
  const [videoShow, setVideoShow] = React.useState(false);
  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

  const translate = useTranslation();
  const [showCoinIncrement, setShowCoinIncrement] = useState<number>(0); //1 =show 1>=hide
  const [sliverCoin, setSliverCoin] = useState(false);
  //1 =show 1>=hide
  useEffect(() => {
    if (inOutReward === 1 && !modalShow && !showCoinIncrement) {
      setShowCoinIncrement(1);
      setBackgrounHide(true)
      // setSliverCoin(true)      
    }
  }, [inOutReward, modalShow]);


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
          {showCoinIncrement === 1 ?
            <>
              <CountUp className="PaxText coinText" start={prevCountRef} end={PAX && PAX} duration={10} delay={2}
                onStart={() => {
                  // handleExtraCoin.play();
                }}
                onEnd={() => {
                  // handleExtraCoin.pause();
                  setTimeout(() => {
                    handleShow();
                    setShowCoinIncrement(2);
                    setPrevCountRef(PAX);
                    setSliverCoin(false)
                    setBackgrounHide(false)
                    handleSoundWinCmp.play()
                    // setInOutReward((prev: number) => {
                    //   return 2;
                    //   // return prev == 1 ? 2 : prev;
                    // });
                  }, 1000);
                }
                }
              /> VTE </> :
            <>
              <span className="coinText">
                {prevCountRef || 0} VTE
              </span>
            </>
          }
        </span>
        <div>
          {/* reward modal 3 */}
          <Modal
            show={
              sliverCoin
            } onHide={() => {
              setSliverCoin(false)
            }}
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

              {/* <Popuphead>Congrats!</Popuphead> */}
              {/* @ts-ignore */}
              <div className=''>
                <p style={{ fontSize: "24px", color: "white", fontWeight: "600" }}>{("parliament coins").toLocaleUpperCase()}</p>
              </div>
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "75%",
                  backgroundImage: `url(${coinBg})`,
                  backgroundSize: "100px 100px",
                  backgroundRepeat: 'no-repeat',
                  //     fontSize: "25px",
                  //     color: "#6352e8",
                  // fontWeight:"600",
                  // backgroundPosition: '-10px -10px',
                }}
              >
                {showCoinIncrement === 1 ?
                  <CountUp className="PaxText coinText" start={prevCountRef} end={PAX && PAX} duration={10}
                    onEnd={() => {
                      // setTimeout(() => {
                      //   handleShow();
                      //   setShowCoinIncrement(2);
                      //   setPrevCountRef(PAX);
                      //   setSliverCoin(false)
                      //   // handleSoundWinCmp.play();
                      //   handleSoundWinCmp.play()
                      //   // setInOutReward((prev: number) => {
                      //   //   return 2;
                      //   //   // return prev == 1 ? 2 : prev;
                      //   // });
                      // }, 1000);
                    }
                    }
                  /> :
                  <>
                    <span className="coinText">
                      {prevCountRef || 0}
                    </span>
                  </>
                }
              </div>

              {/* {inOutReward == 1 && <div className=""> <CoinAnimation /> </div>} */}
              {/* <Modal.Footer> */}

            </Modal.Body>
            {/* </Modal.Footer>       */}
          </Modal>
        </div>
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
              modalShow
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

              <Popuphead>Congrats!</Popuphead>
              {/* @ts-ignore */}
              <div className=''>
                <p style={{ fontSize: "24px", color: "white", fontWeight: "600" }}>You've won {rewardExtraVote} votes</p>
              </div>



              {/* <Modal.Footer> */}
              <div className="d-flex justify-content-center ">
                <Buttons.Primary className="mx-2" onClick={() => {
                  handleSoundWinCmp.pause()
                  setCountShow(false)
                  setShowReward((prev: number) => {
                    return 2;
                    // return prev == 1 ? 2 : prev
                  });
                  setInOutReward((prev: number) => {
                    return 2;
                  });
                  setTimeout(() => {
                    setShowCoinIncrement(0);
                  }, 2000);
                  handleClose();
                  setTimeout(() => {
                    setHeaderExtraVote((prev: any) => {
                      return {
                        ...prev,
                        collect: true
                      }
                    })
                  }, 2800)
                  // setTimeout(() => {
                  //   setHeaderExtraVote({
                  //     vote: 0,
                  //     collect: false
                  //   });
                  // }, 3500)
                }}>Collect your Vote</Buttons.Primary>
                {/* <Buttons.Default className="mx-2" onClick={handleClose}>No</Buttons.Default> */}
              </div>
            </Modal.Body>
            {/* </Modal.Footer>       */}
          </Modal>
        </div>
      </ForZoom >
    </ForZoom2>
  );
};

export default PAXCard;
