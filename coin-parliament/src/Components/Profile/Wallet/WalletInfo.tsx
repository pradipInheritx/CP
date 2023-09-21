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

const Errorsapn = styled.span`
  color:red;
`;

function WalletInfo() {
    const { userInfo } = useContext(UserContext);
    const translate = useTranslation();
    const [walletDetails, setWalletDetails] = useState({
        coin: "BTC",
        walletAdderss: "0x0189705803Cb6819Ee80D209A9CCeAf56fD99E24",
    })
    const [errorValue, setErrorValue] = useState({
        coinError: "",
        walletError: ""
    })
    const [timeAmount, setTimeAmount] = useState({
        time: "",
        amount: ""
    })


    const [timeAmountError, setTimeAmountError] = useState("")

    const [sendAmount, setSendAmount] = useState("")
    const [sendAmountError, setSendAmountError] = useState("")
    let navigate = useNavigate();
    const [coinList, setCoinsList] = useState([])
    const [selectRadio, setSelectRadio] = useState(0)
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

    const handalChangeValue = (e: any, type: string) => {
        console.log(e.target, "getvalue")
        let name = e.target.name;
        let value = e.target.value
        setWalletDetails({ ...walletDetails, [name]: value })
        setErrorValue({
            coinError: "",
            walletError: ""
        })
    }

    const updateAdderss = () => {
        const coinName = coinList.filter((item: any) => {
            if (walletDetails.coin == item.symbol) {
                return item
            }
        })
        // console.log(coinName[0]?.name,"coinName")
        if (!walletDetails.coin) {
            setErrorValue({ ...errorValue, coinError: "Please select coin" })
        } else if (!walletDetails.walletAdderss) {
            setErrorValue({ ...errorValue, walletError: "Please Enter Wallet Adderss" })
        }
        else if (walletDetails.walletAdderss) {
            // @ts-ignore
            // var valid = WAValidator.validate(`${walletDetails.walletAdderss}`, `${coinName[0]?.name}`, `${walletDetails.coin}`);
            // if (valid)
            //     alert('This is a valid address');
            // else
            //     setErrorValue({ ...errorValue, walletError: "Address INVALID" })
            validateAddress(walletDetails.walletAdderss, walletDetails.coin)
        }
    }

    const validateAddress = (inputAddress?: any, type?: any) => {
        axios.get(
            `https://api.blockcypher.com/v1/${type.toLowerCase()}/main/addrs/${inputAddress}`
        ).then((response) => {
            const { error } = response.data;

            if (error) {
                setErrorValue({ ...errorValue, walletError: "Please Enter Valid Wallet Address " })
            } else {
                // setIsValid(true);
                alert("this is ok")
            }
        }).catch(() => {

            setErrorValue({ ...errorValue, walletError: "Please Enter Valid Wallet Address " })
        })
    };

    const selectSendType = () => {
        setTimeAmountError("")
        setSendAmountError("")

        if (selectRadio == 1) {
            console.log(selectRadio, "selectRadio")
        }
        if (selectRadio == 2) {
            if (timeAmount.time == "" || timeAmount.amount == "") {
                setTimeAmountError("Please Add time and Amount Both ")
            }
            else {
                console.log(timeAmount, selectRadio, "selectRadio")
            }
        }
        if (selectRadio == 3) {
            if (sendAmount == "") {
                setSendAmountError("Please Add Amount")
            }
            else {
                console.log(sendAmount, selectRadio, "selectRadio")
            }
        }
    }

    const hideError = () => {
        setTimeAmountError("")
        setSendAmountError("")
        // setSelectRadio(0)
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
                            handalChangeValue(e, "")
                        }}
                    >
                        <option value="">Select Coin</option>
                        {coinList.map((item: any, index: number) => {
                            return <option value={item.symbol} id={item.id}>{item.name}</option>
                        })}
                    </select>
                    {errorValue?.coinError && <Errorsapn>{errorValue?.coinError}</Errorsapn>}
                </SelectTextfield>

                <SelectTextfield
                    label={`${texts.WALLETADDRESS}`}
                    name="walletAdderss"
                >
                    <input
                        style={{
                            width: "100%",
                            padding: "10px 0px 10px 20px",
                            borderRadius: "5px"
                        }}
                        name="walletAdderss"
                        type="walletAdderss"
                        placeholder="Wallet Address"
                        value={walletDetails.walletAdderss || ""}
                        onChange={(e) => {
                            handalChangeValue(e, "")
                        }}
                    />
                    {errorValue?.walletError && <Errorsapn>{errorValue?.walletError}</Errorsapn>}
                </SelectTextfield>
                <div className="d-flex justify-content-center">
                    <div className="d-flex justify-content-center" style={{
                        width: `${window.screen.width > 767 ? "34%" : ""}`,
                        margin: "0px 0px 15px 0px",
                    }}>
                        <Buttons.Primary style={{ maxWidth: '200px', }}
                            onClick={() => { updateAdderss() }}
                        >Update Adderss</Buttons.Primary>
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
                                //   name="group1"
                                id={`default-checkbox`
                                }
                                checked={selectRadio == 1}

                                onClick={(e) => {
                                    setSelectRadio(1)
                                }}
                            />
                            <label htmlFor="default-checkbox" > Immedietely the collected referal amount. </label>

                        </div>

                        <div className="mt-3 ">

                            {/* <p className="" ></p> */}
                            <div className='d-flex align-items-center'>


                                <Form.Check
                                    style={{ fontSize: "20px", marginRight: "10px" }}
                                    type="radio"
                                    //   name="group1"
                                    id={`default-checkbox`
                                    }
                                    checked={selectRadio == 2}
                                    onClick={(e) => {
                                        setSelectRadio(2)
                                    }}
                                />
                                <label htmlFor="default-checkbox" >Enter time limit or amount.</label>
                            </div>
                            {selectRadio == 2 && <div className="d-flex mt-2 justify-content-between ">
                                <input
                                    style={{
                                        width: "45%",
                                        padding: "10px 0px 10px 20px",
                                        borderRadius: "5px"
                                    }}
                                    type="text" name="" id=""
                                    value={timeAmount?.time}
                                    placeholder="Enter Days"
                                    onChange={(e) => {
                                        const re = /^[0-9\b]+$/;
                                        if (e.target.value === '' || re.test(e.target.value)) {
                                            setTimeAmount({ ...timeAmount, time: e.target.value })
                                        }
                                        hideError()
                                    }}
                                />
                                <input
                                    style={{
                                        width: "45%",
                                        padding: "10px 0px 10px 20px",
                                        borderRadius: "5px"
                                    }}
                                    type="text" name="" id=""
                                    placeholder="Enter Amount"
                                    value={timeAmount?.amount}
                                    onChange={(e) => {
                                        const re = /^[0-9\b]+$/;
                                        if (e.target.value === '' || re.test(e.target.value)) {
                                            setTimeAmount({ ...timeAmount, amount: e.target.value })
                                        }
                                        hideError()
                                    }}
                                />
                            </div>}
                            {timeAmountError && <Errorsapn>{timeAmountError}</Errorsapn>}
                        </div>
                        <div className="mt-3">
                            <div className='d-flex align-items-center'>


                                <Form.Check
                                    style={{ fontSize: "20px", marginRight: "10px" }}
                                    type="radio"
                                    //   name="group1"
                                    id={`default-checkbox`
                                    }
                                    checked={selectRadio == 3}
                                    onClick={(e) => {
                                        setSelectRadio(3)
                                    }}
                                />
                                <label htmlFor="default-checkbox" >Add Amount send to the parent account</label>
                            </div>
                            {selectRadio == 3 && <input type="" name="" id=""
                                style={{
                                    width: "100%",
                                    padding: "10px 0px 10px 20px",
                                    borderRadius: "5px"
                                }}
                                value={sendAmount}
                                placeholder="Enter amount send to the parent account"
                                onChange={(e) => {
                                    const re = /^[0-9\b]+$/;
                                    if (e.target.value === '' || re.test(e.target.value)) {
                                        setSendAmount(e.target.value)
                                    }
                                    hideError()
                                }}
                            />}
                        </div>
                        {sendAmountError && <Errorsapn>{sendAmountError}</Errorsapn>}
                    </div>
                </SelectTextfield>
                <div className="d-flex justify-content-center">
                    <div className="d-flex justify-content-center" style={{
                        width: `${window.screen.width > 767 ? "34%" : ""}`,
                        margin: "0px 0px 15px 0px",
                    }}>
                        <Buttons.Primary style={{ maxWidth: '200px', }}
                            onClick={() => { selectSendType() }}
                        >Update Amount</Buttons.Primary>
                    </div>
                </div>
            </div>
        </>
    )
}

export default WalletInfo