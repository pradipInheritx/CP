import React, { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "../../common/models/Dictionary";
import { AvatarType, defaultAvatar } from "../../assets/avatars/Avatars";
import AvatarRadio from "./AvatarRadio";
import NFT from "../../assets/avatars/NFT";
import { useWindowSize } from "../../hooks/useWindowSize";
import UserContext from "../../Contexts/User";
import { useLocation, useNavigate } from "react-router-dom";
import AppContext from "Contexts/AppContext";
import { Image } from "react-bootstrap";
import axios from "axios";
import Button from "Components/Atoms/Button/Button";
import Avatar from '../../assets/images/avatar.svg';
import { ToastType } from "Contexts/Notification";
import { showToast } from "App";
import { db } from "firebase";
import { doc, setDoc } from "firebase/firestore";
import UploadImg from '../../assets/images/UploadImg.svg';
import ImageCompressor from 'image-compressor.js';
import { texts } from "Components/LoginComponent/texts";

type AvatarsModalProps = {
  onSubmit: (type: AvatarType) => Promise<void>;
  onClose: () => void;
  setFirstTimeAvatarSelection?: React.Dispatch<React.SetStateAction<boolean>>
  setShowMenuBar?: React.Dispatch<React.SetStateAction<boolean>>
};

const Title = styled.div`
  font: var(--font-style-normal) normal medium 22px/11px
    var(--font-family-poppins);
  font-size: var(--font-size-22);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-6352e8);
  text-align: center;
  opacity: 1;
  padding: 20px;
  font-weight:400 !important;
`;

const Flex = styled.div`
  // display: grid;
  grid-template-columns: repeat(
    ${(props: { width?: number }) =>
    props.width && props.width > 969 ? "5" : "2"},
    1fr
  );
  grid-gap: 10px;
  align-items: center;

  > div {
    align-self: center;
    justify-self: center;
  }
`;
const ModelWrapper = styled.div`
width:${window.screen.width > 979 ? '350px' : ''}

`;

const Container = styled.div`
  background: var(--color-d4d0f3) 0 0% no-repeat padding-box;
  padding: 10px;
`;
const CloseIcon = styled.span`
color: var(--color-6352e8);
font-size: var(--font-size-22);
`;

const CustomBox = styled.div`
padding:0px 20px;
  max-width: 183px;
  background: rgba(255,255,255,0.47) 0 0% no-repeat padding-box;
  box-shadow: 0 3px 6px #00000029;
  border-radius: 6px;
  border: none;
  height:320px;
`;

const ButtonBox = styled.button`
width:100%;
text-align: center;
background: transparent linear-gradient(180deg,var(--color-6352e8) 0%,#3712b3 100%) 0 0 no-repeat padding-box;
box-shadow: 0 3px 6px #00000029;
border: 1px solid #707070;
border-radius: 47px;
padding: 6px;
opacity: 1;
font: var(--font-style-normal) normal var(--font-weight-bold) var(--font-size-13) / var(--line-spacing-13) var(--font-family-poppins);
-webkit-letter-spacing: var(--character-spacing-0);
-moz-letter-spacing: var(--character-spacing-0);
-ms-letter-spacing: var(--character-spacing-0);
letter-spacing: var(--character-spacing-0);
color: var(--color-ffffff);
margin-bottom:10px;
`;

const AvatarsModal = ({ onSubmit, onClose }: AvatarsModalProps) => {
  const { setFirstTimeAvatarSelection, setShowMenuBar, setSelectBioEdit, avatarImage, setAvatarImage } = useContext(AppContext);
  const translate = useTranslation();
  const { width } = useWindowSize();
  const { userInfo,user } = useContext(UserContext);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePath, setImagepPath] = useState(null);
  const [bio, setBio] = useState("");
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarClick = () => {
    // @ts-ignore
    fileInputRef.current!.click();
  };

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    const maxSizeInBytes = 11 * 1024 * 1024; // 2 MB 
    const imageCompressor = new ImageCompressor();
    const compressedImage = await imageCompressor.compress(file, {
      quality: 0.6,
    });
    if (compressedImage.size < maxSizeInBytes && file.size < maxSizeInBytes) {
      setImageError("")
      // @ts-ignore
      setImagepPath(compressedImage)
      const reader = new FileReader();
      reader.onloadend = () => {
        // @ts-ignore
        setImage(reader.result);
        // @ts-ignore
        setImageUrl(URL.createObjectURL(e.target.files[0]))

      };
      reader.readAsDataURL(file);
    } else {
      setImageError('Image size allowed limit (10 MB)');
      return;
    }
  };

  const handleUpload = async () => {
    setIsLoading(true)
    if (imagePath) {
      setAvatarImage(imageUrl)
      try {
        const formData = new FormData();
        formData.append('file', imagePath);
        // @ts-ignore
        const response = await axios.post(`/generic/user/uploadAvatar/${user?.uid}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });        
        if (response.data.status) {
          showToast(response.data.message, ToastType.SUCCESS);
          setSelectBioEdit(true)
          setFirstTimeAvatarSelection(false);      
          setIsLoading(false)
        } else {          
          showToast(response.data.message, ToastType.ERROR);
          setAvatarImage("")
          setIsLoading(false)
        }
      } catch (error) {        
        showToast("Error uploading image", ToastType.ERROR);
        setAvatarImage("")
        setIsLoading(false)
      }
    }
  };

  return (
    <Container className="position-relative">
      {/* <div className="position-absolute top-0" style={{ right: 0 }}>
        {pathname.includes('profile') && <div className="p-2 pl-0 close" role="button" onClick={onClose}>
          <CloseIcon aria-hidden="true">&times;</CloseIcon>
        </div>}
      </div> */}

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
        backgroundColor: "rgba(0,0,0,0.8)"

      }}>
        <span className="loading" style={{ color: "White", zIndex: "2220px", fontSize: '1.5em', marginTop: "50px" }}>
          {texts.waitForIt}
        </span>
      </div>}
      {!selectedAvatar && (<>
      <div >
        <Title>{translate("Select Your Avatar")}</Title>
        </div>
        <Flex {...{ width }} style={{display:"flex",justifyContent:"center"}}>
          {Object.values(AvatarType).map((type, i) => {
            return <>
              {
                type == "Custom" ?
                  <>                    
                    <CustomBox className={`${window.screen.width > 767 ? "" : ""} d-flex justify-content-between align-items-center flex-column`}>
                      <span className="mt-2" style={{
                        color:"rgb(110, 83, 255)"
                      }}>Custom Avatar</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                          ref={fileInputRef}
                        />

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: "140px",
                            height: "140px",
                            borderRadius: "70px",
                            overflow: "hidden",
                            position: "relative",
                          }}

                        >
                          <Image

                          src={image || UploadImg}
                            alt="Avatar"
                            onClick={handleAvatarClick}
                            className="img-fluid Homeimg"
                            style={{ cursor: 'pointer' }}
                        />
                        </div>
                        {imageError != "" && <span style={{color:"red" , fontSize:"10px"}}>{imageError}</span>}
                      <ButtonBox
                        style={{
                          opacity: `${imageError == "" ? "1":"0.6"}`
                        }}
                        onClick={() => {
                        if (imageError == "")
                        handleUpload()
                      }} disabled={!image} className={`${window.screen.width < 767 ? "mt-3" : "mx-2"}`}>
                          Upload
                        </ButtonBox>
                      </CustomBox>                                          
                  </>
                  :
                  <>
                    {/* <AvatarRadio
                      key={i}
                      type={type}
                      checked={type === (userInfo?.avatar || defaultAvatar)}
                      name={"avatars"}
                      id={"avatar-" + type}
                      onSubmit={() => onSubmit(type)}
                      onClick={(id: string) => {
                        // showModal(<NFT id={id} />);
                        if (!selectedAvatar) setSelectedAvatar(id)
                      }}
                    /> */}
                  </>                  
              }              
              </>    
          })}
        </Flex>

        
        {/* <div className="d-flex justify-content-center text-center mt-4">
          <span style={{ fontSize: '2em', color: '#6e53ff', cursor: 'pointer' }} onClick={() => {
            if (!userInfo?.avatar) {
              onSubmit(defaultAvatar);
            }
            setFirstTimeAvatarSelection(false);
            setSelectBioEdit(true)
            // setShowMenuBar(false);
          }}>{image !=null ?"Next":"Skip"}</span>
        </div> */}
      </>)}
      {selectedAvatar && (<ModelWrapper style={{ left: window.screen.width > 979 ? "38%" : "auto" }} ><NFT setSelectedAvatar={setSelectedAvatar} id={selectedAvatar} /></ModelWrapper>)}
    </Container>
  );
};

export default AvatarsModal;
