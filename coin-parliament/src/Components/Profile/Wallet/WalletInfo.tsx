import { Buttons } from 'Components/Atoms/Button/Button'
import SelectTextfield from 'Components/Forms/SelectTextfield'
import { texts } from 'Components/LoginComponent/texts'
import UserContext from 'Contexts/User'
import { useTranslation } from 'common/models/Dictionary'
import React, { useContext, useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import firebase from "firebase/compat";
import styled from "styled-components";
import axios from 'axios'
import { auth, db } from 'firebase'
import { doc, setDoc } from 'firebase/firestore'
import CoinsList from '../Payment/CoinsList'

const Errorsapn = styled.span`
  color:red;
`;

function WalletInfo() {
    const { userInfo } = useContext(UserContext);
    const [saveAddress, setSaveAddress] = useState(false)
    const [savePaymentMethod, setSavePaymentMethod] = useState(false);
    const [timeType, setTimeType] = useState<string>('time');

    const [walletDetails, setWalletDetails] = useState({
        coin: "",
        walletAddress: "",
    });
    const [errorValue, setErrorValue] = useState({
        coinError: "",
        walletError: ""
    })
    const [timeAmount, setTimeAmount] = useState({
        time: "1 DAY",
        amount: ""
    })

    useEffect(() => {
        setWalletDetails({
            coin: userInfo?.wellDAddress?.coin || '',
            walletAddress: userInfo?.wellDAddress?.address || '',
        });
        setSelectRadio(userInfo?.referalReceiveType?.name || '');
        setDefaultValue();
    }, [JSON.stringify(userInfo?.wellDAddress)]);
    const [timeError, setTimeError] = useState("")

    const [sendAmount, setSendAmount] = useState("")
    const [amountError, setAmountError] = useState("")
    let navigate = useNavigate();
    const [coinList, setCoinsList] = useState([])
    const [selectRadio, setSelectRadio] = useState<string>('');
    const [regexList, setRegexList] = useState({
        bitcoin: "/^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$/",
        ethereum: "/^0x[a-fA-F0-9]{40}$/",
    })


    useEffect(() => {
        const getCoinList = firebase
            .firestore()
            .collection("settings").doc("paymentCoins")
        getCoinList.get()
            .then((snapshot) => {
                const allList = snapshot.data()?.coins;
                setCoinsList(allList && allList);
            }).catch((error) => {
                console.log(error, "error");
            });
    }, [])

    const handleChangeValue = (e: any, type: string) => {
        let name = e.target.name;
        let value = e.target.value
        setWalletDetails({ ...walletDetails, [name]: value })
        setErrorValue({
            coinError: "",
            walletError: ""
        })
    }

    const updateAddress = async () => {
        if (!walletDetails.coin) {
            setErrorValue({ ...errorValue, coinError: "Please select coin" })
        } else if (!walletDetails.walletAddress) {
            setErrorValue({ ...errorValue, walletError: "Please Enter Wallet Address" })
        }
        else if (walletDetails.walletAddress) {
            setSaveAddress(true);
            const validate = await validateAddress(walletDetails.walletAddress, walletDetails.coin)
            if (validate) {
                setSaveAddress(false);
            } else {
                setErrorValue({ ...errorValue, walletError: "Please Enter Valid Wallet Address " })
                setSaveAddress(false);
            }
        }
    }

    const validateAddress = async (inputAddress: string, type: string) => {
        return axios.get(
            `https://api.blockcypher.com/v1/${type.toLowerCase()}/main/addrs/${inputAddress}`
        ).then(async (response) => {
            const { error } = response.data;
            if (auth?.currentUser) {
                const userRef = doc(db, "users", auth?.currentUser?.uid);
                await setDoc(userRef, {
                    wellDAddress: {
                        address: inputAddress,
                        coin: type,
                    }
                    // referalReceiveType: {
                    //     amount: '',
                    //     name: '',
                    //     time: ''
                    // },
                }, { merge: true });
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
        if (selectRadio === 'LIMIT' && timeAmount.time == "") {
            setTimeError("Please enter time.");
            errorCount++;
        }
        if (['LIMIT'].includes(selectRadio) && timeType === 'amount' && (timeAmount.amount === "" || !/^\d{0,8}(\.\d+)?$/.test(timeAmount.amount) || parseFloat(timeAmount.amount) <= 0)) {
            setAmountError("Please enter valid amount.");
            errorCount++;
        }
        if (!errorCount && auth?.currentUser) {
            setSavePaymentMethod(true);
            try {
                const userRef = doc(db, "users", auth?.currentUser?.uid);
                await setDoc(userRef, {
                    referalReceiveType: {
                        time: timeType === 'time' ? `${timeAmount.time}` : '',
                        name: selectRadio,
                        amount: timeType === 'amount' ? `${timeAmount.amount}` : '',
                    }
                }, { merge: true });
            } catch (err) {
                console.log(err);
            }
            setSavePaymentMethod(false);
        }
    }

    const hideError = () => {
        setTimeError("")
        setAmountError("");
        setTimeAmount({ time: '1 DAY', amount: '' });
    }
    const setDefaultValue = () => {
        setTimeAmount({
            amount: userInfo?.referalReceiveType?.amount || '',
            time: userInfo?.referalReceiveType?.time ? userInfo?.referalReceiveType?.time : '1 DAY'
        });
        setTimeType(userInfo?.referalReceiveType?.amount ? 'amount' : 'time');
    }
    return (
        <>
            <div className="mt-4">
                <SelectTextfield
                    label={`${"SELECT COIN"}`}
                    name="Select Coin"
                >
                    <select
                        name="coin"
                        id="coin"
                        style={{
                            width: "100%",
                            padding: "11px 0px 11px 20px",
                            borderRadius: "5px"
                        }}
                        value={walletDetails?.coin || ""}
                        onChange={(e) => {
                            handleChangeValue(e, "")
                        }}
                    >
                        <option value="">Select Coin</option>
                        {coinList.map((item: any, index: number) => {
                            return <option key={index} value={item.symbol} id={item.id}>{item.name}</option>
                        })}
                    </select>
                    {errorValue?.coinError && <Errorsapn>{errorValue?.coinError}</Errorsapn>}
                </SelectTextfield>

                <SelectTextfield
                    label={`${texts.WALLETADDRESS}`}
                    name="walletAddress"
                >
                    <input
                        style={{
                            width: "100%",
                            padding: "10px 0px 10px 20px",
                            borderRadius: "5px"
                        }}
                        name="walletAddress"
                        type="walletAddress"
                        placeholder="Wallet Address"
                        value={walletDetails.walletAddress || ""}
                        onChange={(e) => {
                            handleChangeValue(e, "")
                        }}
                    />
                    {errorValue?.walletError && <Errorsapn>{errorValue?.walletError}</Errorsapn>}
                </SelectTextfield>
                <div className="d-flex justify-content-center">
                    <div className="d-flex justify-content-center" style={{
                        width: `${window.screen.width > 767 ? "34%" : ""}`,
                        margin: "0px 0px 15px 0px",
                    }}>
                        <Buttons.Primary type='button' disabled={saveAddress} style={{ maxWidth: '200px', }} onClick={() => { updateAddress() }}>
                            {saveAddress ? <span className="loading">Update Address...</span> : 'Update Address'}
                        </Buttons.Primary>
                    </div>
                </div>
                <SelectTextfield
                    label={`${("Receiving payment").toLocaleUpperCase()}`}
                    name="Receiving Payment"
                >
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
                            <label htmlFor="immediate" > immediately the collected referal amount. </label>

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
                                <label htmlFor="limit" >Enter time limit and amount.</label>

                            </div>
                            {selectRadio === 'LIMIT' &&
                                <div style={{ marginLeft: '2em' }}>
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
                                        value={timeType}
                                        onChange={e => {
                                            setAmountError("");
                                            setTimeType(e.target.value);
                                        }}
                                    >
                                        <option value={'time'}>Time</option>
                                        <option value={'amount'}>Amount</option>

                                    </select>
                                    {timeType === 'amount' ?
                                        <input
                                            style={{
                                                width: '15em',
                                                padding: "10px 0px 10px 20px",
                                                borderRadius: "5px",
                                                paddingLeft: '10px',
                                            }}
                                            type="text" name="" id=""
                                            placeholder="Enter Amount"
                                            value={timeAmount?.amount}
                                            onChange={(e) => {
                                                const re = /^[0-9\b.]+$/;
                                                if (e.target.value === '' || re.test(e.target.value)) {
                                                    setAmountError("");
                                                    setTimeAmount({ ...timeAmount, amount: e.target.value })
                                                }
                                            }}
                                        /> :
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
                                                // setTimeType(e.target.value);
                                            }}
                                        >

                                            <option value='1 DAY'>1 Day</option>
                                            <option value='1 WEEK'>1 Week</option>
                                            <option value='1 MONTH'>1 Month</option>


                                        </select>}
                                    <div className="d-flex mt-2 justify-content-between">
                                        {timeError && <Errorsapn>{timeError}</Errorsapn>}
                                        {amountError && <Errorsapn>{amountError}</Errorsapn>}
                                    </div>
                                </div>
                            }

                        </div>
                        <div className="mt-3">
                            <div className='d-flex align-items-center'>
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
                                <label htmlFor="manually" >Manually{/* Add Amount send to the parent account */}</label>
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
                            }
                        </div>

                    </div>
                </SelectTextfield>
                <div className="d-flex justify-content-center">
                    <div className="d-flex justify-content-center" style={{
                        width: `${window.screen.width > 767 ? "34%" : ""}`,
                        margin: "0px 0px 15px 0px",
                    }}>
                        <Buttons.Primary disabled={!selectRadio || savePaymentMethod} type='button' style={{ maxWidth: '200px', }}
                            onClick={() => { selectSendType() }}
                        >
                            {savePaymentMethod ? <span className="loading">Update Amount...</span> : 'Update Amount'}
                        </Buttons.Primary>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WalletInfo