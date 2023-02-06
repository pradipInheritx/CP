/** @format */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import MyCarousel from "../Components/Carousel/Carousel";
import NftOneCard from "./NftOneCard";


import "./styles.css";
import SwiperBar from "./SwiperBar";

const MenuBar = styled.div`
  background-color: #6352e8;
  margin-top:.2px ;
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
    
    display: inline-block;
    text-align: center;
    color: white;
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
  background-color: #f8f9fa;
overFlow-x:hidden;
  width:100%;
  
  & p {
    font-weight: 100;
    text-align: center;
    padding: 30px;
    font-size: 23px;
    color: #160133;
    text-transform: uppercase;
  }
`;
const SummerCard = styled.div`

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: #f8f9fa;

  & span {
  }
`;

const NFTGalleryType = () => {
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
      {
        id: 5,
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
      {
        id: 10,
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
      {
        id: 15,
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
      {
        id: 20,
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
      {
        id: 25,
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
  const [backCards, setBackCards] = useState("");
  const [checkCard, setcheckCard] = useState([
    { cardType: "Legendary" },
    { cardType: "Legendary" },
    { cardType: "Legendary" },
    { cardType: "Legendary" },
    { cardType: "Legendary" },
  ]);
  const [filterIndex, setfilterIndex] = useState(0);

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
    // @ts-ignore
    setBackCards(backCards == value ? "" : value);
    // backCards.length > 0  ? backCards.map((items, index) => {
    //   if (items == value) {
    //     // @ts-ignore
    //     backCards.splice(index,1)
    //   }
    //   else {
    //     // @ts-ignore
    //     // backCards.push(value)
    //     setBackCards([...backCards,value])
    //   }
    //   // @ts-ignore
    // }) : setBackCards([...backCards,value]);
  };

  const HandleFilterByInput = (value: string | number) => {
    // var allCard: any = cards;
    // var cardItem = allCard.map((item:any, index:number) => {
    //     item.map((subItme:any) => {
    //       Object.keys(subItme).filter((keyItem, index) => {
    //         if (subItme[keyItem].includes('CP')) {
    //           return subItme
    //         }
    //       });
    //     });
    //       });
    // console.log(cardItem,"cardItem")
    // setCardValue(allCard)
  };
  let params = useParams();
  const { name } = params;

  return (
    <div className=''>
      <div className='h-100 '>
        {/* <MenuBar className={`${window.screen.width<932?"SmallScreen":"BigScreen"} `}>
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
              {item.name}
            </button>
          );
        })}
      </MenuBar> */}

        <CenterItem>
          <div className='d-flex justify-content-center mt-5 flex-wrap '>
            <input
              type='text'
              onChange={(e) => {
                HandleFilterByInput(e.target.value);
              }}
              placeholder='Search...'
              className='py-2 mx-3 rounded border'
            />
            <div className={`${window.screen.width < 767 ? "py-3" : ""}`}>
              <select
                name='cars'
                id='cars'
                className='bg-white border rounded py-2'
              >
                <option value='volvo'>Select Collection</option>
                <option value='SUMMER'>SUMMER</option>
                <option value='saab'>WINTER</option>
              </select>
              <select
                name='cars'
                id='cars'
                className='bg-white border rounded mx-2 py-2'
              >
                <option value='volvo'>Select Type</option>
                <option value='Legendary'>Legendary</option>
                <option value='Rare'>Rare</option>
                <option value='Epic'>Epic</option>
                <option value='UNCommon'>UNCommon</option>
                <option value='Common'>Common</option>
              </select>
              <select
                name='cars'
                id='cars'
                className='bg-white border rounded py-2'
              >
                <option value='volvo'>Select Sets</option>
                <option value='volvo'>Card Type</option>
                <option value='saab'>Card NO.</option>
                <option value='mercedes'>Card Name</option>
                <option value='audi'>Collection</option>
              </select>
            </div>
          </div>
          <div>
            <p>{`${name}`} COLLECTION</p>
          </div>

          <SummerCard>
            {CardValue.map((items, index) => {
              return (
                <div className='w-100 m-auto mb-4 '>
                  {/* @ts-ignore */}
                  <SwiperBar>
                    {/* @ts-ignore */}
                    {items.map((item: any) => {
                      return (
                        <>
                          <NftOneCard
                            DivClass={item.cardType}
                            HeaderText={item.cardType}
                            HeaderClass={`${item.cardType}_text`}
                            Disable={""} // When you pass CardDisebal this name then card is Disable
                            cardHeader={`${item.cardHeader}`}
                            cardNo={`${item.cardNo}`}
                            id={item.id}
                            BackSideCard={BackSideCard}
                            flipCard={backCards == item.id ? true : false}
                          />
                        </>
                      );
                    })}
                  </SwiperBar>
                </div>
              );
            })}
          </SummerCard>
          {/* <div>
            <p>WINTER COLLECTION</p>
          </div>
          <SummerCard>
            {CardValue.map((items, index) => {
              return (
                <div className='w-100 m-auto mb-4'>
                  <SwiperBar>
                    
                    {items.map((item: any) => {
                      return (
                        <>
                          <NftOneCard
                            DivClass={item.cardType}
                            HeaderText={item.cardType}
                            HeaderClass={`${item.cardType}_text`}
                            Disable={""} 
                            cardHeader={`${item.cardHeader}`}
                            cardNo={`${item.cardNo}`}
                            id={item.id}
                            BackSideCard={BackSideCard}
                            flipCard={backCards == item.id ? true : false}
                          />
                        </>
                      );
                    })}
                  </SwiperBar>
                </div>
              );
            })}
          </SummerCard> */}
        </CenterItem>
      </div>
    </div>
  );
};

export default NFTGalleryType;
