/** @format */

import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import MyCarousel from "../Components/Carousel/Carousel";
import NftOneCard from "./NftOneCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./styles.css";
import { Container } from "react-bootstrap";
import SwiperBar from "./SwiperBar";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import firebase from "firebase/compat";
import UserContext from "../Contexts/User";

const MenuBar = styled.div`
  background-color: #6352e8;
  margin-top:2px;
  overflow: auto;
  overflow: scroll;
  white-space: nowrap;
  -ms-overflow-style: none;
  scrollbar-width: none;
width:100%;
  &::-webkit-scrollbar {
    display: none;
  }
  & button {
    background-color: #6352e8;
    border: none;
    color: #fff;
    display: inline-block;
    text-align: center;    
    font-weight: 100;
    &.ActiveColor{
      opacity: 1;
    }
  &.TextColor{
      opacity: 0.40;
    }
 
  }
  &.SmallScreen{
    & button{
      padding: 5px 18px;
      font-size: 9px;
    }
  }
  &.BigScreen{
    
    & button{
    padding: 5px 40px;
    font-size: 12px;
    }
  }
`;
const CenterItem = styled.div`
overFlow-x:hidden;
 
  width:100%;
  & p {
    font-weight: 100;
    text-align: center;
    padding: 30px;
    font-size: 23px;
    color: #6352E8;
    text-transform: uppercase;
  }
`;
const SummerCard = styled.div`
width:100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: #d9d9d9;

  & span {
  }
`;


