import React, { Component, useState } from 'react'
import { useParams } from 'react-router-dom';
import styled, { css } from "styled-components";
import { listData } from './utils';
import { count } from 'console';
import RangeSilder from '../Users/RangeSilder';
import ModalForResult from '../../Pages/ModalForResult';
import Countdown from 'react-countdown';


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
  // height:100px;
`;


const ChildDiv = styled.div`
// background-color:white;
  // border:1px solid green;
  border-radius:10px;
  width:${window.screen.width>767? "25%" :"100%"};
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
font-size:16px;
// font-weight:bold;
text-align:center;
`;

const ImgName = styled.div`
padding:30px 25px 20px 25px;
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
  // & svg g path {
  //   stroke: ${(props: { borderColor: string; selected: boolean }) =>
  //   props.selected ? colors[1] : colors[0]};
  // }
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



function CardShow() {
    let params = useParams();
    const [voteDirection, setVoteDirection] = useState(0);
  const {id} = params;
// @ts-ignore
  const cardData = { ...listData[id] }
  const [ShowSpdometer, setShowSpdometer] = useState(false) 
  const [showPopUp, setShowPopUp] = useState<any>(false) 
  const [clickedOption1, setClickedOption1] = useState(false);
  const [clickedOption0, setClickedOption0] = useState(false);
  const [allBUtton, setAllBUtton] = useState<any>([
    {
    time: "15 Sec",
    Active:true,    
    },
    {
    time: "30 Sec",
    Active:false,    
    },
    {
    time: "1 Min",
    Active:false,    
    },
    {
    time: "15 Min",
    Active:false,    
    }
  ])
  

  const ChangeStatus = (active:any, index:number ) => {
    const alldata = [...allBUtton]
    alldata.filter((value,ind)=> ind==index ?value.Active = !active :value.Active = false )
    alldata[index].Active = !active
    setAllBUtton(alldata)
  }
// @ts-ignore
    return (
      <MainDiv className=''
      >
        <CoinsShow
          className='d-flex justify-content-center'
          style={{
          backgroundColor:"#160133",
        }}
        >
          <div className='d-flex justify-content-center w-75'>
            <ChildDiv
          
            onClick={() => {
              // navigate(`/CardShow/${index}`);
              // console.log(`/pairs/${index}`,"url")
          }}
          >
           
           <ImgName>
            <img src={cardData.img1} alt=""  width={"80px"} height={"75px"} />
             <CoinText>{cardData.name1}</CoinText>
             {/* <CoinPrice>{cardData.price1}</CoinPrice> */}
          </ImgName>
           <div className="w-25 d-flex flex-column  justify-content-center align-items-center"
              >
                <p style={{color:"#6352e8"}}>VS</p>            
             <div className=""
               style={{
                 border: "1px solid #6352e8",
                 width:"10px",
                 height: "1px"
             }}
                ></div>
                <div className=""
               style={{
                 borderLeft: "2px solid #6352e8",
                 height: "50px"
             }}
             ></div>
             
              </div>  
              
           <ImgName>
             <img src={cardData.img2} alt=""  width={"80px"} height={"75px"}/>
                <CoinText>{cardData.name2}</CoinText>
                {/* <CoinPrice>{cardData.price2}</CoinPrice> */}
              </ImgName>  
              
              <div className='' style={{
            position: "relative"            
            }}>
            <span className="bi bi-heart" style={{
              color: "#6352e8",
              // padding: "20px",
                position: "absolute",                              
                  top: "15px",
                fontSize: "18px"
            }}></span>              
           </div>
        </ChildDiv>
          </div>          
        </CoinsShow>
      
        {/* <ButtonDiv className=''>
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
              color:`${item.Active==true ? "white" :"#6352e8"}`
            }}
              >{item.time}</p>
            </TimeButton>)
          })}
        </ButtonDiv> */}
        {ShowSpdometer == false ? 
          <>
            
            <div className='text-center mt-5'>
              <p
                style={{ color:"#6352e8"}}
              >
                Who gets your vote?
              </p>
            </div>
            <VoteButton className='mt-3'
              
            >
              {/* @ts-ignore */}
              <VoteDiv              
                className={`${clickedOption1 ? "animate" : ""} confetti-button svg-button`}
              style={{
               borderRadius:"60px 0px 60px 60px"
              }}
                onClick={() => {   
                  setVoteDirection(1)               
                  setClickedOption1(true);
                  setTimeout(() => {
                    setShowSpdometer(true)
                    setClickedOption1(false)
                  }, 600);
                  setTimeout(() => {
                    setShowPopUp(true)
                    setShowSpdometer(false)
                  }, 7700);
                }
                }
              >
                <p>Vote</p> 
                <p>{cardData.name1}</p>
                </VoteDiv>
              <div>  
                <div>VS</div>
                <div
                  style={{
                  
                }}
                >

                </div>
              </div>
              {/* @ts-ignore */}
              <VoteDiv
                className={`${clickedOption0 ? "animate" : ""} confetti-button svg-button`}
                
                style={{
                  animation: "bull_shake_right 2s ease 2s 3 alternate forwards",
                 borderRadius:"0px 60px 60px 60px"
              }}
                 onClick={() => {                  
                  //  setShowSpdometer(true)
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
                    console.log("i am working")
                  }, 7700);
                }
                }
              >
                <p>Vote</p>
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
                // display: "flex",
                
                // justifyContent: "center",
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
            
              <RangeSilder />
              <div
              
                style={{
                position:"relative"
              }}
              >
                <Countdown date={Date.now() + 7000}
                      renderer={({ hours, minutes, seconds, completed }) => {
                        return (
                          <span className="text-uppercase" style={{
                            color: '#6352e8', fontSize: '20px', fontWeight: 100, lineHeight: "10%", position: "absolute",
                            left:"42%",
                            top:"-25px",
                          }}>																				
                            {hours < 1 ? null : `${hours} :`}
                            {minutes < 10 ? `0${minutes}` : minutes}:
                
                            {seconds < 10 ? `0${seconds}` : seconds} 																				
                          </span>
                        );

                      }}
										/>
              </div>
            </div>
            </div>
        }
        {
          showPopUp == true ?
            <>
              <ModalForResult   
voteDirection = {voteDirection }    
            // @ts-ignore 
                                showPopUp={showPopUp}
                setShowPopUp={setShowPopUp}
              />
            </>
            : ""
        }
        
      </MainDiv>      
    )
  }


export default CardShow