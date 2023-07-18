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
// @ts-ignore
import Monsoon from '../assets/avatars/videos/Monsoon.mp4'; import Winter from '../assets/avatars/videos/Winter.mp4'; import Summer from '../assets/avatars/videos/Summer.mp4'; import Science from '../assets/avatars/videos/Science.mp4';
import { Col, Form, Row } from "react-bootstrap";
import { texts } from "../Components/LoginComponent/texts";
import AppContext from "Contexts/AppContext";

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

const ProfileNftGalleryCopy = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [collectionType, setCollectionType] = useState<any>()
  const [allTypeofCard, setAllTypeofCard] = useState<any>([])
  const [allCardArray, setAllCardArray] = useState<any>([])
  const [searchedCard, setSearchedCard] = useState<any>([])
  const [allCard, setAllCard] = useState<any>([])
  const [cardType, setCardType] = useState<any>('all')
  const { albumOpen, setAlbumOpen } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState<any>('')
  const [selectCollection, setSelectCollection] = useState<any>('none')
  const [backCards, setBackCards] = useState<any>([]);
  const [equalPart, setEqualPart] = useState<any>([]);
  const [cardShow, setCardShow] = useState<any>(false);
  const [winerCard, setWinerCard] = useState<any>([]);
  const [myCards, setMyCards] = useState<any>(false)
  const [setsCardId, setSetsCardId] = useState<any>('none')
  const [setsValue, setSetsValue] = useState<any>([])
  const [setsCardName, setSetsCardName] = useState<any>('none')
  const [myAlbumID, setMyAlbumID] = useState<any>('')
  const [showWincardTExt, setShowWincardTExt] = useState<any>(false)
  const [cardName, setCardName] = useState<any>([])
  const [cardNameNew, setCardNameNew] = useState<any>([])
  const [allCardArrayNew, setAllCardArrayNew] = useState<any>([])
  const [allCardNew, setAllCardNew] = useState<any>([])
  // const [notFound,setNotFound]=useState<any>(0) 
  var notFound = false;
  const [allVideo, setAllVideo] = useState<any>({
    Monsoon: Monsoon,
    Winter: Winter,
    Summer: Summer,
    Science: Science,
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
          
          setCardShow(false)

        }).catch((error) => {
          console.log(error, "error");
        });
      setAlbumOpen("")    
    }
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
        
      }).catch((error) => {
        console.log(error, "error");
      });
  }

  const onCollectionChange = (collectionName: any) => {
    onSelectSets("none")
    if (searchTerm?.length || selectCollection != "none") {
      // console.log(selectCollection,cardType?.length,"selectCollection")
      
      setCardShow(true)
    }
    else {
      setCardShow(false)
    }

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
          console.log(data,"collectionType")
          setCardShow(false)

        }).catch((error) => {
          console.log(error, "error");
        });
      
    }
    else {   
      
      const getCollectionType = firebase
        .firestore()
        .collection("cardsDetails")
        .where("albumName", "==", collectionName)
      getCollectionType.get()
        .then((snapshot) => {
          
          const data: any = []
          snapshot.forEach((doc) => {            
            data.push({ id: doc.id, ...doc.data() });
          });   
          console.log("i am working")
          setCardNameNew(data)
          setAllCardNew(data)          
          
          // setCardType("all")
          setCardShow(true)
        }).catch((error) => {
          console.log(error, "error");
        });   
      
      const getAlbumId = collectionType && collectionType?.filter((item: any, index: number) => item.albumName == collectionName)
      // console.log(getAlbumId && getAlbumId[0]?.id,"checkalbumId")
      const getSetsType = firebase
        .firestore()
        .collection("nftGallery")
        .doc(getAlbumId && getAlbumId[0]?.id)
        .collection("setDetails")
        getSetsType.get()
        .then((snapshot) => {
          
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

  console.log(cardType,setsCardId,setsCardName,"allnames")
  // console.log(cardShow,myCards,"cardShow myCards")

  // const onSearch = (searchTerm: any) => {
  //   setSearchTerm(searchTerm)
  //   if (searchTerm?.length || selectCollection != "none") {
  //     setCardShow(true)
  //   }
  //   else {
  //     setCardShow(false)
  //   }

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
      // setCardNameNew(serchresult)
      
      setAllCardNew(serchresult)
      //  setCardNameNew(serchresult)
    }
    else {
      const serchValue = allCardArrayNew.filter((card: any) => card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()) && card?.albumName == selectCollection)
      const serchCard = serchValue.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId)
      const serchresult = serchCard.filter((card: any) => cardType != "all" ? card.cardType == cardType.toUpperCase() : card.cardType != cardType.toUpperCase())
      
      setAllCardNew(serchresult)
      //  setCardNameNew(serchresult)
    }
  }


  const onSelectType = (cardType: any) => {
    setCardType(cardType)
    if (cardType === 'all') {
      console.log(allCardArrayNew,"forcardName")
      const typeCard = allCardArrayNew.filter((card: any) => card.cardType != cardType.toUpperCase() && card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      const forcardName = typeCard.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId && card?.albumName == selectCollection)
      
      setCardNameNew(forcardName)
      setAllCardNew(forcardName)
      setSetsCardName("none")
    }
    else {
      
      setCardShow(true)
      const typeCard = allCardArrayNew.filter((card: any) => card.cardType === cardType.toUpperCase() && card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      const forcardName = typeCard.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId && card?.albumName == selectCollection)
      
      setCardNameNew(forcardName)
      setAllCardNew(forcardName)
      setSetsCardName("none")
    }
  }
  const onSelectSets = (cardId: any) => {
    setSetsCardId(cardId)
    if (cardId === 'none') {      
      const cardWithId = allCardArrayNew.filter((card: any) => card.setId !== cardId && card?.albumName == selectCollection)
      const forcardName = cardWithId.filter((card: any) => cardType == "all" ? card?.cardType !== cardType.toUpperCase() : card?.cardType == cardType.toUpperCase() && card?.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      
      setAllCardNew(forcardName)
      setCardNameNew(forcardName)
      setSetsCardName("none")
    }
    else {
      
      setCardShow(true);
      const cardWithId = allCardArrayNew.filter((card: any) => card.setId == cardId && card?.albumName == selectCollection)
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
      setAllCardNew(finalValue)
      //  console.log(finalValue,"serchresult")
      //  setSearchedCard((pev:any)=>finalValue)
    }
    else {
      const cardWithName = allCardArrayNew.filter((card: any) => card.cardName == mycardName)
      const cardNameId = cardWithName.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId)
      const cardNameType = cardNameId.filter((card: any) => cardType != "all" ? card.cardType == cardType.toUpperCase() : card.cardType != cardType.toUpperCase())
      const finalValue = cardNameType.filter((card: any) => card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()) && card?.albumName == selectCollection)
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

  const allWinerCard = () => {
    // if (myCards) {
    //   setSearchedCard(winerCard.length && winerCard?.map((winItem:any) => {
    //     {
    //       allCard.filter((card: any) => {
    //         console.log(card,)
    //           card.cardId == winItem.firstRewardCardId
    //       }

    //       )
    //   }
    // }))
    // }
    // else {
    //   setSearchedCard(allCard.filter((card: any) => card.type != cardType.toUpperCase() && card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase())))
    // }
  }


  useEffect(() => {
    getNftCard()
    // @ts-ignore
    getAllRewardsOfUser(`${user?.uid}`)
  }, [])


  useEffect(() => {
    onCollectionChange(selectCollection)
  }, [selectCollection])

  useEffect(() => {
    onSearch(searchTerm)

  }, [searchTerm])
  useEffect(() => {
    // onSearch(searchTerm)
    onSelectType(cardType)
    onSelectSets(setsCardId)
    onSelectName(setsCardName)
  }, [
    // allCard
    cardType, setsCardId, setsCardName
  ])




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

  const [filterCard, setFilterCard] = useState<any>();

  useEffect(() => {
    setFilterCard(equalPart);
  }, [equalPart])
  const availableCard = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      let winnerCardId = winerCard?.map((WinerItem: any) => WinerItem?.firstRewardCardId);

      setFilterCard((prev: any) => {

        return prev;
      });
    } else {
      setFilterCard(equalPart);
    }

  }
  
  console.log(allCardNew,"allCardNew")

  return (
    <div className='' style={{ background: "white", minHeight: "80vh" }}>
      {/* <div className=" w-100 container pt-3 d-flex justify-content-center " >
        <Row className="justify-content-md-center">
          <Col lg={3} sm={12} xs={13} className="" style={{ paddingLeft: '0px' }}>
            <input type='text' onChange={e => onSearch(e.target.value)} placeholder='Search...' className='py-2 rounded border w-100 mb-lg-0 mb-sm-3 mb-3' style={{ marginRight: '10px' }} />
          </Col>
          <Col lg={2} sm={6} xs={6} className="" style={{ padding: '0px' }} >
            <select
              name='cars'
              id='cars'
              style={{ marginRight: '10px' }}
              className="bg-white border rounded py-2 mb-lg-0 mb-sm-3 w-100 mb-3"
              value={selectCollection}
              onChange={e => setSelectCollection(e.target.value)}
            >
              <option value='none'>{texts.SelectCollection}</option>
              {collectionType?.map((data: any, index: number) => {
                return <option selected value={data?.albumName} key={index}>{data?.albumName}</option>
              })}

            </select>
          </Col>
          <Col lg={2} sm={6} xs={6} className="" style={{ paddingRight: '0px' }}>
            <select
              name='cars'
              id='cars'
              className=" bg-white border rounded py-2 mb-lg-0 mb-sm-3 w-100 mb-3"
              onChange={e => onSelectSets(e.target.value)}
              style={{ marginRight: '10px' }}
            >
              <option value='none'>{texts.SelectSets}</option>
              {setsValue?.map((data: any, index: number) => {
                return <option value={data?.id} key={index}>{(data?.setName)?.toUpperCase()}</option>
              })}
            </select>
          </Col>
          <Col lg={2} sm={6} xs={6} className="" style={{ paddingRight: '0px' }}>
            <select
              name='type'
              id='type'
              className="bg-white border rounded py-2 mb-lg-0 mb-sm-3 w-100 mb-3"
              onChange={(e) => { onSelectType(e.target.value) }}
              style={{ marginRight: '10px' }}
            >
              {selectCollection != "none" ? <><option value='all'>{texts.SelectType}</option>
                <option value={`${texts.Legendary}`}>{texts.Legendary}</option>
                <option value={`${texts.Rare}`}>{texts.Rare}</option>
                <option value={`${texts.Epic}`}>{texts.Epic}</option>
                <option value={`${texts.UNCommon}`}>{texts.UNCommon}</option>
                <option value={`${texts.Common}`}>{texts.Common}</option></> :
                <option value='all'>{texts.SelectType}</option>}
            </select>
          </Col>
          <Col lg={1} sm={6} xs={6} className="" style={{ paddingRight: '0px' }}>
            <select
              className="bg-white border rounded py-2 mb-lg-0 mb-sm-3 w-100 mb-3"
              style={{ marginRight: '10px' }}
              onChange={e => onSelectName(e.target.value)}
            >
              <option value='none'>{texts.SelectName}</option>
              {cardNameNew?.map((data: any, index: number) => {
                return <option value={data?.cardName} key={index}>{`${data?.cardName}`}</option>
              })}
            </select>
          </Col>
          <Col lg={2} sm={12} xs={12} className="d-flex  mb-lg-0 mb-sm-3 mb-3" style={{ paddingRight: '0px' }}>
            <Form.Check
              style={{ fontSize: "20px", marginRight: "10px" }}
              className="align-self-center"
              type="checkbox"
              id={`default-checkbox`}
              onClick={() => { setMyCards(!myCards) }}
            />
            <label htmlFor="default-checkbox" className="align-self-center">{texts.AvailableCards}</label>
          </Col>
        </Row>
      </div> */}

      <div className='d-flex justify-content-center pt-5 flex-wrap '>
        <input
          type='text'

          onChange={e => onSearch(e.target.value)}
          // onChange={(e)=>{HandelonchangeFilter(e)}}
          placeholder='Search...'
          className='py-2 mx-2 rounded border'
        // style={{ width: "200px" }}

        />
        <div className={`${window.screen.width < 767 ? "py-3 px-3" : ""}`}>
          <select
            name='cars'
            id='cars'
            className='bg-white border rounded py-2'
            value={selectCollection}
            // onChange={e=>onCollectionChange(e.target.value)}
            onChange={e => setSelectCollection(e.target.value)}
          >
            <option value='none'>{texts.SelectCollection}</option>
            {collectionType?.map((data: any, index: number) => {
              return <option selected value={data?.albumName} key={index}>{data?.albumName}</option>
            })}

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
              return <option selected value={data?.id} key={index}>{(data?.setName)?.toUpperCase()}</option>
            })}
          </select>
        </div>
        <div className={`${window.screen.width < 767 ? "" : ""}`}>

          <select
            name='type'
            id='type'
            className='bg-white border rounded mx-1 py-2'
            onChange={(e) => { onSelectType(e.target.value) }}
            value={cardType}
          >
            {selectCollection != "none" ? <><option value='all' >{texts.SelectType}</option>
              <option value={`${texts.Legendary}`} >{texts.Legendary}</option>
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
        <div
          className="d-flex  justify-content-start align-items-center "
        >

          <Form.Check
            style={{ fontSize: "20px", marginRight: "10px" }}
            type="checkbox"
            id={`default-checkbox`}
            // label={`default checkbox`}
            // onClick={availableCard}
            onClick={() => { setMyCards(!myCards) }}
          />
          <label htmlFor="default-checkbox">{texts.AvailableCards}</label>
        </div>
      </div>
      <GalleryType
        className=''
        style={{ width: `${window.screen.width > 787 ? "800px" : "100%"}` }}
      >
        {!myCards && !cardShow && collectionType?.map((data: any, index: number) => {
          return <div
            style={{
              width: "600px"
            }}
            onClick={() => { setSelectCollection(data?.albumName) }} key={index}>
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
          {!!cardShow ? filterCard?.map((cardPart: any, ind: number) => {
            return <div className='w-100 m-auto mb-4' key={ind}>
              <SwiperBar>
                {cardPart?.map((item: any, index: number) => {
                  if (myCards) {

                    if (winerCard.length && winerCard?.find((WinerItem: any) => WinerItem?.firstRewardCardId == item?.cardId)) {                    
                      // setNotFound(notFound +1)
                      notFound = true;
                      return (
                        <NftOneCard
                          key={index}
                          DivClass={item?.cardType}
                          HeaderText={item?.cardType}
                          HeaderClass={`${item?.cardType}_text`}
                          Serie={item?.setName || "Set" + index}
                          BackCardName={item?.cardName}
                          Rarity={item?.cardType}
                          Quantity={item?.totalQuantity}
                          holderNo={item?.noOfCardHolders}
                          // cardNo={`${((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
                          // cardNo={item?.sno[index]}
                          // GeneralSerialNo={`${((item.collectionName)?.toUpperCase())?.slice(0, 3) + ((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
                          cardNo={`${((item?.cardName)?.toUpperCase())?.slice(0, 2) + (item?.id)?.slice(0, 2)}`}
                          // GeneralSerialNo={}                            
                          CollectionType={item?.albumName || "LEGENDARY"}
                          MintedTime={getMintedTime(item?.cardId)}
                          PrivateSerialNo={getPriSerialNo(item?.cardId)}
                          Disable={winerCard.length ? CheckCardDisable(item?.cardId) : 'CardDisebal'}
                          userId={item?.setId}
                          // Disable={"CardDisebal"}                            
                          cardHeader={`${item?.cardName}`}
                          id={item?.cardId}
                          BackSideCard={BackSideCard}
                          fulldata={item}
                          flipCard={backCards?.includes(item?.cardId)}
                        />
                      );
                    } else {

                      if (filterCard.length - 1 == ind && cardPart.length - 1 == index) {
                        
                        return <div className="d-flex justify-content-center"> {notFound == false && <p style={{ color: "black", fontSize: "14px" }}>Data Not Found</p>}</div>
                      }
                    }
                  }
                  else {
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
                      />
                    );
                  }
                })}
                {/* {showWincardTExt ==true ? } */}
              </SwiperBar>
            </div>
          })
            : ""
          }
        </SummerCard> :
        <div className="d-flex justify-content-center mt-5">
          {cardShow == true && <p style={{
            color: "black"
          }}>Data Not Found</p>}
          {cardShow == false && myCards == true && <p style={{
            color: "black"
          }}>First Select Colloction</p>}
        </div>
      }



    </div >
  );
};

export default ProfileNftGalleryCopy;