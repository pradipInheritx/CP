
import { Buttons } from 'Components/Atoms/Button/Button';
import UserContext from 'Contexts/User';
import axios from 'axios'
import { BearVsBullRow } from 'common/models/CoinTable';
import React, { useContext, useEffect, useState } from 'react'
import { Image } from 'react-bootstrap';
import PAX from '../../../assets/logos/PAX.png';


const Logo = ({ symbol }: BearVsBullRow) => {
    return (
        <Image
            src={process.env.PUBLIC_URL + `/images/logos/${symbol?.toUpperCase()}.svg`}
            style={{
                // margin: "0 auto",
                width: `${symbol !== "ETH" ? "40px" : "35px"}`,
                height: `${symbol !== "ETH" ? "40px" : "40px"}`,
            }}
            onError={(e) =>
                ((e.target as HTMLImageElement).src = "/images/no_logo.png")
            }
        />
    );
};

const WalletBalance = () => {
    const [pendingAmount, setPendingAmount] = useState({
        ETH: 0,
        BNB: 0,
        MATIC: 0
    })
    const { userInfo, user } = useContext(UserContext);
    const [pendingPax, setPendingPax] = React.useState(0);


    useEffect(() => {
        ShowPendingAmount()        
    }, [])

    const ShowPendingAmount = () => {
        axios.get(`/payment/getPendingPaymentbyUserId/${user?.uid}`)
            .then(async (response) => {                
                setPendingAmount(response.data.data)
            })
            .catch((error) => {
                console.log(error, "error")
            })
        
        axios.post("payment/getAllPendingPaxByUserId", {              
                userId: userInfo?.uid            
        }).then((res: any) => {
            console.log(res.data.result, "resultdata")
            setPendingPax(res?.data?.data?.result?.pendingPaxTotal || 0)
        }).catch((err: any) => {
            console.log(err, "resultdata")
        })
    }

    console.log(pendingPax,"pendingPax")
    const getPendingAmount = () => {
        axios.get(`/payment/getInstantReferalAmount/${user?.uid}`)
            .then(async (response) => {
                // setPendingAmount(response.data.data)                
            })
            .catch((error) => {
                // console.log(error,"error")
            })
    }

    return (
        <div className='d-flex justify-content-center align-items-center'
        >
            <div className='mt-3'>
                {pendingPax > 0 && userInfo?.isUserUpgraded && <>
                <p className='mx-3' style={{
                    fontSize: "18px"
                }}>{"YOUR REWARD PENDING  AMOUNT".toLocaleUpperCase()}</p>
                
                    <div className='d-flex justify-content-around align-items-center my-2'
                        style={{
                            background: "white",
                            borderRadius: "5px",
                            padding: "8px 8px",
                        }}
                    >
                        <div className='d-flex align-items-center'>
                            <img src={PAX} alt=""
                                style={{
                                    // margin: "0 auto",
                                    width: "40px",
                                    height: "40px",
                                }}
                            />
                            <p className=''
                                style={{
                                    marginLeft: `${"23px"}`
                                }}
                            >PAX</p>
                        </div>                      
                        <p className=''
                            style={{
                                color: "#6352E8",
                            }}
                        >{pendingPax}</p>
                    </div>
                </>}
                <p className='mx-3' style={{
                    fontSize: "18px",
                    margin:"20px 0px 10px 0px"
                }}>{"Your Referral Pending Amount".toLocaleUpperCase()}</p>
                {Object.keys(pendingAmount).length ?
                    <div className='d-flex flex-column'>
                        {Object.keys(pendingAmount).map((value, index) => {
                            if (value == "ETH" || value == "BNB" || value == "MATIC") {
                                return <>

                                    <div className='d-flex justify-content-around align-items-center my-2 '
                                        style={{
                                            background: "white",
                                            borderRadius: "5px",
                                            padding:"8px",
                                    }}
                                    >
                                        <div className='d-flex align-items-center'>
                                            <Logo
                                                symbol={value}
                                                
                                            />                                            
                                            <p className=''
                                                style={{
                                                    marginLeft: `${value == "ETH" ? "23px" : "20px"}`
                                                }}
                                            >{value} </p>
                                        </div>
                                        
                                        {/* @ts-ignore */}
                                        <p className=''
                                            style={{
                                                color:"#6352E8",
                                        }}
                                        >{pendingAmount[value]}</p>
                                    </div>
                                </>
                        }
                            
                        })
                        }
                    </div>
                    :
                    <div className="d-flex justify-content-center" >
                        <p className='mt-3'>Pending Payment Amount is not found</p>
                    </div>
                }                                
                <div className={`${window.screen.width > 767 ? "justify-content-center" : "justify-content-center"} d-flex mt-3`}>

                    <Buttons.Primary
                        //   disabled={!selectRadio || savePaymentMethod}
                        type='button' style={{
                            maxWidth: '200px',
                            marginLeft: `${window.screen.width > 767 ? "25px" : ""}`,
                            // opacity: `${getPendingShow ? 0.8 : 1}`
                        }}
                        onClick={() => {
                            getPendingAmount()
                        }}
                    >
                        {/* {getPendingShow ? <span className=''> Pay me now...</span> : ' Pay me now'} */}
                        {"COLLECT NOW".toLocaleUpperCase()}
                    </Buttons.Primary>
                </div>
            </div>
        </div>
    )
}

export default WalletBalance