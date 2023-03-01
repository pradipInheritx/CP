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


// import { Firestore } from "firebase/firestore";

const GalleryType = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  color: black;
  & div {
    border: 1px solid #5f4ce3;
    margin: 50px 10px;
    cursor: pointer;
    padding: 20px 20px;
    $ p {
    }
  }
`;

const ProfileNftGallery = () => {
  
  const navigate = useNavigate();
  const [collectionType, setCollectionType] = useState<any>()

 const getNftCard = () => {
  const getCollectionType = firebase
            .firestore()
            .collection("nft_gallery")
    getCollectionType.get()
      .then((snapshot) => {        
        // console.log("snapshot.docs",snapshot.docs.map((doc) => doc.data()));
       let allcollection= snapshot.docs.map((doc) => doc.data())
          setCollectionType(allcollection)
        // console.log(allcollection,"allcollection")
        
      }).catch((error) => {
        console.log(error,"error");
      })
      ;    
}


  
  
useEffect(() => {
  getNftCard()
}, [])
  
// console.log(getAllRewardsOfUser(`${user?.uid}`),"CheckAllCArd")
// console.log((user?.uid),"user?.uid")
  return (
    <div className='' style={{ background: "white", minHeight: "80vh" }}>
      <GalleryType
        className=''
        style={{ width: `${window.screen.width > 787 ? "800px" : "100%"}` }}
      >
        {/* <div onClick={() => navigate("/profile/Album/WINTER")}>
          <p>WINTER COLLECTION</p>
        </div>
        <div onClick={() => navigate("/profile/Album/SUMMER")}>
          <p>SUMMER COLLECTION</p>
        </div> */}

        {collectionType?.map((data:any) => {
          return <div onClick={() => { navigate(`/profile/Album/${data?.collectionName}`)}}>
          <p>{data?.collectionName} COLLECTION</p>
        </div>
        })}
      </GalleryType>
    </div>
  );
};

export default ProfileNftGallery;
