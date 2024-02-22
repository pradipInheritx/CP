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
import { db } from "../firebase";
import { ToastType } from "Contexts/Notification";
import { Buttons } from "Components/Atoms/Button/Button";
import { Image } from "react-bootstrap";
import { CircularProgressbar ,buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useWindowSize } from "../hooks/useWindowSize";
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

const avatarIMG:any = {
  "SAVE THE CHILDREN":savetheChildren,
  "UNICEF WALLET":UNICEF,
  "UNITED WAY":unitedWay,
  "AMERICAN RED CROSS":americanRedCross,
  "SALVATION ARMY":salvationArmy
}

const HeaderText = styled.p`
  font-size: 15px;
  margin:15px 0px;
`;
const FoundationPage = styled.div`
  font-size: 13px;
  margin:auto;
  line-height: 21px;
  padding: 24px 10px;
  background: white;
  color: #160133;
  font-weight:100;
  max-width:800px;
  min-height:82vh;
  & h1 {
    color: #6352E8;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 20px;
  }

  & a {
    color: #6352E8;
  }

  & p {
    margin-bottom: 20px;
  }
`;

const Foundations = () => {

  const { userInfo, user } = useContext(UserContext);
  const [FoundationArray, setFoundationArray] = useState([])
  const [FoundationEdit, setFoundationEdit] = useState(false)
  const [foundationData, setFoundationData] = useState({
    id: "",
    name: "",
  })
  const { width: w = 0 } = useWindowSize();
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
        // toast.dismiss();
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
  
  const percentage = 66;
  return (
      
    <FoundationPage>
      
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
            width: `${window.screen.width > 767 ? "500px" : "100%"}`,
            // padding: "20px"
          }}
        >
          {user?.uid && 
          <>
          <HeaderText className='mt-4 text-uppercase'>This is foundation select by you</HeaderText>


          <div className='w-100 ' style={{backgroundColor:"#5d4ae1",
            color: "white",
            width:"40%",
            height:"40px",
            borderRadius:'6px',
            lineHeight:"40px",
            padding:"25px",
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between"}}>

          {FoundationEdit?<select
              name="coin"
              id={foundationData.id}
              style={{
                // width: `${window.screen.width > 767 ? "70%" : "70%"}`,
                // padding: "9px 0px 9px 20px",
                // borderRadius: "5px"
                border:"none",
                backgroundColor:"#5d4ae1",
                outline:"none",
                color: "white"
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
            </select>: <span style={{textTransform:"uppercase"}}>{foundationData?.name}</span> }

            <span
              // disabled={!foundationData.id || !foundationData.name}
              style={{ maxWidth: '200px', }}
              onClick={() => {
                if (foundationData.id && foundationData.name && FoundationEdit) {                  
                  onSubmitAvatar()
                } else {
                  setFoundationEdit(true)
                }
              }}
            >              
              {FoundationEdit ? "Save" :"Edit"}
            </span>
            </div>
          </>
          }          
          <div>

            <div className='d-flex justify-content-between my-3 text-uppercase'>
              <strong style={{width:"60%"}}>Foundation</strong>
              <strong style={{
                width: "30%",
                textAlign: `${window.screen.width > 767 ?"center":"left"}`,
              }}>Cpm</strong>
              <strong style={{width:"10%"}}>Pax</strong>
            </div>
            {FoundationArray.map((item: any, index: number) => {
              
              return (
                <>
                  <div style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                  width:"100%",
                  height:"76px",
                    borderRadius: "6px",
                  marginTop:"10px",
                  padding:"1rem"}}
                  >
                  <div className="row hstack" >
                              <div className="col-2" style={{width:window.screen.width > 767 ? '15%' : '15%',transform:window.screen.width > 320 ? 'scale(1)' : 'scale(0.7)'}} >
                              <Image
                                style={{
                                  border: " 3px solid var(--blue-violet)",
                                  boxShadow: "1px 0px 5px #FAE481",
                                  backgroundColor:"#FAE481",    
                                }}
                                  roundedCircle={true}
                                  src={avatarIMG[`${item.name.toUpperCase()}`]}
                                  alt="avatar"
                                  className="avatar_sm"
                                />
                              </div>
                              <div className="col-5" style={{width:window.screen.width > 767 ? '55%' : '40%'}}>
                              <span className="badge_sm rounded-pill vstack" style={{marginBottom:'2px',
                                    width:"6rem",
                                    height:"1.5rem",
                                    padding:"3px",
                                    fontSize:"8px",
                                    display:"flex",
                                    justifyContent:"center",
                                    fontWeight:"bold"}}>{item.name}</span>
                              </div>
                              <div className="col-3" style={{width:window.screen.width > 767 ? '15%' : '20%'}}>
                              <CircularProgressbar value={item.commission/100} text={`${(item.commission/100).toFixed(2)}`}
                               styles={buildStyles({
                                pathColor: "#6352e8",
                                pathTransition: "none",
                                strokeLinecap: "butt",
                                trailColor:"grey",
                                textColor:"#6352E8"
                            })}/>
                              </div>
                              <div className="col-3" style={{width:window.screen.width > 767 ? '10%' : '25%', display:"flex",justifyContent:"flex-end"}}>
                              <span className='d-flex justify-content-center'
                                style={{
                                    width: "10%",
                                    color: "#6352E8"
                                    }}
                                 >
                                  {/* {item.commission} */}
                                  {item?.paxValue || 0}
                                  </span>
                              </div>
                              
                          </div>
                    {/* <span
                      style={{
                        width: "90%"
                      }}>{item.name}</span>
                    <span className='d-flex justify-content-center'
                      style={{
                        width: "10%"
                      }}
                    >{item.commission}</span> */}
                  </div>
                </>
              )
            })}
          </div>
        </div>
      </div>
      </FoundationPage>      
    
  );
};

export default Foundations;
