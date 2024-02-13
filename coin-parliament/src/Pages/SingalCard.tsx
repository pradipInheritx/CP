/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Leaderboard from "../Components/Leaderboard";
import NftOneCard from "./NftOneCard";
import "./styles.css";
import { leaders as leaders, userInfo as userInfo1 } from "../Components//Coins/testData";
import UserContext from "../Contexts/User";
import CoinsContext from "../Contexts/CoinsContext";
import AppContext from "../Contexts/AppContext";
import { setChecked } from "../common/models/User";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { functions } from "../firebase";
import { httpsCallable } from "@firebase/functions";
import firebase from "firebase/compat/app";
import { Other } from "./SingleCoin";
import { translate, useTranslation } from "../common/models/Dictionary";
import { Ratio } from "react-bootstrap";

const CenterItem = styled.div`
  background-color: #f2f2f2;  
overFlow-x:hidden;
  width:100%;
  
  // & p {
  //   font-weight: 100;
  //   text-align: center;
  //   padding: 20px;
  //   font-size: 20px;
  //   color: #160133;
  //   text-transform: uppercase;
  // }
  // & strong {
  //   // font-weight: 400;
  //   text-align: center;
  //   // padding: 30px;
  //   font-size: 20px;
  //   color: #160133;
    
  // }
`;
const SummerCard = styled.div`
width:${window.screen.width > 767 ? "730px" : "100%"};
margin:auto;
display: flex;
justify-content:center;  
`;

