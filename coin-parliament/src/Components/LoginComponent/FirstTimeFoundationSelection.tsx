import React, {  useContext } from "react";
import "./Login.css";
import { Stack } from "react-bootstrap";
import { useTranslation } from "../../common/models/Dictionary";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import AvatarsModal from "../Profile/AvatarsModal";
import { AvatarType } from "../../assets/avatars/Avatars";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { texts } from "./texts";
import styled from "styled-components";
import { Buttons } from "../Atoms/Button/Button";

const FoundationArray=['Foundation One','Foundation Two','Foundation Three','Foundation Four','Foundation Five'
]
const Title = styled.div`
  font: var(--font-style-normal) normal medium 22px/11px
    var(--font-family-poppins);
  font-size: var(--font-size-22);
  letter-spacing: var(--character-spacing-0);
  color: var(--black);
  text-align: center;
  opacity: 1;
  padding: 20px;
  font-weight:400 !important;
  align-self:'start';
`;
const Skip = styled.span`
text-decoration:underline;
color:var(--blue-violet);
align-self:center;
`;

export type FirstTimeFoundationSelectionProps = {
    user: any;
    setFirstTimeFoundationSelection:any
  };
const FirstTimeFoundationSelection = ({ user ,setFirstTimeFoundationSelection}: FirstTimeFoundationSelectionProps) => {
  const translate = useTranslation();
  const {showToast} = useContext(NotificationContext);
  const onSubmitAvatar = async (type: AvatarType) => {
    if (user?.uid) {
      const userRef = doc(db, "users", user?.uid);
      try {
        await setDoc(userRef, {avatar: type}, {merge: true});
        showToast(translate("user info was updated"));
        toast.dismiss();
      } catch (e) {
        showToast(translate("user failed to be updated"), ToastType.ERROR);
      }
    }
  };
  return (
    <Stack
      gap={2}
      className=" justify-content-center"
      style={{ minHeight: "100vh", background:'var(--light-purple)' }}
    >
            <Title>{translate(texts.FoundationSelect)}</Title>  
            <div style={{width:window.screen.width>979?'25%':'75%', alignSelf:'center'}}>
              {FoundationArray?.map(item=> <Buttons.Primary style={{fontSize:'17px',fontWeight:300, padding:'10px', width:'10%',margin:'10px 0px'}} fullWidth={true} onClick={()=>setFirstTimeFoundationSelection(false)}>
         {item}
      </Buttons.Primary> )}
      </div>
      <Skip onClick={()=>setFirstTimeFoundationSelection(false)}>Skip</Skip>
    </Stack>
  );
};

export default FirstTimeFoundationSelection;
