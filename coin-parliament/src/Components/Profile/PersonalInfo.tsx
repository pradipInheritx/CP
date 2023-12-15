import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Form, Modal, Row, InputGroup } from "react-bootstrap";
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
import SelectTextfield from "../Forms/SelectTextfield";
import { CountryCode } from "./utils";
import styled from "styled-components";
import { Input } from "../Atoms/styles";
import { texts } from "../LoginComponent/texts";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { generateGoogle2faUrl } from "../../common/consts/contents";
import axios from "axios";
import Styles from "../LoginComponent/styles";

const phonePattern =
  "([0-9\\s\\-]{7,})(?:\\s*(?:#|x\\.?|ext\\.?|extension)\\s*(\\d+))?$";





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
  const [displayName, setDisplayName] = useState('')
  const [displayNameErr, setDisplayNameErr] = useState(false)

  useEffect(() => {
    setDisplayName(userInfo?.displayName || '')
    setUserName(userInfo?.userName || '')
    setLastName(userInfo?.lastName || '')
    setEmail(userInfo?.email || '')
    // @ts-ignore
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
  console.log(userCurrentCountryCode, phone, "phonenumber");
  return (
    <>

      <Form className="mt-1 d-flex flex-column" onSubmit={async (e) => {
        e.preventDefault();
        if (edit) {
          if (displayName.length > 6 && displayName.length < 15) {
            const newUserInfo = {
              ...(userInfo as UserProps),
              firstName: firstName as string,
              lastName: lastName as string,
              email: email as string,
              displayName: displayName as string,
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
          }
          else {
            setDisplayNameErr(true);
          }
        } else {
          setEdit(true)
        }
        // await login(e, callback);
      }}>

        <Buttons.Primary style={{ maxWidth: '100px', placeSelf: 'end', margin: '20px', marginBottom: '0px' }} >{edit ? 'SAVE' : 'EDIT'}</Buttons.Primary>
        <Container>

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
                  label: `${"Dispaly Name"}`,
                  name: "displayName",
                  placeholder: "Display Name",
                  min: 6,
                  max: 15,
                  value: displayName || "",
                  onChange: async (e) => {
                    setDisplayName(e.target.value)
                    setDisplayNameErr(false)
                  },
                  edit: !edit,
                }}

              />
              {displayNameErr ? <Styles.p className=" mt-1 mb-2 text-danger"
                style={{
                  fontSize: "10px"
                }}
              >
                Display Name should be between 6-15 characters
              </Styles.p> : null}
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
              <TextField
                {...{
                  label: `${texts.BIO}`,
                  name: "bio",
                  type: "bio",
                  placeholder: "Bio",
                  value: bio || "",
                  onChange: async (e) => {
                    setBio(e.target.value);
                  },
                  edit: !edit,
                  // edit: true,
                }}
              />
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
    </>
  );
};

export default PersonalInfo;
