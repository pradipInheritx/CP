import React, { useContext } from "react";
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
import AppContext from "Contexts/AppContext";



export type FirstTimeAvatarSelectionProps = {
  user: any;
  setFirstTimeAvatarSelection: any;
};
const FirstTimeAvatarSelection = ({ user, setFirstTimeAvatarSelection, }: FirstTimeAvatarSelectionProps) => {
  const translate = useTranslation();
  const { showToast } = useContext(NotificationContext);
  const { setFirstTimeLogin, setShowMenuBar } = useContext(AppContext);
  const FoundationArray = ['Foundation One', 'Foundation Two', 'Foundation Three', 'Foundation Four', 'Foundation Five'
  ]
  const onSubmitAvatar = async (type: AvatarType) => {
    if (user?.uid) {
      const userRef = doc(db, "users", user?.uid);
      try {
        const foundationName = FoundationArray[Math.trunc(Math.random() * 4)]
        await setDoc(userRef, { avatar: type, foundationName }, { merge: true });
        // await setDoc(userRef, { foundationName }, { merge: true });
        showToast(translate(texts.UserInfoUpdate));
        toast.dismiss();
        setFirstTimeAvatarSelection(false)
        setShowMenuBar(false)
      } catch (e) {
        showToast(translate(texts.UserFailUpdate), ToastType.ERROR);
      }
    }
  };
  return (
    <Stack
      gap={2}
      className=" justify-content-center"
      style={{ minHeight: "100vh", background: 'var(--light-purple)', paddingTop: '100px', flexDirection: 'row' }}
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
