import React, { useContext, useEffect, useState } from "react";
import "./Login.css";
import { Button, Stack } from "react-bootstrap";
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
import firebase from "firebase/compat/app";



export type FirstTimeAvatarSelectionProps = {
  user: any;
  setFirstTimeAvatarSelection: any;
  setSelectBioEdit: any;
};
const FirstTimeAvatarSelection = ({ user, setFirstTimeAvatarSelection, setSelectBioEdit}: FirstTimeAvatarSelectionProps) => {
  const translate = useTranslation();
  const { showToast } = useContext(NotificationContext);
  const { setFirstTimeLogin, setShowMenuBar } = useContext(AppContext);
  const [FoundationArray, setFoundationArray] = useState([])
  // var FoundationArray = [];

  const FoundationValue = async () => {
    axios.get(`/admin/foundation/getList`).then((res) => {
      const FoundData = res.data.foundationList
      const makeFroundArray : any =[]
      FoundData.map((item:any,number:number) => {
        makeFroundArray.push({ id: item.id, name: item.name,})
      })
      setFoundationArray(makeFroundArray)
    }).catch((err) => {
      console.log(err, "foundationListerr")
    })    
  }

useEffect(() => {  
  FoundationValue()  
}, [])
  
  // const usersCollection = async () => {
  //   const usersCollectionData = await  firebase
  //     .firestore()
  //     .collection("users").get();
            
  //   usersCollectionData.forEach(async (doc) => {
  //     const userData = doc.data();
  //     const foundationData = FoundationArray[Math.trunc(Math.random() * FoundationArray.length)]  
  //     if (!userData.hasOwnProperty("foundationData")) {
  //       await firebase
  //         .firestore()
  //         .collection("users").doc(doc.id).update({
  //           foundationData: foundationData
  //       });
  //     }
  //   });
  // } 



  const onSubmitAvatar = async (type: AvatarType) => {
    if (user?.uid) {
      setSelectBioEdit(true)
      const userRef = doc(db, "users", user?.uid);
      try {        
        const foundationData = FoundationArray[Math.trunc(Math.random() * FoundationArray.length)]

        await setDoc(userRef, { avatar: type, foundationData }, { merge: true });
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
        minHeight: "100vh", background: 'var(--light-purple)', paddingTop: '100px', flexDirection: 'row' ,
      overflow:"hidden"
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
