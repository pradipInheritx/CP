/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import MyCarousel from "../Components/Carousel/Carousel";

import NftOneCard from "./NftOneCard";


import "./styles.css";
import SwiperBar from "./SwiperBar";
import { db } from "../firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import firebase from "firebase/compat";
import AppContext from "../Contexts/AppContext";

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

const NFTGallery = () => {
  const navigate = useNavigate();
  const [collectionType, setCollectionType] = useState<any>()
  const { nftAlbumData,setNftAlbumData} = useContext(AppContext);

     
  
  console.log(collectionType,"allcollection");

  return (
    <div className='' style={{ background: "white", minHeight: "80vh" }}>
      <GalleryType className='' style={{width:`${window.screen.width >787 ? "800px":"100%"}`}} >
        <div onClick={() => navigate("/nftAlbum/Winter")}>
          <p>WINTER COLLECTION</p>
        </div>
        <div onClick={() => navigate("/nftAlbum/Summer")}>
          <p>SUMMER COLLECTION</p>
        </div>
        {/* {collectionType?.map((data:any) => {
          return <div onClick={() => { setNftAlbumData(data); navigate(`/nftAlbum/${data?.collectionName}`)}}>
          <p>{data?.collectionName} COLLECTION</p>
        </div>
        })} */}
       
      </GalleryType>
    </div>
  );
};

export default NFTGallery;
