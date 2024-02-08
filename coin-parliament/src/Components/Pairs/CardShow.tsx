import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from "styled-components";
import { listData } from './utils';
import RangeSilder from '../Users/RangeSilder';
import ModalForResult from '../../Pages/ModalForResult';
import Countdown from 'react-countdown';
import CountDown from './CountDown';

const Price = styled.div`
  min-width: 56px;
  font-family: var(--font-family-poppins);
  font-weight: 400;
  color: ${(props: { single: boolean }) => props.single ? "var(--white)" : "#23036a"}`;

const MainDiv = styled.div`
  height:100vh;
  background:white;
  margin-top:-5px;
  margin-left:-5px;
  width:101%
  over-flow:hidden;

`;
const CoinsShow = styled.div`  
border-radius:0px 0px 120px 0px;
  // border:1px solid red;
  padding:0px;
  margin:0;
  align-items:center;
  height:270px;
`;


const ChildDiv = styled.div`
// background-color:white;
  // border:1px solid green;
  border-radius:10px;
  margin-top:7rem;
  width:${window.screen.width>767? "8%" :"20%"};
  display:flex;
  justify-content: space-between;
  &:hover{
    animation: zoom-in-zoom-out 1s ease;
    @keyframes zoom-in-zoom-out {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.1, 1.1);
  }
  100% {
    transform: scale(1, 1);
  }
}
  }
`;
const CoinText = styled.p`
color:white;
font-size:15px;
font-weight:bold;
text-align:center;
`;
const CoinPrice = styled.p`
color:white;

font-size: 16px;
text-align: center;
font-size:16px;
// font-weight:bold;
text-align:center;
`;

const ImgName = styled.div`
`;

const ButtonDiv = styled.div`
padding:50px 0px;
display:flex;
justify-content: center;
`;

const TimeButton = styled.div`
width: 71px;
height: 70px;
box-shadow: 0 3px 6px #00000029;
border-radius: 45px;
opacity: 1;
margin:0px 15px;
align-items: center;
display:flex;
justify-content: center;
cursor:pointer;
`;


const VoteButton = styled.div`
padding: ${window.screen.width > 767 ? "30px 0px" :"30px 15px"} ;
// border:1px solid red;
width:100%;
cursor:pointer;
display:flex;
justify-content: center;
overflow:hidden;
gap:10px;
`;

const Option = css`
  border: ${(props: { borderColor: string; selected: boolean }) =>
    `1px solid ${props.borderColor}`};
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;
  // box-shadow: 0 3px 6px #00000029;
  box-shadow: rgb(67 47 229) 0px 4px 1px, rgba(0,0,0,0.22) 0px 6px 12px;
  transition: all .2s ease;

  `;
 
const VoteDiv = styled.div`
  ${Option};
    text-align:center;
    display:flex;
  flex-direction: column;
  justify-content: center;
    max-width: 200px;
  height: 76px;
    color:#6352e8;
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
    animation: bull_shake_left 2s ease 2s 3 alternate forwards;    
  }
  &:hover {
  background:#6352E8;
  color:white;
 box-shadow: rgb(67 47 229) 0px 4px 1px, rgb(170 164 220) 0px 8px 6px;
`;



