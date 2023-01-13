import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Form, Modal, Row } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import User, { UserProps } from "../../common/models/User";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import TextField from "../Forms/Textfield";
import { Buttons } from "../Atoms/Button/Button";
import { getAuth, sendEmailVerification, signOut, updateEmail } from "firebase/auth";
import { Logout } from "../../common/models/Login";
import { useNavigate } from "react-router-dom";
const phonePattern =
  "([0-9\\s\\-]{7,})(?:\\s*(?:#|x\\.?|ext\\.?|extension)\\s*(\\d+))?$";

const PersonalInfo = () => {
  const { userInfo, user: u, setUserInfo,setUser } = useContext(UserContext);
  const { showToast } = useContext(NotificationContext);
  const [edit,setEdit]=useState(false)
  const [firstName,setFirstName]=useState('')
  const [lastName,setLastName]=useState('')
  const [email,setEmail]=useState('')
  const [phone,setPhone]=useState('')
const [show,setShow]=useState(false)
let navigate = useNavigate();
  const user = userInfo ? new User({ user: userInfo }) : ({} as User);
useEffect(() => {
  setFirstName(user?.firstName || '')
  setLastName(user?.lastName || '')
  setEmail(user?.email || '')
  setPhone(user?.phone || '')
 
}, [])
const handleClose=()=>{
  setShow(false)
}
  const onSubmit = async (newUserInfo: UserProps) => {
    if (u?.uid) {
      const userRef = doc(db, "users", u?.uid);
      try {
        await updateDoc(userRef, newUserInfo);
        showToast("user info was updated");
      } catch (e) {
        showToast("user failed to be updated", ToastType.ERROR);
      }
    }
  };

  return (
    <>
    <Form className="mt-1 d-flex flex-column"  onSubmit={async (e) => {
      e.preventDefault();
      if(edit){
        const newUserInfo = {
          ...(userInfo as UserProps),
          firstName: firstName as string,
          lastName: lastName as string,
          email: email as string,
          phone: phone as string,
        };
        if(email===user?.email){
        setUserInfo(newUserInfo);
        await onSubmit(newUserInfo);
        setEdit(false)}
        else{
          setShow(true)
        }
      }else{
        setEdit(true)
      }
      // await login(e, callback);
    }}>
      <Buttons.Primary style={{maxWidth:'100px', placeSelf:'end', margin:'20px', marginBottom:'0px'}} >{edit?'SAVE':'EDIT'}</Buttons.Primary>
      <Container>
      
        <Row >
      
          <Col >
           
            <TextField
              {...{
                label: "First Name",
                name: "firstName",
                placeholder: "First Name",
                value: firstName || "",
                onChange: async (e) => {
                  
                  setFirstName(e.target.value)
                  
                  
                },
                edit:!edit,
              }}
              
            />
            <TextField
              {...{
                label: "Last Name",
                name: "lastName",
                placeholder: "Last Name",
                value: lastName,
                onChange:(e) => {
                  setLastName(e.target.value);
                },
                edit:!edit,
              }}
            />
            <TextField
              {...{
                label: "Email",
                name: "email",
                type: "email",
                placeholder: "Email",
                value: email || "",
                onChange: async (e) => {
                  
                  setEmail(e.target.value);
                  
                },
                edit:!edit,
              }}
            />
            <TextField
              {...{
                label: "Phone",
                name: "phone",
                type: "tel",
                pattern: phonePattern,
                placeholder: "Phone",
                value: phone || "",
                onChange: async (e) => {
                  
                  setPhone(e.target.value);
                 
    
                },
                edit:!edit,
              }}
            />
          </Col>
          
        </Row>
      </Container>
    </Form>
      <Modal show={show} onHide={handleClose}>
      <Modal.Header >
        <Modal.Title>Change email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
        You will be logged out and you need to reverify your email address.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Buttons.Default onClick={handleClose}>Close</Buttons.Default>
        <Buttons.Primary
          // disabled={!valid}
          onClick={async () => {
            const auth = getAuth();
            // @ts-ignore
            updateEmail(auth?.currentUser, email).then(() => {
              showToast("user info was updated");
              // @ts-ignore
               sendEmailVerification(auth?.currentUser);
              signOut(auth)
          .then((res) => {
            
            navigate('/')
            Logout(setUser);
          })
          .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
          });
              // ...
            }).catch((error) => {
              showToast("user failed to be updated", ToastType.ERROR);
              // ...
            });
            // await triggerSaveUsername();
            handleClose();
          }}
        >
        CONTINUE
        </Buttons.Primary>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default PersonalInfo;
