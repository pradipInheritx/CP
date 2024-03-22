import React, {useContext} from "react";
import UserContext from "../Contexts/User";
import SignupForm from "../Components/LoginComponent/SignupForm";
import {useLocation, useNavigate} from "react-router-dom";
import {User} from "firebase/auth";
import {httpsCallable} from "firebase/functions";
import {functions} from "../firebase";
import {SignupRegular} from "../common/models/Login";
import NotificationContext, {ToastType} from "../Contexts/Notification";

const Refer = () => {
  const {setUser} = useContext(UserContext);
  const search = useLocation().search;
  const refer = new URLSearchParams(search).get("refer");
  let navigate = useNavigate();
  const {showToast} = useContext(NotificationContext);
  const assignReferrer = async (params: User) => {
    const assign = httpsCallable(functions, "assignReferrer");
    await assign({parent: refer, child: params.uid});
    navigate("/");
  };

  return (
    
    <SignupForm
    emailValue=''
      callback={{
        successFunc: async (params:any) => {
          await assignReferrer(params);
          setUser(params);
        },
        errorFunc: (e:any) => showToast(e.message, ToastType.ERROR),
      }}
      signup={SignupRegular}
    />

  );
};

export default Refer;
