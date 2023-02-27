import React, { useEffect } from 'react'
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

    console.log(vote?.valueVotingTime,"chekcvote")
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
        // setborderColor("#218b17");
          console.log("i am winner quail")
      } else {
        if (vote?.direction == 1) {
            winner == vote?.direction
                ?
                //   setborderColor("#74ff5d") 
                console.log("i am winner 1")
                :
                //   setborderColor("#015117");
                console.log("i am not winner 1");
        } else if (vote?.direction == 0) {
          winner != vote?.direction
              ?console.log("i am winner 0")
            //   setborderColor("#74ff5d")
              :
              console.log("i am not winner 0")
            //   setborderColor("#015117");
        }
      }       
    }
  };

    useEffect(() => { 
    getBorderColor()
     }, [])
    
  return (
      <div>
          <div className="d-flex justify-content-around">                                                    
              <input type="range" className="form-range" id="myinput"  value={-3}></input>
            </div>
            <div className="d-flex justify-content-between"
            style={{color:"black"}}
            >                                                    
              <p>LOW</p>
              <p>MID</p>
              <p>HIGH</p>
            </div>
    </div>
  )
}

export default RangeSilder