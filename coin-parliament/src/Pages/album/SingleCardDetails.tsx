/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

import "../styles.css";
import { httpsCallable } from "@firebase/functions";
import firebase from "firebase/compat";


import { Ratio } from "react-bootstrap";
import NftOneCard from "Pages/NftOneCard";
import UserContext from "Contexts/User";
import CoinsContext from "Contexts/CoinsContext";
import AppContext from "Contexts/AppContext";
import { Other } from "Pages/SingleCoin";
import { useTranslation } from "common/models/Dictionary";

const CenterItem = styled.div`
  background-color: #f2f2f2;  
overFlow-x:hidden;
  width:100%;
  
  // & p {
  //   font-weight: 100;
  //   text-align: center;
  //   padding: 20px;
  //   font-size: 20px;
  //   color: #160133;
  //   text-transform: uppercase;
  // }
  // & strong {
  //   // font-weight: 400;
  //   text-align: center;
  //   // padding: 30px;
  //   font-size: 20px;
  //   color: #160133;
    
  // }
`;
const SummerCard = styled.div`
width:${window.screen.width > 767 ? "730px" : "100%"};
margin:auto;
display: flex;
justify-content:center;  
`;

const TextStyle = styled.p`
font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-12) / var(--line-spacing-14) var(--font-family-poppins);
  color:#807f8b;
  
  text-align: center;
  letter-spacing: 0.04px;
  text-transform: uppercase;
  opacity: 1;
  // text-decoration: underline;
`;

