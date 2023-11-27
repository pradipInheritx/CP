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
  display: grid;
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
`

const AvatarsModal = ({ onSubmit, onClose }: AvatarsModalProps) => {
  const { setFirstTimeAvatarSelection, setShowMenuBar } = useContext(AppContext);
  const translate = useTranslation();
  const { width } = useWindowSize();
  const { userInfo,user } = useContext(UserContext);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [image, setImage] = useState(null);
  const [imagePath, setImagepPath] = useState(null);
  const [bio, setBio] = useState("");
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    // @ts-ignore
    fileInputRef.current!.click();
  };

  const handleImageChange = (e:any) => {
    const file = e.target.files[0];
    if (file) {
      setImagepPath(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        // @ts-ignore
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (imagePath) {
      try {
        const formData = new FormData();
        formData.append('file', imagePath);
        // @ts-ignore
        const response = await axios.post(`https://us-central1-coin-parliament-staging.cloudfunctions.net/api/v1/generic/user/uploadAvatar/${user?.uid}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });        
        if (response.data.status) {
          showToast(response.data.message, ToastType.SUCCESS);
        } else {          
          showToast(response.data.message, ToastType.ERROR);
        }
      } catch (error) {        
        showToast("Error uploading image", ToastType.ERROR);
      }
    }
  };

  const UpdateBio = async () => {
    if (user?.uid) {      
      const userRef = doc(db, "users", user?.uid);
      await setDoc(userRef, {bio:bio}, { merge: true });
    }
}

  return (
    <Container className="position-relative">
      {/* <div className="position-absolute top-0" style={{ right: 0 }}>
        {pathname.includes('profile') && <div className="p-2 pl-0 close" role="button" onClick={onClose}>
          <CloseIcon aria-hidden="true">&times;</CloseIcon>
        </div>}
      </div> */}
      {!selectedAvatar && (<>
        <Title>{translate("Select Your Avatar")}</Title>
        <Flex {...{ width }}>
          {Object.values(AvatarType).map((type, i) => (
            <AvatarRadio
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

            />
          ))}
        </Flex>

        <div className={`${window.screen.width > 767 ? "w-100" : "w-100 flex-column"} d-flex`}>
          <div className={`${window.screen.width > 767 ? "w-50" : "w-100 flex-column"} mt-4 d-flex justify-content-center align-items-center`}>
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
                width:"150px",
                height: "150px",
                borderRadius: "75px",
                overflow: "hidden",
                position: "relative",
              }}

            >
              <Image
                
                src={image || Avatar}
                alt="Avatar"
                onClick={handleAvatarClick}
                className="img-fluid Homeimg"
                style={{ cursor: 'pointer' }}
              />              
            </div>
            <Button variant="primary" onClick={handleUpload} disabled={!image} className={`${window.screen.width <767 ? "mt-3" :"mx-2"}`}>
              Upload
            </Button>
          </div>
          <div className={`${window.screen.width > 767 ? "w-50" : "w-100"} mt-4 d-flex justify-content-center align-items-center`}>
            <input
              style={{
                border: "none",
                borderRadius: "3px",
                height: "40px",
                width:`${window.screen.width > 767 ? "50%":"60%"}`
              }}
              name="bio"
              onChange={(e) => {
                setBio(e.target.value)
              }}
              placeholder=" Add Bio"
              type="text" id="" />
            <Button variant="primary" onClick={UpdateBio} disabled={!bio} className={`${window.screen.width < 767 && ""} mx-2`}>
              Add 
            </Button>
          </div>
        </div>
        <div className="d-flex justify-content-center text-center mt-4">
          <span style={{ fontSize: '2em', color: '#6e53ff', cursor: 'pointer' }} onClick={() => {
            if (!userInfo?.avatar) {
              onSubmit(defaultAvatar);
            }
            setFirstTimeAvatarSelection(false);
            setShowMenuBar(false);
          }}>{image !=null ?"Next":"Skip"}</span>
        </div>
      </>)}
      {selectedAvatar && (<ModelWrapper style={{ left: window.screen.width > 979 ? "38%" : "auto" }} ><NFT setSelectedAvatar={setSelectedAvatar} id={selectedAvatar} /></ModelWrapper>)}
    </Container>
  );
};

export default AvatarsModal;
