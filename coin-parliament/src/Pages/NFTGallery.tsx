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
import { texts } from "../Components/LoginComponent/texts";


const GalleryType = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content:space-around;
  color: black;
  & div {
    // border: 1px solid #5f4ce3;
    width:${window.screen.width < 767?"80%":"340px" };
    height:${window.screen.width < 767?"91px":"100px" };
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
  const [collection, setCollection] = useState<any>()
  const [setsCardId, setSetsCardId] = useState<any>('none')
  const [setsValue, setSetsValue] = useState<any>([])
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
  // const onSearch = (searchTerm: any) => {
  
  // setSearchTerm(searchTerm)
  // if (searchTerm?.length || selectCollection!="none") {
  //   setCardShow(true)
  // }
  // else {
  //   setCardShow(false)
  // }
    
  // if(cardType==='all' &&  selectCollection ==="none") setSearchedCard(allCard.filter((card:any)=>card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))
  // else {
  //   setSearchedCard(allCard.filter((card: any) => card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) && card.type != cardType.toUpperCase() && card?.collectionName === selectCollection))
  // }
  // }
const onSearch = (searchTerm: any) => {  
  setSearchTerm(searchTerm)
  if (searchTerm?.length || selectCollection!="none") {
    setCardShow(true)
  }
  else {
    setCardShow(false)
  }
  
    
   if (cardType === 'all' && selectCollection === "none" && setsCardId === "none")
   {      
     console.log("i am if onSearch")
     const serchresult = allCard.filter((card: any) => card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()))
    //  console.log(serchresult,"serchresult")
     setSearchedCard((pev:any)=>serchresult)
      }
   else {
     const serchValue = allCard.filter((card: any) => card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) && card?.collectionName === selectCollection)
     const serchCard = serchValue.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId)
     const serchresult = serchCard.filter((card: any) => cardType != "all" ? card.type == cardType.toUpperCase() : card.type != cardType.toUpperCase() )    
     setSearchedCard(serchresult)
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
      setSetsValue([])
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
  const idSets: any = [];
  data.forEach((element: any) => {

    const collectionId = element.collectionId;
    const collectionName = element.collectionName;
    const collectionDocId = element.id;

    element.setDetails.forEach((setDetail: any) => {
      const setId = setDetail.id;
      const setName = setDetail?.name;
      idSets.push({setId,setName})
      setDetail.cards.forEach((cardDetail: any) => {
        cards.push({collectionId, collectionName, collectionDocId, setId,setName, ...cardDetail});
      });
    });
  });
  setAllCard(cards)
  setSetsValue(idSets)
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
  


// const onSelectType=(cardType:any)=>{
//   setCardType(cardType)  
//   if (cardType === 'all') {
    
//     setSearchedCard(allCard.filter((card: any) => card.type != cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))
//   }
//   else {    
//     setCardShow(true)
//   setSearchedCard((prev: any) => allCard.filter((card: any) => card.type === cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))}
// }
  const onSelectType=(cardType:any)=>{
  setCardType(cardType)
  
  if (cardType === 'all') { 
    const typeCard = allCard.filter((card: any) => card.type != cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()))
    setSearchedCard(typeCard.filter((card:any)=>setsCardId != "none" ?card?.setId ==setsCardId:card.setId !==setsCardId))
  }
  else {    
    setCardShow(true)
    const typeCard = allCard.filter((card: any) => card.type === cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())) 
    setSearchedCard(typeCard.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId))    
  }
}
  
  const onSelectSets=(cardId:any)=>{
  setSetsCardId(cardId)
  if (cardId === 'none') {    
    const cardWithId=allCard.filter((card: any) => card.setId !== cardId )
    setSearchedCard(cardWithId.filter((card: any) =>cardType == "all" ? card.type !== cardType.toUpperCase() : card.type == cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())) );
    
  }
  else {    
    setCardShow(true);        
    const cardWithId=allCard.filter((card: any) => card.setId == cardId )
    setSearchedCard(cardWithId.filter((card: any) => cardType == "all" ? card.type !== cardType.toUpperCase() : card.type== cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())) );        
  }
}
  
  
useEffect(() => {
    getNftCard()
  }, [])
useEffect(() => {
    onCollectionChange(selectCollection)
  }, [selectCollection])
  
useEffect(() => {
   onSearch(searchTerm)

}, [searchTerm])
  
useEffect(() => {
   onSearch(searchTerm)
   onSelectType(cardType)
   onSelectSets(setsCardId)
  }, [
    // allCard
     cardType   ,setsCardId 
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
    <div className='' style={{ background: "white", minHeight: "80vh",  }}>
    <div className='d-flex justify-content-center pt-5 flex-wrap w-100' >
            <input
              type='text'
              name="hello"
              onChange={e =>onSearch(e.target.value)}
              // onChange={(e)=>{HandelonchangeFilter(e)}}
              placeholder='Search...'
              className='py-2 mx-3 rounded border'
              // style={{ width: "200px" }}
              
            />
            <div className={`${window.screen.width < 767 ? "py-3 d-flex" : ""} `}>
              <select
                name='cars'
                id='cars'
                className='bg-white border rounded py-2 mx-2'
                // onChange={e=>onCollectionChange(e.target.value)}
                onChange={e=>setSelectCollection(e.target.value)}
              >
            <option value='none'>{texts.SelectCollection}</option>
            

            {collectionType?.map((data:any ,index:number) => {
              return  <option value={data?.collectionName} key={index}>{data?.collectionName}</option>        
            })}
                {/* <option value='Summer'>SUMMER</option>
                <option value='Winter'>WINTER</option>
                <option value='Monsoon'>Monsoon</option> */}
          </select>
          <select
                name='cars'
                id='cars'
                className='bg-white border rounded py-2 mx-1'
                // onChange={e=>onCollectionChange(e.target.value)}
                onChange={e=>onSelectSets(e.target.value)}
              >
            <option value='none'>{texts.SelectSets}</option>            
            {setsValue?.map((data:any ,index:number ) => {
              return  <option value={ data?.setId} key={index}>{`${((data?.setName)?.toUpperCase())?.slice(0, 3) + data?.setId}`}</option>        
            })}            
          </select>
          </div>
          <div className={`${window.screen.width < 767 ? "py-3" : ""} `}>
              <select
                name='type'
                id='type'
                className='bg-white border rounded mx-1 py-2'
                onChange={(e)=>{onSelectType(e.target.value)}}
              >
                <option value='all'>{texts.SelectType}</option>
                <option value={`${texts.Legendary}`}>{texts.Legendary}</option>
                <option value={`${texts.Rare}`}>{texts.Rare}</option>
                <option value={`${texts.Epic}`}>{texts.Epic}</option>
                <option value={`${texts.UNCommon}`}>{texts.UNCommon}</option>
                <option value={`${texts.Common}`}>{texts.Common}</option>
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
           style={{
                width: "600px"
          }}
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