const SingleCardDetails = () => {
  // const [cards, setCards] = useState(

  //   {
  //     id: 1,
  //     cardType: "COMMON",
  //     cardNo: "CP244",
  //     cardHeader: "INVESTOR",
  //     type: "SUMMER",
  //   },

  // );
  const [CardValue, setCardValue] = useState([]);
  const [backCards, setBackCards] = useState<any>([]);
  const [sameCards, setSameCards] = useState<any>({})
  const { user, userInfo } = useContext(UserContext);
  const { leaders } = useContext(CoinsContext);
  const { albumOpen, setAlbumOpen, userTypes } = useContext(AppContext);
  const [chosen, setChosen] = useState<string | undefined>();


  // console.log(leaders,"allleaders")

  // const BackSideCard = (value: string | number) => {
  //   // @ts-ignore
  //   let allBackCard = backCards;
  //   // @ts-ignore
  //   // setBackCards(backCards == value ? "" : value);
  //   backCards.length > 0
  //     ? backCards?.map((items: any, index: number) => {
  //       if (items == value) {
  //         // @ts-ignore
  //         allBackCard.splice(index, 1);
  //         setBackCards(allBackCard);
  //       } else {
  //         // @ts-ignore

  //         setBackCards([...backCards, value]);
  //       }
  //       // @ts-ignore
  //     })
  //     : setBackCards([...backCards, value]);
  // };


  const BackSideCard = (value: string | number) => {
    // @ts-ignore
    if (backCards.includes(value)) {
      let allBackCard = [...backCards];
      allBackCard.splice(backCards.indexOf(value), 1);
      setBackCards(allBackCard)
    }
    else {
      setBackCards([...backCards, value])
    };
  };


  const [allCardList, setAllCardList] = useState<any>([])
  const [singalCardData, setSingalCardData] = useState<any>([])
  // const { singalCardData,setSingalCardData} = useContext(AppContext);

  let params = useParams();
  const translate = useTranslation();
  const { type, id } = params;
  const navigate = useNavigate();  
  

  const getNftCard = () => {
    const getCards = firebase
      .firestore()
      .collection("nft_gallery")
      .where("collectionName", "==", type)
    getCards.get()
      .then((snapshot) => {
        let allcollection = snapshot.docs.map((doc) => doc.data())

        const collectionType = allcollection?.map((allCard: any) => {
          return allCard?.setDetails
        })
      }).catch((error) => {
        console.log(error, "error");
      })
      ;
  }
  useEffect(() => {    
    getNftCard()
    // alllist= getList({cardID:id})

  }, [id])
  useEffect(() => {
    // @ts-ignore
    setSingalCardData(JSON.parse(localStorage.getItem("singalCardData")))
    
  }, []);

  // const getCardDetails = () => {
  //   const getCard = firebase
  //     .firestore()
  //     .collection("cardsDetails")
  //     .where("cardId", "==", id)
  //   getCard.get()
  //     .then((snapshot) => {
  //       let data = snapshot.docs.map((doc) => doc.data());
  //       if (data.length > 0) {
  //         setSingalCardData(data[0]);
  //       }        

  //     }).catch((error) => {
  //       console.log(error, "error");
  //     })
  //     ;
  // }

  useEffect(() => {   
    if (singalCardData?.myID) {
      firebase
        .firestore()
        .collection("users")
        .where("uid", "==", singalCardData?.myID)
        .get()
        .then((snapshot) => {
          var data: any = []
          snapshot.forEach((doc) => {
            data.push({ ...doc.data() });
          });

          getsamecard(data[0])
          console.log(data[0],"checkdata")
        }).catch((error) => {
          console.log(error, "error");
        });
    }
      
    if (singalCardData?.myID) {      
      getRewardTransactions(singalCardData?.myID)
    }

  }, [singalCardData])


  const getsamecard = (data: any) => {
    console.log(data, "sameCards i am every time calling")
    var commonCard = {}
    // @ts-ignore
    const allCards = data?.rewardStatistics?.cards
    allCards?.map((item: any, index: number) => {
      // @ts-ignore
      commonCard = { ...commonCard, [item]: (commonCard[item] ? commonCard[item] + 1 : 1) }
    })
    console.log(commonCard, "commonCard")
    setSameCards(commonCard)
  }


  const getRewardTransactions = (myID:any) => {    
    const allTimeData = firebase
    .firestore()
    .collection("reward_transactions")
      .where("user", "==", myID)
    allTimeData.get()
      .then((doc: any) => {
        var AllSameCard:any =[]
      doc.forEach((cards: any, index: number) => {
        // winCards.push(cards.data().)
        if (cards.data()?.winData?.firstRewardCardId == singalCardData.id) {          
          const date = new Date(cards.data()?.transactionTime.seconds * 1000);
          var getMIntedTime = date.toLocaleString()
          AllSameCard.push({ ...cards.data(), getMIntedTime: getMIntedTime })
          
        }
      })        
        setAllCardList(AllSameCard)
        // console.log(AllSameCard,"AllSameCard")
    })
    .catch((error: any) => {
      console.log("getAllRewardsOfUser Error", error)
    })
  }

  console.log(allCardList,"allCardList")
  return (
    <div className=''>
      <div className='h-100 '>


        <CenterItem className="">
          {/* <div className="text-center">
            <p>{cards.cardType}</p>
          </div> */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0px 0px 87px 0px",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
            }}>
            <SummerCard>
              {/* {nftAlbumData?.map((items:any, index:number) => {
              return ( */}
              <div className=''
                style={{ width: `${window.screen.width < 767 ? "70%" : "38%"}` }}
              >
                {/* @ts-ignore */}

                {/* @ts-ignore */}
                {/* {items?.cards.map((item: any) => {
                      if (item?.cardId == id) {                        
                        return ( */}
                <>
                  <NftOneCard
                    DivClass={singalCardData?.cardType}
                    HeaderText={singalCardData?.cardType}
                    HeaderClass={`${singalCardData?.cardType}_text`}
                    Serie={singalCardData?.setName}
                    BackCardName={singalCardData?.cardName}
                    Rarity={singalCardData?.cardType}
                    CollectionType={singalCardData?.albumName}
                    Quantity={singalCardData?.quantity}
                    holderNo={singalCardData?.noOfCardHolders}
                    cardNo={`${((singalCardData?.cardName)?.toUpperCase())?.slice(0, 2) + (singalCardData?.id)?.slice(0, 2)}`}
                    // GeneralSerialNo={`${((type)?.toUpperCase())?.slice(0, 3) + ((singalCardData?.cardName)?.toUpperCase())?.slice(0, 3) + singalCardData?.cardId}`}
                    // GeneralSerialNo={singalCardData?.sno}
                    GeneralSerialNo={singalCardData?.sno && (singalCardData?.sno[0])?.replace(/[0-9]/g, '')}
                    // Disable={"CardDisebal"}
                    // When you pass CardDisebal this name then card is Disable
                    ShowQuantity={`${sameCards[singalCardData?.cardName] || 1}`}
                    cardHeader={`${singalCardData?.cardName}`}
                    // cardNo={`${singalCardData.cardNo}`}
                    id={singalCardData?.cardId}
                    BackSideCard={BackSideCard}
                    // flipCard={backCards == singalCardData.id ? true : false}
                    flipCard={backCards?.includes(singalCardData?.cardId)}
                    ImgUrl={singalCardData?.cardImageUrl || ""}
                    VideoUrl={singalCardData?.cardVideoUrl || ""}
                    darkTheme={true}
                    Hide360Icon={true}
                  />
                </>                
              </div >
            </SummerCard>
            <div className="d-flex justify-content-center  pt-2 pb-4">
              <Other onClick={() => {
                // navigate(-1);
                // setAlbumOpen(singalCardData?.albumName);
                navigate(`${singalCardData?.isFollower ? `/followerProfile/album?collectionName=${ singalCardData?.albumName}&cardName=${singalCardData?.cardName}` : `/profile/Album?collectionName=${singalCardData?.albumName}&cardName=${singalCardData?.cardName}`}`)
              }}>{translate("BACK TO COLLECTION")}</Other>
            </div>
          </div >
          <div>
            <div>
              <div className="text-center my-3">
                <span style={{
                  color: "black",
                  fontWeight: 500,
                  fontSize: "15px"
                }}>{"All Details of Card".toUpperCase()}</span>                
              </div>              
              <div
                className="d-flex align-items-center flex-column w-100"
                style={{
                  color: "gray",
                  // color: "#7456ff",
              }}> 
                {
                  allCardList?.map((item: any, index: number) => {
                    return (
                      <>
                        <div className="py-2 px-2 my-2 d-flex justify-content-between"
                          style={{                            
                            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                            borderRadius: "5px",
                            background:"white",
                            width:`${window.screen.width>767 ?"400px":"95%"}`
                        }}
                        >                        
                          <TextStyle className="py-1">
                        Serial no : {item?.winData?.firstRewardCardSerialNo}
                          </TextStyle>
                          <TextStyle className="py-1">
                          Time : {item?.getMIntedTime}
                        </TextStyle>
                        </div>                       
                      </>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </CenterItem >
      </div >
    </div >
  );
};

export default SingleCardDetails;


