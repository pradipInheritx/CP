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
import { Link, useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import firebase from "firebase/compat";
import UserContext from "../Contexts/User";
import AppContext from "../Contexts/AppContext";
import { Other } from "./SingleCoin";
import { texts } from "../Components/LoginComponent/texts";

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


const FwProfileNftGalleryType = () => {
  const { user } = useContext(UserContext);
  const [filterIndex, setfilterIndex] = useState(0);
  // const{followerUserId}=useContext(AppContext)
  const followerUserId = localStorage.getItem("followerId")
  const [backCards, setBackCards] = useState<any>([]);
  const [winerCard, setWinerCard] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<any>('')
  const [allCard, setAllCard] = useState<any>([])
  const [searchedCard, setSearchedCard] = useState<any>([])
  const [cardType, setCardType] = useState<any>('all')
  const [allCardArray, setAllCardArray] = useState<any>([])
  const [equalPart, setEqualPart] = useState<any>([]);
  const [cardShow, setCardShow] = useState<any>(false);
  const [setsCardId, setSetsCardId] = useState<any>('none')
  const [setsValue, setSetsValue] = useState<any>([])
  const [setsCardName, setSetsCardName] = useState<any>('none')
  const [cardName, setCardName] = useState<any>([])



  const BackSideCard = (value: string | number) => {
    // @ts-ignore
    // let allBackCard = [...backCards];
    if (backCards.includes(value)) {
      let allBackCard = [...backCards];
      allBackCard.splice(backCards.indexOf(value), 1);
      setBackCards(allBackCard)
    }
    else {
      setBackCards([...backCards, value])
    };
    // @ts-ignore
    // setBackCards(backCards == value ? "" : value);
    //  backCards.length > 0
    //    ? backCards?.map((items: any, index: number) => {
    //        if (items == value) {
    //          // @ts-ignore
    //          allBackCard.splice(index, 1);
    //          setBackCards(allBackCard);
    //        } else {
    //          // @ts-ignore
    //          setBackCards([...backCards, value]);
    //        }
    //        // @ts-ignore
    //      })
    //    : setBackCards([...backCards, value]);
  };

  let params = useParams();
  const { type } = params;


  const [nftAlbumData, setNftAlbumData] = useState<any>();

  const getNftCard = () => {
    const getCards = firebase
      .firestore()
      .collection("nft_gallery")
    getCards.get()
      .then((snapshot) => {
        let allcollection = snapshot.docs.map((doc) => doc.data())

        allcollection?.map((card) => {
          if (card?.collectionName == type) {
            setNftAlbumData(card?.setDetails)
          }
        })
      }).catch((error) => {
        console.log(error, "error");
      })
      ;
  }


  const getAllRewardsOfUser = async (uid: string) => {

    var winCards: {
      firstRewardCard: string,
      firstRewardCardCollection: string,
      firstRewardCardId: number,
      firstRewardCardSerialNo: string,
      firstRewardCardType: string,
      secondRewardExtraVotes: number,
      thirdRewardDiamonds: number

    }[] = []
    await firebase
      .firestore()
      .collection("reward_transactions")
      .where("user", "==", uid && uid)
      .get()
      .then((doc: any) => {

        doc.forEach((cards: any, index: number) => {

          // winCards.push(cards.data().)

          winCards.push({ ...cards.data().winData, ...cards.data().transactionTime })

        })
      })
      .catch((error: any) => {
        console.log("getAllRewardsOfUser Error", error)
      })

    setWinerCard(winCards)
  }



  const onCollectionChange = () => {

    const getCollectionType = firebase
      .firestore()
      .collection("nft_gallery")
      .where("collectionName", "==", type)
    getCollectionType.get()
      .then((snapshot) => {

        const data: any = []
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setAllCardArray(data)
        const cards: any = [];
        const idSets: any = [];
        const getCardName: any = [];
        data.forEach((element: any) => {

          const collectionId = element.collectionId;
          const collectionName = element.collectionName;
          const collectionDocId = element.id;

          element.setDetails.forEach((setDetail: any) => {
            const setId = setDetail.id;
            const setName = setDetail?.name;
            idSets.push({ setId, setName })
            setDetail.cards.forEach((cardDetail: any) => {
              getCardName.push({ name: cardDetail.name })
              cards.push({ collectionId, collectionName, collectionDocId, setId, setName, ...cardDetail });
            });
          });
        });
        setAllCard(cards)
        setSetsValue(idSets)
        setCardName(getCardName)

      }).catch((error) => {
        console.log(error, "error");
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
    if (cardType === 'all') setSearchedCard(allCard.filter((card: any) => card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())))
    else setSearchedCard(allCard.filter((card: any) => card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) && card.type == cardType.toUpperCase()))
  }

  const onSelectType = (cardType: any) => {
    setCardType(cardType)

    if (cardType === 'all') {
      const typeCard = allCard.filter((card: any) => card.type != cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      const forcardName = typeCard.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId)
      setSearchedCard(typeCard.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId))
      setCardName(forcardName?.map((card: any) => {
        return { name: card?.name }
      }))
      setSetsCardName("none")
    }
    else {
      setCardShow(true)
      const typeCard = allCard.filter((card: any) => card.type === cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      const forcardName = typeCard.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId)
      setSearchedCard(typeCard.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId))
      setCardName(forcardName?.map((card: any) => {

        return { name: card?.name }
      }))
      setSetsCardName("none")
    }
  }

  const onSelectSets = (cardId: any) => {
    setSetsCardId(cardId)
    if (cardId === 'none') {
      const cardWithId = allCard.filter((card: any) => card.setId !== cardId)
      const forcardName = cardWithId.filter((card: any) => cardType == "all" ? card.type !== cardType.toUpperCase() : card.type == cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      setSearchedCard(cardWithId.filter((card: any) => cardType == "all" ? card.type !== cardType.toUpperCase() : card.type == cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())));
      setCardName(forcardName?.map((card: any) => {

        return { name: card?.name }
      }))
      setSetsCardName("none")
    }
    else {
      setCardShow(true);
      const cardWithId = allCard.filter((card: any) => card.setId == cardId)
      const forcardName = cardWithId.filter((card: any) => cardType == "all" ? card.type !== cardType.toUpperCase() : card.type == cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      setSearchedCard(cardWithId.filter((card: any) => cardType == "all" ? card.type !== cardType.toUpperCase() : card.type == cardType.toUpperCase() && card.name?.toLowerCase()?.includes(searchTerm.toLowerCase())));
      setCardName(forcardName?.map((card: any) => {
        return { name: card?.name }
      }))
      setSetsCardName("none")
    }
  }

  const onSelectName = (mycardName: any) => {
    setSetsCardName(mycardName)
    if (mycardName === 'none') {
      const cardWithName = allCard.filter((card: any) => card.name !== mycardName)
      const cardNameId = cardWithName.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId)
      const cardNameType = cardNameId.filter((card: any) => cardType != "all" ? card.type == cardType.toUpperCase() : card.type != cardType.toUpperCase())
      const finalValue = cardNameType.filter((card: any) => card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      //  console.log(serchresult,"serchresult")

      setSearchedCard((pev: any) => finalValue)
    }
    else {
      const cardWithName = allCard.filter((card: any) => card.name == mycardName)
      const cardNameId = cardWithName.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId)
      const cardNameType = cardNameId.filter((card: any) => cardType != "all" ? card.type == cardType.toUpperCase() : card.type != cardType.toUpperCase())
      const finalValue = cardNameType.filter((card: any) => card.name?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      //  console.log(serchresult,"serchresult")
      setSearchedCard((pev: any) => finalValue)
    }
  }


  useEffect(() => {
    getNftCard()
    getAllRewardsOfUser(`${followerUserId && followerUserId}`)

  }, [params, followerUserId])


  useEffect(() => {
    onCollectionChange()
  }, [])

  useEffect(() => {
    // getNftCard()
    // onCollectionChange(type)
    onSearch(searchTerm)
    onSelectType(cardType)
    onSelectName(setsCardName)
  }, [allCard])


  const CheckCardDisable = (cardId: any) => {
    var disableCard;

    let cardTrue = winerCard?.find((winCard: any, index: number) => {

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
    let mintedTime = winerCard?.find((winCard: any, index: number) => {
      if (winCard?.firstRewardCardId == cardId) {
        const date = new Date(winCard?.seconds * 1000);
        getMIntedTime = date.toLocaleString()
        return true
      }
    })
    return getMIntedTime
  }

  const getPriSerialNo = (cardId: any) => {
    var seriaNo;
    let PriSerialNo = winerCard?.find((winCard: any, index: number) => {
      if (winCard?.firstRewardCardId == cardId) {
        seriaNo = winCard?.firstRewardCardSerialNo
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
      sliceDived(searchedCard, 4)
    }
  }, [searchedCard])



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
              onChange={e => onSearch(e.target.value)}
              // onChange={(e)=>{HandelonchangeFilter(e)}}
              placeholder='Search...'
              className='py-2 mx-2 rounded border'

            // style={{ width: "200px" }}              
            />

            <div className={`${window.screen.width < 767 ? "py-2" : ""}`}>
              <select
                name='cars'
                id='cars'
                className='bg-white border rounded py-2 '
                // onChange={e=>onCollectionChange(e.target.value)}
                onChange={e => onSelectSets(e.target.value)}
              >
                <option value='none'>{texts.SelectSets}</option>
                {setsValue?.map((data: any, index: number) => {
                  return <option value={data?.setId} key={index}>{`${((data?.setName)?.toUpperCase())?.slice(0, 3) + data?.setId}`}</option>
                })}
              </select>
              <select
                name='type'
                id='type'
                className='bg-white border rounded mx-2 py-2'
                onChange={(e) => { onSelectType(e.target.value) }}
              >
                <option value='all'>{texts.SelectType}</option>
                <option value={`${texts.Legendary}`}>{texts.Legendary}</option>
                <option value={`${texts.Rare}`}>{texts.Rare}</option>
                <option value={`${texts.Epic}`}>{texts.Epic}</option>
                <option value={`${texts.UNCommon}`}>{texts.UNCommon}</option>
                <option value={`${texts.Common}`}>{texts.Common}</option>
              </select>

              <select
                className='bg-white border rounded py-2 mx-1'
                // onChange={e=>onCollectionChange(e.target.value)}
                onChange={e => onSelectName(e.target.value)}
              >
                <option value='none'>{texts.SelectName}</option>
                {cardName?.map((data: any, index: number) => {
                  return <option value={data?.name} key={index}>{`${data?.name}`}</option>
                })}
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
            {/* <div className="d-flex justify-content-center align-items-center  pt-4">
                <Link to="/nftAlbum" style={{textDecoration:'none'}}>
                  <Other>{"Back to all Card"}</Other>
                </Link>
              </div> */}
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
              {equalPart?.map((cardPart: any, ind: number) => {
                return <div className='w-100 m-auto mb-4' key={ind}>
                  <SwiperBar>
                    {cardPart?.map((item: any, index: number) => {
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
                          // GeneralSerialNo={`${((item.collectionName)?.toUpperCase())?.slice(0, 3) + ((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
                          MintedTime={getMintedTime(item?.cardId)}
                          PrivateSerialNo={getPriSerialNo(item?.cardId)}
                          Disable={winerCard.length ? CheckCardDisable(item?.cardId) : 'CardDisebal'}
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
                fontSize: "14px"
              }}>Data Not Found</p> : ""}
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

export default FwProfileNftGalleryType;
