/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import MyCarousel from "../Components/Carousel/Carousel";

import NftOneCard from "./NftOneCard";
// @ts-ignore
import Wildwest from '../assets/avatars/videos/Monsoon.mp4'; import Winter from '../assets/avatars/videos/Winter.mp4'; import Summer from '../assets/avatars/videos/Summer.mp4'; import Space from '../assets/avatars/videos/Science.mp4';
import PartlyCloudy from '../assets/images/PartlyCloudy.png'; import Lightning from '../assets/images/Lightning.png'; import Snowing from '../assets/images/Snowing.png'; import Raining from '../assets/images/Raining.png';
import lock from '../assets/images/lock.png';

import "./styles.css";
import SwiperBar from "./SwiperBar";
import firebase from "firebase/compat";
import { Ratio } from "react-bootstrap";
import { texts } from "../Components/LoginComponent/texts";
import AppContext from "Contexts/AppContext";
import SetsScreen from "./SetsScreen";


const GalleryType = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  // justify-content:space-around;
  justify-content:${window.screen.width > 767 ? "space-between" : "center"};
  color: black;
  & div {
    // border: 1px solid #5f4ce3;
    width:${window.screen.width < 767 ? "80%" : "340px"};
    height:${window.screen.width < 767 ? "91px" : "100px"};
    // height:71px;
    margin: 10px 0px;
     
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
  // background-color: #f8f9fa;
`;
const Colortext = styled.p`
font-size:15px;
    background: -webkit-linear-gradient(270deg, #FEFEFE 35.94%, #3C1ABA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  const [collectionTypeNew, setCollectionTypeNew] = useState<any>()
  const [allTypeofCard, setAllTypeofCard] = useState<any>([])
  const [allTypeofCardNew, setAllTypeofCardNew] = useState<any>([])
  const [allCardArray, setAllCardArray] = useState<any>([])
  const { albumOpen, setAlbumOpen } = useContext(AppContext);
  const [searchedCard, setSearchedCard] = useState<any>([])
  const [searchedCardNew, setSearchedCardNew] = useState<any>([])
  const [allCard, setAllCard] = useState<any>([])
  const [allCardArrayNew, setAllCardArrayNew] = useState<any>([])
  const [allCardNew, setAllCardNew] = useState<any>([])
  const [cardType, setCardType] = useState<any>('all')
  const [searchTerm, setSearchTerm] = useState<any>('')
  const [selectCollection, setSelectCollection] = useState<any>('none')
  const [backCards, setBackCards] = useState<any>([]);
  const [equalPart, setEqualPart] = useState<any>([]);
  const [cardShow, setCardShow] = useState<any>(false);
  const [collection, setCollection] = useState<any>()
  const [setsCardId, setSetsCardId] = useState<any>('none')
  const [setsValue, setSetsValue] = useState<any>([])
  const [setsCardName, setSetsCardName] = useState<any>('none')
  const [cardName, setCardName] = useState<any>([])
  const [cardNameNew, setCardNameNew] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false);
  const [allVideo, setAllVideo] = useState<any>({
    Wildwest: Wildwest,
    Winter: Winter,
    Summer: Summer,
    Space: Space,
  })
  const [TypeWather, setTypeWather] = useState<any>(
    [
      { name: "Partly Cloudy", image: PartlyCloudy },
      { name: "Raining", image: Raining },
      { name: "Snowing", image: Snowing },
      { name: "Lightning", image: Lightning }
    ]
  )


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
  }, [albumOpen])



  const getNftCardNew = () => {
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
        setIsLoading(false)
        console.log(data, "allcardData")
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
          console.log(collectionName, "collectionName")
          const data: any = []
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          data.sort((a: any, b: any) => a.setName.localeCompare(b.setName))
          setCardNameNew(data)
          setAllCardNew(data)
          setCardShow(true)
        }).catch((error) => {
          console.log(error, "error");
        });
      const getAlbumId = collectionType && collectionType?.filter((item: any, index: number) => item.albumName == collectionName)
      const getSetsType = firebase
        .firestore()
        .collection("nftGallery")
        // .doc(collectionName)
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
          console.log("setsdata", data)
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
      serchresult.sort((a: any, b: any) => a.setName.localeCompare(b.setName))
      setCardNameNew(serchresult)
      setAllCardNew(serchresult)
    }
    else {
      const serchValue = allCardArrayNew.filter((card: any) => card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()) && card?.albumName == selectCollection)
      const serchCard = serchValue.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId)
      const serchresult = serchCard.filter((card: any) => cardType != "all" ? card.cardType == cardType.toUpperCase() : card.cardType != cardType.toUpperCase())
      serchresult.sort((a: any, b: any) => a.setName.localeCompare(b.setName))
      setCardNameNew(serchresult)
      setAllCardNew(serchresult)
    }
  }


  const onSelectType = (cardType: any) => {
    setCardType(cardType)
    console.log(setsCardId, "setsCardId")
    if (cardType === 'all') {
      const typeCard = allCardArrayNew.filter((card: any) => card.cardType != cardType.toUpperCase() && card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      const forcardName = typeCard.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId && card.albumName == selectCollection)
      forcardName.sort((a: any, b: any) => a.setName.localeCompare(b.setName))
      setCardNameNew(forcardName)
      setAllCardNew(forcardName)

      setSetsCardName("none")
    }
    else {
      setCardShow(true)
      const typeCard = allCardArrayNew.filter((card: any) => card.cardType === cardType.toUpperCase() && card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      const forcardName = typeCard.filter((card: any) => setsCardId != "none" ? card?.setId == setsCardId : card.setId !== setsCardId && card.albumName == selectCollection)
      console.log(forcardName, "forcardNamecard")
      setCardNameNew(forcardName)
      setAllCardNew(forcardName)
      setSetsCardName("none")
    }
  }

  const onSelectSets = (cardId: any) => {
    setSetsCardId(cardId)
    if (cardId === 'none') {
      const cardWithId = allCardArrayNew.filter((card: any) => card.setId !== cardId && card.albumName == selectCollection)
      const forcardName = cardWithId.filter((card: any) => cardType == "all" ? card?.cardType !== cardType.toUpperCase() : card?.cardType == cardType.toUpperCase() && card?.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      forcardName.sort((a: any, b: any) => a.setName.localeCompare(b.setName))
      setCardNameNew(forcardName)
      setAllCardNew(forcardName)
      setSetsCardName("none")
    }
    else {
      setCardShow(true);
      const cardWithId = allCardArrayNew.filter((card: any) => card.setId == cardId && card.albumName == selectCollection)
      const forcardName = cardWithId.filter((card: any) => cardType == "all" ? card.cardType !== cardType.toUpperCase() : card.cardType == cardType.toUpperCase() && card.cardName?.toLowerCase()?.includes(searchTerm.toLowerCase()))
      setCardNameNew(forcardName)
      setAllCardNew(forcardName)
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
      finalValue.sort((a: any, b: any) => a.setName.localeCompare(b.setName))
      setAllCardNew(finalValue)
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



  console.log(albumOpen, "nftAlbum")

  useEffect(() => {
    getNftCardNew()
    setIsLoading(true)
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


  console.log(setsCardName,"setsCardName")
  // use searched card for showing searchdata


  const BackSideCard = (value: string | number) => {
    // @ts-ignore
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
      const DivideEqual = arr?.slice(i, i + partSize);
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

  const getSno = (Snumber: any) => {
    console.log(Snumber.slice(0, -2), "Snumber")
  }



  console.log(allCardNew, "allCardNewcheck")

  return (
    <div className=''
    // style={{ minHeight: "auto" }}
    >
      <h5 className="mt-4 text-center ">        
        <strong style={{ textTransform: 'uppercase', fontSize: "1.26rem" }}>Wall of fame</strong>
      </h5>
      <div className='d-flex justify-content-center mt-2  flex-wrap w-100 py-2'
      // style={{background:"#6352e8"}}
      >
        <input
          type='text'
          onChange={e => onSearch(e.target.value)}
          // onChange={(e)=>{HandelonchangeFilter(e)}}
          placeholder='Search...'
          className='py-2 mx-2 color-back '
          style={{ width: "200px" }}

        />
        <div className={`${window.screen.width < 767 ? "py-3 d-flex" : ""} `}>
          <select
            className='color-back py-2 mx-2'
            value={selectCollection}
            // onChange={e=>onCollectionChange(e.target.value)}          
            onChange={e => setSelectCollection(e.target.value)}
            style={{
              width: "140px"
            }}
          >
            <option value='none'>{texts.SelectCollection}</option>


            {collectionType?.map((data: any, index: number) => {
              return <option selected value={data?.albumName} key={index}>{data?.albumName}</option>
            })}
            {/* <option value='Summer'>SUMMER</option>
                <option value='Winter'>WINTER</option>
                <option value='Monsoon'>Monsoon</option> */}
          </select>
          <select
            className='  color-back py-2 mx-1'
            // onChange={e=>onCollectionChange(e.target.value)}
            onChange={e => onSelectSets(e.target.value)}
            value={setsCardId}
            style={{
              width: "140px"
            }}
          >
            <option value='none'>{texts.SelectSets}</option>
            {setsValue?.map((data: any, index: number) => {
              // return  <option value={ data?.setId} key={index}>{`${((data?.setName)?.toUpperCase())?.slice(0, 3) + data?.setId}`}</option>        
              return <option selected value={data?.id} key={index}>{`${((data?.setName)?.toUpperCase())}`}</option>
            })}
          </select>
        </div>
        <div className={`${window.screen.width < 767 ? "" : ""} `}>
          <select
            name='type'
            id='type'
            className='  color-back mx-1 py-2'
            onChange={(e) => { onSelectType(e.target.value) }}
            value={cardType}
            style={{
              width: "140px"
            }}
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
            className='  color-back py-2 mx-1'
            // onChange={e=>onCollectionChange(e.target.value)}
            onChange={e => onSelectName(e.target.value)}
            value={setsCardName}
            style={{
              width: "140px"
            }}
          >
            <option value='none'>{texts.SelectName}</option>
            {cardNameNew?.map((data: any, index: number) => {
              return <option selected value={data?.cardName} key={index}>{`${data?.cardName}`}</option>
            })}
          </select>
        </div>
      </div>

      {/* @ts-ignore */}      
      {isLoading && <div style={{
        position: 'fixed',
        height: '100%',
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        top: '0px',
        right: '0px',
        bottom: '0px',
        zIndex: '9999',
        overflow: 'hidden',
        width: '100%',
        alignItems: 'center',

      }}>
        <span className="loading" style={{ color: "White", zIndex: "2220px", fontSize: '1.5em' ,marginTop:"50px"}}>
          {texts.waitForIt}
        </span>
      </div>}

      
      <GalleryType className='d-flex' style={{ width: `${window.screen.width > 787 ? "800px" : "100%"}` }} >
        {(!cardShow && selectCollection === 'none') && collectionType?.map((data: any, index: number) => {
          return <div className="" onClick={() => { setSelectCollection(data?.albumName) }} key={index}
            style={{
              width: "380px",
              overflow: "hidden",
              height: "108px",
              borderRadius: "10px",
            }}
          >
            {data?.albumVideoUrl ?
              <img src={data?.albumVideoUrl} width={'100%'} height={'100%'} />
              :
              <p style={{ color: "white" }}>{data?.albumName}</p>
            }
            {/* <p>{data?.collectionName} COLLECTION</p> */}
          </div>
        })}
        {(!cardShow && selectCollection === 'none' && collectionType) && TypeWather?.map((data: any, index: number) => {
          return <div
            // onClick={() => { setSelectCollection(data?.id) }} key={index}
            style={{
              width: "380px",
              //  height:"150px",             
              background: `linear-gradient(0deg, rgba(84, 60, 214, 0.85), rgba(84, 60, 214, 0.85)) , url(${data.image})`,
              borderRadius: "10px",
              backgroundSize: "cover",
            }}
            className="d-flex justify-content-center align-items-center flex-column"
          >
            {/* <i className="bi bi-lock-fill"
          style={{fontSize:"50px"}}
          ></i>   */}
            <img src={lock} alt="" width={"30px"} />

            <Colortext className="mt-2"
              style={{
                // color:"linear-gradient(180deg, #FEFEFE 52.94%, #3618A8 94.05%)",
                // background: "linear-gradient(rgb(188, 12, 241), rgb(212, 4, 4))",

              }}
            >{data.name.toUpperCase()}</Colortext>
          </div>

        })}
      </GalleryType> 
      
      
      {
        selectCollection !== "none" && setsCardId == "none" && setsCardName == "none" && cardType =="all" && <>
          <div className="w-100 d-flex">
            <div className={`${window.screen.width > 767 ? "" : ""} d-flex justify-content-between flex-wrap`} style={{}}>
              {setsValue.map((item:any,index:number) => {
                return <SetsScreen
                  onSelectSets={onSelectSets}                  
                  allCardNew={allCardNew}
                  setsValue={item}
                />
              })}
            </div>
          </div>
        </>
      }
      {/* <GalleryType2 className='' style={{
        width: `${window.screen.width > 787 ? "800px" : "100%"}`,
        margin: "40px auto",
        
      }} >     
        </GalleryType2>      */}
      {allCardNew?.length > 0 && (setsCardId != "none" || setsCardName != "none" || cardType != "all")  ?
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
                      BackCardName={item?.cardName}
                      Rarity={item?.cardType}
                      Quantity={item?.totalQuantity}
                      holderNo={item?.noOfCardHolders}
                      // cardNo={`${((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
                      // cardNo={item?.sno[index]}
                      // GeneralSerialNo={`${((item.collectionName)?.toUpperCase())?.slice(0, 3) + ((item?.setName)?.toUpperCase())?.slice(0, 3) }`}
                      cardNo={`${((item?.cardName)?.toUpperCase())?.slice(0, 2) + (item?.id)?.slice(0, 2)}`}
                      GeneralSerialNo={item?.sno && (item?.sno[0])?.replace(/[0-9]/g, '')}
                      Serie={item?.setName || "Set" + (index + 1)}
                      CollectionType={item?.albumName || "LEGENDARY"}

                      userId={item?.setId}
                      // CollectionType={item?.collectionName}
                      // CollectionType={item?.albumId}
                      // Disable={"CardDisebal"}                            
                      cardHeader={`${item?.cardName}`}
                      id={item?.id || item?.cardId}
                      BackSideCard={BackSideCard}
                      fulldata={item}
                      flipCard={backCards?.includes(item?.id)}
                      ImgUrl={item?.cardImageUrl || ""}
                      VideoUrl={item?.cardVideoUrl || ""}
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

export default NFTGallery;
