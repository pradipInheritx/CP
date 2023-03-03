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
  saveUsername: (username: string) => Promise<void>;
  setFirstTimeAvatarSelection:any;
};

const checkValidUsername = httpsCallable(functions, "checkValidUsername");

const FirstTimeLogin = ({ generate, saveUsername ,setFirstTimeAvatarSelection}: FirstTimeLoginProps) => {
  const translate = useTranslation();
  const {setFirstTimeLogin} = useContext(AppContext );
  const { showToast } = useContext(NotificationContext);
  const title = texts.chooseUserName;
  const text = texts.chooseUserNameText;
  const [username, setUsername] = useState<string>("");
  const [show, setShow] = useState(false);
  const [valid, setValid] = useState(false);
const[userNameErr,setUserNameErr]=useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const triggerSaveUsername = async () => {
    try {
      // setFirstTimeAvatarSelection(true)
      
      await saveUsername(username);
      setFirstTimeLogin(false);
      
    } catch (e) {
      showToast((e as Error).message, ToastType.ERROR);
    }
  };
useEffect(() => {
  setFirstTimeAvatarSelection(true)
  return () => {
    setFirstTimeAvatarSelection(true)
  }
}, [])

  return (
    <>
      <Stack
        gap={2}
        className=" justify-content-center"
        style={{ height: "100vh", background:'var(--light-purple)' }}
      >
        <div className="container-center-horizontal">
          <div className="first-time-login screen">
            <Styles.Title>{translate(title)}</Styles.Title>
           
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                if(username?.length<16 && username?.length>7){
                  // checkValidUsername({ username }).then(res=>res?.data?handleShow():setUserNameErr(true))
                  handleShow()
                }
                else{
         
                  setUserNameErr(true)
                }
              
              }}
            >
              <Container>
                <Input
                 style={{color:'var(--blue-violet)',boxShadow:window.screen.width>979?'0px 3px 6px #00000029':''}}
                  placeholder={capitalize(translate(texts.username))}
                  name="username"
                  required
                  value={username}
                  // @ts-ignore
                  maxlength={10}
                  onChange={(e) => {
                    setUsername(e.target.value.replace(" ", "_").toLowerCase());
                    setUserNameErr(false)
                  }}
                />
                <Generate
                  onClick={(e) =>
                    {e.preventDefault();
                    setUsername(generate().replace(" ", "_").toLowerCase())}
                  }
                >
                  {capitalize(translate(texts.generate))}
                </Generate>
                
              </Container>
              <div className="my-4">
                
                <Buttons.Primary
                
                  fullWidth={true}
                  type="submit"
                  // disabled={!valid}
                >
                  {texts.continue}
                </Buttons.Primary>
              </div>
              {userNameErr?<Styles.p className="mb-2">
              {translate(texts.UserNameValidation)}
            </Styles.p>:null}
              <Styles.p className="mb-2">
              {translate(text)}
            </Styles.p>
            </Form>
          </div>
        </div>
      </Stack>
      <Modal show={show} onHide={handleClose} style={{zIndex:9999}}>
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
