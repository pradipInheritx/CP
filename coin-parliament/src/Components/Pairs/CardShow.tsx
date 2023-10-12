import React, { Component, useState } from 'react'
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import { listData } from './utils';
import { count } from 'console';
import RangeSilder from '../Users/RangeSilder';
import ModalForResult from 'Pages/ModalForResult';
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
  width:${window.screen.width > 767 ? "25%" : "100%"};
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
// padding:50px 0px;
cursor:pointer;
display:flex;
justify-content: center;
`;

const VoteDiv = styled.div`
  max-width: 200px;
  height: 76px;
  border:1px solid #6352e8;
  color:#6352e8;
  background:"#160133";
  flex-grow: 1;
  flex-basis: 0;
  // min-width: 0;
  box-shadow: 0 3px 6px #00000029;
  display:flex;
  flex-direction: column;
  justify-content: center;
  padding:25px 0px;
  text-align:center;
  // & span {
  //   color:red;
  // }
  // & p {
  //   color:red;
  // }
`;



function CardShow() {
  let params = useParams();
  const { id } = params;
  // @ts-ignore
  const cardData = { ...listData[id] }
  const [ShowSpdometer, setShowSpdometer] = useState(false)
  const [showPopUp, setShowPopUp] = useState<any>(false)
  const [allBUtton, setAllBUtton] = useState<any>([
    {
      time: "15 Sec",
      Active: true,
    },
    {
      time: "30 Sec",
      Active: false,
    },
    {
      time: "1 Min",
      Active: false,
    },
    {
      time: "15 Min",
      Active: false,
    }
  ])


  const ChangeStatus = (active: any, index: number) => {
    const alldata = [...allBUtton]
    alldata.filter((value, ind) => ind == index ? value.Active = !active : value.Active = false)
    alldata[index].Active = !active
    setAllBUtton(alldata)
  }

  return (
    <MainDiv className=''
    >
      <CoinsShow
        className='d-flex justify-content-center'
        style={{
          backgroundColor: "#160133",
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
              <img src={cardData.img1} alt="" width={"75px"} />
              <CoinText>{cardData.name1}</CoinText>
              <CoinPrice>{cardData.price1}</CoinPrice>
            </ImgName>
            <div className="w-25 d-flex flex-column  justify-content-center align-items-center"
            >
              <p style={{ color: "#6352e8" }}>VS</p>
              <div className=""
                style={{
                  border: "1px solid #6352e8",
                  width: "10px",
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
              <img src={cardData.img2} alt="" width={"75px"} />
              <CoinText>{cardData.name2}</CoinText>
              <CoinPrice>{cardData.price2}</CoinPrice>
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

      <ButtonDiv className=''>
        {allBUtton.map((item: any, index: number) => {
          return (<TimeButton
            style={{
              background: `${item.Active == true ? "#6352e8" : "white"}`
            }}
            onClick={(e) => {
              ChangeStatus(item.Active, index)
            }}
          >
            <p
              style={{
                color: `${item.Active == true ? "white" : "#6352e8"}`
              }}
            >{item.time}</p>
          </TimeButton>)
        })}
      </ButtonDiv>
      {ShowSpdometer == false ?
        <>
          <VoteButton className=''

          >
            <VoteDiv className='confetti-button svg-button animate'
              style={{
                borderRadius: "60px 0px 60px 60px"
              }}
              onClick={() => {
                setShowSpdometer(true)
                setTimeout(() => {
                  setShowPopUp(true)
                  setShowSpdometer(false)
                }, 15000);
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
            <VoteDiv className='confetti-button svg-button animate'
              style={{
                borderRadius: "0px 60px 60px 60px"
              }}
              onClick={() => {
                setShowSpdometer(true)
                setTimeout(() => {
                  setShowPopUp(true)
                  setShowSpdometer(false)
                  console.log("i am working")
                }, 15000);
              }
              }
            >
              <p>Vote</p>
              <p>{cardData.name2}</p>
            </VoteDiv>
          </VoteButton>



        </> :
        <div
          className='d-flex justify-content-center ml-3'
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
                marginTop: "20px"
              }}
            >
              <p className='text-center'
                style={{
                  color: "black"
                }}
              >YOUR CURRENT VOTE IMPACT</p>
            </div>

            <RangeSilder />
            <div

              style={{
                position: "relative"
              }}
            >
              <Countdown date={Date.now() + 15000}
                renderer={({ hours, minutes, seconds, completed }) => {
                  return (
                    <span className="text-uppercase" style={{
                      color: '#6352e8', fontSize: '20px', fontWeight: 100, lineHeight: "10%", position: "absolute",
                      left: "42%",
                      top: "-25px",
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
              // @ts-ignore 
              showPopUp={showPopUp}
            // setShowPopUp={setShowPopUp}
            />
          </>
          : ""
      }

    </MainDiv>
  )
}


export default CardShow