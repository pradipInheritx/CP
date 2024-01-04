import { Buttons } from 'Components/Atoms/Button/Button'
import SelectTextfield from 'Components/Forms/SelectTextfield'
import { texts } from 'Components/LoginComponent/texts'
import UserContext from 'Contexts/User'
import { useTranslation } from 'common/models/Dictionary'
import React, { useContext, useEffect, useState } from 'react'
import { Form, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import firebase from "firebase/compat";
import styled, { createGlobalStyle } from "styled-components";
import axios from 'axios'
import { auth, db } from 'firebase'
import { doc, setDoc } from 'firebase/firestore'
import CoinsList from '../Payment/CoinsList'
import { showToast } from 'App'
import { ToastType } from 'Contexts/Notification'
import WalletValidation from './WalletValidation'

const Errorsapn = styled.span`
  color:red;
`;

const RemoveButton = styled.button`    
    width: 45px;
    height: 45px;
    border:none;            
    font-size: 30px;
    background: #4f36c7;
    color: white;  
    
`;
const I = styled.i`
  border-radius: 50%;
  font-size: 13px;  
position: absolute;
  font-weight: 300;
  top:-27px;
  left:${window.screen.width >767 ? "375px":"70px"};
  color: #6352e8;
//   width: 16px;
//   height: 16px;
  text-align: center;
`;

const IconValue = styled.i`
  border-radius: 50%;
  font-size: 13px;  
position: absolute;
  font-weight: 300;
  top:-27px;
  left:262px;
  color: #6352e8;
  text-align: center;
`;

const Icon2 = styled.i`
  border-radius: 50%;
  font-size: 13px;  
position: absolute;
  font-weight: 300;
  top:-27px;
  left:290px;
  color: #6352e8;
  text-align: center;
`;

const Icon3 = styled.i`
  border-radius: 50%;
  font-size: 13px;  
position: absolute;
  font-weight: 300;
  top:-27px;
  left:${window.screen.width >767 ? "430px":"125px"};
  color: #6352e8;
  text-align: center;
`;

function WalletInfo() {
    const { userInfo,user } = useContext(UserContext);
    const [saveAddress, setSaveAddress] = useState(false)
    const [savePaxAddress, setSavePaxAddress] = useState(false)
    const [saveCardAddress, setSaveCardAddress] = useState(false)
    const [savePaymentMethod, setSavePaymentMethod] = useState(false);
    const [timeType, setTimeType] = useState<string>('time');
    const [limitType, setLimitType] = useState<string>("");
    const [getPendingShow, setGetPendingShow] = useState<boolean>(false);    
    const [walletDetails, setWalletDetails] = useState({
        coin: "",
        address: "",
    });
    const [paxDetails, setPaxWalletDetails] = useState({
        coin: "BNB",
        address: "",
    });
    const [CardDetails, setCardWalletDetails] = useState({
        coin: "MATIC",
        address: "",
    });
    console.log(paxDetails,"paxDetails")

    const [walletDetailsObj, setWalletDetailsObj] = useState([{
        coin: "",
        address: "",
    }]);
    const [tooltipShow, setTooltipShow] = React.useState(false);
    const [tooltipShowPax, setTooltipShowPax] = React.useState(false);
    const [tooltipShowCard, setTooltipShowCard] = React.useState(false);
    const [tooltipShow2, setTooltipShow2] = React.useState(false);
    const [addType, setAddType] = React.useState("");
    const [validationErrors, setValidationErrors] = useState([]);
    const [modleShow, setModleShow] = useState(false)
    const handleModleClose = () => setModleShow(false);
    const handleModleShow = () => setModleShow(true);
    const [mfaLogin, setMfaLogin] = useState(false)  

    const [errorValue, setErrorValue] = useState({
        coinError: "",
        walletError: ""
    })

    const [PaxErrorValue, setPaxErrorValue] = useState({
        coinError: "",
        walletError: ""
    })
    const [CardErrorValue, setCardErrorValue] = useState({
        coinError: "",
        walletError: ""
    })
    const [timeAmount, setTimeAmount] = useState({
        time: "",
        amount: ""
    })
    const [timeValue, setTimeValue] = useState("")
    const [amountValue, setAmountValue] = useState("")

    useEffect(() => {
        // setWalletDetailsObj({
        //     coin: userInfo?.wellDAddress?.coin || '',
        //     walletAddress: userInfo?.wellDAddress?.address || '',
        // });        
        if (Array.isArray(userInfo?.wellDAddress) == true) {                        
            // @ts-ignore
            setWalletDetailsObj(userInfo?.wellDAddress || []);
        }
        else {            
            // @ts-ignore
            setWalletDetailsObj([userInfo?.wellDAddress] || []);            
        }        
        if (typeof userInfo?.paxAddress === 'object') {            
            // @ts-ignore
            setPaxWalletDetails(userInfo?.paxAddress || {});
        }
        else {
            // @ts-ignore
            setPaxWalletDetails({});
        }
        // @ts-ignore
        if (typeof userInfo?.cardAddress === 'object') {            
            // @ts-ignore
            setCardWalletDetails(userInfo?.cardAddress || {});
        }
        else {
            // @ts-ignore
            setCardWalletDetails({});
        }
        
        console.log(userInfo?.wellDAddress,"userInfo?.wellDAddress")
        setSelectRadio(userInfo?.referalReceiveType?.name || '');
        setDefaultValue();
    }, [JSON.stringify(userInfo?.wellDAddress)]);
    const [timeError, setTimeError] = useState("")

    const [sendAmount, setSendAmount] = useState("")
    const [amountError, setAmountError] = useState("")
    let navigate = useNavigate();
    const [coinList, setCoinsList] = useState([])
    const [coinListPax, setCoinsListPax] = useState([])
    const [selectRadio, setSelectRadio] = useState<string>('');
    const [regexList, setRegexList] = useState({
        bitcoin: "/^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$/",
        ethereum: "/^0x[a-fA-F0-9]{40}$/",
    })

    console.log(coinListPax,"coinListPax")

    useEffect(() => {
        const getCoinList = firebase
            .firestore()
            .collection("settings").doc("paymentCoins")
        getCoinList.get()
            .then((snapshot) => {
                // const allList = snapshot.data()?.coins;               
                let allList = [                    
                    {
                        "status": "Active",
                        "symbol": "ETH",
                        "id": "2",
                        "name": "Ethereum"
                    },
                    {
                        "id": "3",
                        "status": "Active",
                        "name": "Binance",
                        "symbol": "BNB"
                    },
                    {
                        "symbol": "MATIC",
                        "status": "Active",
                        "name": "Polygon",
                        "id": "4"
                    },
                    
                ]
                console.log(walletDetailsObj, "walletDetailsObj")
                
                const uniqueNamesArray2 = allList.filter((obj2:any) =>
                    // @ts-ignore
                    userInfo?.wellDAddress && !userInfo?.wellDAddress.some((obj1: any) => obj1.coin == obj2.symbol)
                );       
                // @ts-ignore
                setCoinsList(uniqueNamesArray2);
                // setCoinsListPax(allList)
            }).catch((error) => {
                console.log(error, "error");
            });
    }, [userInfo?.wellDAddress])
    

    const handleChangeValue = (e: any, type: string) => {
        let name = e.target.name;
        let value = e.target.value
        if (type == "paxDetails") {            
            
            setPaxWalletDetails(
                {
                    coin: "BNB",
                    address: value,
                }
            )
            setPaxErrorValue({
                coinError: "",
                walletError: ""
            })
        } 
        if(type == "CardDetails"){

            setCardWalletDetails(
                {
                    coin: "MATIC",
                    address: value,
                }
            )
            setPaxErrorValue({
                coinError: "",
                walletError: ""
            })
        }
       if(type == "walletDetails") {            
            setWalletDetails({ ...walletDetails, [name]: value })
            setErrorValue({
                coinError: "",
                walletError: ""
            })
        }
    }

    const updateAddress = async () => {
        if (!walletDetails.coin) {
            setErrorValue({ ...errorValue, coinError: "Please select coin" })
        } else if (!walletDetails.address) {
            setErrorValue({ ...errorValue, walletError: "Please Enter Wallet Address" })
        }
        else if (walletDetails.address) {
            setSaveAddress(true);
            const validate = await validateAddress(walletDetails.address, walletDetails.coin,"forWallet")
            if (validate) {
                setSaveAddress(false);
            } else {
                setErrorValue({ ...errorValue, walletError: "Please Enter Valid Wallet Address " })
                setSaveAddress(false);
            }
        }
    }

    const updatePaxAddress = async () => {
        if (!paxDetails.coin) {
            setPaxErrorValue({ ...PaxErrorValue, coinError: "Please select coin" })
        } else if (!paxDetails.address) {
            setPaxErrorValue({ ...PaxErrorValue, walletError: "Please Enter Pax Address" })
        }
        else if (paxDetails.address) {
            setSavePaxAddress(true);
            const validate = await validateAddress(paxDetails.address, paxDetails.coin,"forPax")
            if (validate) {
                setSavePaxAddress(false);
            } else {
                setPaxErrorValue({ ...PaxErrorValue, walletError: "Please Enter Valid Pax Address " })
                setSavePaxAddress(false);
            }
        }
    }

    const updateCardAddress = async () => {
        if (!CardDetails.coin) {
            setCardErrorValue({ ...CardErrorValue, coinError: "Please select coin" })
        } else if (!CardDetails.address) {
            setCardErrorValue({ ...CardErrorValue, walletError: "Please Enter Card Address" })
        }
        else if (CardDetails.address) {
            setSaveCardAddress(true);
            const validate = await validateAddress(CardDetails.address, CardDetails.coin,"forCard")
            if (validate) {
                setSaveCardAddress(false);
            } else {
                setCardErrorValue({ ...CardErrorValue, walletError: "Please Enter Valid Card Address " })
                setSaveCardAddress(false);
            }
        }
    }

    console.log(PaxErrorValue,"PaxErrorValue")

    const validateAddress = async (inputAddress: string, type: string,checktype:string) => {
        return axios.get(
            `https://api.blockcypher.com/v1/${type.toLowerCase()}/main/addrs/${inputAddress}`
        ).then(async (response) => {            
            const { error } = response.data;
            console.log(response,"geterror")
            
            if (!error &&checktype == "forWallet") {                
                setWalletDetails({ coin: "", address : ""})
                if (auth?.currentUser) {
                    const allwalletData = [...walletDetailsObj, {
                        address: inputAddress,
                        coin: type,
                    }]
                    const userRef = doc(db, "users", auth?.currentUser?.uid);
                    await setDoc(userRef, {
                        wellDAddress: allwalletData                    
                    }, { merge: true });
                }
                showToast("Wallet Adderss Add Successfully", ToastType.SUCCESS);
            }
            
            // Cehck pax value

            if (checktype == "forPax") {
                if (auth?.currentUser) {
                    const allwalletData = {
                        address: inputAddress,
                        coin: type,
                    }
                    const userRef = doc(db, "users", auth?.currentUser?.uid);
                    await setDoc(userRef, {
                        paxAddress: allwalletData
                    }, { merge: true });
                }
                showToast("PAX Adderss Add Successfully", ToastType.SUCCESS);
            }

            if (checktype == "forCard") {
                if (auth?.currentUser) {
                    const allwalletData = {
                        address: inputAddress,
                        coin: type,
                    }
                    const userRef = doc(db, "users", auth?.currentUser?.uid);
                    await setDoc(userRef, {
                        cardAddress: allwalletData
                    }, { merge: true });
                }
                showToast("Card Adderss Add Successfully", ToastType.SUCCESS);
            }
            if (error) {
                return false;                
            } else {
                return true;                
            }
        }).catch(() => {
            return false;            
        })
    };

    const selectSendType = async () => {
        setTimeError("");
        setAmountError("");
        let errorCount = 0;

        if (selectRadio === 'LIMIT' && limitType != "") {
            if (selectRadio === 'LIMIT' && limitType == "ANY_OF_THEM"  && timeAmount.time === "" && timeAmount.amount === "") {
                setTimeError("Please select limit.");
                errorCount++;
            }
            if (selectRadio === 'LIMIT' && limitType == "ANY_OF_THEM" && timeAmount.amount === "") {
                setAmountError("Please enter valid amount.");
                errorCount++;
            }
            if (selectRadio === 'LIMIT' && limitType == "TIME" && timeValue === "") {
                setTimeError("Please select limit.");
                errorCount++;
            }
            if (selectRadio === 'LIMIT' && limitType == "AMOUNT" && amountValue === "") {
                console.log(limitType)
                setAmountError("Please enter valid amount.");
                errorCount++;
            }
            if (['LIMIT'].includes(selectRadio) && limitType == "ANY_OF_THEM" && timeAmount.amount !== "" &&/* timeType === 'amount' && */ (!/^\d{0,10}(\d+)?$/.test(timeAmount.amount) || parseFloat(timeAmount.amount) <= 0)) {
                console.log(limitType)
                setAmountError("Please enter valid amount.");
                errorCount++;
            }
            if (['LIMIT'].includes(selectRadio) && limitType == "AMOUNT" && amountValue !== "" &&/* timeType === 'amount' && */ (!/^\d{0,10}(\d+)?$/.test(amountValue) || parseFloat(amountValue) <= 0)) {
                console.log(limitType)
                setAmountError("Please enter valid amount.");
                errorCount++;
            }
            if (!errorCount && auth?.currentUser) {
                setSavePaymentMethod(true);
                const data = {
                    days: `${limitType == "AMOUNT" ?"" : limitType == "TIME" ? timeValue : timeAmount.time}`,
                    name: selectRadio,
                    amount: `${limitType == "TIME" ? "" : limitType == "AMOUNT" ? amountValue : timeAmount.amount}`,
                    limitType: limitType,
                }
                // {
                //     time: `${timeAmount.time}`,
                //         name: selectRadio,
                //             amount: `${timeAmount.amount}`,
                //         }
                try {
                    const userRef = doc(db, "users", auth?.currentUser?.uid);

                    await setDoc(userRef, {
                        referalReceiveType: data
                    }, { merge: true });
                    showToast("Update Wallet Successfully", ToastType.SUCCESS);
                } catch (error) {   
                    // @ts-ignore
                    showToast(error.response.data.message, ToastType.ERROR);
                }
                
                console.log(data,"checkreferalReceiveType")
                setSavePaymentMethod(false);
            }   
        } else if (selectRadio === 'LIMIT' && limitType == ""){
            setTimeError("Please select One Check Box");
        }           
        if (selectRadio === 'IMMEDIATE') {
            if (!errorCount && auth?.currentUser) {
                setSavePaymentMethod(true);                    
                try {
                    const userRef = doc(db, "users", auth?.currentUser?.uid);

                    await setDoc(userRef, {
                        referalReceiveType: {
                            days: "",
                            name: selectRadio,
                            amount: "",
                            limitType: "",
                        }            
                    }, { merge: true });
                    showToast("Update Wallet Successfully", ToastType.SUCCESS);
                } catch (err) {
                    console.log(err);
                    // @ts-ignore
                    showToast(err.message, ToastType.ERROR);
                }                
                setSavePaymentMethod(false);
            }  
        }
        if (selectRadio === 'ONDEMAND') {
            if (!errorCount && auth?.currentUser) {
                setSavePaymentMethod(true);                    
                try {
                    const userRef = doc(db, "users", auth?.currentUser?.uid);

                    await setDoc(userRef, {
                        referalReceiveType: {
                            days: "",
                            name: selectRadio,
                            amount: "",
                            limitType: "",
                        }            
                    }, { merge: true });
                    showToast("Update Wallet Successfully", ToastType.SUCCESS);
                } catch (err) {
                    console.log(err);
                    // @ts-ignore
                    showToast(err.message, ToastType.ERROR);
                }                
                setSavePaymentMethod(false);
            }  
        }
    }

    const GetRefPayment = () => {
        
        const headers = {
            // 'Content-Type': 'application/json',
            "accept": "application/json",
            // @ts-ignore
            "Authorization": `Bearer ${auth?.currentUser?.accessToken}`,
            "content-type": "application/json"
        }
        axios.get(`/payment/getInstantReferalAmount/${user?.uid}`, {headers}            
        ).then(async (response) => {
            console.log(response, "response")
            showToast("Successfully Received all Pending Payment", ToastType.SUCCESS);
            setGetPendingShow(false)
            })
            .catch((error) => {                
                setGetPendingShow(false)
                showToast(error.response.data.message, ToastType.ERROR);
            })
    }

    const hideError = () => {
        setTimeError("")
        setAmountError("");
        setTimeAmount({ time: '', amount: '' });
    }
    const setDefaultValue = () => {
        // @ts-ignore
        if (userInfo?.referalReceiveType?.limitType == "TIME")
        {
            // @ts-ignore
            setLimitType(userInfo?.referalReceiveType?.limitType)
            // @ts-ignore
            setTimeValue(userInfo?.referalReceiveType?.days)
        }
        // @ts-ignore
        if (userInfo?.referalReceiveType?.limitType == "AMOUNT")
        {
            // @ts-ignore
            setLimitType(userInfo?.referalReceiveType?.limitType)
            setAmountValue(userInfo?.referalReceiveType?.amount)
        }
        // @ts-ignore
        if (userInfo?.referalReceiveType?.limitType == "ANY_OF_THEM")
        {
            // @ts-ignore
            setLimitType(userInfo?.referalReceiveType?.limitType)
            setTimeAmount({
                amount: userInfo?.referalReceiveType?.amount || '',
                time: userInfo?.referalReceiveType?.time ? userInfo?.referalReceiveType?.time : ''
            });
        }
        setTimeType(userInfo?.referalReceiveType?.amount ? 'amount' : 'time');
    }


    const handleRemoveBox = async (index:number) => {
        const newBoxes = [...walletDetailsObj];
        newBoxes.splice(index, 1);
        // @ts-ignore
        const userRef = doc(db, "users", auth?.currentUser?.uid);
        await setDoc(userRef, {
            wellDAddress: newBoxes
            // referalReceiveType: {
            //     amount: '',
            //     name: '',
            //     time: ''
            // },
        }, { merge: true })       
        // setWalletDetailsObj(newBoxes);
    };
 
    const UpdateFunction = () => {
        handleModleClose()

        if (addType == "PAYNOW") {
            GetRefPayment()  
        }
        if (addType == "UPDATESETTING") {            
            selectSendType()
        }
        if (addType == "ADDADDERS") {
            updateAddress()
        }                      
        if (addType == "PAXADDADDERS") {
            updatePaxAddress()
        }                      
        if (addType == "CARDADDADDERS") {
            updateCardAddress()
        }                      
    }

    // const AddWalletFunction = () => {
    //     handleModleClose()
    //     updateAddress()
    // }


    return (
        <>
            <div className="mt-4"            
            >       
               
               {/* Wallet  */}
               
               {userInfo?.isUserUpgraded && <SelectTextfield
                    label={"Add your address to receive the converted collectible card "}
                    name={"Add your address to receive the converted collectible card "}                
                >                    
                    <div className={`${window.screen.width > 350 ? 'd-flex' : ''} w-100 text-uppercase`}  >
                        {/* <select
                            name="coin"
                            id="coin"

                            style={{
                                width: "45%",
                                padding: "11px 0px 11px 20px",
                                borderRadius: "5px"
                            }}
                            value={paxDetails?.coin || ""}
                            onChange={(e) => {
                                handleChangeValue(e, "paxDetails")
                            }}
                        >
                            <option value="">Choose coin</option>
                            {coinListPax.map((item: any, index: number) => {
                                return <option key={index} value={item.symbol} id={item.id}>{item.name}</option>
                             })}
                        </select> */}

                        {
                            tooltipShowCard &&
                            <div
                                style={{
                                    display: "relative"
                                }}
                            >
                                    <div className="newtooltip text-uppercase"
                                    style={{
                                        // right: "0%",
                                        width: `${window.screen.width > 767 ? "50%" : "78%"}`,
                                        marginLeft: `${window.screen.width > 767 ? "2.50%" : ""}`,
                                        marginTop: `${window.screen.width > 767 ? "1%" : "1%"}`,
                                    }}
                                >
                                    {/* <p>Your CMP count</p> */}
                                        <p className="mt-1 text-end lh-base">This address will be used in case you decide to convert your card reward to a collectible card</p>

                                </div>
                            </div>
                        }
                        <div className=''>
                            <Icon3 className='bi bi-info-circle'
                                onMouseDown={(e) => {
                                    setTooltipShowCard(false)
                                }}
                                onMouseUp={(e) => {
                                    setTooltipShowCard(true)
                                }}
                                onMouseEnter={() => setTooltipShowCard(true)}
                                onMouseLeave={() => setTooltipShowCard(false)}
                            ></Icon3>
                        </div>
                        <input
                            style={{
                                width: "45%",
                                padding: "11px 0px 11px 20px",
                                borderRadius: "5px"
                            }}
                            disabled
                            name="coin"
                            id="coin"                            
                            value={"Polygon chain".toLocaleUpperCase()}                            
                        />
                        

                        <div style={{ width: (window.screen.width < 350 ? '10em' : 'auto'), padding: '1em', textAlign: 'center' }}></div>
                        <input
                            className='text-uppercase'
                            style={{
                                width: "45%",
                                padding: "10px 0px 10px 20px",
                                borderRadius: "5px"
                            }}
                            name="address"
                            type="address"
                            placeholder="Enter address"
                            value={CardDetails.address || ""}
                            onChange={(e) => {
                                handleChangeValue(e, "CardDetails")
                            }}
                        />
                        <RemoveButton type='button'
                            disabled={!CardDetails?.address || saveCardAddress}
                            style={{
                                marginLeft: "10px",
                                borderRadius: "5px",
                                fontSize: "12px",
                            }}
                            onClick={() => {
                                // updateAddress()
                                setAddType("CARDADDADDERS")
                                handleModleShow()

                            }}>
                            {savePaxAddress ? <span className="loading">ADD..</span> : 'ADD'}
                        </RemoveButton>
                    </div>

                    {CardErrorValue?.coinError && <Errorsapn>{CardErrorValue?.coinError}</Errorsapn>}
                    {CardErrorValue?.walletError && <Errorsapn>{CardErrorValue?.walletError}</Errorsapn>}

                </SelectTextfield>}

                {/* PAX Wallet dropdown */}
                
                {userInfo?.isUserUpgraded && <SelectTextfield
                    label={"ADD YOUR ADDRESS TO RECEIVE PAX REWARD"}
                    name={"ADD YOUR ADDRESS TO RECEIVE PAX REWARD"}                
                >                    
                    <div className={`${window.screen.width > 350 ? 'd-flex' : ''} w-100 text-uppercase`}  >
                        {/* <select
                            name="coin"
                            id="coin"

                            style={{
                                width: "45%",
                                padding: "11px 0px 11px 20px",
                                borderRadius: "5px"
                            }}
                            value={paxDetails?.coin || ""}
                            onChange={(e) => {
                                handleChangeValue(e, "paxDetails")
                            }}
                        >
                            <option value="">Choose coin</option>
                            {coinListPax.map((item: any, index: number) => {
                                return <option key={index} value={item.symbol} id={item.id}>{item.name}</option>
                             })}
                        </select> */}

                        {
                            tooltipShowPax &&
                            <div
                                style={{
                                    display: "relative"
                                }}
                            >
                                    <div className="newtooltip text-uppercase"
                                    style={{
                                        // right: "0%",
                                        width: `${window.screen.width > 767 ? "50%" : "78%"}`,
                                        marginLeft: `${window.screen.width > 767 ? "2.50%" : ""}`,
                                        marginTop: `${window.screen.width > 767 ? "1%" : "1%"}`,
                                    }}
                                >
                                    {/* <p>Your CMP count</p> */}
                                        <p className="mt-1 text-end lh-base">Pax rewards will be sent automatically to this address every time you achieve the 100 CMP</p>

                                </div>
                            </div>
                        }
                        <div className=''>
                            <Icon2 className='bi bi-info-circle'
                                onMouseDown={(e) => {
                                    setTooltipShowPax(false)
                                }}
                                onMouseUp={(e) => {
                                    setTooltipShowPax(true)
                                }}
                                onMouseEnter={() => setTooltipShowPax(true)}
                                onMouseLeave={() => setTooltipShowPax(false)}
                            ></Icon2>
                        </div>
                        <input
                            style={{
                                width: "45%",
                                padding: "11px 0px 11px 20px",
                                borderRadius: "5px"
                            }}
                            disabled
                            name="coin"
                            id="coin"                            
                            value={"BNB chain".toLocaleUpperCase()}                            
                        />

                        <div style={{ width: (window.screen.width < 350 ? '10em' : 'auto'), padding: '1em', textAlign: 'center' }}></div>
                        <input
                            className='text-uppercase'
                            style={{
                                width: "45%",
                                padding: "10px 0px 10px 20px",
                                borderRadius: "5px"
                            }}
                            name="address"
                            type="address"
                            placeholder="Enter address"
                            value={paxDetails.address || ""}
                            onChange={(e) => {
                                handleChangeValue(e, "paxDetails")
                            }}
                        />
                        <RemoveButton type='button'
                            disabled={!paxDetails?.address || savePaxAddress}
                            style={{
                                marginLeft: "10px",
                                borderRadius: "5px",
                                fontSize: "12px",
                            }}
                            onClick={() => {
                                // updateAddress()
                                setAddType("PAXADDADDERS")
                                handleModleShow()

                            }}>
                            {savePaxAddress ? <span className="loading">ADD..</span> : 'ADD'}
                        </RemoveButton>
                    </div>

                    {PaxErrorValue?.coinError && <Errorsapn>{PaxErrorValue?.coinError}</Errorsapn>}
                    {PaxErrorValue?.walletError && <Errorsapn>{PaxErrorValue?.walletError}</Errorsapn>}

                </SelectTextfield>}


                {/* For Wallet dropdown */}

                {walletDetailsObj.length > 0 && <SelectTextfield
                    label={`${("ADD YOUR ADDRESSES TO RECEIVE THE REFERRAL PAYMENTS ").toLocaleUpperCase()}`}
                    name="ADD YOUR ADDRESSES TO RECEIVE THE REFERRAL PAYMENTS "

                >
                    {
                        walletDetailsObj.length > 0 && tooltipShow &&
                        <div
                            style={{
                                display: "relative"
                            }}
                        >
                            <div className="newtooltip"
                                style={{
                                    // right: "0%",
                                    width: `${window.screen.width > 767 ? "50%" : "78%"}`,
                                    marginLeft: `${window.screen.width > 767 ? "2.50%" : ""}`,
                                    marginTop: `${window.screen.width > 767 ? "1%" : "1%"}`,
                                }}
                            >
                                {/* <p>Your CMP count</p> */}
                                <p className="mt-1 text-end lh-base">These addresses will be used to receive payments (50% of all your friends' total purchases) and rewards (PAX and Collectible cards)</p>

                            </div>
                        </div>
                    }
                    <div className=''>
                        <I className='bi bi-info-circle'
                            onMouseDown={(e) => {
                                setTooltipShow(false)
                            }}
                            onMouseUp={(e) => {
                                setTooltipShow(true)
                            }}
                            onMouseEnter={() => setTooltipShow(true)}
                            onMouseLeave={() => setTooltipShow(false)}
                        ></I>
                    </div>
                    
                {walletDetailsObj.map((item,index) => {                                            
                    return <>
                    <div className={`${window.screen.width > 350 ? 'd-flex ' : ''} mt-3 w-100`}>
                            <input                                
                            name="coin"
                            id="coin"
                            style={{
                                width: "45%",
                                padding: "11px 0px 11px 20px",
                                borderRadius: "5px"
                            }}
                                disabled={true}
                                value={item?.coin.toLocaleUpperCase() || ""}
                            // onChange={(e) => {
                            //     handleChangeValue(e, "")
                            // }}
                        />                            
                        
                        <div style={{ width: (window.screen.width < 350 ? '10em' : 'auto'), padding: '1em', textAlign: 'center' }}></div>
                            <input
                                
                            style={{
                                width: "45%",
                                padding: "10px 0px 10px 20px",
                                borderRadius: "5px"
                                }}
                                disabled={true}
                            name="address"
                            type="address"
                            placeholder="Enter address"
                                value={item.address || ""}
                            onChange={(e) => {
                                handleChangeValue(e, "walletDetails")
                            }}
                            />
                            <RemoveButton
                                style={{
                                    marginLeft: "10px",
                                    borderRadius: "5px"
                                }}
                                onClick={() => {
                                    handleRemoveBox(index)
                                }}>-</RemoveButton>
                        </div> 
                        
                    </>
                })}
                </SelectTextfield>}
                
                <SelectTextfield
                    label={`${walletDetailsObj.length < 1 ? ("ADD YOUR ADDRESSES TO RECEIVE THE REFERRAL PAYMENTS"):""}`}
                    name={`${walletDetailsObj.length < 1 &&  "ADD YOUR ADDRESSES TO RECEIVE THE REFERRAL PAYMENTS"}`}
                
                >      
                    
                    {
                        walletDetailsObj.length < 1 && tooltipShow &&
                        <div                            
                        >
                            <div className="newtooltip"
                                style={{
                                    // right: "0%",
                                    width: `${window.screen.width > 767 ? "50%" : "78%"}`,
                                    marginLeft: `${window.screen.width > 767 ? "2.50%" : ""}`,
                                    marginTop: `${window.screen.width > 767 ? "1%" : "1%"}`,
                                }}
                            >
                                {/* <p>Your CMP count</p> */}
                                    <p className="mt-1 text-end lh-base">These addresses will be used to receive payments (50% of all your friends' total purchases) and rewards (PAX and Collectible cards)</p>                                                              
                            </div>
                        </div>
                    }
                    {walletDetailsObj.length < 1 && <div className=''                        
                    >                    
                    <I className='bi bi-info-circle'
                        onMouseDown={(e) => {
                            setTooltipShow(false)
                        }}
                        onMouseUp={(e) => {
                            setTooltipShow(true)
                        }}
                        onMouseEnter={() => setTooltipShow(true)}
                        onMouseLeave={() => setTooltipShow(false)}
                    ></I> 
                    </div>  }                 
                    <div className={`${window.screen.width > 350 ? 'd-flex mt-2' : ''} w-100`}  >
                        <select
                            name="coin"
                                id="coin"
                                
                            style={{
                                width: "45%",
                                padding: "11px 0px 11px 20px",
                                borderRadius: "5px"
                            }}
                            value={walletDetails?.coin.toLocaleUpperCase() || ""}
                            onChange={(e) => {
                                handleChangeValue(e, "walletDetails")
                            }}
                        >
                            <option value="" className='text-uppercase'>{"Choose chain".toLocaleUpperCase()}</option>
                            {coinList.map((item: any, index: number) => {
                                return <option className='text-uppercase' key={index} value={item.symbol} id={item.id}>{item.name}</option>
                            })}
                        </select>
                        <div style={{ width: (window.screen.width < 350 ? '10em' : 'auto'), padding: '1em', textAlign: 'center' }}></div>
                        <input

                            style={{
                                width: "45%",
                                padding: "10px 0px 10px 20px",
                                borderRadius: "5px"
                            }}
                            name="address"
                            type="address"
                            placeholder={"Enter address".toLocaleUpperCase()}
                            value={walletDetails.address || ""}
                            onChange={(e) => {
                                handleChangeValue(e, "walletDetails")
                            }}
                        />                       
                        <RemoveButton type='button'
                            disabled={!walletDetails?.address || saveAddress}
                            style={{
                                marginLeft: "10px",
                                borderRadius: "5px"
                            }}
                            onClick={() => {
                                // updateAddress()
                                setAddType("ADDADDERS")
                                handleModleShow()
                                
                        }}>
                            {saveAddress ? <span className="loading">+</span> : '+'}
                        </RemoveButton>
                    </div>
                    {errorValue?.coinError && <Errorsapn>{errorValue?.coinError}</Errorsapn>}
                    {errorValue?.walletError && <Errorsapn>{errorValue?.walletError}</Errorsapn>}

                    </SelectTextfield>
                    
                
                

                {/* <div className="d-flex justify-content-center">
                    <div className="d-flex justify-content-center" style={{
                        width: `${window.screen.width > 767 ? "34%" : ""}`,
                        margin: "0px 0px 15px 0px",
                    }}>
                        <Buttons.Primary type='button' disabled={saveAddress} style={{ maxWidth: '200px', }} onClick={() => {
                            updateAddress()                            
                        }}>
                            {saveAddress ? <span className="loading">Update Address...</span> : 'Update Address'}
                        </Buttons.Primary>
                    </div>
                </div> */}

                {/* second part */}
                
                <SelectTextfield
                    label={`${("Choose your preferred payment time").toLocaleLowerCase()}`}
                    name="Choose your preferred payment time"
                >
                    {
                        tooltipShow2 &&
                        <div
                            style={{
                                display: "relative"
                            }}
                        >
                            <div className="newtooltip"
                                style={{
                                    // right: "0%",
                                    width: `${window.screen.width > 767 ? "50%" : "78%"}`,
                                    marginLeft: `${window.screen.width > 767 ? "2.50%" : ""}`,
                                    marginTop: `${window.screen.width > 767 ? "1%" : "1%"}`,
                                }}
                            >                                                                
                                <p className="mt-1 text-end lh-base">
                                    Be aware that the network fee will be deducted from the amount, so choose wisely
                                </p>
                            </div>
                        </div>
                    }
                    <div className=''>
                        <IconValue className='bi bi-info-circle'
                            onMouseDown={(e) => {
                                setTooltipShow2(false)
                            }}
                            onMouseUp={(e) => {
                                setTooltipShow2(true)
                            }}
                            onMouseEnter={() => setTooltipShow2(true)}
                            onMouseLeave={() => setTooltipShow2(false)}
                        ></IconValue>
                    </div>
                    
                    <div className="w-100" >
                        <div className="d-flex  justify-content-start align-items-center ">
                            <Form.Check
                                style={{ fontSize: "20px", marginRight: "10px" }}
                                type="radio"
                                id={`immediate`}
                                checked={selectRadio === 'IMMEDIATE'}
                                onClick={(e) => {
                                    hideError();
                                    setSelectRadio('IMMEDIATE');
                                }}
                            />
                            <label htmlFor="immediate" >{"Immediate".toLocaleUpperCase()}</label>

                        </div>

                        <div className="mt-3 ">
                            <div className='d-flex align-items-center'>
                                <Form.Check
                                    style={{ fontSize: "20px", marginRight: "10px" }}
                                    type="radio"
                                    id={`limit`}
                                    checked={selectRadio == 'LIMIT'}
                                    onClick={(e) => {
                                        setDefaultValue();
                                        setSelectRadio('LIMIT')
                                    }}
                                />
                                <label htmlFor="By limit" >{"By limit".toLocaleUpperCase()}</label>

                            </div>

                            {/* Limit part */}

                            {selectRadio === 'LIMIT' &&
                                <>
                                <div className='d-flex' style={{ marginLeft: '2em' }}>                                
                                <div className=" d-flex  align-items-center">
                                        <Form.Check
                                            style={{ fontSize: "20px", marginRight: "10px" }}
                                            type="checkbox"
                                            id={`Time`}   
                                            checked={limitType == 'TIME'}
                                            onChange={() => {
                                                setLimitType("TIME")
                                                setTimeError("")
                                            }}
                                        />
                                        <label htmlFor="default-checkbox" style={{ marginRight: "20px" }}> {"Time".toLocaleUpperCase()} </label>
                                    </div>
                                <div className=" d-flex  align-items-center">
                                        <Form.Check
                                            style={{ fontSize: "20px", marginRight: "10px" }}
                                            type="checkbox"
                                            id={`Amount`}                                            
                                            checked={limitType == 'AMOUNT'}
                                            onChange={() => {
                                                setLimitType("AMOUNT")
                                                setTimeError("")                                            
                                            }}
                                        />
                                        <label htmlFor="default-checkbox" style={{ marginRight: "20px" }}> {"Amount".toLocaleUpperCase()} </label>
                                    </div>
                                <div className=" d-flex  align-items-center">
                                        <Form.Check
                                            style={{ fontSize: "20px", marginRight: "10px" }}
                                            type="checkbox"
                                            id={`AnyofThem`}    
                                            checked={limitType == 'ANYOFTHEM'}
                                            onChange={() => {
                                                setLimitType("ANYOFTHEM")
                                                setTimeError("")
                                            }}
                                        />
                                        <label htmlFor="default-checkbox" style={{ marginRight: "7px" }} > {"Any of Them".toLocaleUpperCase() } </label>
                                    </div>
                                </div>
                                {limitType == "TIME" &&                                                                     
                                    <div className={`${window.screen.width > 350 ? 'd-flex ' : ''}mt-2`} style={{ marginLeft: '2em' }}>
                                            <select
                                                className='color-back'
                                                style={{
                                                    width: '15em',
                                                    height: '40px',
                                                    color: 'black',
                                                    paddingLeft: '10px',
                                                    borderRadius: "0px 5px 5px 0px",
                                                }}
                                                defaultValue={timeType}
                                            value={timeValue.toLocaleUpperCase()}
                                                onChange={e => {
                                                    // setTimeAmount({ ...timeAmount, time: e.target.value })
                                                    setTimeValue(e.target.value)
                                                }}
                                            >

                                            <option value=''>{"Select time frame".toLocaleUpperCase()}</option>
                                                <option value='1 DAY'>1 Day</option>
                                                <option value='1 WEEK'>1 Week</option>
                                                <option value='1 MONTH'>1 Month</option>
                                            </select>
                                        </div>                                    
                                    }
                                {limitType == "AMOUNT" &&   
                                <>    
                                    <input
                                        style={{
                                            width: '15em',
                                            padding: "10px 0px 10px 20px",
                                            borderRadius: "5px",
                                            paddingLeft: '10px',
                                            marginLeft: '2em' ,
                                    }}
                                    className='mt-2'
                                        maxLength={10}
                                        type="text" name="" id=""
                                        placeholder={"Type amount".toLocaleUpperCase()}
                                        value={amountValue}
                                        onChange={(e) => {
                                            const re = /^[0-9\b]+$/;
                                            if (e.target.value === '' || re.test(e.target.value)) {
                                                setAmountError("");
                                                setTimeError("");
                                                setAmountValue(e.target.value)
                                            }
                                        }}
                                    />    
                                    {/* <div className="d-flex mt-2 justify-content-between" style={{ marginLeft: '2em' }}>
                                        {amountError && <Errorsapn>{amountError}</Errorsapn>}
                                    </div> */}
                                    </>
                                    }

                                {limitType == "ANYOFTHEM" &&                                                                      
                                    <>
                                    <div className={`${window.screen.width > 350 ? 'd-flex ' : ''} mt-2`} style={{ marginLeft: '2em' }}>
                                        <select
                                            className='color-back'
                                            style={{
                                                width: '15em',
                                                height: '40px',
                                                color: 'black',
                                                paddingLeft: '10px',
                                                borderRadius: "0px 5px 5px 0px",
                                            }}
                                            defaultValue={timeType}
                                            value={timeAmount?.time}
                                            onChange={e => {
                                                setTimeAmount({ ...timeAmount, time: e.target.value })
                                            }}
                                        >

                                            <option  value=''>{"Select time frame".toLocaleUpperCase()}</option>
                                            <option value='1 DAY'>1 DAY</option>
                                            <option value='1 WEEK'>1 WEEK</option>
                                            <option value='1 MONTH'>1 MONTH</option>
                                        </select>
                                        <div style={{ width: (window.screen.width < 350 ? '15em' : 'auto'), padding: '1em', textAlign: 'center' }}>OR</div>
                                        <input
                                            style={{
                                                width: '15em',
                                                padding: "10px 0px 10px 20px",
                                                borderRadius: "5px",
                                                paddingLeft: '10px',
                                            }}
                                            maxLength={10}
                                            type="text" name="" id=""
                                            placeholder={"Type amount".toLocaleUpperCase()}
                                            value={timeAmount?.amount}
                                            onChange={(e) => {
                                                const re = /^[0-9\b]+$/;
                                                if (e.target.value === '' || re.test(e.target.value)) {
                                                    setAmountError("");
                                                    setTimeError("");
                                                    setTimeAmount({ ...timeAmount, amount: e.target.value })
                                                }
                                            }}
                                        />

                                    </div>
                                    {/* <div className="d-flex mt-2 justify-content-between" style={{ marginLeft: '2em' }}>
                                        {timeError && <Errorsapn>{timeError}</Errorsapn>}
                                        {amountError && <Errorsapn>{amountError}</Errorsapn>}
                                    </div> */}
                                    </>}
                                <div className="d-flex mt-2 justify-content-between" style={{ marginLeft: '2em' }}>
                                    {timeError && <Errorsapn>{timeError}</Errorsapn>}
                                    {amountError && <Errorsapn>{amountError}</Errorsapn>}
                                </div>
                                </>
                            }

                            {(selectRadio === 'LIMIT') && userInfo?.referalReceiveType?.name =="LIMIT"  &&
                                <>
                                {/* <div className={`${window.screen.width > 767 ? "justify-content-start" : "justify-content-center"} d-flex`}>
                                    
                                    <Buttons.Primary disabled={!selectRadio || savePaymentMethod} type='button' style={{
                                        maxWidth: '200px',
                                        marginLeft: `${window.screen.width > 767 ? "25px" : ""}`,
                                        opacity: `${getPendingShow ? 0.8 : 1}`
                                    }}
                                        
                                        onClick={() => {                                            
                                            // setGetPendingShow(true)
                                            setAddType("PAYNOW")
                                            handleModleShow()
                                        }}
                                >
                                        {getPendingShow ? <span className=''> Pay me now...</span> : ' Pay me now'}
                                    </Buttons.Primary>
                                </div> */}
                                </>
                            }

                        </div>
                        <div className="mt-3">
                            {/* <div className='d-flex align-items-center'>
                                <Form.Check
                                    style={{ fontSize: "20px", marginRight: "10px" }}
                                    type="radio"
                                    id={`manually`}
                                    checked={selectRadio === 'MANUAL'}
                                    onClick={(e) => {
                                        setSelectRadio('MANUAL');
                                        hideError();
                                    }}
                                />
                                <label htmlFor="manually" >MANUAL</label>
                            </div>
                            {(selectRadio === 'MANUAL' && false) &&
                                <>
                                    <input type="" name="" id=""
                                        style={{
                                            width: "100%",
                                            padding: "10px 0px 10px 20px",
                                            borderRadius: "5px"
                                        }}
                                        value={sendAmount}
                                        placeholder="Enter amount send to the parent account"
                                        onChange={(e) => {
                                            const re = /^[0-9\b.]+$/;
                                            if (e.target.value === '' || re.test(e.target.value)) {
                                                setTimeAmount({ time: '', amount: e.target.value })
                                            }
                                            hideError();
                                        }}
                                    />
                                    {amountError && <Errorsapn>{amountError}</Errorsapn>}
                                </>
                            } */}



                            
                            {/* {(selectRadio === 'LIMIT') &&
                                <>
                                <p
                                    style={{
                                    margin:"0px 0px 10px 25px"
                                }}
                                >On demand</p>
                                <div className={`${window.screen.width > 767 ? "justify-content-start" : "justify-content-center"} d-flex`}>
                                    
                                    <Buttons.Primary disabled={!selectRadio || savePaymentMethod} type='button' style={{
                                        maxWidth: '200px',
                                        marginLeft: `${window.screen.width > 767 ? "25px" : ""}`,
                                        opacity: `${getPendingShow ? 0.8 : 1}`
                                    }}
                                        
                                        onClick={() => {
                                            GetRefPayment()
                                            setGetPendingShow(true)
                                        }}
                                >
                                        {getPendingShow ? <span className=''> GET PENDING AMOUNT...</span> : 'GET PENDING AMOUNT'}
                                    </Buttons.Primary>
                                </div>
                                </>
                            } */}
                        </div>
                        <div className="mt-3 ">
                            <div className='d-flex align-items-center'>
                                <Form.Check
                                    style={{ fontSize: "20px", marginRight: "10px" }}
                                    type="radio"
                                    id={`demand`}
                                    checked={selectRadio == 'ONDEMAND'}
                                    onClick={(e) => {
                                        setDefaultValue();
                                        setSelectRadio('ONDEMAND')
                                    }}
                                />
                                <label htmlFor="On demand" >{"On demand".toLocaleUpperCase()}</label>

                            </div>
                            {(selectRadio === 'ONDEMAND') && (userInfo?.referalReceiveType?.name === 'ONDEMAND')&&
                                <>
                                {/* <div className={`${window.screen.width > 767 ? "justify-content-start" : "justify-content-center"} d-flex`}>
                                    
                                    <Buttons.Primary disabled={!selectRadio || savePaymentMethod} type='button' style={{
                                        maxWidth: '200px',
                                        marginLeft: `${window.screen.width > 767 ? "25px" : ""}`,
                                        opacity: `${getPendingShow ? 0.8 : 1}`
                                    }}
                                        
                                        onClick={() => {                                            
                                            // setGetPendingShow(true)
                                            setAddType("PAYNOW")
                                            handleModleShow()
                                        }}
                                >
                                        {getPendingShow ? <span className=''> Pay me now...</span> : ' Pay me now'}
                                    </Buttons.Primary>
                                </div> */}
                                </>
                            }
                        </div>
                    </div>
                </SelectTextfield>
                {console.log(userInfo?.referalReceiveType?.name !== selectRadio,"!== selectRadio")}
                <div className="d-flex justify-content-center">
                    <div className="d-flex justify-content-center" style={{
                        width: `${window.screen.width > 767 ? "34%" : ""}`,
                        margin: "0px 0px 15px 0px",
                    }}>
                        <Buttons.Primary
                            disabled={!selectRadio || savePaymentMethod}
                            // disabled={(userInfo?.referalReceiveType?.name == selectRadio) || !(selectRadio == "LIMIT")}
                            type='button' style={{
                                maxWidth: '200px',                            
                                backgroundColor: `${(userInfo?.referalReceiveType?.name !== selectRadio) || (selectRadio == "LIMIT") ? "" :"gray"}`
                            }}
                            onClick={() => {
                                // selectSendType()
                                if ((userInfo?.referalReceiveType?.name !== selectRadio) || (selectRadio == "LIMIT")) {                                    
                                    setAddType("UPDATESETTING")
                                    handleModleShow()
                                }
                            }}
                        >
                            {savePaymentMethod  ? <span className="loading"> UPDATE...</span> : 'UPDATE'}
                        </Buttons.Primary>
                    </div>
                </div>
            </div>
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
                    
                    
                    <div className="d-flex justify-content-end"
                        style={{
                            color: "gray",
                            cursor: "pointer"
                        }}
                        onClick={() => {
                            handleModleClose()
                        }}
                    >
                        X
                    </div>
                    <Modal.Body
                    >
                        <div className="d-flex flex-column align-items-center">
                            <WalletValidation
                                setMfaLogin={setMfaLogin}
                                UpdateFunction={UpdateFunction}
                                modalOpen={true}
                            />    
                        </div>
                    </Modal.Body>                    
                </Modal>
            </div> 

        </>
    )
}

export default WalletInfo