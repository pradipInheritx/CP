import React, { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "../../common/models/Dictionary";
import { texts } from "../LoginComponent/texts";
import CountUp from "react-countup";
import AppContext from "../../Contexts/AppContext";
import styled, { css } from "styled-components";
import { Modal } from "react-bootstrap";
import { Buttons } from "../Atoms/Button/Button";
import coinBg from "../../assets/images/coin_bg.png";
import { ZoomCss as ZoomCss2 } from "../App/App";


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
    transform: scale(1.4);
    animation: zoom-in-zoom-out 4s infinite ;
    @keyframes zoom-in-zoom-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.4);
  }
  100% {
    transform: scale(1);
  }
}
`;

const ForZoom = styled.div`
 ${(props: ZoomProps) => `${(props.showCoinIncrement === 1) ? ZoomCss : ""}`} 

`;
const ForZoom2 = styled.div`
z-index:${(props: ZoomProps) => `${(props.showCoinIncrement === 1) ? "2200" : ""}`};  
 ${(props: ZoomProps) => `${(props.showCoinIncrement === 1) ? ZoomCss2 : ""}`} `


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


  const { showReward, setShowReward, setHeaderExtraVote, rewardExtraVote, setRewardExtraVote, inOutReward, setInOutReward } = useContext(AppContext);
  console.log(showReward, "CheckshowReward")
  const [modalShow, setModalShow] = React.useState(false);
  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

  const translate = useTranslation();
  const [showCoinIncrement, setShowCoinIncrement] = useState<number>(0); //1 =show 1>=hide
  useEffect(() => {
    if (inOutReward === 1 && !modalShow && !showCoinIncrement) {
      setShowCoinIncrement(1);
    }
  }, [inOutReward, modalShow]);
  return (
    <ForZoom2 {...{ showCoinIncrement }} style={{ marginTop: "7px" }}>
      <ForZoom className="cp_balance dark_prpl_bkgnd mx-auto mb-3"
        {...{ showCoinIncrement }}
      >
        <h6 className="box_title card-header " style={{ fontSize: '12px', paddingTop: '15px', paddingBottom: '10px' }}>
          {texts.CoinParliamentBalance}
        </h6>
        <div className="d-flex justify-content-center align-items-center flex-column">
          <div className="circle "

            style={{
              backgroundImage: `url(${coinBg})`,
              backgroundSize: "90px 87px",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '-8px -5px',
            }}
          >
            <div
              className="d-flex justify-content-center align-items-center flex-column coin_Bg"
              style={{ height: 75, color: '#6352E8' }}
            >
              <div>
                <span className="cp_Value vstack " style={{ paddingBottom: '2px', fontSize: `${inOutReward == 1 ? "24px" : "20px"} ` }}>
                  {/* PARLIAMENT COIN-reward modal 2*/}
                  {showCoinIncrement === 1 ?
                    <CountUp className="PaxText" start={prevCountRef} end={PAX && PAX} duration={5}
                      onEnd={() => {
                        console.log('reward modal 2');
                        setTimeout(() => {
                          handleShow();
                          setShowCoinIncrement(2);
                          setPrevCountRef(PAX);
                          // setInOutReward((prev: number) => {
                          //   return 2;
                          //   // return prev == 1 ? 2 : prev;
                          // });
                        }, 1000);
                      }
                      }
                    /> :
                    <>
                      {prevCountRef || 0}
                    </>
                  }
                </span>
                {/* <span className="cp_PAX" >PTS</span> */}
              </div>
            </div>
          </div>
          <p className="cp_wallet mt-3">{walletId}</p>
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
            contentClassName={"modulebackground"}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: "2200" }}
          >
            <Modal.Body className="d-flex  justify-content-center align-items-center">
              {/* continue voting */}
              {/* @ts-ignore */}
              <div className=''>
                <p style={{ fontSize: "20px", color: "white" }}>Congrats! You've won {rewardExtraVote} votes</p>
              </div>


            </Modal.Body>
            {/* <Modal.Footer> */}
            <div className="d-flex justify-content-center ">
              <Buttons.Primary className="mx-2" onClick={() => {
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
                // setTimeout(() => {
                //   setRewardExtraVote((prev: number) => {
                //     setShowReward((Showprev: number) => {
                //       if (prev != 0 && Showprev == 2 || false) {
                //         setHeaderExtraVote(prev)
                //       }
                //       return Showprev
                //     })
                //     return prev
                //   })
                // }, 3000);
                handleClose();
                setTimeout(() => {
                  setHeaderExtraVote((prev: any) => {
                    return {
                      ...prev,
                      collect: true
                    }
                  })
                }, 2800)
                setTimeout(() => {
                  setHeaderExtraVote({
                    vote: 0,
                    collect: false
                  });
                }, 3000)
              }}>Collect your Vote</Buttons.Primary>
              {/* <Buttons.Default className="mx-2" onClick={handleClose}>No</Buttons.Default> */}
            </div>
            {/* </Modal.Footer>       */}
          </Modal>
        </div>



      </ForZoom >
    </ForZoom2>
  );
};

export default PAXCard;
