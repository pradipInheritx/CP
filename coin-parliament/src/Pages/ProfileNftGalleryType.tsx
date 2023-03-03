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
  const [searchTerm, setSearchTerm] = useState<any>('')
  const [allCard, setAllCard] = useState<any>([])
  const [searchedCard, setSearchedCard] = useState<any>([])
  const [cardType,setCardType]=useState<any>('all')
  const [allCardArray,setAllCardArray]=useState<any>([])
  const [equalPart, setEqualPart] = useState<any>([]);
  const [cardShow, setCardShow] = useState<any>(false);


  
//   useEffect(() => {
//   //  onSnapshot(doc(db, "nft_gallery","WINTER"), (doc) => {
//   //     // setLeaders((doc.data() as { leaders: Leader[] })?.leaders || []);
//   //     console.log("nft_gallery", doc.data());
//   //   });
//   // getNftCard();
// }, [])
  
  // useEffect(() => {
  //   HandleFilter(filterIndex);
  // }, [filterIndex]);

  // const HandleFilter = (filterIndex?: number | string | undefined) => {
  //   var allCard: any = cards;
  //   if (filterIndex && filterIndex > 0) {
  //     allCard.filter((item: any, ind: number) => {
  //       if (ind + 1 == filterIndex) {
  //         var cardItem: any = [item];
  //         setCardValue(cardItem);
  //       }
  //     });
  //   } else {
  //     setCardValue(allCard);
  //   }
  // };

  
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
   setWinerCard(winCards)
  }
  


const onCollectionChange=()=>{ 
  
  const getCollectionType = firebase
  .firestore()
  .collection("nft_gallery")
  .where("collectionName", "==", type)
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
    if (searchedCard?.length) {
    setCardShow(true)
  }
  else {
    setCardShow(false)
  }
  if(cardType==='all') setSearchedCard(allCard.filter((card:any)=>card.type!=cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))
  else {
    setCardShow(true)
    setSearchedCard(
    (prev:any)=>allCard.filter((card:any)=>card.type===cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))}
}

useEffect(() => {
  getNftCard()
   getAllRewardsOfUser(`${user?.uid}`)
  
}, [params])
  
  
  useEffect(() => {  
  onCollectionChange()  
  }, [])
  
  useEffect(() => {
  // getNftCard()
  // onCollectionChange(type)
  onSearch(searchTerm)
  onSelectType(cardType)
}, [allCard])
  

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
    else {
      sliceDived(searchedCard,4)
  }
  },[searchedCard])
 
console.log(searchedCard,"searchedCard")
console.log(equalPart,"setEqualPart")

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
                
                <option value='saab'>Card NO.</option>
                <option value='mercedes'>Card Name</option>
                
              </select>
            </div>
          </div>

          <div>
            <p>{type} COLLECTION</p>
          </div>
            {/* <SummerCard>
            {nftAlbumData?.map((items: any, index: number) => {
              
              return (
                <div className='w-100 m-auto mb-4 '>
                  
                  <SwiperBar>
                    
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
                            Disable={winerCard.length?CheckCardDisable(item?.cardId):'CardDisebal'}                                                      
                            cardHeader={`${item?.name}`}
                            cardNo={`${((items?.name)?.toUpperCase())?.slice(0, 3) + items?.id}`}
                            id={item?.cardId}
                            BackSideCard={BackSideCard}
                            
                            flipCard={backCards.includes(item?.cardId)}
                          />
                        </>
                      );
                    })}
                  </SwiperBar>
                </div>
              );
            })}
          </SummerCard> */}
          {searchedCard?.length > 0 ?
                  <SummerCard className="mt-4">
                      {equalPart?.map((cardPart:any) => {                    
                        return <div className='w-100 m-auto mb-4'>                  
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
                                      // GeneralSerialNo={`${((item.collectionName)?.toUpperCase())?.slice(0, 3) + ((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
                                      MintedTime={getMintedTime(item?.cardId)}
                                      PrivateSerialNo={getPriSerialNo(item?.cardId)}                                                        
                                      Disable={winerCard.length?CheckCardDisable(item?.cardId):'CardDisebal'}
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
                  <div  className="d-flex justify-content-center">
                    {cardShow == true ?<p style={{
                color: "black",
                      fontSize:"14px"
                    }}>Data Not Found</p>:""}
                  </div>
                }

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
