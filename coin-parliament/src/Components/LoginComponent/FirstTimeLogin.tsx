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
  generate: () => string;
  saveUsername: (username: string, DisplayName: string) => Promise<void>;
  setFirstTimeAvatarSelection: any;
};

// const checkValidUsername = httpsCallable(functions, "checkValidUsername");

const FirstTimeLogin = ({ generate, saveUsername, setFirstTimeAvatarSelection }: FirstTimeLoginProps) => {

  const translate = useTranslation();
  const { setFirstTimeLogin } = useContext(AppContext);
  const { user, userInfo } = useContext(UserContext)
  const { showToast } = useContext(NotificationContext);
  const title = texts.chooseUserName;
  const text = texts.chooseUserNameText;
  const [username, setUsername] = useState<string>("");
  const [displayValue, setDisplayValue] = useState<string>("");
  const [show, setShow] = useState(false);
  const [valid, setValid] = useState(false);
  const [userNameErr, setUserNameErr] = useState(false);
  const [displayValueErr, setDisplayValueErr] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const checkValidUsername = async (username: string) => {
    console.log("firebasefun");
    const users = await firebase
      .firestore()
      .collection("users")
      .get();
    const usernames = users.docs.map((u) => u.data().userName).filter(u => u !== (userInfo?.userName || ''));
    console.log("firebase", usernames);
    return (
      !usernames.includes(username)/*  &&
      username.length >= 8 &&
      username.length <= "unique_username".length */
    );
  };

  useEffect(() => {
    setDisplayValue(userInfo?.displayName || '');
  }, [JSON.stringify(userInfo?.displayName)]);

  const triggerSaveUsername = async () => {
    try {
      // setFirstTimeAvatarSelection(true)
      const firstTimeLogin: Boolean = false
      // @ts-ignore
      const userRef = doc(db, "users", user?.uid);
      await setDoc(userRef, { firstTimeLogin }, { merge: true });
      await saveUsername(username , displayValue);
      setFirstTimeLogin(false);

    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  };
  useEffect(() => {
    setFirstTimeAvatarSelection(true);
    return () => {
      setFirstTimeAvatarSelection(true)
    }
  }, [])

  return (
    <>
      <Stack
        gap={2}
        className=" justify-content-center"
        style={{ height: "100vh", background: 'var(--light-purple)' }}
      >
        <div className="container-center-horizontal">
          <div className="first-time-login screen">
            <Styles.Title>{translate(title)}</Styles.Title>

            <Form
              onSubmit={async (e) => {
                e.preventDefault();

                if (username?.length > 1 && /^[a-zA-Z0-9\s_]+$/g.test(username) ) {
                  setUserNameErr(false)                  
                  if (displayValue.length > 5 && displayValue.length < 16) {                    
                    setDisplayValueErr(false)
                    checkValidUsername(username).then(res => res ? handleShow() : setUserNameErr(true));
                  } else {
                    setDisplayValueErr(true)
                  }
                } else {
                  setUserNameErr(true)
                }                            
               

              }}
            >
              <Input
                style={{ color: 'var(--blue-violet)', boxShadow: window.screen.width > 979 ? '0px 3px 6px #00000029' : '' }}
                placeholder={capitalize(translate("Dispaly Name"))}
                name="dispalyName"
                required
                value={displayValue}
                // @ts-ignore
                // maxlength={10}
                onChange={(e) => {                             
                  setDisplayValue(e.target.value)                                    
                  setDisplayValueErr(false)
                }}
              />
              {displayValueErr ? <Styles.p className=" mt-1 mb-2 text-danger"
                style={{
                fontSize:"10px"
              }}
              >
                {translate("Display Name should be between 6-15 characters")}
              </Styles.p> : null}
              
              <Container className="mt-3">                
                <Input                  
                  style={{ color: 'var(--blue-violet)', boxShadow: window.screen.width > 979 ? '0px 3px 6px #00000029' : '' }}
                  placeholder={capitalize(translate(texts.username))}
                  name="username"
                  required
                  type="text"
                  value={username}
                  // @ts-ignore
                  // maxlength={10}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/\s/g, '');

                    // Update the state only if the new value doesn't contain spaces
                    if (!newValue.includes(' ')) {
                      setUsername(newValue);
                      setUserNameErr(false)
                    }
                  }}
                />
                <Generate
                  onClick={(e) => {
                    e.preventDefault();
                    setUsername(generate())
                  }
                  }
                >
                  {capitalize(translate(texts.generate))}
                </Generate>
              </Container>              
              {userNameErr ? <Styles.p className="mb-2 text-danger">
                {translate(texts.UserNameValidation)}
              </Styles.p> : null}


              <div className="my-4">

                <Buttons.Primary

                  fullWidth={true}
                  type="submit"
                // disabled={!valid}
                >
                  {texts.continue}
                </Buttons.Primary>
              </div>

              <Styles.p className="mb-2">
                {translate(text)}
              </Styles.p>
            </Form>
          </div>
        </div>
      </Stack>
      <Modal show={show} onHide={handleClose} style={{ zIndex: 9999 }}>
        <div className="d-flex justify-content-end">
          <button type="button" className="btn-close " aria-label="Close" onClick={() => {
            handleClose()
          }}></button>
        </div>
        <Modal.Header >
          <Modal.Title>{translate(texts.firstTimeLoginModalTitle)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {translate(texts.firstTimeLoginModalText).replace(
              "{username}",
              `"${username}"`
            )}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Buttons.Default onClick={handleClose}>Close</Buttons.Default>
          <Buttons.Primary
            // disabled={!valid}
            onClick={async () => {

              await triggerSaveUsername();
              handleClose();
            }}
          >
            {translate(texts.continue)}
          </Buttons.Primary>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FirstTimeLogin;
