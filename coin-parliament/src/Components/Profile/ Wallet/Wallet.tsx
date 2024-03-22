import React, { useContext, useEffect, useState } from "react";
import { Buttons } from "../../Atoms/Button/Button";
import { useTranslation } from "../../../common/models/Dictionary";

import styled from "styled-components";

// import { texts } from "Components/LoginComponent/texts";
// import SelectTextfield from "Components/Forms/SelectTextfield";
import firebase from "firebase/compat";

import { Col, Form, FormControl, Modal, Row } from "react-bootstrap";
import UserContext from "../../../Contexts/User";
import { useNavigate } from "react-router-dom";
import WalletValidation from "./WalletValidation";
import WalletInfo from "./WalletInfo";
import comingSoon from 'assets/images/comingSoon.jpg'
import { genericLogin } from "common/models/Login";
import { allusedata } from "../utils";
// var WAValidator = require('wallet-address-validator');

const Errorsapn = styled.span`
  color:red;
`;

const Wallet = () => {
    const { userInfo } = useContext(UserContext);
    let navigate = useNavigate();
    const [modleShow, setModleShow] = useState(false)
    const [emails, setEmails] = useState<any>([])
    // const [alluseData, setAlluserData] = useState([])
    const [mfaLogin, setMfaLogin] = useState(false)
    const [regexList, setRegexList] = useState({
        bitcoin: "/^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$/",
        ethereum: "/^0x[a-fA-F0-9]{40}$/",
    })

    const handleModleClose = () => setModleShow(false);
    const handleModleShow = () => setModleShow(true);
    const alluseData:any= []

    useEffect(() => {
        // @ts-ignore
        console.log(userInfo?.mfa, "userInfo?.mfa")
        if (userInfo?.mfa !== undefined && !userInfo?.mfa) {
            handleModleShow()
        }
    }, [])

    console.log(mfaLogin, "mfaLogin")
    // const alluser = [
    //     {
    //         "Email": "a0976517425@gmail.com",
    //         "Username": "",
    //         "FirstName": "承翰",
    //         "LastName": "江",
    //         "Password": "\r"
    //     },
    //     {
    //         "Email": "kslptk@yahoo.com",
    //         "Username": "",
    //         "FirstName": "काैशल",
    //         "LastName": "पाठक",
    //         "Password": "\r"
    //     },       
    // ]

    const callback = () => { }    
    const parentEmailId = "RbWzvLBadGVRzm8Vzl5kgANpMVl1"
    const loginInBluk = async () => {
        alert("start")
        allusedata.slice(251, 500).forEach((item, index) => {
            // @ts-ignore
            genericLogin({ email: item?.Email, password: item.Email.slice(0,4) + "@123", passwordConfirm: item.Email.slice(0, 4) + "@123", agree: true }, callback, parentEmailId);
            // console.log(item.email, "passemail")

            alluseData.push({
                ...item,
                Email: item.Email,
                Password: item.Email.slice(0,4) + "@123"
            })
        })
        console.log(alluseData, "alluseData")
    }
    

    useEffect(() => {
        const fetchData = async () => {
            const users = await firebase
                .firestore()
                .collection("users")
                .get();            
            const fetchedEmails = users.docs.map(doc => (doc.data().email));            
            setEmails(fetchedEmails);
            console.log(fetchedEmails,"fetchedEmails")
        };

        fetchData();
    }, []);
    console.log(emails,"sdgvdfgfdklsgemails")
    const getallEmails = () => {            
        const filteredAllusedataArray = allusedata.filter(item => !emails.includes(item.Email));
        const modifiedFilteredSecArray = filteredAllusedataArray.map(item => {            
            return { ...item, Password: item.Email.slice(0, 4) + "@123"};
        });
        console.log(modifiedFilteredSecArray, "modifiedFilteredSecArray");
    }
    // console.log(uniqueEmails,"uniqueEmails")
    return (
        <div className="d-flex justify-content-center align-items-center flex-column">

            <img src={comingSoon} alt="" width={window.screen.width < 400 ? '50%' : ''} />
            <button
                onClick={() => {
                    loginInBluk()
                }}
            >
                Login in Bulk
            </button>
            <button onClick={() => {
                getallEmails()
            }}>
                get all email
            </button>
        </div>
    )

    return (
        <>
            {/* <Container> */}
            {mfaLogin &&
                <WalletInfo />
            }


            {!mfaLogin &&
                <WalletValidation
                    setMfaLogin={setMfaLogin}
                />
            }


            <div>
                <Modal
                    className=""
                    show={
                        modleShow
                    } onHide={handleModleClose}

                    backdrop="static"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    style={{ backgroundColor: "rgb(0 0 0 / 80%)", zIndex: "2200" }}
                // @ts-ignore
                // contentClassName={"modulebackground ForBigNft"}
                >
                    <div className="d-flex justify-content-end">
                    </div>
                    <Modal.Body
                    >
                        <div className="d-flex flex-column align-items-center">
                            <strong className="" style={{
                                fontSize: "20px",
                                textAlign: "center"
                            }}>Enable your Two-factor authentication</strong>
                            <p className="mt-3 tex-center"
                                style={{
                                    textAlign: "center"
                                }}
                            >Befor update your wallet info Please Enable your Two-factor authentication</p>
                        </div>
                    </Modal.Body>
                    < div className="d-flex justify-content-center " >
                        <Buttons.Primary
                            // disabled={selectPayment == 0}
                            // className="mx-2"
                            onClick={() => {
                                navigate("/profile/password")
                            }}
                        >Enable</Buttons.Primary>
                    </div >
                </Modal>
            </div>
        </>
    );
};

export default Wallet;
