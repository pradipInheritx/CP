import React, { useEffect, useState } from 'react'
import { Coin } from "../../common/models/Coin";
import { VoteResultProps } from "../../common/models/Vote";
import "./styles.css";
import styled from "styled-components";

const InputRange = styled.input`
    width:100%;
    & ::-webkit-slider-runnable-track{
      border-radius: 1px;
    }
`;


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
         
      let winner = diff[0] < diff[1] ? 1 : 0;
      const averageValue = Math.abs(diff[0] - diff[1]) * 100;
      if(!vote?.valueVotingTime || vote?.valueVotingTime==NaN){
        setPersentValue(50) 
        return
      }
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
       let livePrice =Number(coins[symbol1]?.price)
       let votePrice =Number(vote?.valueVotingTime)
       let PricePer = livePrice;
       console.log('price',livePrice < votePrice + 1 &&
        livePrice > votePrice - 1,{
          livePrice,
          votePrice,
          vote
        }
        
        
        )
        if(!vote?.valueVotingTime || vote?.valueVotingTime==NaN){
          setPersentValue(50) 
          return
        }
       if(livePrice < votePrice + 1 &&
         livePrice > votePrice - 1) { 
          setPersentValue(50);
        }
        else{
          if(vote?.direction == 0){
            livePrice > votePrice ?setPersentValue(75):setPersentValue(25);
          }else if(vote?.direction == 1){
            livePrice > votePrice ? setPersentValue(25):setPersentValue(75);
          }
        }     
    }
  };
  
  
  useEffect(() => { 
    
      getBorderColor()
    
  }, [coins[symbol1]?.price ,coins[symbol2]?.price,vote?.valueVotingTime])
  
  return (
    <div className=''>
          {/* <p style={{color:"black"}} className="py-2">YOUR VOTE IMPACT</p> */}
          <div className="d-flex justify-content-around w-100 ">                                                    
              <input type="range"  id="myinput"  min={0} max={100} value={persentValue} className="rengeInput w-100"></input>
            </div>
            <div className="d-flex justify-content-between mt-2"
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