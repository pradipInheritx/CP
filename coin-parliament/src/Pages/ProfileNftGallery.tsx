/** @format */

import React, { useEffect, useState } from "react";
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

const ProfileNftGallery = () => {
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
  const [checkCard, setcheckCard] = useState([
      { cardType: "Legendary" },
      { cardType: "Legendary" },
      { cardType: "Legendary" },
      { cardType: "Legendary" },
    { cardType: "Legendary" },
  ]);
  const [filterIndex, setfilterIndex] = useState(0);
  const [backCards, setBackCards] = useState("");

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
    // const settings = {
    //   className: "center",
    //   centerMode: true,
    //   infinite: true,
    //   centerPadding: "60px",
    //   slidesToShow: 4,
    //   speed: 500
    // };
  var settings = {
      
      dots: true,
    // infinite: false,
    //   centerMode: true,
    //   speed: 500,
    //   slidesToShow: 5,
    //   slidesToScroll: 4,
    // initialSlide: 0,
    //   prevArrow: false,
    //   nextArrow: false,
      className: "center",
      centerMode: true,
      infinite: true,
      
      slidesToShow: 5,
      speed: 500,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
            infinite: true,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,            
            className: "center",
            centerMode: true,
            infinite: true,
            
          }
        }
      ]
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
  
  
  return (
    <div className="">
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
              {item.name}
            </button>
          );
        })}
      </MenuBar> */}
      <CenterItem>              
        <div >
          <p>SUMMER COLLECTION</p>
        </div>

        <SummerCard>
          {CardValue.map((items, index) => {
            return (             
              <div className="m-auto mb-4"
                    style={{
                        width: "100%",
                        }}
              >        
              {/* @ts-ignore */}
        <SwiperBar>
           {/* @ts-ignore */}
            {items.map((item:any) => {
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
      </CenterItem>
      </div>
    </div>
  );
};

export default ProfileNftGallery;