const ProfileNftGalleryType = () => {
  const { user } = useContext(UserContext);
  const [cards, setCards] = useState([
    [
      {
        id: 1,
        cardType: "Common",
        cardNo: "CP244",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 2,
        cardType: "Common",
        cardNo: "CP244",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 3,
        cardType: "Common",
        cardNo: "CP244",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 4,
        cardType: "Common",
        cardNo: "CP244",
        cardHeader: "INVESTOR",
        type: "WINTER",
      },      
    ],
    [
      {
        id: 6,
        cardType: "UNCommon",
        cardNo: "CP245",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 7,
        cardType: "UNCommon",
        cardNo: "CP245",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 8,
        cardType: "UNCommon",
        cardNo: "CP245",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 9,
        cardType: "UNCommon",
        cardNo: "CP245",
        cardHeader: "INVESTOR",
        type: "WINTER",
      },      
    ],
    [
      {
        id: 11,
        cardType: "Epic",
        cardNo: "CP246",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 12,
        cardType: "Epic",
        cardNo: "CP246",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 13,
        cardType: "Epic",
        cardNo: "CP246",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 14,
        cardType: "Epic",
        cardNo: "CP246",
        cardHeader: "INVESTOR",
        type: "WINTER",
      },      
    ],
    [
      {
        id: 16,
        cardType: "Rare",
        cardNo: "CE248",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 17,
        cardType: "Rare",
        cardNo: "CE248",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 18,
        cardType: "Rare",
        cardNo: "CE248",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 19,
        cardType: "Rare",
        cardNo: "CE248",
        cardHeader: "INVESTOR",
        type: "WINTER",
      },    
    ],

    [
      {
        id: 21,
        cardType: "Legendary",
        cardNo: "CP120",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 22,
        cardType: "Legendary",
        cardNo: "CP120",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 23,
        cardType: "Legendary",
        cardNo: "CP120",
        cardHeader: "INVESTOR",
        type: "SUMMER",
      },
      {
        id: 24,
        cardType: "Legendary",
        cardNo: "CP120",
        cardHeader: "INVESTOR",
        type: "WINTER",
      },      
    ],
  ]);
  const [menuItem, setMenuItem] = useState([
    { name: "View All" },
    { name: "Common" },
    { name: "UnCommon" },
    { name: "Epic" },
    { name: "Rare" },
    { name: "Legendary" },
  ]);

  const [CardValue, setCardValue] = useState([]);
  const [checkCard, setcheckCard] = useState([
    { cardType: "Legendary" },
    { cardType: "Legendary" },
    { cardType: "Legendary" },
    { cardType: "Legendary" },
    { cardType: "Legendary" },
  ]);
  const [filterIndex, setfilterIndex] = useState(0);
  const [backCards, setBackCards] = useState<any>([]);
  const [winerCard, setWinerCard] = useState<any>([]);



  
//   useEffect(() => {
//   //  onSnapshot(doc(db, "nft_gallery","WINTER"), (doc) => {
//   //     // setLeaders((doc.data() as { leaders: Leader[] })?.leaders || []);
//   //     console.log("nft_gallery", doc.data());
//   //   });
//   // getNftCard();
// }, [])
  
  useEffect(() => {
    HandleFilter(filterIndex);
  }, [filterIndex]);

  const HandleFilter = (filterIndex?: number | string | undefined) => {
    var allCard: any = cards;
    if (filterIndex && filterIndex > 0) {
      allCard.filter((item: any, ind: number) => {
        if (ind + 1 == filterIndex) {
          var cardItem: any = [item];
          setCardValue(cardItem);
        }
      });
    } else {
      setCardValue(allCard);
    }
  };  
  const BackSideCard = (value: string | number) => {
    let allBackCard = backCards;
    // @ts-ignore
    // setBackCards(backCards == value ? "" : value);
    backCards.length > 0  ? backCards?.map((items:any, index:number) => {
      if (items == value) {
        // @ts-ignore
        allBackCard.splice(index, 1);
        setBackCards(allBackCard);
      }
      else {
        // @ts-ignore
        
        setBackCards([...backCards,value])
      }
      // @ts-ignore
    }) : setBackCards([...backCards,value]);
  };

      let params = useParams();
  const { type } = params;
console.log(type,"type")
  const [nftAlbumData,setNftAlbumData] = useState<any>();

     const getNftCard = () => {
  const getCards = firebase
            .firestore()
            .collection("nft_gallery")
    getCards.get()
      .then((snapshot) => {                
       let allcollection= snapshot.docs.map((doc) => doc.data())        
        console.log(allcollection,"allcollection")
        allcollection?.map((card) => {
          if (card?.collectionName==type) {
            setNftAlbumData(card?.setDetails)
          }          
        })
      }).catch((error) => {
        console.log(error,"error");
      })
      ;    
     }
  
  
  const getAllRewardsOfUser = async (uid: string) => {
  // console.log("getAllRewardsOfUser")
  var winCards: {
    firstRewardCard: string,
    firstRewardCardCollection: string,
    firstRewardCardId: number,
    firstRewardCardSerialNo : string,
    firstRewardCardType : string,
    secondRewardExtraVotes : number,
    thirdRewardDiamonds : number
    
  }[] = []
   await firebase
  .firestore()
    .collection("reward_transactions")
    .where("user", "==", uid)
    .get()
    .then((doc:any) => {
      // console.log("getAllRewardsOfUser",doc)
      doc.forEach((cards:any,index:number) => {
        // console.log("getAllRewardsOfUser -- ",cards.data())
        // winCards.push(cards.data().)
        winCards.push({...cards.data().winData ,...cards.data().transactionTime})
        
      })
    })
    .catch((error:any) => {
      console.log("getAllRewardsOfUser Error", error)
    })
  // console.log("winCardsgetAllRewardsOfUser",winCards)
   setWinerCard(winCards)
}

useEffect(() => {
  getNftCard()
   getAllRewardsOfUser(`${user?.uid}`)
  
  }, [params])

  const CheckCardDisable = (cardId: any) => {   
  var disableCard;
  console.log('winCard?.firstRewardCardId',winerCard)
  let cardTrue = winerCard?.find((winCard: any, index: number) =>
  {

    if (winCard?.firstRewardCardId != cardId) {
      
      disableCard = "CardDisebal"       
      return false
    }
    if (winCard?.firstRewardCardId == cardId) {
      
      disableCard = undefined
      return true
    }
    
  })
    
      
    return disableCard
  }
  

  const getMintedTime = (cardId: any) => {
    var getMIntedTime;
      let  mintedTime= winerCard?.find((winCard:any,index:number) => {
        if (winCard?.firstRewardCardId == cardId) {
              const date = new Date(winCard?.seconds*1000);
          getMIntedTime = date.toLocaleString()
          return true
              }            
          })
          return getMIntedTime 
  }
  
  const getPriSerialNo = (cardId: any) => {
    var seriaNo;
      let  PriSerialNo= winerCard?.find((winCard:any,index:number) => {
        if (winCard?.firstRewardCardId == cardId) {              
               seriaNo= winCard?.firstRewardCardSerialNo
                return "hello"
            }            
          })
          return seriaNo    
  }
 
  return (
    <div className=''>
      <div className='h-100 '>
        {/* <MenuBar className={`${window.screen.width<932?"SmallScreen":"BigScreen"}`}>
        {menuItem.map((item, index) => {
          return (
            <button
              key={index}
              className={`${filterIndex==index? "ActiveColor":"TextColor"}`}
              onClick={(e) => {
                
                setfilterIndex(index);
              }}
            >
              {" "}
              {item.type}
            </button>
          );
        })}
      </MenuBar> */}
        <CenterItem>
          <div>
            <p>{type} COLLECTION</p>
          </div>
            <SummerCard>
            {nftAlbumData?.map((items: any, index: number) => {
              
              return (
                <div className='w-100 m-auto mb-4 '>
                  {/* @ts-ignore */}
                  <SwiperBar>
                    {/* @ts-ignore */}
                    {items?.cards.map((item: any) => {
                   
                      return (
                        <>
                          <NftOneCard                            
                            DivClass={item?.type}
                            HeaderText={item?.type}
                            HeaderClass={`${item?.type}_text`}
                            Serie={items?.name}
                            BackCardName={item?.name}
                            Rarity={item?.type}
                            Quantity={item?.quantity}
                            holderNo={item?.noOfCardHolders}
                            MintedTime={getMintedTime(item?.cardId)}
                            PrivateSerialNo={getPriSerialNo(item?.cardId)}
                            // MintedTime={CheckCardDisable({WorkType:"CardDisable", cardId:item.cardId})
                            // Serice={item.name}
                            // CardName={item.cards.name}
                            
                            Disable={winerCard.length?CheckCardDisable(item?.cardId):'CardDisebal'}
                            // Disable={"CardDisebal"}
                            
                            // When you pass CardDisebal this name then card is Disable
                            cardHeader={`${item?.name}`}
                            cardNo={`${((items?.name)?.toUpperCase())?.slice(0, 3) + items?.id}`}
                            id={item?.cardId}
                            BackSideCard={BackSideCard}
                            // flipCard={backCards == item.id ? true : false}
                            flipCard={backCards.includes(item?.cardId)}
                          />
                        </>
                      );
                    })}
                  </SwiperBar>
                </div>
              );
            })}
          </SummerCard>


          {/* <SummerCard>
            {CardValue.map((items, index) => {
              return (
                <div
                  className='m-auto mb-4'
                  style={{
                    width: "100%",
                  }}
                >
                   */}

                  {/* <SwiperBar>
                    
                    {items.map((item: any) => {
                      return (
                        <>
                          <NftOneCard
                            DivClass={item.cardType}
                            HeaderText={item.cardType}
                            HeaderClass={`${item.cardType}_text`}
                            Disable={""} // When you pass CardDisebal this name then card is Disable
                            //   width={`${window.screen.width > 979 ? "217px" :"250px"}`}
                            cardHeader={`${item.cardHeader}`}
                            cardNo={`${item.cardNo}`}
                            id={item.id}
                            BackSideCard={BackSideCard}
                            flipCard={backCards.includes(item.id)}
                          />
                        </>
                      );
                    })}
                  </SwiperBar> */}
                {/* </div>
              );
            })}
          </SummerCard> */}
        </CenterItem>
      </div>
    </div>
  );
};

export default ProfileNftGalleryType;
