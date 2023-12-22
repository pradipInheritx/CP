import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { texts } from "../Components/LoginComponent/texts";
import GeneralPage from "../GeneralPage";
import UNICEF from "assets/images/foundation/unicef.png"
import americanRedCross from "assets/images/foundation/americanRedCross.png"
import salvationArmy from "assets/images/foundation/salvationArmy.png"
import savetheChildren from "assets/images/foundation/savetheChildren.png"
import unitedWay from "assets/images/foundation/unitedWay.png"
import styled from "styled-components";
import axios from "axios";
import UserContext from "Contexts/User";
import { doc, setDoc } from "firebase/firestore";
import { showToast } from "App";
import { toast } from "react-toastify";
import { db } from "firebase";
import { ToastType } from "Contexts/Notification";
import { Buttons } from "Components/Atoms/Button/Button";

const text = [
  {
    image: UNICEF,
    text: "UNICEF: Supporting children's rights, UNICEF provides healthcare, clean water, education, and protection to children in need worldwide."
  },
  {
    image: savetheChildren,
    text: "Save the Children: Save the Children works to improve the lives of children through education, healthcare, and protection from harm, ensuring every child has a chance to thrive."
  },
  {
    image: salvationArmy,
    text: "Salvation Army: The Salvation Army offers assistance to those in need, including food, shelter, and rehabilitation services, helping individuals and families overcome hardships."
  },
  {
    image: unitedWay,
    text: "United Way: United Way focuses on community development, addressing issues like poverty and education to create lasting change in local communities."
  },
  {
    image: americanRedCross,
    text: "American Red Cross: The American Red Cross provides disaster relief, blood donation services, and support to military families, saving lives and easing human suffering."
  },
]

const HeaderText = styled.p`
  font-size: 15px;
  margin:15px 0px;
`;

const Foundations = () => {

  const { userInfo, user } = useContext(UserContext);
  const [FoundationArray, setFoundationArray] = useState([])
  const [FoundationEdit, setFoundationEdit] = useState(false)
  const [foundationData, setFoundationData] = useState({
    id: "",
    name: "",
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
  }, [userInfo])


  const onSubmitAvatar = async () => {    
    if (user?.uid) {

      const userRef = doc(db, "users", user?.uid);
      try {
        await setDoc(userRef, { foundationData }, { merge: true });
        showToast("user foundation was updated");
        setFoundationEdit(false)
        toast.dismiss();
        // setShowMenuBar(false)        
      } catch (e) {
        setFoundationEdit(false)
        showToast("user failed to be updated", ToastType.ERROR);
      }
    }
  };

  const handleChangeValue = (e: any, type?: string) => {
    let id = e.target.options[e.target.selectedIndex].id;
    let value = e.target.value
    setFoundationData({ name: value, id: id })
  } 
  return (
    <GeneralPage>
      <div >
        <div style={{ textAlign: 'center' }}>
          <h1>
            {(`${texts.Foundations}`).toUpperCase()}:
          </h1>
        </div>
        <p style={{ textAlign: 'justify' }}>
          For every PAX token that is minted on Coin Parliament, you have the opportunity to choose one of these charitable foundations:
        </p>
        <ul style={{ textAlign: 'justify', listStyleType: 'none' }}>
          {text.map((value, index) => {
            return (
              <li className="" key={index}>
                <div className="d-flex">
                  <div className="" style={{ height: '30px', width: '30px', display: 'inline-block' }}>
                    <img src={value?.image} alt="" style={{ height: '30px', width: '30px', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                  <p className="" style={{ paddingLeft: '1em', textAlign: 'justify' }}>{value?.text}</p>
                </div>
              </li>
            )
          })}
        </ul>
        <p style={{ textAlign: 'justify' }} className="px-2">
          You can select which charitable foundation you'd like to support, and we will donate an extra 10% (from our account) to your chosen charity. This means that each time a PAX token is minted, you can make a meaningful contribution to the cause you care about the most through your participation in Coin Parliament.
        </p>
      </div>

      <div className='d-flex justify-content-center px-2'>
        <div
          style={{
            width: `${window.screen.width > 767 ? "500px" : "100%"}`
          }}
        >
          {user?.uid && 
          <>
          <HeaderText className='mt-4 text-uppercase'>This is foundation select by you</HeaderText>


          <div className='w-100 d-flex justify-content-between'>

            <select
              name="coin"
              id={foundationData.id}
              style={{
                width: `${window.screen.width > 767 ? "70%" : "70%"}`,
                padding: "9px 0px 9px 20px",
                borderRadius: "5px"
              }}
              value={foundationData.name}
              disabled={!FoundationEdit}
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
              // disabled={!foundationData.id || !foundationData.name}
              type='button' style={{ maxWidth: '200px', }}
              onClick={() => {
                if (foundationData.id && foundationData.name && FoundationEdit) {                  
                  onSubmitAvatar()
                } else {
                  setFoundationEdit(true)
                }
              }}
            >
              {/* {savePaymentMethod ? <span className="loading"> UPDATE...</span> : 'UPDATE'} */}
              {FoundationEdit ? "Save" :"Edit"}
            </Buttons.Primary>
            </div>
          </>
          }
          {/* <HeaderText className='text-uppercase'>All foundation</HeaderText> */}
          <div>

            <div className='d-flex justify-content-between my-3 text-uppercase'>
              <strong>Foundation &nbsp;Name</strong>
              <strong>Total Cpm</strong>
            </div>
            {FoundationArray.map((item: any, index: number) => {
              return (
                <>
                  <div className='d-flex justify-content-between mt-2 text-uppercase'>
                    <span
                      style={{
                        width: "90%"
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
    </GeneralPage>
  );
};

export default Foundations;
