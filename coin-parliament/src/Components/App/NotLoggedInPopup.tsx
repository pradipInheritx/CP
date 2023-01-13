import React, { useContext } from "react";
import { toast } from "react-toastify";
import { Buttons } from "../Atoms/Button/Button";
import Popup from "./Popup";
import AppContext from "../../Contexts/AppContext";
import { useTranslation } from "../../common/models/Dictionary";

export type NotLoggedInProps = {
  content?: React.ReactNode;
};

const NotLoggedInPopup = ({
  content = "You are not logged in!",
}: NotLoggedInProps) => {
  const translate = useTranslation();
  const { setLogin, setSignup } = useContext(AppContext);

  return (
    <Popup
      closeButton={false}
      buttons={[
        <Buttons.Default
          onClick={() => {
            setLogin(true);
            toast.dismiss();
          }}
          className="me-1"
        >
          Login
        </Buttons.Default>,
        <Buttons.Default
          onClick={() => {
            setLogin(true);
            setSignup(true);
            toast.dismiss();
          }}
        >
          Signup
        </Buttons.Default>,
      ]}
      content={
        <p>{typeof content === "string" ? translate(content) : content}</p>
      }
      wrapper={false}
    />
  );
};

export default NotLoggedInPopup;
