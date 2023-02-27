/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import MyCarousel from "../Components/Carousel/Carousel";

import NftOneCard from "./NftOneCard";


import "./styles.css";
import SwiperBar from "./SwiperBar";
import firebase from "firebase/compat";


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
  const [allTypeofCard, setAllTypeofCard] = useState<any>([])
  


    const getNftCard = () => {
  const getCollectionType = firebase
            .firestore()
            .collection("nft_gallery")
    getCollectionType.get()
      .then((snapshot) => {        
        // console.log("snapshot.docs",snapshot.docs.map((doc) => doc.data()));
       let allcollection= snapshot.docs.map((doc) => doc.data())
        setCollectionType(allcollection)
        
        allcollection?.map((allcolloection: any) => {
          setAllTypeofCard([...allTypeofCard,allcolloection]) 
          // allcolloection?.map((allcard:any) => {
          //  setAllTypeofCard([...allTypeofCard,allcard]) 
          // })
          
        })

        // setAllTypeofCard

        // console.log(allcollection,"allcollection")
        
      }).catch((error) => {
        console.log(error,"error");
      })
      ;    
}

useEffect(() => {
    getNftCard()
  }, [])
     
  
  console.log(allTypeofCard,"allcollection");

  return (
    <div className='' style={{ background: "white", minHeight: "80vh" }}>

<div className='d-flex justify-content-center pt-5 flex-wrap '>
            <input
              type='text'
              name="hello"
              // onChange={(e) => {
              //   HandleFilterByInput(e.target.value);
              // }}
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
              >
                <option value='volvo'>Select Collection</option>
                <option value='SUMMER'>SUMMER</option>
                <option value='saab'>WINTER</option>
              </select>
              <select
                name='type'
                id='type'
                className='bg-white border rounded mx-2 py-2'
                // onChange={(e)=>{HandelonchangeFilter(e)}}
              >
                <option value=''>Select Type</option>
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
                {/* <option value='volvo'>Card Type</option> */}
                <option value='saab'>Card NO.</option>
                <option value='mercedes'>Card Name</option>
                {/* <option value='audi'>Collection</option> */}
              </select>
            </div>
          </div>

      <GalleryType className='' style={{width:`${window.screen.width >787 ? "800px":"100%"}`}} >
        {/* <div onClick={() => navigate("/nftAlbum/Winter")}>
          <p>WINTER COLLECTION</p>
        </div>
        <div onClick={() => navigate("/nftAlbum/Summer")}>
          <p>SUMMER COLLECTION</p>
        </div> */}
        {collectionType?.map((data:any) => {
          return <div onClick={() => { navigate(`/nftAlbum/${data?.collectionName}`)}}>
          <p>{data?.collectionName} COLLECTION</p>
        </div>
        })}
       
      </GalleryType>
    </div>
  );
};

export default NFTGallery;
