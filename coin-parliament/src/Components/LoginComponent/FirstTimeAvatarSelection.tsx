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



export type FirstTimeAvatarSelectionProps = {
    user: any;
    setFirstTimeAvatarSelection:any;
  };
const FirstTimeAvatarSelection = ({ user,setFirstTimeAvatarSelection }: FirstTimeAvatarSelectionProps) => {
  const translate = useTranslation();
  const {showToast} = useContext(NotificationContext);
  const onSubmitAvatar = async (type: AvatarType) => {
    if (user?.uid) {
      const userRef = doc(db, "users", user?.uid);
      try {
        await setDoc(userRef, {avatar: type}, {merge: true});
        showToast(translate("user info was updated"));
        toast.dismiss();
        setFirstTimeAvatarSelection(false)
      } catch (e) {
        showToast(translate("user failed to be updated"), ToastType.ERROR);
      }
    }
  };
  return (
    <Stack
      gap={2}
      className=" justify-content-center"
      style={{ minHeight: "100vh", background:'var(--light-purple)' ,paddingTop:'100px',flexDirection:'row'}}
    >
      <AvatarsModal
         {...{
          onSubmit: onSubmitAvatar,
          onClose: () => console.log('click'),
          }}
         />                
    </Stack>
  );
};

export default FirstTimeAvatarSelection;
