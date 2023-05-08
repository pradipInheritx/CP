import React, { useContext, useEffect, useRef } from "react";
import { useTranslation } from "../../common/models/Dictionary";
import { texts } from "../LoginComponent/texts";
import CountUp from "react-countup";
import AppContext from "../../Contexts/AppContext";
import styled, { css } from "styled-components";

type PAXCardProps = {
  walletId: string;
  PAX: number;
  rewardTimer?: any;
};

type ZoomProps = {
  inOutReward?:number
};

const ZoomCss = css`
    // transform: scale(1.4);
    animation: zoom-in-zoom-out 4s ease ;
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
 ${(props: ZoomProps) => `${props.inOutReward == 1 ? ZoomCss :""}`} 

`;


const PAXCard = ({ walletId, PAX ,rewardTimer}: PAXCardProps) => {
  const prevCountRef = useRef(PAX)
  const {showReward,setShowReward,setHeaderExtraVote,rewardExtraVote,setRewardExtraVote, inOutReward,setInOutReward} = useContext(AppContext);
  console.log(showReward,"CheckshowReward")
  useEffect(() => {
    prevCountRef.current = PAX ; 
  }, [])
  
  console.log(rewardExtraVote,"secondRewardExtraVotes")
  const translate = useTranslation();
  return (
    <ForZoom className="cp_balance dark_prpl_bkgnd mx-auto mb-3"    
    {...{inOutReward}}
    >
      <h6 className="box_title card-header " style={{ fontSize: '12px', paddingTop: '15px', paddingBottom: '10px' }}>
        {/* {translate("Coin Parliament Balance")} */}
        {texts.CoinParliamentBalance}
      </h6>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="circle">
          <div
            className="d-flex justify-content-center align-items-center flex-column"
            style={{ height: 75,color:'#6352E8' }}
          >
            <div>
              <span className="cp_Value vstack" style={{ paddingBottom: '2px', fontSize:`${inOutReward==1?"30px":"20px"}`}}>
                <CountUp start={prevCountRef.current} end={PAX && PAX +1 -1} duration={3}
                  onEnd={() => {      
                    setTimeout(() => {  
                      setInOutReward((prev: number) => { 
                        console.log(prev,"showRewardCheck")
                      return prev==1?2:prev
                    });                    
                    }, 1000);
                    

                    setTimeout(() => {  
                      
                      setShowReward((prev: number) => {                        
                      
                      return prev==1?2:prev
                    })                                   
                    }, 4000);
                            
                    setTimeout(() => {
                      setRewardExtraVote((prev: number) => {                  
                        setShowReward((Showprev:number) => {
                        if (prev != 0 && Showprev ==2) {                                                                                          
                        setHeaderExtraVote(prev)
                        }
                          return Showprev
                      })                      
                      return prev
                    })     
                    },8000);
                    
                    // setHeaderExtraVote((prev: number) => {                      
                    //   console.log(rewardExtraVote,"secondRewardExtraVotes2")                    
                    //   return rewardExtraVote ? rewardExtraVote :0
                    // })                    
                  }
                  }
                />
              </span>
              {/* <span className="cp_PAX" >PTS</span> */}
            </div>
          </div>
        </div>
        <p className="cp_wallet mt-3">{walletId}</p>
      </div>
    </ForZoom>
  );
};

export default PAXCard;