function CardShow({coins}: any) {
// @ts-ignore
  const cardData = { ...listData[0] }
  const [ShowSpdometer, setShowSpdometer] = useState(false) 
  const [showPopUp, setShowPopUp] = useState<any>(false) 
  const [clickedOption1, setClickedOption1] = useState(false);
  const [clickedOption0, setClickedOption0] = useState(false);  
  const [changeColor, setChangeColor] = useState<string>("black");
  const [currentPrice, setCurrentPrice] = useState<any>(0)
  const [voteDirection, setVoteDirection] = useState(0);
  const prevCountRef = useRef(currentPrice)
  const [lastvalue,setLastValue] = useState()

  const [allBUtton, setAllBUtton] = useState<any>([
    {
    time: "7 Sec",
    Active:true,    
    },
    {
    time: "15 Sec",
    Active:false,    
    },
    {
    time: "30 Sec",
    Active:false,    
    },
    {
    time: "60 Sec",
    Active:false,    
    }
  ])

  const OnlyCheckColor = () => {
    if (coins == prevCountRef.current) {
      setChangeColor("white")
    }
    else if (coins> prevCountRef.current) {
      setChangeColor("Green")
    }
    else if (coins < prevCountRef.current) {
      setChangeColor("Red")
    }
    setCurrentPrice(coins)
  }



  const ChangeStatus = (active:any, index:number ) => {
    const alldata = [...allBUtton]
    alldata.filter((value,ind)=> ind==index ?value.Active = !active :value.Active = false )
    alldata[index].Active = !active
    setAllBUtton(alldata)
  }

  function getActiveTime(arr:any) {
    for (const obj of arr) {
        if (obj.Active) {
            let selectedTime = obj.time
            return selectedTime.split(' ')[0] * 1000;
        }
    }
    return null; // Return null if no active time is found
}

const activeTime = useMemo(()=>getActiveTime(allBUtton) || 7000,[allBUtton]);

// console.log("activeTime.....", activeTime,typeof activeTime);
useEffect(() => {
  prevCountRef.current = currentPrice;
  OnlyCheckColor()
}, [coins,activeTime,allBUtton])
  
// @ts-ignore
    return (
      <MainDiv className=''
      >
        <CoinsShow
          className='d-flex justify-content-center '
          style={{
          backgroundColor:"#160133",
        }}
        >
          <div className='d-flex justify-content-center  w-75'>
            <ChildDiv
      
            onClick={() => {
              // navigate(`/CardShow/${index}`);
              // console.log(`/pairs/${index}`,"url")
          }}
          >
           
           <ImgName>
            <img src={cardData.img1} alt=""  width={"80px"} />
             <CoinText style={{marginBottom:"0rem"}}>{"Bitcoin"}</CoinText>
             <CoinText style={{marginBottom:"0rem"}}>{"BTC"}</CoinText>
             <CoinPrice style={{marginBottom:"0rem",color: `${changeColor}` }}> {coins !== null ? "$"+parseFloat(coins).toFixed(2) : "Loading..."}</CoinPrice>
          </ImgName>

              {/* <div className='' style={{
            position: "relative"            
            }}>
            <span className="bi bi-heart" style={{
              color: "#6352e8",
              // padding: "20px",
                position: "absolute",                              
                  top: "-14px",
                  left:"14px",
                fontSize: "18px"
            }}></span>              
           </div> */}
        </ChildDiv>
          </div>          
        </CoinsShow>
      
        {ShowSpdometer == false ?(
        <>
        <ButtonDiv className=''>
          {allBUtton.map((item:any,index:number) => {
            return (<TimeButton
              style={{
              background:`${item.Active==true ? "#6352e8" :"white"}`
              
              }}
              onClick={(e) => {
                ChangeStatus(item.Active ,index)
              }}
            >            
              <p
                style={{
              color:`${item.Active==true ? "white" :"#6352e8"}`,marginBottom:"0rem"
            }}
              >{item.time}</p>
            </TimeButton>)
          })}
        </ButtonDiv>
        </>
        ):("")}
      
        {ShowSpdometer == false ? 
          <>
            
            <div className='text-center mt-2'>
              <p
                style={{ color:"#6352e8"}}
              >
                Who gets your vote?
              </p>
            </div>
            <VoteButton className='mt-3'>
              {/* @ts-ignore */}
              <VoteDiv              
                className={`${clickedOption1 ? "animate" : ""} confetti-button svg-button`}
              style={{
               borderRadius:"60px 0px 60px 60px"
              }}
                onClick={() => {                  
                  setClickedOption1(true);
                  console.log(coins,"786 firstvalue")
                  setTimeout(() => {
                    setVoteDirection(1)  
                    setShowSpdometer(true)
                    setClickedOption1(false)
                  }, 600);
                  setTimeout(() => {
                    setShowPopUp(true)
                    setShowSpdometer(false)
                    console.log(coins,"last786")
                  },activeTime
                  );
                }
                }
              >
                <p>{cardData.name1}</p>
                </VoteDiv>
              <div>  
                {/* <div
                  style={{
                  
                }}
                >

                </div> */}
              </div>
              {/* @ts-ignore */}
              <VoteDiv
                className={`${clickedOption0 ? "animate" : ""} confetti-button svg-button`}
                
                style={{
                  animation: "bull_shake_right 2s ease 2s 3 alternate forwards",
                 borderRadius:"0px 60px 60px 60px"
              }}
                 onClick={() => {    
                  setVoteDirection(2)                
                   setClickedOption0(true);
                   setTimeout(() => {
                     setClickedOption0(false)
                     setShowSpdometer(true)
                   }, 600
                   );
                  setTimeout(() => {
                    setShowPopUp(true)
                    setShowSpdometer(false)                    
                  }, activeTime);
                }
                }
              >
                <p>{cardData.name2}</p>
                </VoteDiv>
            </VoteButton>
          </> :
          <div
            className='d-flex justify-content-center ml-3 mt-5'
            style={{
            
          }}
          >          
            <div
              className=''
              style={{
              width: "300px",
              height: "250px",
              border: "1px solid #6352e8",
              borderRadius: "10px",
              boxShadow: "0 3px 6px #00000029"
              }}> 
              <div
                style={{
                marginTop:"20px"
              }}
              >
                <p className='text-center'
                  style={{
                  color:"black"
                }}
                >YOUR CURRENT VOTE IMPACT</p>
              </div>
            
              <RangeSilder
                coins={coins}
                activeTime={activeTime}
                voteDirection={voteDirection}  
              />
              <div
                style={{
                position:"relative"
              }}
              >

            <CountDown activeTime={activeTime} setLastValue={setLastValue}/>
            </div>
            </div>
            </div>
        }
        {
          showPopUp == true ?
            <>
              <ModalForResult   
                voteDirection = {voteDirection}  
            // @ts-ignore 
                showPopUp={showPopUp}
                setShowPopUp={setShowPopUp}
                coins={coins}
              />
            </>
            : ""
        }
        
      </MainDiv>      
    )
  }


export default CardShow
