import React, { useContext, useEffect, useRef } from "react";
import { useTranslation } from "../../common/models/Dictionary";
import { texts } from "../LoginComponent/texts";
import CountUp from "react-countup";
import AppContext from "../../Contexts/AppContext";

type PAXCardProps = {
  walletId: string;
  PAX: number;
  rewardTimer?: any;
};

const PAXCard = ({ walletId, PAX ,rewardTimer}: PAXCardProps) => {
  const prevCountRef = useRef(PAX)
  const {showReward,setShowReward,setHeaderExtraVote,rewardExtraVote,setRewardExtraVote} = useContext(AppContext);
  console.log(showReward,"CheckshowReward")
  useEffect(() => {
    prevCountRef.current = PAX ; 
  }, [])
  
  console.log(rewardExtraVote,"secondRewardExtraVotes")
  const translate = useTranslation();
  return (
    <div className="cp_balance dark_prpl_bkgnd mx-auto mb-3">
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
              <span className="cp_Value vstack" style={{ paddingBottom: '2px', fontSize:`${showReward==1?"30px":"20px"}`}}>
                <CountUp start={prevCountRef.current} end={PAX && PAX} duration={5}
                  onEnd={() => {
                    setShowReward((prev:number) => {                      
                      return prev==1?2:prev
                    })                                         
                    console.log(rewardExtraVote, "secondRewardExtraVotes1")   
                    setRewardExtraVote((prev: number) => {
                    console.log(prev, "checkprev1")                         
                      if (prev != 0) {                        
                    console.log(prev, "checkprev1")                                                 
                        setHeaderExtraVote(prev)
                      }
                      return prev
                    })
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
    </div>
  );
};

export default PAXCard;
