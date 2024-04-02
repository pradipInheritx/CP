import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from "styled-components";
import { listData } from './utils';
import RangeSilder from '../Users/RangeSilder';
import ModalForResult from '../../Pages/ModalForResult';
import Countdown from 'react-countdown';
import CountDown from './CountDown';
import CPLogo from '../../assets/images/CPLogo.png';

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
  padding:15px;
  margin:0;
  align-items:center;
  // height:270px;
`;


const ChildDiv = styled.div`
// background-color:white;
  // border:1px solid green;
  // border-radius:10px;
  // margin-top:7rem;
  // width:${window.screen.width>767? "8%" :"20%"};
  // display:flex;
  // justify-content: space-between;
//   &:hover{
//     animation: zoom-in-zoom-out 1s ease;
//     @keyframes zoom-in-zoom-out {
//   0% {
//     transform: scale(1, 1);
//   }
//   50% {
//     transform: scale(1.1, 1.1);
//   }
//   100% {
//     transform: scale(1, 1);
//   }
// }
  }
`;
export const CoinText = styled.p`
color:white;
// font-size:15px;
font-size:0.80em;
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
padding:5px 0px;
display:flex;
justify-content: center;
`;

const TimeButton = styled.div`
width:100%;
height:100%;

box-shadow: 0 3px 6px #00000029;

border-radius: 50%;
opacity: 1;
// padding:20px;
align-items: center;
display:flex;
justify-content: center;
cursor:pointer;
@media (max-width: 767px) {
  margin:0px 4px /* Adjust the styles for smaller screens */
}
`;


const VoteButton = styled.div`
padding: ${window.screen.width > 767 ? "10px 0px" :"10px 15px"} ;
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
    max-width: 180px;
    width:2%;
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
  }
 @media (max-width: 767px) {
  max-width: 150px; /* Adjust the styles for smaller screens */
}
`;

const ResponsiveContainer = styled.div`
  width: 350px;
  height: 400px;
  border: 1px solid #6352e8;
  border-radius: 10px;
  box-shadow: 0 3px 6px #00000029;

  @media (max-width: 767px) {
    width: 250px;
    height: 380px;
  }
`;


function CardShow({coins}: any) {
// @ts-ignore
  const cardData = { ...listData[0] }
  const [impactValue, setImpactValue] = useState()
  const [ShowSpdometer, setShowSpdometer] = useState(false) 
  const [showPopUp, setShowPopUp] = useState<any>(false) 
  const [clickedOption1, setClickedOption1] = useState(false);
  const [clickedOption0, setClickedOption0] = useState(false);  
  const [changeColor, setChangeColor] = useState<string>("black");
  const [currentPrice, setCurrentPrice] = useState<any>(0)
  const [voteDirection, setVoteDirection] = useState(0);
  const [voteLastPrice, setVoteLastPrice] = useState(0);
  const prevCountRef = useRef(currentPrice)
  const [lastvalue,setLastValue] = useState()
  const[startprice,setStartPrice]=useState(0)

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
  
  const getLastPrice = () => {
    console.log("yes i am calling")
    setVoteLastPrice(coins)
  }

  const getstartprice = () =>{
    setStartPrice(coins)
  }
  // console.log(startprice,"startprice444")

  // console.log(voteLastPrice,"lastprice444")
  
// @ts-ignore
    return (
      <MainDiv className=''
      >
        <CoinsShow
          className='d-flex justify-content-between'
          style={{
          backgroundColor:"#160133",
        }}
        >
          <div className=''
            style={{
              marginLeft: "20px",
              opacity: 0,
            }}
          ><img src={CPLogo} alt="" width={"70px"} /></div>
          <div className='d-flex justify-content-center'>
            <ChildDiv
      
            onClick={() => {
              // navigate(`/CardShow/${index}`);
              // console.log(`/pairs/${index}`,"url")
          }}
          >
           
           <ImgName>
            <img src={cardData.img1} alt=""  width={"70px"} />
             <CoinText style={{marginBottom:"0rem"}}>{"Bitcoin"}</CoinText>
             <CoinText style={{marginBottom:"0rem"}}>{"BTC"}</CoinText>
             <CoinPrice style={{marginBottom:"0rem",color: `${changeColor}` }}> {coins !== null ? "$"+parseFloat(coins).toFixed(2) : "Loading..."}</CoinPrice>
          </ImgName>
              
        </ChildDiv>
          </div> 
          <div className=''
            style={{
            marginRight:"20px"
          }}
          ><img src={CPLogo} alt="" width={"70px"} /></div>
        </CoinsShow>
      
        {ShowSpdometer == false ?(
        <>
        <ButtonDiv className=''>
          {allBUtton.map((item:any,index:number) => {
            return (
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  margin: `${window.screen.width > 767 ? "0px 1%" :"0px 5px"}`
                }}
                key={item.time + index}
              >
              <TimeButton
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
                </TimeButton>
              </div>
                )
          })}
        </ButtonDiv>
        </>
        ):("")}
      
        {ShowSpdometer == false ? 
          <>
            
            <div className='text-center mt-1'>
              <span
                style={{
                  color: "#6352e8",
                  fontSize:"0.80em",
                }}
                
              >
                Who gets your vote?
              </span>
            </div>
            <VoteButton className=''>
              {/* @ts-ignore */}
              <VoteDiv              
                className={`${clickedOption1 ? "animate" : ""} confetti-button svg-button`}
              style={{
               borderRadius:"60px 0px 60px 60px"
              }}
                onClick={() => {  
                  setClickedOption1(true);
                  getstartprice()
                  // console.log(coins,"786 firstvalue")
                  setTimeout(() => {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                    setVoteDirection(1)  
                    setShowSpdometer(true)
                    setClickedOption1(false)
                  }, 600);
                  setTimeout(() => {
                    setShowPopUp(true)
                    setShowSpdometer(false)
                    getLastPrice()
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
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
                     setClickedOption0(false)
                     setShowSpdometer(true)
                   }, 600
                   );
                  setTimeout(() => {
                    setShowPopUp(true)
                    setShowSpdometer(false) 
                    getLastPrice()
                  }, activeTime);
                }
                }
              >
                <p>{cardData.name2}</p>
                </VoteDiv>
            </VoteButton>
          </> :
          <div
            className='d-flex justify-content-center ml-3 mt-3'
            style={{
            
          }}
          >          
            <ResponsiveContainer             > 
              <div
                style={{
                marginTop:"10px",display:"flex",flexDirection:"column",justifyContent:"center", alignItems:"center"
              }}
              >
                 <img src={cardData.img1} alt=""  width={"30px"} style={{height:"50px"}} />
                 <p style={{marginBottom:"0rem",fontWeight:"Bold",fontSize:"13px"}}>{"Bitcoin"}</p>
                 <p style={{marginBottom:"0rem",fontSize:"13px"}}>{"BTC"}</p>
                 <p style={{marginBottom:"0rem",fontWeight:"500",fontSize:"14px"}}>{Math.floor(activeTime / 1000) + " Sec Vote"}</p>
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
                setImpactValue={setImpactValue}
              />
              <div
                style={{
                position:"relative"
              }}
              >

            <CountDown activeTime={activeTime} setLastValue={setLastValue}/>
            </div>
            </ResponsiveContainer>
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
                voteLastPrice={voteLastPrice}
                startprice={startprice}
                activeTime={activeTime}
                impactValue={impactValue}
              />
            </>
            : ""
        }
        
      </MainDiv>      
    )
  }


export default CardShow
