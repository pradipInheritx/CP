/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import MyCarousel from "../Components/Carousel/Carousel";

import NftOneCard from "./NftOneCard";


import "./styles.css";
import SwiperBar from "./SwiperBar";
import firebase from "firebase/compat";


const GalleryType = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content:space-around;
  color: black;
  & div {
    border: 1px solid #5f4ce3;
    margin: 50px 10px;
    cursor:pointer;
    padding: 20px 20px;
    $ p {
    }
  }
`;
const SummerCard = styled.div`

  display: flex;
  justify-content: center;
  // border:1px solid red;
  flex-wrap: wrap;
  background-color: #f8f9fa;

  
`;
const NFTGallery = () => {
  const navigate = useNavigate();
  const [collectionType, setCollectionType] = useState<any>()
  const [allTypeofCard, setAllTypeofCard] = useState<any>([])
  const [allCardArray,setAllCardArray]=useState<any>([])
  const [searchedCard,setSearchedCard]= useState<any>([])
  const [allCard,setAllCard]=useState<any>([])
  const [cardType,setCardType]=useState<any>('all')
  const [searchTerm,setSearchTerm]=useState<any>('')
  const [collection, setCollection] = useState<any>()
  const [backCards, setBackCards] = useState<any>([]);
  const [equalPart, setEqualPart] = useState<any>([]);
    const getNftCard = () => {
  const getCollectionType = firebase
            .firestore()
            .collection("nft_gallery")
    getCollectionType.get()
      .then((snapshot) => {        
        // console.log("snapshot.docs",snapshot.docs.map((doc) => doc.data()));
       let allcollection= snapshot.docs.map((doc) => doc.data())
        setCollectionType(allcollection)
        
        allcollection?.map((allcolloection: any) => {
          setAllTypeofCard([...allTypeofCard,allcolloection]) 
          const data:any=[]
          snapshot.forEach((doc) => {    
    data.push({id: doc.id, ...doc.data()});
  });
  setAllCardArray(data)
  // console.log("Array", allCardArray);
  const cards: any = [];
  data.forEach((element: any) => {
    console.log("Element =>", element);
    const collectionId = element.collectionId;
    const collectionName = element.collectionName;
    const collectionDocId = element.id;

    element.setDetails.forEach((setDetail: any) => {
      const setId = setDetail.id;
      const setName = setDetail?.name;
      console.log(setDetail,"setDetail")
      setDetail.cards.forEach((cardDetail: any) => {
        cards.push({collectionId, collectionName, collectionDocId, setId,setName, ...cardDetail});
      });
    });
  });
  setAllCard(cards)
          // allcolloection?.map((allcard:any) => {
          //  setAllTypeofCard([...allTypeofCard,allcard]) 
          // })
          
        })

        // setAllTypeofCard

        // console.log(allcollection,"allcollection")
        
      }).catch((error) => {
        console.log(error,"error");
      })
      ;    
}
const onSearch=(searchTerm:any)=>{
  setSearchTerm(searchTerm)
  if(cardType==='all') setSearchedCard(allCard.filter((card:any)=>card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))
  else setSearchedCard(allCard.filter((card:any)=>card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) && card.type!=cardType.toUpperCase()))
}
const onCollectionChange=(collectionName:any)=>{
  if(collectionName==='none') {
    const getCollectionType = firebase
  .firestore()
  .collection("nft_gallery")
getCollectionType.get()
.then((snapshot) => {        
// console.log("snapshot.docs",snapshot.docs.map((doc) => doc.data()));
const data:any=[]
snapshot.forEach((doc) => {
data.push({id: doc.id, ...doc.data()});
});
setAllCardArray(data)
const cards: any = [];
  data.forEach((element: any) => {
    console.log("Element =>", element);
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
console.log("nft_gallery", data);
}).catch((error) => {
console.log(error,"error");
});    
  }
  else{
  const getCollectionType = firebase
  .firestore()
  .collection("nft_gallery")
  .where("collectionName", "==", collectionName)
getCollectionType.get()
.then((snapshot) => {        
// console.log("snapshot.docs",snapshot.docs.map((doc) => doc.data()));
const data:any=[]
snapshot.forEach((doc) => {
data.push({id: doc.id, ...doc.data()});
});
setAllCardArray(data)
const cards: any = [];
  data.forEach((element: any) => {
    console.log("Element =>", element);
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
console.log("Array", data);

}).catch((error) => {
console.log(error,"error");
});    }
}
const onSelectType=(cardType:any)=>{
  setCardType(cardType)
  
  if(cardType==='all') setSearchedCard(allCard.filter((card:any)=>card.type!=cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))
  else{setSearchedCard(
    (prev:any)=>allCard.filter((card:any)=>card.type===cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))}
}
useEffect(() => {
    getNftCard()
  }, [])
  useEffect(() => {
   onSearch(searchTerm)
   onSelectType(cardType)
  }, [allCard])
     
  
  console.log("searchedcard",searchedCard,searchedCard?.length);
// use searched card for showing searchdata
  
  
  const BackSideCard = (value: string | number) => {
    // @ts-ignore
     let allBackCard = [...backCards];
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
  // console.log(collectionType, "collectionType")
  
function sliceDived(arr:any, partSize:any) {
    const res = [];
    for (let i = 0; i < arr.length; i += partSize) {
        const DivideEqual = arr.slice(i, i + partSize);
        res.push(DivideEqual);
    }
    // return res;
  // console.log(res,"res")
  setEqualPart(res)
  
}

  useEffect(() => {
    if (searchedCard?.length > 0) {      
      sliceDived(searchedCard, 4)
}
  },[searchedCard])
// const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// console.log(,"sliceDived");



  return (
    <div className='' style={{ background: "white", minHeight: "80vh" }}>

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
            <div className={`${window.screen.width < 767 ? "py-3" : ""}`}>
              <select
                name='cars'
                id='cars'
                className='bg-white border rounded py-2'
                onChange={e=>onCollectionChange(e.target.value)}
              >
            <option value='none'>Select Collection</option>
            

            {collectionType?.map((data:any) => {
              return  <option value={data?.collectionName}>{data?.collectionName}</option>
        
        })}
                {/* <option value='Summer'>SUMMER</option>
                <option value='Winter'>WINTER</option>
                <option value='Monsoon'>Monsoon</option> */}
              </select>
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
              <select
                name='cars'
                id='cars'
                className='bg-white border rounded py-2'
              >
                <option value='volvo'>Select Sets</option>
                {/* <option value='volvo'>Card Type</option> */}
                <option value='saab'>Card NO.</option>
                <option value='mercedes'>Card Name</option>
                {/* <option value='audi'>Collection</option> */}
              </select>
            </div>
          </div>

      <GalleryType className='' style={{width:`${window.screen.width >787 ? "800px":"100%"}`}} >
        {/* <div onClick={() => navigate("/nftAlbum/Winter")}>
          <p>WINTER COLLECTION</p>
        </div>
        <div onClick={() => navigate("/nftAlbum/Summer")}>
          <p>SUMMER COLLECTION</p>
        </div> */}
        {collectionType?.map((data:any) => {
          return <div onClick={() => { navigate(`/nftAlbum/${data?.collectionName}`)}}>
          <p>{data?.collectionName} COLLECTION</p>
        </div>
        })}
       
      </GalleryType>
      <SummerCard className="">
            {equalPart?.map((cardPart:any) => {
          
          return  <div className='w-100 m-auto mb-4 '>                  
                  <SwiperBar>                    
                    {cardPart?.map((item: any) => {
                      
                      return (
                        
                          <NftOneCard                            
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
                
            
          </SummerCard>
    </div>
  );
};

export default NFTGallery;
