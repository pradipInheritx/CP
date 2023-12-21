import { texts } from 'Components/LoginComponent/texts';
import { httpsCallable } from 'firebase/functions';
import React, { useContext, useEffect, useState } from 'react'
import { db, functions } from "firebase";
import UserContext from 'Contexts/User';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ButtonGroup } from "react-bootstrap";
import Button, { Buttons } from "Components/Atoms/Button/Button";
import moment from 'moment';
import AppContext from 'Contexts/AppContext';
import axios from 'axios';
import SelectTextfield from 'Components/Forms/SelectTextfield';
import { doc, setDoc } from 'firebase/firestore';
import { showToast } from 'App';
import { translate } from 'common/models/Dictionary';
import { ToastType } from 'Contexts/Notification';
import { toast } from 'react-toastify';

const HeaderText = styled.p`
  font-size: 15px;
  margin:15px 0px;
`;


const FoundationData=()=> {
    const { setAlbumOpen } = useContext(AppContext);
    const { userInfo, user } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [totalData, setTotalData] = useState<number>(0);

    const [pageIndex, setPageIndex] = useState(1);
    let navigate = useNavigate();
    const [FoundationArray, setFoundationArray] = useState([])
    const [foundationData, setFoundationData] = useState({
        id: "",
        name:"",
    })
   
    const FoundationValue = async () => {
        axios.get(`/admin/foundation/getList`).then((res) => {            
                setFoundationArray(res.data.foundationList)
        }).catch((err) => {
            console.log(err, "foundationListerr")
        })
    }

    useEffect(() => {
        FoundationValue()
        // @ts-ignore
        setFoundationData(userInfo?.foundationData || {})        
    }, [])


    const onSubmitAvatar = async () => {
        console.log(FoundationArray, "FoundationArray")
        if (user?.uid) {
         
            const userRef = doc(db, "users", user?.uid);
            try {            
                await setDoc(userRef, { foundationData }, { merge: true });                
                showToast("user foundation was updated");
                toast.dismiss();                
                // setShowMenuBar(false)        
            } catch (e) {
                showToast("user failed to be updated", ToastType.ERROR);
            }
        }
    };

    const handleChangeValue = (e: any, type?: string) => {
        let id = e.target.id;
        let value = e.target.value        
        setFoundationData({ name: value,id:id })                        
    }

    console.log(foundationData,"setFoundationData")

    return (
        <div className='d-flex justify-content-center px-2'>
            <div
                style={{
                    width: `${window.screen.width > 767 ? "500px" : "100%"}`
                }}
            >
                <HeaderText className='mt-4 text-uppercase'>This is foundation select by you</HeaderText>

                
                <div className='w-100 d-flex justify-content-between'>
                    
                        <select
                            name="coin"
                            id="coin"
                            style={{
                                width: `${window.screen.width > 767 ? "70%" : "70%"}`,
                                padding: "9px 0px 9px 20px",
                                borderRadius: "5px"
                            }}
                        value={foundationData.name}
                            onChange={(e) => {
                                handleChangeValue(e)
                            }}
                        >
                        <option value="" id="" className=''>{("Choose Foundation").toUpperCase()}</option>
                            {FoundationArray.map((item: any, index: number) => {
                                return <option className='' key={index} value={item.name} id={item.id}>{item.name.toUpperCase()}</option>
                            })}
                    </select>
                    
                    <Buttons.Primary
                        disabled={!foundationData.id || !foundationData.name}
                        type='button' style={{ maxWidth: '200px', }}
                        onClick={() => {
                            if (foundationData.id && foundationData.name) {
                                onSubmitAvatar()
                            }
                        }}
                    >
                        {/* {savePaymentMethod ? <span className="loading"> UPDATE...</span> : 'UPDATE'} */}
                        Update
                    </Buttons.Primary>
                    </div>                
                <HeaderText className='text-uppercase'>All foundation</HeaderText>
                <div>
                
                    <div className='d-flex justify-content-between my-3 text-uppercase'>
                    <strong>Name</strong>
                    <strong>Total Cpm</strong>
                </div>
            {FoundationArray.map((item:any,index:number) => {
                return (
                    <>
                        <div className='d-flex justify-content-between mt-2 text-uppercase'>
                            <span
                                style={{
                            width:"90%"
                        }}>{item.name}</span>
                            <span className='d-flex justify-content-center'                            
                                style={{
                                    width: "10%"
                                }}
                            >{item.commission}</span>
                        </div>
                    </>
                )
            })}
            </div>
            </div>
        </div>
    )
}

export default FoundationData