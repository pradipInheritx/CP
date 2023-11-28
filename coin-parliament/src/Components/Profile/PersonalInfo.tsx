import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Form, Modal, Row, InputGroup } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import User, { UserProps } from "../../common/models/User";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import TextField from "../Forms/Textfield";
import { Buttons } from "../Atoms/Button/Button";
import { getAuth, sendEmailVerification, signOut, updateEmail } from "firebase/auth";
import { Logout } from "../../common/models/Login";
import { useNavigate } from "react-router-dom";
import SelectTextfield from "../Forms/SelectTextfield";
import { CountryCode } from "./utils";
import styled from "styled-components";
import { Input } from "../Atoms/styles";
import { texts } from "../LoginComponent/texts";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { generateGoogle2faUrl } from "../../common/consts/contents";
import axios from "axios";
import Avatars, { AvatarType } from "assets/avatars/Avatars";
import Avatar from "Components/Users/Avatar";
import { translate, useTranslation } from "common/models/Dictionary";
import UpdateAvatars from "./UpdateAvatars";
import { toast } from "react-toastify";

const phonePattern =
  "([0-9\\s\\-]{7,})(?:\\s*(?:#|x\\.?|ext\\.?|extension)\\s*(\\d+))?$";


const ElementsAvatarAImage1 = styled.div`
  width: 70px;  
  margin-top: 1px;    
`;

