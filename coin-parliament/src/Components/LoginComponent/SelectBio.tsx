import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "../../common/models/Dictionary";
import "./Login.css";
import Styles from "./styles";
import { Form, Modal, Stack } from "react-bootstrap";
import { texts } from "./texts";
import InputField from "../Atoms/Input/InputField";
import Button, { Buttons } from "../Atoms/Button/Button";
import styled from "styled-components";
import { Border1pxEbb, BorderRadius4px } from "../../styledMixins";
import { capitalize } from "lodash";
import { functions } from "../../firebase";
import { httpsCallable } from "firebase/functions";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import AppContext from "../../Contexts/AppContext";
import { userConverter } from "../../common/models/User";
import firebase from "firebase/compat";
import UserContext from "../../Contexts/User";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { userInfo } from "os";
import { AvatarType } from "assets/avatars/Avatars";
const Generate = styled(Button)`
  width: auto;
  min-width: auto;
  background: var(--white);
  color: var(--blue-violet);
  border: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
`;

const Input = styled(InputField)`
  border: 0;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  &:focus {
    outline: none;
    box-shadow: 0px 0px 2px white;
}
`;

const Container = styled.div`
  ${Border1pxEbb};
  ${BorderRadius4px};
  display: flex;
`;

export type FirstTimeLoginProps = {
  userData:any
  setSelectBioEdit: any;
  setFirstTimeAvatarSelection?: any;
};

// const checkValidUsername = httpsCallable(functions, "checkValidUsername");



const SelectBio = ({ userData, setSelectBioEdit, setFirstTimeAvatarSelection }: FirstTimeLoginProps) => {

  const translate = useTranslation();
  const { userInfo, user } = useContext(UserContext);
  const { setShowMenuBar } = useContext(AppContext);
  const title = "Add Bio";
   
  const [bio, setBio] = useState("");
  const BioTexts = {
    Angel:
      "A serial entrepreneur, startup blood runs through her veins. She has founded 3 startups in the fashion industry which put her on the list of most powerful women in the world. Ultra-high net worth individual, with a strategic network, seeking highly innovative early-stage companies to ignite her soul. A huge believer in CP and was one of the larger seed investors.",
    Trader:
      "A fast paced, young & confident trader with supernatural abilities to make money under any market conditions. A self made millionaire. Created a name for himself as one of the youngest most influential traders. Not a crowd follower, but a champion at spotting individual market movements that occur on a daily or even hourly time frame. makes fast decisions. Lives by the motto High Risk High reward. ",
    Hodler:
      "A tech savvy enthusiast, extremely knowledgeable, a true leader by experience. A protector & keeper whilst simultaneously fueling advancement. Consistently guiding and nourishing opportunity with true determination picking up followers wherever he goes.",
    Investor:
      "Chairman of one of the world's leading VC’s, Board member of 18 internet & tech companies, portfolio consists predominantly of Crypto and stocks. Is seen as the ‘high priest’ in the investment community. Fast thinker, spots changes in trends ahead of others, but patient with his approach to investing - starts early and looks for fundamental long-term growth.",
    Founder:
      "Established CP and multiple other successful startups which have collectively IPO’s for over 100 Billion. Passionate about new concepts with a radical imagination & clear vision to revolutionize. Holds a high-risk tolerance, extremely knowledgeable and is a hit with the crowds.",    
  };

  useEffect(() => {
    // @ts-ignore
    setBio(BioTexts[userInfo?.avatar] || "")
  }, [])
  
  console.log(bio,"bioCheck")

  const UpdateBio = async () => {
    if (user?.uid) {
      const userRef = doc(db, "users", user?.uid);
      await setDoc(userRef, { bio: bio }, { merge: true });
      setSelectBioEdit(false)
      setShowMenuBar(false);
    }
  }

  return (
    <>
      <Stack
        gap={2}
        className=" justify-content-center"
        style={{ height: "100vh", background: 'var(--light-purple)' }}
      >
        <div className="container-center-horizontal">
          <div className="">
            <Styles.Title>{translate(title)}</Styles.Title>    
            
              <textarea className="form-control" id="exampleFormControlTextarea1"
                style={{
                  width: "300px",
                  minHeight: "100px",
                  fontSize:"13px"
                }}
              value={bio}
              placeholder="Add Bio"
              onChange={(e) => {
                setBio(e.target.value)
              }}
            >   
              
            </textarea>                        
            
            <div className="d-flex justify-content-center">
            <Buttons.Primary
              // fullWidth={true}  
              className="mt-3"
              style={{
                width:"200px"
              }}
              onClick={UpdateBio}
            // disabled={!valid}
            >
              Update
            </Buttons.Primary>
            </div>
          </div>
        </div>
      </Stack>      
    </>
  );
};

export default SelectBio;
