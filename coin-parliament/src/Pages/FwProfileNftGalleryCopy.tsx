/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import MyCarousel from "../Components/Carousel/Carousel";

import NftOneCard from "./NftOneCard";
import firebase from "firebase/compat";

import "./styles.css";
import SwiperBar from "./SwiperBar";
import UserContext from "../Contexts/User";
import AppContext from "../Contexts/AppContext";
// @ts-ignore
import Monsoon from '../assets/avatars/videos/Monsoon.mp4'; import Winter from '../assets/avatars/videos/Winter.mp4'; import Summer from '../assets/avatars/videos/Summer.mp4'; import Space from '../assets/avatars/videos/Science.mp4';
import { texts } from "../Components/LoginComponent/texts";

// import { Firestore } from "firebase/firestore";

const GalleryType = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content:space-around;
  color: black;
  & div {
    // border: 1px solid #5f4ce3;
    width:${window.screen.width < 767 ? "80%" : "340px"};
    height:${window.screen.width < 767 ? "91px" : "100px"};
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

const Video = styled.video`
  width: 100%;
  // max-width: 300px;
  height: auto;
  margin: 0 auto;
  // border-radius: 20px;
`;

const SummerCard = styled.div`

  display: flex;
  justify-content: center;
  // border:1px solid red;
  flex-wrap: wrap;
  background-color: #f8f9fa;

  
`;

const FwProfileNftGalleryCopy = () => {
  const { user } = useContext(UserContext);
  const { setAlbumOpen, albumOpen } = useContext(AppContext)
  const followerUserId = /* localStorage.getItem("followerId") */'';
  const navigate = useNavigate();
  const [collectionType, setCollectionType] = useState<any>()
  const [allTypeofCard, setAllTypeofCard] = useState<any>([])
  const [allCardArray, setAllCardArray] = useState<any>([])
  const [searchedCard, setSearchedCard] = useState<any>([])
  const [allCard, setAllCard] = useState<any>([])
  const [cardType, setCardType] = useState<any>('all')
  const [searchTerm, setSearchTerm] = useState<any>('')
  const [selectCollection, setSelectCollection] = useState<any>('none')
  const [backCards, setBackCards] = useState<any>([]);
  const [equalPart, setEqualPart] = useState<any>([]);
  const [cardShow, setCardShow] = useState<any>(false);
  const [winerCard, setWinerCard] = useState<any>([]);
  const [setsCardId, setSetsCardId] = useState<any>('none')
  const [setsValue, setSetsValue] = useState<any>([])
  const [setsCardName, setSetsCardName] = useState<any>('none')
  const [cardName, setCardName] = useState<any>([])
  const [cardNameNew, setCardNameNew] = useState<any>([])
  const [allCardArrayNew, setAllCardArrayNew] = useState<any>([])
  const [allCardNew, setAllCardNew] = useState<any>([])
  const [allVideo, setAllVideo] = useState<any>({
    Monsoon: Monsoon,
    Winter: Winter,
    Summer: Summer,
    Space: Space,
  });



  useEffect(() => {
    if (albumOpen != "") {
      const getCollectionType = firebase
        .firestore()
        .collection("nftGallery")
      getCollectionType.get()
        .then((snapshot) => {

          const data: any = []
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });

          setCollectionType(data)
          setSelectCollection(albumOpen)
          setSetsValue([])
          setCardShow(false)

        }).catch((error) => {
          console.log(error, "error");
        });
      setAlbumOpen("")
    }
    // if (albumOpen != "") {
    //   setSelectCollection(albumOpen)
    //   setAlbumOpen("")      
    // }
  }, [albumOpen])



  const getNftCard = () => {
    const getCollectionType = firebase
      .firestore()
      .collection("cardsDetails")
    getCollectionType.get()
      .then((snapshot) => {
        const data: any = []
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setAllCardArrayNew(data)
        console.log(data, "allcardData")
      }).catch((error) => {
        console.log(error, "error");
      });
  }

  const onCollectionChange = (collectionName: any) => {
    if (searchTerm?.length || selectCollection != "none") {
      setCardShow(true)
    }
    else {
      setCardShow(false)
    }
    onSelectSets("none")
    if (collectionName === 'none') {
      const getCollectionType = firebase
        .firestore()
        .collection("nftGallery")
      getCollectionType.get()
        .then((snapshot) => {

          const data: any = []
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });

          setCollectionType(data)
          // setAllCardArray(data)
          setSetsValue([])
          setCardShow(false)

        }).catch((error) => {
          console.log(error, "error");
        });
    }
    else {
      const getCollectionType = firebase
        .firestore()
        .collection("cardsDetails")
        // .where("albumId", "==", collectionName)
        .where("albumName", "==", collectionName)
      getCollectionType.get()
        .then((snapshot) => {
          const data: any = []
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });

          console.log(data, "alldatacard")
          setAllCardNew(data)
          setCardNameNew(data)
          // onSelectSets("none")
          setCardShow(true)
        }).catch((error) => {
          console.log(error, "error");
        });
      const getAlbumId = collectionType && collectionType?.filter((item: any, index: number) => item.albumName == collectionName)
      const getSetsType = firebase
        .firestore()
        .collection("nftGallery")
        .doc(getAlbumId && getAlbumId[0]?.id)
        .collection("setDetails")
      getSetsType.get()
        .then((snapshot) => {
          console.log(collectionName, "collectionName")
          const data: any = []
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setSetsValue(data)
          setCardType("all")

        }).catch((error) => {
          console.log(error, "error");
        });


    }
  }

  const onSearch = (searchTerm: any) => {
    setSearchTerm(searchTerm)
    if (searchTerm?.length || selectCollection != "none") {
      setCardShow(true)
    }
    else {
      setCardShow(false)
    }


    if (cardType === 'all' && selectCollection === "none" && setsCardId === "none") {
      const serchresult = allCardArrayNew.filter((card: any) => card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      setAllCardNew(serchresult)
    }
    else {
      const serchValue = allCardArrayNew.filter((card: any) => card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()) && card?.albumName == selectCollection)
      const serchCard = serchValue.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId)
      const serchresult = serchCard.filter((card: any) => cardType != "all" ? card.cardType == cardType.toUpperCase() : card.cardType != cardType.toUpperCase())
      setAllCardNew(serchresult)
    }
  }


  const onSelectType = (cardType: any) => {
    setCardType(cardType)
    console.log(setsCardId, "setsCardId")
    if (cardType === 'all') {
      const typeCard = allCardArrayNew.filter((card: any) => card.cardType != cardType.toUpperCase() && card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      const forcardName = typeCard.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId && card.albumName == selectCollection)

      setAllCardNew(forcardName)
      setCardNameNew(forcardName)
      setSetsCardName("none")
    }
    else {
      setCardShow(true)
      const typeCard = allCardArrayNew.filter((card: any) => card.cardType === cardType.toUpperCase() && card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      const forcardName = typeCard.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId && card.albumName == selectCollection)
      console.log(forcardName, "forcardNamecard")
      setAllCardNew(forcardName)
      setCardNameNew(forcardName)
      setSetsCardName("none")
    }
  }



  const onSelectSets = (cardId: any) => {
    setSetsCardId(cardId)
    if (cardId === 'none') {
      const cardWithId = allCardArrayNew.filter((card: any) => card.setId !== cardId && card.albumName == selectCollection)
      const forcardName = cardWithId.filter((card: any) => cardType == "all" ? card?.cardType !== cardType.toUpperCase() : card?.cardType == cardType.toUpperCase() && card?.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      setAllCardNew(forcardName)
      setCardNameNew(forcardName)
      setSetsCardName("none")
    }
    else {
      setCardShow(true);
      const cardWithId = allCardArrayNew.filter((card: any) => card.setId == cardId && card.albumName == selectCollection)
      const forcardName = cardWithId.filter((card: any) => cardType == "all" ? card.cardType !== cardType.toUpperCase() : card.cardType == cardType.toUpperCase() && card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      setAllCardNew(forcardName)
      setCardNameNew(forcardName)
      setSetsCardName("none")
    }
  }

  const onSelectName = (mycardName: any) => {
    setSetsCardName(mycardName)
    if (mycardName === 'none') {
      const cardWithName = allCardArrayNew.filter((card: any) => card.cardName !== mycardName)
      const cardNameId = cardWithName.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId)
      const cardNameType = cardNameId.filter((card: any) => cardType != "all" ? card.cardType == cardType.toUpperCase() : card.cardType != cardType.toUpperCase())
      const finalValue = cardNameType.filter((card: any) => card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()) && card?.albumName == selectCollection)
      //  console.log(finalValue,"serchresult")
      // setCardNameNew(finalValue)    
      setAllCardNew(finalValue)
      //  setSearchedCard((pev:any)=>finalValue)
    }
    else {
      const cardWithName = allCardArrayNew.filter((card: any) => card.cardName == mycardName)
      const cardNameId = cardWithName.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId)
      const cardNameType = cardNameId.filter((card: any) => cardType != "all" ? card.cardType == cardType.toUpperCase() : card.cardType != cardType.toUpperCase())
      const finalValue = cardNameType.filter((card: any) => card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()) && card?.albumName == selectCollection)
      // setCardNameNew(finalValue)  
      setAllCardNew(finalValue)
      //  console.log(finalValue,"serchresult")
      //  setSearchedCard((pev:any)=>finalValue)
    }
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
      .where("user", "==", uid)
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


  useEffect(() => {
    getNftCard()
    getAllRewardsOfUser(`${followerUserId}`)
  }, [])
  useEffect(() => {
    onCollectionChange(selectCollection)
  }, [selectCollection])

  useEffect(() => {
    onSearch(searchTerm)
  }, [searchTerm])


  useEffect(() => {
    //  onSearch(searchTerm)
    onSelectType(cardType)
    onSelectSets(setsCardId)
    //  onSelectTypeNew(cardType) 
    onSelectName(setsCardName)
  }, [cardType, setsCardId, setsCardName])


  const BackSideCard = (value: string | number) => {
    if (backCards.includes(value)) {
      let allBackCard = [...backCards];
      allBackCard.splice(backCards.indexOf(value), 1);
      setBackCards(allBackCard)
    }
    else {
      setBackCards([...backCards, value])
    };
  };


  function sliceDived(arr: any, partSize: any) {
    const res = [];
    for (let i = 0; i < arr.length; i += partSize) {
      const DivideEqual = arr.slice(i, i + partSize);
      res.push(DivideEqual);
    }
    // return res;

    setEqualPart(res)

  }

  useEffect(() => {
    if (allCardNew?.length > 0) {
      sliceDived(allCardNew, 4)

    }
    else {
      sliceDived(allCardNew, 4)
      // setCardShow(false)
    }
  }, [allCardNew])


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

  console.log(allCardNew, "allCardNew", cardShow)
  return (
    <div className='' style={{ background: "white", minHeight: "80vh" }}>
      <div className='d-flex justify-content-center pt-5 flex-wrap '>
        <input
          type='text'
          name="hello"
          onChange={e => onSearch(e.target.value)}
          // onChange={(e)=>{HandelonchangeFilter(e)}}
          placeholder='Search...'
          className='py-2 mx-3 rounded border'
        // style={{ width: "200px" }}

        />
        <div className={`${window.screen.width < 767 ? "pt-2" : ""}`}>
          <select
            name='cars'
            id='cars'
            className='bg-white border rounded py-2'
            // onChange={e=>onCollectionChange(e.target.value)}
            value={selectCollection}
            onChange={e => setSelectCollection(e.target.value)}
          >
            <option value='none'>{texts.SelectCollection}</option>


            {collectionType?.map((data: any, index: number) => {
              return <option value={data?.albumName} selected key={index}>{data?.albumName}</option>
            })}
            {/* <option value='Summer'>SUMMER</option>
                <option value='Winter'>WINTER</option>
                <option value='Monsoon'>Monsoon</option> */}
          </select>

          <select
            name='cars'
            id='cars'
            className='bg-white border rounded py-2 mx-2'
            // onChange={e=>onCollectionChange(e.target.value)}
            value={setsCardId}
            onChange={e => onSelectSets(e.target.value)}
          >
            <option value='none'>{texts.SelectSets}</option>
            {setsValue?.map((data: any, index: number) => {
              return <option selected value={data?.id} key={index}>{`${((data?.setName)?.toUpperCase())}`}</option>
            })}
          </select>
        </div>
        <div className={`${window.screen.width < 767 ? "pt-2" : ""}`}>
          <select
            name='type'
            id='type'
            className='bg-white border rounded mx-2 py-2'
            onChange={(e) => { onSelectType(e.target.value) }}
            value={cardType}
          >
            {selectCollection != "none" ? <><option value='all'>{texts.SelectType}</option>
              <option value={`${texts.Legendary}`}>{texts.Legendary}</option>
              <option value={`${texts.Rare}`}>{texts.Rare}</option>
              <option value={`${texts.Epic}`}>{texts.Epic}</option>
              <option value={`${texts.UNCommon}`}>{texts.UNCommon}</option>
              <option value={`${texts.Common}`}>{texts.Common}</option></> :
              <option value='all'>{texts.SelectType}</option>}
          </select>

          <select
            className='bg-white border rounded py-2 mx-1'
            // onChange={e=>onCollectionChange(e.target.value)}
            onChange={e => onSelectName(e.target.value)}
            value={setsCardName}
          >
            <option value='none'>{texts.SelectName}</option>
            {cardNameNew?.map((data: any, index: number) => {
              return <option selected value={data?.cardName} key={index}>{`${data?.cardName}`}</option>
            })}
          </select>
        </div>
      </div>
      <GalleryType
        className=''
        style={{ width: `${window.screen.width > 787 ? "800px" : "100%"}` }}
      >
        {!cardShow && collectionType?.map((data: any, index: number) => {
          return <div onClick={() => { setSelectCollection(data?.albumName) }} key={index}
            style={{
              width: "600px"
            }}
          >
            {allVideo[`${data?.albumName}`] ? <Video autoPlay={true} loop={true} playsInline>
              <source
                src={allVideo[`${data?.albumName}`]}
                type="video/mp4"
              />
            </Video> : <p style={{ color: "black" }}>{data?.albumName}</p>}
            {/* <p>{data?.collectionName} COLLECTION</p> */}
          </div>
        })}
      </GalleryType>

      {allCardNew?.length > 0 ?
        <SummerCard className="mt-4">
          {!!cardShow ? equalPart?.map((cardPart: any, ind: number) => {
            return <div className='w-100 m-auto mb-4' key={ind}>
              <SwiperBar>
                {cardPart?.map((item: any, index: number) => {
                  return (
                    <NftOneCard
                      key={index}
                      DivClass={item?.cardType}
                      HeaderText={item?.cardType}
                      HeaderClass={`${item?.cardType}_text`}
                      // Serie={item?.setName}
                      Serie={item?.setName || "Set" + (index + 1)}
                      BackCardName={item?.cardName}
                      Rarity={item?.cardType}
                      Quantity={item?.totalQuantity}
                      holderNo={item?.noOfCardHolders}
                      // cardNo={`${((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
                      // cardNo={item?.sno[index]}
                      cardNo={`${((item?.cardName)?.toUpperCase())?.slice(0, 2) + (item?.id)?.slice(0, 2)}`}
                      // GeneralSerialNo={`${((item.collectionName)?.toUpperCase())?.slice(0, 3) + ((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
                      MintedTime={getMintedTime(item?.cardId)}
                      PrivateSerialNo={getPriSerialNo(item?.cardId)}
                      Disable={winerCard.length ? CheckCardDisable(item?.cardId) : 'CardDisebal'}
                      userId={item?.setId}
                      // CollectionType={item?.collectionName}
                      CollectionType={item?.albumName || "LEGENDARY"}
                      // Disable={"CardDisebal"}                            
                      cardHeader={`${item?.cardName}`}
                      id={item?.cardId}
                      BackSideCard={BackSideCard}
                      fulldata={item}
                      flipCard={backCards?.includes(item?.cardId)}
                      ImgUrl={item?.cardImageUrl || ""}
                    />
                  );
                })}
              </SwiperBar>
            </div>
          })
            : ""
          }
        </SummerCard> :
        <div className="d-flex justify-content-center mt-5">
          {cardShow == true ? <p style={{
            color: "black"
          }}>Data Not Found</p> : ""}
        </div>
      }

    </div>
  );
};

export default FwProfileNftGalleryCopy;
