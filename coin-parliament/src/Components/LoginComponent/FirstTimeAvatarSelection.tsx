import React, {  useContext, useEffect, useState } from "react";
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
import axios from "axios";



export type FirstTimeAvatarSelectionProps = {
    user: any;
    setFirstTimeAvatarSelection:any;
  setSelectBioEdit: any;
};
const FirstTimeAvatarSelection = ({ user, setFirstTimeAvatarSelection, setSelectBioEdit }: FirstTimeAvatarSelectionProps) => {  
  const translate = useTranslation();
  const { showToast } = useContext(NotificationContext);
  const { setFirstTimeLogin, setShowMenuBar } = useContext(AppContext);
  // const [FoundationArray, setFoundationArray] = useState([])
  var FoundationArray = ["Foundation one", "Foundation two", "Foundation three","Foundation four"];

  // const FoundationValue = async () => {
  //   axios.get(`/admin/foundation/getList`).then((res) => {
  //     const FoundData = res.data.foundationList
  //     const makeFroundArray: any = []
  //     FoundData.map((item: any, number: number) => {
  //       makeFroundArray.push({ id: item.id, name: item.name, })
  //     })
  //     setFoundationArray(makeFroundArray)
  //   }).catch((err) => {
  //     console.log(err, "foundationListerr")
  //   })
  // }

  useEffect(() => {
    // FoundationValue()
  }, [])

  const onSubmitAvatar = async (type: AvatarType) => {
    console.log(FoundationArray, "FoundationArray")
    if (user?.uid) {
      setSelectBioEdit(true)
      const userRef = doc(db, "users", user?.uid);
      try {
        const foundationName = FoundationArray[Math.trunc(Math.random() * FoundationArray.length)]

        await setDoc(userRef, { avatar: type, foundationName }, { merge: true });
        // await setDoc(userRef, { foundationName }, { merge: true });
        showToast(translate(texts.UserInfoUpdate));
        toast.dismiss();
        setFirstTimeAvatarSelection(false)
        // setShowMenuBar(false)        
      } catch (e) {
        showToast(translate(texts.UserFailUpdate), ToastType.ERROR);
      }
    }
  };

  return (
    <Stack
      gap={2}
      className=" justify-content-center"
      style={{
        minHeight: "100vh", background: 'var(--light-purple)', flexDirection: 'row',
        overflow: "hidden"
      }}
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
