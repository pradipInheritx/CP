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
    opacity: 0.4;
    font-weight: 100;
 
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
      { cardType: "Common" },
      { cardType: "Common" },
      { cardType: "Common" },
      { cardType: "Common" },
      { cardType: "Common" },
    ],
    [
      { cardType: "UNCommon" },
      { cardType: "UNCommon" },
      { cardType: "UNCommon" },
      { cardType: "UNCommon" },
      { cardType: "UNCommon" },
    ],
    [
      { cardType: "Epic" },
      { cardType: "Epic" },
      { cardType: "Epic" },
      { cardType: "Epic" },
      { cardType: "Epic" },
    ],
    [
      { cardType: "Rare" },
      { cardType: "Rare" },
      { cardType: "Rare" },
      { cardType: "Rare" },
      { cardType: "Rare" },
    ],

    [
      { cardType: "Legendary" },
      { cardType: "Legendary" },
      { cardType: "Legendary" },
      { cardType: "Legendary" },
      { cardType: "Legendary" },
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
  const [filterIndex, setfilterIndex] = useState();

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

  return (
    <div className="d-flex flex-column">
    <div className='h-100 '>
      <MenuBar className={`${window.screen.width<932?"SmallScreen":"BigScreen"}`}>
        {menuItem.map((item, index) => {
          return (
            <button
              key={index}
              onClick={(e) => {
                {/* @ts-ignore */}
                setfilterIndex(index);
              }}
            >
              {" "}
              {item.name}
            </button>
          );
        })}
      </MenuBar>
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
        <Slider {...settings}>
           {/* @ts-ignore */}
            {items.map((item:any) => {
              return <>                
                <NftOneCard                      
                      DivClass={item.cardType}
                      HeaderText={item.cardType}
                      HeaderClass={`${item.cardType}_text`}
                      Disable={""} // When you pass CardDisebal this name then card is Disable
                    //   width={`${window.screen.width > 979 ? "217px" :"250px"}`}
                    />
              </>
          })}
        </Slider>
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
