import React, { useContext, useEffect, useRef } from "react";
import { useTranslation } from "../../common/models/Dictionary";
import { texts } from "../LoginComponent/texts";
import CountUp from "react-countup";
import AppContext from "../../Contexts/AppContext";
import styled, { css } from "styled-components";
import { Modal } from "react-bootstrap";
import { Buttons } from "../Atoms/Button/Button";
import coinBg from "../../assets/images/coin_bg.png";



type PAXCardProps = {
  walletId: string;
  PAX: number;
  rewardTimer?: any;
  countShow?: any;
  setCountShow?: any;
};

type ZoomProps = {
  inOutReward?: number
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
 ${(props: ZoomProps) => `${props.inOutReward == 1 ? ZoomCss : ""}`} 

`;


const PAXCard = ({ walletId, PAX, rewardTimer, countShow, setCountShow }: PAXCardProps) => {
  // const prevCountRef = useRef(PAX)
  const prevCountRef = (PAX || 0) - (rewardTimer?.data?.thirdRewardDiamonds || 0)
  const { showReward, setShowReward, setHeaderExtraVote, rewardExtraVote, setRewardExtraVote, inOutReward, setInOutReward } = useContext(AppContext);
  console.log(showReward, "CheckshowReward")
  const [modalShow, setModalShow] = React.useState(false);
  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);


  // useEffect(() => {
  //   // if (PAX != prevCountRef.current) {      
  //     prevCountRef.current = PAX;
  //   // }
  // }, [PAX])

  // console.log(,PAX,"PAXall")

  // console.log(rewardExtraVote, "secondRewardExtraVotes")
  const translate = useTranslation();
  return (
    <ForZoom className="cp_balance dark_prpl_bkgnd mx-auto mb-3"
      {...{ inOutReward }}
    >
      <h6 className="box_title card-header " style={{ fontSize: '12px', paddingTop: '15px', paddingBottom: '10px' }}>
        {/* {translate("Coin Parliament Balance")} */}
        {texts.CoinParliamentBalance}
      </h6>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="circle "

          style={{
            backgroundImage: `url(${coinBg})`,
            // backgroundImage: `url(${externalImage})`,
            // backgroundSize: 'cover',
            backgroundSize: "90px 87px",
            // backgroundPosition: "2px 0px",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '-8px -5px',
            // height: '500px',
          }}
        >
          <div
            className="d-flex justify-content-center align-items-center flex-column coin_Bg"
            style={{ height: 75, color: '#6352E8' }}
          >
            <div>
              <span className="cp_Value vstack " style={{ paddingBottom: '2px', fontSize: `${inOutReward == 1 ? "24px" : "20px"}` }}>
                {inOutReward == 1 && showReward == 1 ? <CountUp className="PaxText" start={prevCountRef} end={PAX && PAX} duration={5}
                  onEnd={() => {

                    setTimeout(() => {
                      setInOutReward((prev: number) => {
                        // console.log(prev,"showRewardCheck")
                        if (prev == 1) {
                          handleShow()
                          return 2
                        } else {
                          return prev
                        }
                      });
                    }, 1000);

                    // setInOutReward((prev: number) => { 
                    //     console.log(prev,"showRewardCheck")
                    //   return prev==1?2:prev
                    // });

                    // setTimeout(() => {

                    //   setShowReward((prev: number) => {

                    //   return prev==1?2:prev
                    // })
                    // }, 1000);

                    // setTimeout(() => {
                    //   setRewardExtraVote((prev: number) => {
                    //     setShowReward((Showprev:number) => {
                    //     if (prev != 0 && Showprev ==2) {
                    //     setHeaderExtraVote(prev)
                    //     }
                    //       return Showprev
                    //   })
                    //   return prev
                    // })
                    // },3000);

                    // setHeaderExtraVote((prev: number) => {                      
                    //   console.log(rewardExtraVote,"secondRewardExtraVotes2")                    
                    //   return rewardExtraVote ? rewardExtraVote :0
                    // })                    
                  }
                  }
                /> :
                  <>
                    {PAX || 0}
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
          <div className="d-flex justify-content-end">
            {/* <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={()=>{
          handleClose()
          }}></button> */}
          </div>
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
              setTimeout(() => {

                setShowReward((prev: number) => {

                  return prev == 1 ? 2 : prev
                })
              }, 1000);

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
  );
};

export default PAXCard;
