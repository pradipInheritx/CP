/** @format */

import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import MyCarousel from "../Components/Carousel/Carousel";
import AppContext from "../Contexts/AppContext";
import NftOneCard from "./NftOneCard";
import { db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import firebase from "firebase/compat";

import "./styles.css";
import SwiperBar from "./SwiperBar";
import { Other } from "./SingleCoin";

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
//     const { nftAlbumData,setNftAlbumData} = useContext(AppContext);
  
  const [menuItem, setMenuItem] = useState([
    { name: "View All" },
    { name: "Common" },
    { name: "UnCommon" },
    { name: "Epic" },
    { name: "Rare" },
    { name: "Legendary" },
  ]);
  const [allCard, setAllCard] = useState<any>([])
  const [searchedCard, setSearchedCard] = useState<any>([])
  const [searchTerm, setSearchTerm] = useState<any>('')
  const [cardType,setCardType]=useState<any>('all')
  const [allCardArray,setAllCardArray]=useState<any>([])
    const [nftAlbumData,setNftAlbumData] = useState<any>();
  const [CardValue, setCardValue] = useState([]);
  const [equalPart, setEqualPart] = useState<any>([]);
  const [backCards, setBackCards] = useState<any>([]);
  const [cardShow, setCardShow] = useState<any>(false);
  
  const BackSideCard = (value: string | number) => {
    // @ts-ignore
     let allBackCard = backCards;
     // @ts-ignore
     // setBackCards(backCards == value ? "" : value);
     backCards.length > 0
       ? backCards?.map((items: any, index: number) => {
           if (items == value) {
             // @ts-ignore
             allBackCard.splice(index, 1);
             setBackCards(allBackCard);
           } else {
             // @ts-ignore

             setBackCards([...backCards, value]);
           }
           // @ts-ignore
         })
       : setBackCards([...backCards, value]);
  };
  let params = useParams();
  const { type } = params;


  //  const getNftCard = () => {
  // const getCards = firebase
  //           .firestore()
  //           .collection("nft_gallery")
  //   getCards.get()
  //     .then((snapshot) => {        
  
  //      let allcollection= snapshot.docs.map((doc) => doc.data())
  //         // setCollectionType(allcollection)
  
  //       allcollection?.map((card) => {

  //         if (card?.collectionName==type) {
  //           setNftAlbumData(card?.setDetails)
  //         }          
  //       })
  //     }).catch((error) => {
  //       console.log(error,"error");
  //     })
  //     ;    
  //  }
  
const onCollectionChange=()=>{ 
  
  const getCollectionType = firebase
  .firestore()
  .collection("nft_gallery")
  .where("collectionName", "==", type)
getCollectionType.get()
.then((snapshot) => {        

const data:any=[]
snapshot.forEach((doc) => {
data.push({id: doc.id, ...doc.data()});
});
setAllCardArray(data)
const cards: any = [];
  data.forEach((element: any) => {
    
    const collectionId = element.collectionId;
    const collectionName = element.collectionName;
    const collectionDocId = element.id;

    element.setDetails.forEach((setDetail: any) => {
      const setId = setDetail.id;
      const setName = setDetail?.name;
      setDetail.cards.forEach((cardDetail: any) => {
        cards.push({collectionId, collectionName, collectionDocId, setId,setName, ...cardDetail});
      });
    });
  });
  setAllCard(cards)


}).catch((error) => {
console.log(error,"error");
});    
  
}
  const onSearch = (searchTerm: any) => {
    if (searchTerm?.length) {
    setCardShow(true)
  }
  else {
    setCardShow(false)
  }
  setSearchTerm(searchTerm)
  if(cardType==='all') setSearchedCard(allCard.filter((card:any)=>card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))
  else setSearchedCard(allCard.filter((card:any)=>card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) && card.type==cardType.toUpperCase()))
}
  
  const onSelectType=(cardType:any)=>{
  setCardType(cardType)
  
  if(cardType==='all') setSearchedCard(allCard.filter((card:any)=>card.type!=cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))
  else {
    setCardShow(true)
    setSearchedCard((prev:any)=>allCard.filter((card:any)=>card.type===cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))}
}
  
