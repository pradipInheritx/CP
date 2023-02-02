/** @format */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
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

const NFTGallery = () => {
  const [cards, setCards] = useState([
    [
      { cardType: "Common",cardNo:"CP244",cardHeader:"INVESTOR" },
      { cardType: "Common" ,cardNo:"CP244",cardHeader:"INVESTOR" },
      { cardType: "Common" ,cardNo:"CP244",cardHeader:"INVESTOR" },
      { cardType: "Common" ,cardNo:"CP244",cardHeader:"INVESTOR" },
      { cardType: "Common" ,cardNo:"CP244",cardHeader:"INVESTOR" },
    ],
    [
      { cardType: "UNCommon" ,cardNo:"CP245",cardHeader:"INVESTOR"  },
      { cardType: "UNCommon",cardNo:"CP245",cardHeader:"INVESTOR"  },
      { cardType: "UNCommon" ,cardNo:"CP245",cardHeader:"INVESTOR" },
      { cardType: "UNCommon" ,cardNo:"CP245",cardHeader:"INVESTOR" },
      { cardType: "UNCommon" ,cardNo:"CP245",cardHeader:"INVESTOR" },
    ],
    [
      { cardType: "Epic" ,cardNo:"CP246",cardHeader:"INVESTOR" },
      { cardType: "Epic" ,cardNo:"CP246",cardHeader:"INVESTOR" },
      { cardType: "Epic" ,cardNo:"CP246",cardHeader:"INVESTOR" },
      { cardType: "Epic",cardNo:"CP246",cardHeader:"INVESTOR"  },
      { cardType: "Epic" ,cardNo:"CP246",cardHeader:"INVESTOR" },
    ],
    [
      { cardType: "Rare" ,cardNo:"CP248",cardHeader:"INVESTOR" },
      { cardType: "Rare" ,cardNo:"CP248",cardHeader:"INVESTOR" },
      { cardType: "Rare" ,cardNo:"CP248",cardHeader:"INVESTOR" },
      { cardType: "Rare" ,cardNo:"CP248",cardHeader:"INVESTOR" },
      { cardType: "Rare" ,cardNo:"CP248",cardHeader:"INVESTOR" },
    ],

    [
      { cardType: "Legendary",cardNo:"CP240",cardHeader:"INVESTOR"  },
      { cardType: "Legendary",cardNo:"CP240",cardHeader:"INVESTOR"  },
      { cardType: "Legendary",cardNo:"CP240",cardHeader:"INVESTOR"  },
      { cardType: "Legendary",cardNo:"CP240",cardHeader:"INVESTOR"  },
      { cardType: "Legendary",cardNo:"CP240",cardHeader:"INVESTOR"  },
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

  const HandleFilterByInput = (value:string|number) => {
    var allCard: any = cards;
    
      allCard.filter((item: any, ind: number) => {
        if (item.cardNo.includes(value)) {
          var cardItem: any = [item];
          // setCardValue(cardItem);
          console.log(cardItem,"cardItem")
        }
      });
    
  }

  return (
    <div className="">
    <div className='h-100 ' >
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
        <div className="d-flex justify-content-center mt-5"><input type="text" onChange={(e)=>{HandleFilterByInput(e.target.value)}} /></div>  
        <div>
          <p>SUMMER COLLECTION</p>
        </div>

        <SummerCard>
          {CardValue.map((items, index) => {
            return (             
              <div className="w-100 m-auto mb-4"
              
              > 
                {/* @ts-ignore */}
                <SwiperBar >
                  {/* @ts-ignore */}
            {items.map((item:any) => {
              return <>                
                <NftOneCard                      
                      DivClass={item.cardType}
                      HeaderText={item.cardType}
                      HeaderClass={`${item.cardType}_text`}
                  Disable={""} // When you pass CardDisebal this name then card is Disable
                  cardHeader={`${item.cardHeader}`}
                  cardNo={`${item.cardNo}`}
                    />
              </>
          })}
        </SwiperBar>
      </div>
            );
          })}
        </SummerCard>
        <div>
          <p>WINTER COLLECTION</p>
        </div>
        <SummerCard>
          {CardValue.map((items, index) => {
            return (
              <div className="w-100 m-auto mb-4">
        {/* @ts-ignore */}
                <SwiperBar >
                  {/* @ts-ignore */}
            {items.map((item:any) => {
              return <>                
                <NftOneCard                      
                  DivClass={item.cardType}
                  HeaderText={item.cardType}
                  HeaderClass={`${item.cardType}_text`}
                  cardHeader={`${item.cardHeader}`}
                  cardNo={`${item.cardNo}`}
                />
              </>
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

export default NFTGallery;