const PersonalInfo = () => {
  const { userInfo, user: u, setUserInfo, setUser } = useContext(UserContext);
  const { showToast } = useContext(NotificationContext);
  const [edit, setEdit] = useState(false)
  const [userName, setUserName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState<any>({ phone: "" })
  const [countryCode, setCountryCode] = useState('us');
  const [userCurrentCountryCode, setUserCurrentCountryCode] = useState('');
  const [show, setShow] = useState(false);
  let navigate = useNavigate();
  const user = userInfo ? new User({ user: userInfo }) : ({} as User);
  const [avatarMode, setAvatarMode] = useState(false);
  const translate = useTranslation();
  useEffect(() => {
    setUserName(userInfo?.displayName || '')
    setFirstName(userInfo?.firstName || '')
    setLastName(userInfo?.lastName || '')
    setEmail(userInfo?.email || '')
    setBio(userInfo?.bio || '');
    setPhone({ phone: userInfo?.phone })
  }, [userInfo]);

  const createPost = async (id: string) => {
    if (!id) return
    // @ts-ignore
    if (userInfo?.googleAuthenticatorData?.otp_auth_url) {

      return
    }
    const data = {
      userId: id,
      userType: "USER",
    };
    try {
      const response = await axios.post(generateGoogle2faUrl, data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!userInfo?.mfa) createPost(userInfo?.uid as string);
    // return () => setCopied(false);
  }, [userInfo?.mfa]);
  const handleClose = () => {
    setShow(false)
  }
  const onSubmit = async (newUserInfo: UserProps) => {
    if (u?.uid) {
      const userRef = doc(db, "users", u?.uid);
      try {
        await updateDoc(userRef, newUserInfo);
        showToast(texts.UserInfoUpdate);        
      } catch (e) {
        showToast(texts.UserFailUpdate, ToastType.ERROR);
      }
    }
  };
  const handleOnChange = (value: any, data: any, event: any, formattedValue: any) => {
    setPhone({ phone: value });
    if (countryCode === data.country) {
      setCountryCode(data.countryCode);
    }

  }
  // console.log(phone,"Phonenumber")
  useEffect(() => {
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        setUserCurrentCountryCode(response?.data?.country_code.toLowerCase() || 'us');
      })
      .catch((error) => {
        console.log(error);
      });
  }, [phone]);

  const onSubmitAvatar = async (type: AvatarType) => {

    console.log("yes i am calling")
    
    if (u?.uid) {          
      const userRef = doc(db, "users", u?.uid);
      try {
        await setDoc(userRef, { avatar: type }, { merge: true });
        showToast(translate(texts.UserInfoUpdate));
        setAvatarMode(false)
        toast.dismiss();        
      } catch (e) {
        showToast(translate(texts.UserFailUpdate), ToastType.ERROR);
      }
    }
  };


  return (
    <>

      <Form className="mt-1 d-flex flex-column" onSubmit={async (e) => {
        e.preventDefault();
        if (edit) {
          const newUserInfo = {
            ...(userInfo as UserProps),
            firstName: firstName as string,
            lastName: lastName as string,
            email: email as string,
            bio: bio as string,
            phone: countryCode + phone.phone as string,
          };
          if (email === user?.email) {
            setUserInfo(newUserInfo);
            await onSubmit(newUserInfo);
            setEdit(false)
          }
          else {
            setShow(true)
          }
        } else {
          setEdit(true)
        }
        // await login(e, callback);
      }}>

        <Buttons.Primary style={{ maxWidth: '100px', placeSelf: 'end', margin: '20px', marginBottom: '0px' }} >{edit ? 'SAVE' : 'EDIT'}</Buttons.Primary>
        <Container className="">
          <ElementsAvatarAImage1 className="m-auto mb-2" onClick={() => {
            setAvatarMode(true)
          }} role="button">
            {user?.avatar && (
              <Avatars type={user?.avatar as AvatarType} width={70} style={{
                height:"70px"
              }}/>
            )}
            {!user?.avatar &&                          
              <Avatar />            
            }
          </ElementsAvatarAImage1>                    
          <Row >

            <Col >

              <TextField
                {...{
                  label: `${texts.USERNAME}`,
                  name: "UserName",
                  placeholder: "User Name",
                  value: userName,
                  onChange: async (e) => {
                    setUserName(e.target.value)
                  },
                  maxLength: 10,
                  edit: true,
                }}

              />
              <TextField
                {...{
                  label: `${texts.FIRSTNAME}`,
                  name: "firstName",
                  placeholder: "First Name",
                  value: firstName || "",
                  onChange: async (e) => {
                    setFirstName(e.target.value)
                  },
                  edit: !edit,
                }}

              />
              <TextField
                {...{
                  label: `${texts.LASTNAME}`,
                  name: "lastName",
                  placeholder: "Last Name",
                  value: lastName,
                  onChange: (e) => {
                    setLastName(e.target.value);
                  },
                  edit: !edit,
                }}
              />
              <TextField
                {...{
                  label: `${texts.EMAIL}`,
                  name: "email",
                  type: "email",
                  placeholder: "Email",
                  value: email || "",
                  onChange: async (e) => {
                    setEmail(e.target.value);
                  },
                  edit: !edit,
                  // edit: true,
                }}
              />
              <SelectTextfield
                label={`${texts.BIO}`}
                name="Bio"

              >
              <textarea                                  
                  name= "bio"                  
                  placeholder= "Bio"
                  value= {bio || ""}
                onChange={(e) => {
                  setBio(e.target.value)
                  }}
                  disabled ={!edit}
                  // edit: true,
                  style={{
                    border: "none",
                    borderRadius:"5px",
                  width:`${window.screen.width  > 767 ?"500px":""}`
                }}
                />
                </SelectTextfield>
              <div className="mb-5">
                <SelectTextfield
                  label={`${texts.PHONE}`}
                  name="Phone"

                >
                  <PhoneInput
                    inputStyle={{
                      width: "100%", padding: "20px 0px 20px 50px",
                    }}
                    dropdownStyle={{
                      maxHeight: "150px"
                    }}
                    placeholder=""
                    inputProps={{
                      name: 'phone',
                      required: true,
                      disabled: !edit
                    }}
                    disableDropdown={!edit}
                    country={phone?.phone == undefined ? userCurrentCountryCode : ''}
                    // country={""}
                    value={phone?.phone && phone?.phone}
                    onChange={handleOnChange}
                  />
                </SelectTextfield>
              </div>
            </Col>

          </Row>
        </Container>
      </Form >
      <Modal show={show} onHide={handleClose} centered>
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
                showToast(texts.UserInfoUpdate);
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
                showToast(texts.UserFailUpdate, ToastType.ERROR);
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
      
      {/* Avater change modal */}

      <Modal show={avatarMode} onHide={handleClose} size="xl"
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        contentClassName={`${window.screen.width > 767 ? "" : "AvatarModalTop"} AvatarModal`}
      >        
        <UpdateAvatars
          {...{
            onSubmit: onSubmitAvatar,
            onClose: () => setAvatarMode(false),
          }}
        />
      </Modal>      
    </>
  );
};

export default PersonalInfo;