useEffect(() => {  
  onCollectionChange()  
}, [])
useEffect(() => {
  // getNftCard()
  // onCollectionChange(type)
  onSearch(searchTerm)
  onSelectType(cardType)
}, [allCard])
  
  function sliceDived(arr: any, partSize: any) {
    const res = [];
    for (let i = 0; i < arr.length; i += partSize) {
        const DivideEqual = arr.slice(i, i + partSize);
        res.push(DivideEqual);
    }  
  setEqualPart(res)
  
}
  
useEffect(() => {
    if (searchedCard?.length > 0) {      
      sliceDived(searchedCard, 4)
}
  },[searchedCard])
  


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
          {/* <div className="d-flex justify-content-center align-items-center  pt-4">
                <Link to="/nftAlbum" style={{textDecoration:'none'}}>
                  <Other>{"Back to all Card"}</Other>
                </Link>
              </div> */}
          <div className='d-flex justify-content-center pt-5 flex-wrap '>
            <input
              type='text'
              name="hello"
              onChange={e =>onSearch(e.target.value)}
              // onChange={(e)=>{HandelonchangeFilter(e)}}
              placeholder='Search...'
              className='py-2 mx-3 rounded border'
              // style={{ width: "200px" }}              
            />
            <div className={`${window.screen.width < 767 ? "" : ""}`}>              
              <select
                name='type'
                id='type'
                className='bg-white border rounded mx-2 py-2'
                onChange={(e)=>{onSelectType(e.target.value)}}
              >
                <option value='all'>Select Type</option>
                <option value='Legendary'>Legendary</option>
                <option value='Rare'>Rare</option>
                <option value='Epic'>Epic</option>
                <option value='UNCommon'>UNCommon</option>
                <option value='Common'>Common</option>
              </select>
              {/* <select
                name='cars'
                id='cars'
                className='bg-white border rounded py-2'
              >
                <option value='volvo'>Select Sets</option>
                
                <option value='saab'>Card NO.</option>
                <option value='mercedes'>Card Name</option>
                
              </select> */}
            </div>
          </div>
          <div>
            <p>{`${type}`} COLLECTION</p>
          </div>        
          {searchedCard?.length > 0 ? <SummerCard className="">
            {equalPart?.map((cardPart: any ,ind:number) => {
              return <div className='w-100 m-auto mb-4' key={ind}>
                <SwiperBar>
                  {cardPart?.map((item: any ,index:number) => {
                    return (
                      <NftOneCard
                        key={index}
                        DivClass={item?.type}
                        HeaderText={item?.type}
                        HeaderClass={`${item?.type}_text`}
                        Serie={item?.setName}
                        BackCardName={item?.name}
                        Rarity={item?.type}
                        Quantity={item?.quantity}
                        holderNo={item?.noOfCardHolders}
                        cardNo={`${((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
                        GeneralSerialNo={`${((item.collectionName)?.toUpperCase())?.slice(0, 3) + ((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
                        userId={item?.setId}
                        CollectionType={item?.collectionName}
                        // Disable={"CardDisebal"}                            
                        cardHeader={`${item?.name}`}
                        id={item?.cardId}
                        BackSideCard={BackSideCard}
                        fulldata={item}
                        flipCard={backCards?.includes(item?.cardId)}
                      />
                    );
                  })}
                </SwiperBar>
              </div>
            })}
          </SummerCard> :
            <div className="d-flex justify-content-center">
              {cardShow == true ? <p style={{
                color: "black",
                fontSize:"14px"
              }}>Data Not Found</p> : ""}
            </div>}
        </CenterItem>
      </div>
    </div>
  );
};

export default NFTGalleryType;
