import React, { useEffect, useState } from 'react'
import { Coin } from "../../common/models/Coin";
import {VoteResultProps} from "../../common/models/Vote";
function RangeSilder(
    {
    vote,
    coins,
    symbol1,
    symbol2
    }: {
    vote: VoteResultProps;
    coins: { [symbol: string]: Coin };
    symbol1: string;
    symbol2: string;
    })

{

  console.log(vote?.valueVotingTime, "chekcvote")
  
  const [persentValue, setPersentValue] = useState<any>(0)

const getBorderColor = () => {
    // let PricePer = livePrice / 100;   
     if (symbol2 !== undefined) {
         let bothLivePrice = [coins[symbol1]?.price, coins[symbol2]?.price];
        // @ts-ignore
      let bothCurrentPrice = [...vote?.valueVotingTime];
    //   let bothCurrentPrice = [vote?.valueVotingTime[0],vote?.valueVotingTime[1],];
    let diff = [
        bothCurrentPrice[0] / bothLivePrice[0],
        bothCurrentPrice[1] / bothLivePrice[1],
    ];
     console.log(diff,"bothCurrentPrice")     
      let winner = diff[0] < diff[1] ? 1 : 0;
      const averageValue = Math.abs(diff[0] - diff[1]) * 100;
      if ((averageValue == averageValue)) {        
        setPersentValue(50) 
      } else {
        if (vote?.direction == 1) {
            winner == vote?.direction
                ?
                  setPersentValue(25)              
                :             
                  setPersentValue(75) 
             
        } else if (vote?.direction == 0) {
          winner != vote?.direction
            ?            
            setPersentValue(25) 
            :
            setPersentValue(75) 

        }
      }       
     } else if (symbol2 == undefined) {    
       let livePrice =coins[symbol1]?.price
       let votePrice =Number(vote?.valueVotingTime)
       let PricePer = livePrice;

       if(livePrice < PricePer + 10 &&
         livePrice > PricePer - 10) {
         
          setPersentValue(50);
            }
            else{
              if(vote?.direction == 1){
                livePrice < votePrice ?setPersentValue(75):setPersentValue(25);
              }else if(vote?.direction == 0){
                livePrice > votePrice ? setPersentValue(25):setPersentValue(75);
              }

            }
      // if (vote?.direction == 1) {
      //   // #218b17 #015117 #74ff5d
      //   switch (true) {
      //     case livePrice < votePrice + PricePer &&
      //       livePrice > votePrice - PricePer:
      //       setPersentValue("#218b17");
      //       break;
      //     case livePrice < votePrice:
      //       setPersentValue("#218b17");
      //       break;
      //     case livePrice > votePrice:
      //       setPersentValue("#218b17");
      //       break;
      //     default:
      //       console.log("not work");
      //   }
      // } else if (vote?.direction == 0) {
      //   switch (true) {
      //     //#218b17 #74ff5d #015117 
      //     case livePrice < votePrice + PricePer &&
      //       livePrice > votePrice - PricePer:
      //       setPersentValue("#218b17");
      //       break;
      //     case livePrice < votePrice:
      //       setPersentValue("#218b17");
      //       break;
      //     case livePrice > votePrice:
      //       setPersentValue("#218b17");
      //       break;
      //     default:
      //       console.log("not work");
      //   }
      // }
    }
  };

  console.log(vote,"CheckvalueVotingTime")
    useEffect(() => { 
    getBorderColor()
     }, [])
    
  return (
      <div>
          <div className="d-flex justify-content-around">                                                    
              <input type="range" className="form-range" id="myinput"  min={0} max={100} value={persentValue}></input>
            </div>
            <div className="d-flex justify-content-between"
            style={{color:"black"}}
            >                                                    
              <span>LOW</span>
              <span>MID</span>
              <span>HIGH</span>
            </div>
    </div>
  )
}

export default RangeSilder