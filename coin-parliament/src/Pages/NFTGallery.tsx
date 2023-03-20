/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import MyCarousel from "../Components/Carousel/Carousel";

import NftOneCard from "./NftOneCard";
// @ts-ignore
import Monsoon from '../assets/avatars/videos/Monsoon.mp4';import Winter from '../assets/avatars/videos/Winter.mp4'; import Summer from '../assets/avatars/videos/Summer.mp4';


import "./styles.css";
import SwiperBar from "./SwiperBar";
import firebase from "firebase/compat";
import { Ratio } from "react-bootstrap";


const GalleryType = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content:space-around;
  color: black;
  & div {
    // border: 1px solid #5f4ce3;
    width:${window.screen.width < 767?"80%":"240px" };
    height:${window.screen.width < 767?"91px":"71px" };
    // height:71px;
    margin: 50px 10px;
    
    cursor:pointer;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px;
    // padding: 20px 20px;
    text-align:center;
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
const Video = styled.video`
  width: 100%;
  // max-width: 300px;
  height: auto;
  margin: 0 auto;
  // border-radius: 20px;
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
  const [selectCollection, setSelectCollection] = useState<any>('none')
  const [backCards, setBackCards] = useState<any>([]);
  const [equalPart, setEqualPart] = useState<any>([]);
  const [cardShow, setCardShow] = useState<any>(false);
  const [collection,setCollection]= useState<any>()
  const [allVideo, setAllVideo] = useState<any>({
    Monsoon:Monsoon,
    Winter :Winter,
    Summer :Summer
  })
  
    const getNftCard = () => {
  const getCollectionType = firebase
            .firestore()
            .collection("nft_gallery")
    getCollectionType.get()
      .then((snapshot) => {          
               
       let allcollection= snapshot.docs.map((doc) => doc.data())
        setCollectionType(allcollection)
        
        allcollection?.map((allcolloection: any) => {
          setAllTypeofCard([...allTypeofCard,allcolloection]) 
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
          // allcolloection?.map((allcard:any) => {
          //  setAllTypeofCard([...allTypeofCard,allcard]) 
          // })
          
        })

        // setAllTypeofCard

  
        
      }).catch((error) => {
        console.log(error,"error");
      });    
}
  const onSearch = (searchTerm: any) => {
  
  setSearchTerm(searchTerm)
  if (searchTerm?.length || selectCollection!="none") {
    setCardShow(true)
  }
  else {
    setCardShow(false)
  }
    
  if(cardType==='all' &&  selectCollection ==="none") setSearchedCard(allCard.filter((card:any)=>card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))
  else {    
    setSearchedCard(allCard.filter((card: any) => card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) && card.type != cardType.toUpperCase() && card?.collectionName === selectCollection))
  }
  }
  
  const onCollectionChange = (collectionName: any) => {
  
if (searchTerm?.length || cardType?.length || selectCollection!="none") {
    setCardShow(true)
  }
  else {
    setCardShow(false)
  }

  if(collectionName==='none') {
    const getCollectionType = firebase
  .firestore()
  .collection("nft_gallery")
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
  setCardShow(false)

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
// const cardItems:any=[]
//   cards.map((cardValue: any) => {
//     cardItems.push(cardValue)
//   })
//   setSearchedCard(cardItems)
  if (cardType == "all") {
    setSearchedCard(cards.filter((card: any) => card.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())))
  }
  else {
    setSearchedCard(cards.filter((card: any) => card.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) && card.type == cardType ?.toUpperCase()))
  }
  // setCardShow(true)


}).catch((error) => {
console.log(error,"error");
});    }
  }
  


const onSelectType=(cardType:any)=>{
  setCardType(cardType)  
  if (cardType === 'all') {
    
    setSearchedCard(allCard.filter((card: any) => card.type != cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))
  }
  else {    
    setCardShow(true)
  setSearchedCard((prev: any) => allCard.filter((card: any) => card.type === cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))}
}
useEffect(() => {
    getNftCard()
  }, [])
useEffect(() => {
    onCollectionChange(selectCollection)
  }, [selectCollection])
  
  useEffect(() => {
   onSearch(searchTerm)
   onSelectType(cardType)
  }, [
    // allCard
    searchTerm, cardType    
  ])
     
  
  
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
  
  
function sliceDived(arr:any, partSize:any) {
    const res = [];
    for (let i = 0; i < arr.length; i += partSize) {
        const DivideEqual = arr.slice(i, i + partSize);
        res.push(DivideEqual);
    }
    // return res;
  
  setEqualPart(res)
  
}

useEffect(() => {
  if (searchedCard?.length > 0) {      
    sliceDived(searchedCard, 4)
  }
  else {      
      sliceDived(searchedCard,4)
    // setCardShow(false)
  }
  },[searchedCard])




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
                // onChange={e=>onCollectionChange(e.target.value)}
                onChange={e=>setSelectCollection(e.target.value)}
              >
            <option value='none'>Select Collection</option>
            

            {collectionType?.map((data:any ,index:number) => {
              return  <option value={data?.collectionName} key={index}>{data?.collectionName}</option>        
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
              {/* <select
                name='cars'
                id='cars'
                className='bg-white border rounded py-2'
              >
                <option value='volvo'>Select Sets</option>
                <option value='volvo'>Card Type</option>
                <option value='saab'>Card NO.</option>
                <option value='mercedes'>Card Name</option>
                <option value='audi'>Collection</option>
              </select> */}
            </div>
      </div>
      {/* @ts-ignore */}
      <GalleryType className='' style={{width:`${window.screen.width >787 ? "800px":"100%"}`}} >
        {/* <div onClick={() => navigate("/nftAlbum/Winter")}>
          <p>WINTER COLLECTION</p>
        </div>
        <div onClick={() => navigate("/nftAlbum/Summer")}>
          <p>SUMMER COLLECTION</p>
        </div> */}
        {!cardShow && collectionType?.map((data:any ,index:number) => {
          return <div onClick={() => { navigate(`/nftAlbum/${data?.collectionName}`) }} key={index}
          
          >            
        <Video  autoPlay={true} loop={true}>
          <source
            src={allVideo[`${data?.collectionName}`]}
            type="video/mp4"
          />
        </Video>
          {/* <p>{data?.collectionName} COLLECTION</p> */}
        </div>
        })}
       
      </GalleryType>
      {searchedCard?.length > 0 ?
        <SummerCard className="mt-4">
            {!!cardShow ? equalPart?.map((cardPart:any ,ind:number) => {                    
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
            })          
          : ""          
          }                          
      </SummerCard> :
        <div  className="d-flex justify-content-center mt-5">
          {cardShow == true ?<p style={{
            color:"black"
          }}>Data Not Found</p>:""}
        </div>
      }
    </div>
  );
};

export default NFTGallery;