const SingalCard = () => {
  // const [cards, setCards] = useState(

  //   {
  //     id: 1,
  //     cardType: "COMMON",
  //     cardNo: "CP244",
  //     cardHeader: "INVESTOR",
  //     type: "SUMMER",
  //   },

  // );

  const [CardValue, setCardValue] = useState([]);
  const [backCards, setBackCards] = useState<any>([]);
  const { user, userInfo } = useContext(UserContext);
  const { leaders } = useContext(CoinsContext);
  const { albumOpen, setAlbumOpen, userTypes } = useContext(AppContext);
  const [chosen, setChosen] = useState<string | undefined>();


  // console.log(leaders,"allleaders")

  // const BackSideCard = (value: string | number) => {
  //   // @ts-ignore
  //   let allBackCard = backCards;
  //   // @ts-ignore
  //   // setBackCards(backCards == value ? "" : value);
  //   backCards.length > 0
  //     ? backCards?.map((items: any, index: number) => {
  //       if (items == value) {
  //         // @ts-ignore
  //         allBackCard.splice(index, 1);
  //         setBackCards(allBackCard);
  //       } else {
  //         // @ts-ignore

  //         setBackCards([...backCards, value]);
  //       }
  //       // @ts-ignore
  //     })
  //     : setBackCards([...backCards, value]);
  // };


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

  const [cardsDetails, setCardsDetails] = useState<any>()
  const [nftAlbumData, setNftAlbumData] = useState<any>()
  const [followersDetails, setFollowersDetails] = useState<any>()
  const [followersShow, setFollowersShow] = useState<any>([])
  const [singalCardData, setSingalCardData] = useState<any>([])
  // const { singalCardData,setSingalCardData} = useContext(AppContext);

  let params = useParams();
  const translate = useTranslation();
  const { type, id } = params;
  const navigate = useNavigate();


  // const claimReward = httpsCallable(functions, "claimReward");
  const getList = httpsCallable(functions, `cardHolderListing`);
  const getFollwersList = async (id: any) => {



    await getList({ cardId: id }).then((list) => {
      // @ts-ignore          
      const FollowerList = list?.data?.map((items: any) => {
        // console.log(items,"allitems")
        return {
          leaders: items?.leader?.length || 0,
          displayName: items?.displayName,
          userId: items?.uid,
          avatar: items?.avatar,
          status: items?.status?.name,
          phone: items?.phone,
          country: items?.country,
          score: items?.voteStatistics?.score,
          totalVote: items?.voteStatistics?.total,
          subscribers: items?.subscribers.length || 0,
          pct: items?.voteStatistics?.successful / items?.voteStatistics?.total,
          firstName: items?.firstName,
          email: items?.email,
          lastName: items?.lastName,
          isUserUpgraded: items?.isUserUpgraded,
        }
      })
      setFollowersDetails(FollowerList)
    }).catch((error) => {
      console.log(`error: ${JSON.stringify(error)}`);
    });;
  }

  // const getNftCard = () => {
  //   const getCards = firebase
  //     .firestore()
  //     .collection("nft_gallery")
  //     .where("collectionName", "==", type)
  //   getCards.get()
  //     .then((snapshot) => {
  //       let allcollection = snapshot.docs.map((doc) => doc.data())

  //       const collectionType = allcollection?.map((allCard: any) => {
  //         return allCard?.setDetails
  //       })
  //     }).catch((error) => {
  //       console.log(error, "error");
  //     })
  //     ;
  // }
  const getNftCard = async () => {
    try {
      const q = query(collection(db, "nft_gallery"), where("collectionName", "==", type));
      const querySnapshot = await getDocs(q);

      const allcollection = querySnapshot.docs.map((doc) => doc.data());

      const collectionType = allcollection.map((allCard) => allCard?.setDetails);

      return collectionType;
    } catch (error) {
      console.error("Error getting nft cards:", error);
      return null;
    }
  };
  useEffect(() => {
    getFollwersList(id)
    getNftCard()
    // alllist= getList({cardID:id})

  }, [id])
  useEffect(() => {
    // @ts-ignore
    setSingalCardData(JSON.parse(localStorage.getItem("singalCardData")))
    // getCardDetails();
  }, []);
  // const getCardDetails = () => {
  //   const getCard = firebase
  //     .firestore()
  //     .collection("cardsDetails")
  //     .where("cardId", "==", id)
  //   getCard.get()
  //     .then((snapshot) => {
  //       let data = snapshot.docs.map((doc) => doc.data());
  //       if (data.length > 0) {
  //         setSingalCardData(data[0]);
  //       }        

  //     }).catch((error) => {
  //       console.log(error, "error");
  //     })
  //     ;
  // }




  console.log(followersDetails, "followersDetails")


  return (
    <div className=''>
      <div className='h-100 '>


        <CenterItem className="">
          {/* <div className="text-center">
            <p>{cards.cardType}</p>
          </div> */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0px 0px 87px 0px",
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
            }}>
            <SummerCard>
              {/* {nftAlbumData?.map((items:any, index:number) => {
              return ( */}
              <div className=''
                style={{ width: `${window.screen.width < 767 ? "70%" : "38%"}` }}
              >
                {/* @ts-ignore */}

                {/* @ts-ignore */}
                {/* {items?.cards.map((item: any) => {
                      if (item?.cardId == id) {                        
                        return ( */}
                <>
                  <NftOneCard
                    DivClass={singalCardData?.cardType}
                    HeaderText={singalCardData?.cardType}
                    HeaderClass={`${singalCardData?.cardType}_text`}
                    Serie={singalCardData?.setName}
                    BackCardName={singalCardData?.cardName}
                    Rarity={singalCardData?.cardType}
                    CollectionType={singalCardData?.albumName}
                    Quantity={singalCardData?.quantity}
                    holderNo={singalCardData?.noOfCardHolders}
                    cardNo={`${((singalCardData?.cardName)?.toUpperCase())?.slice(0, 2) + (singalCardData?.id)?.slice(0, 2)}`}
                    // GeneralSerialNo={`${((type)?.toUpperCase())?.slice(0, 3) + ((singalCardData?.cardName)?.toUpperCase())?.slice(0, 3) + singalCardData?.cardId}`}
                    // GeneralSerialNo={singalCardData?.sno}
                    GeneralSerialNo={singalCardData?.sno && (singalCardData?.sno[0])?.replace(/[0-9]/g, '')}
                    // Disable={"CardDisebal"}
                    // When you pass CardDisebal this name then card is Disable
                    cardHeader={`${singalCardData?.cardName}`}
                    // cardNo={`${singalCardData.cardNo}`}
                    id={singalCardData?.cardId}
                    BackSideCard={BackSideCard}
                    // flipCard={backCards == singalCardData.id ? true : false}
                    flipCard={backCards?.includes(singalCardData?.cardId)}
                    ImgUrl={singalCardData?.cardImageUrl || ""}
                    VideoUrl={singalCardData?.cardVideoUrl || ""}
                    darkTheme={true}
                    Hide360Icon={true}
                  />
                </>                
              </div >
            </SummerCard>
            <div className="d-flex justify-content-center  pt-2 pb-4">
              <Other onClick={() => {
                // navigate(-1);
                setAlbumOpen(singalCardData?.albumName);
                navigate('/nftAlbum')
              }}>{translate("BACK TO COLLECTION")}</Other>
            </div>
          </div >
          <div>
            <div>
              <div className="text-center my-3">
                <span style={{
                  color: "black",
                  fontWeight: 500,
                  fontSize: "15px"
                }}>Card Holders</span>

              </div>
              <div>
                <Leaderboard
                  {...{
                    expanded: true,
                    leaders: followersDetails?.filter((leader: any) => {
                      return (
                        // @ts-ignore
                        leader?.status?.toLowerCase() === chosen?.toLowerCase() || !chosen
                      );
                    }),
                    userInfo,
                    setChecked: setChecked(leaders, user),
                  }}
                />
              </div>
            </div>
          </div>
        </CenterItem >
      </div >
    </div >
  );
};

export default SingalCard;


