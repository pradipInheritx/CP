/** @format */

import React, { useContext } from "react";
import { Image } from "react-bootstrap";
import { useTranslation } from "../common/models/Dictionary";
import Pairs from "../Components/Pairs/Pairs";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import UserContext from "../Contexts/User";
import Coins from "../Components/Coins/Coins";
import { calcFavorites } from "../common/utils/coins";
import AppContext from "../Contexts/AppContext";
import { HomeContainer } from "../Components/App/App";
import NotificationContext from "../Contexts/Notification";
import NotLoggedInPopup from "../Components/App/NotLoggedInPopup";
import Quotes from "../Components/Quotes";
import ContentContext from "../Contexts/ContentContext";
import { useWindowSize } from "../hooks/useWindowSize";
import InfluencersCarousel from "../Components/Users/InfluencersCarousel";
import { texts } from "../Components/LoginComponent/texts";
import { Buttons } from "../Components/Atoms/Button/Button";
import { firestore } from "../firebase";
import { collection, doc, getDocs, query, setDoc, where, limit } from "firebase/firestore";


const H2 = styled.h2`
  font-size: var(--font-size-xxl);
  text-align: center;
`;

const TextContainer = styled.div`
  max-width: 284px;
  margin: 0 auto;

  & p {
    font-size: 17px;
  }
`;
const Home = () => {
  const translate = useTranslation();
  const { user } = useContext(UserContext);
  const { login, firstTimeLogin, setLogin, setLoginRedirectMessage, setSignup } =
    useContext(AppContext);
  const { showModal } = useContext(NotificationContext);
  const { quotes } = useContext(ContentContext);
  const { width } = useWindowSize();
  // const src = `/hpbanner${width && width > 979 ? "" : ""}.png`;
  const src = `/hpbanner${width && width > 979 ? "" : ""}.png`;

  // const userQuerySnapshot = await getDocs(query(usersCollectionRef, where('referalReceiveType.name', '!=', 'ONDEMAND'), limit(1)));

  // const updateAllUsers = async () => {
  //   try {
  //     const usersCollectionRef = collection(firestore, 'users');
  //     const userQuerySnapshot = await getDocs(query(usersCollectionRef, where('referalReceiveType.name', '!=', 'ONDEMAND')));

  //     const getAllUsers = userQuerySnapshot.docs.map(user => {
  //       const userData = user.data();
  //       return { userId: user.id};
  //     });

  //     console.log("getAllUsers length: " + getAllUsers);

  //     const updateUserList = getAllUsers.map(async (user) => {
  //       // const getRefrealType = user.referalType;
  //       console.log(user.userId,"user.userId")
  //       await setDoc(doc(usersCollectionRef, user.userId), { referalReceiveType: { amount: "", days: "", limitType:"", name: "ONDEMAND" }},{ merge: true });
  //     });

  //     await Promise.all(updateUserList);
  //     console.log('All updates completed successfully');
  //   } catch (error) {
  //     console.error("scriptToUpdateAllUsers ERROR: " + error);
  //   }
  // };



  return (
    <>
      <div className='p-0 w-100' style={{ background: "#160133" }}>
        {/* <button type="button"
          onClick={() => {
            updateAllUsers()
        }}
        >Run Croin</button> */}
        <div className= "HomeImage" style={{ background: "#160133" }}>
          <HomeContainer width={width} className='mb-4 p-0  '>
            {!(login || firstTimeLogin) && (
              <>
                <Image
                  src={src}
                  style={{
                    width: width && width > 969 ? "100%" : "100%",
                    height:
                      width && width > 969
                        ? "auto"
                        : "auto",
                    marginTop: width && width > 969 ? "0" : "80px",
                    // marginTop:'120px',
                    position: "absolute",
                  }}
                />

                <div
                  className='w-100 '
                  style={{
                    marginTop: window.screen.width > 979 ? "150px" : "-48px",
                  }}
                >


                  {/* <TextContainer className="mt-2" >
                  <p>{translate("Make better investment decisions with the world’s first social voting indicator")}</p>
                </TextContainer> */}
                </div>
              </>
            )}
          </HomeContainer>
        </div>
        <div className='mb-4 mx-0 HomeText'>
           {/* <h2
                    style={{ zIndex: 0, position: "relative",marginTop:window?.screen?.width<768?'90px': "200px" }}
                    className=' d-block text-center mb-2'
                  >
                    <strong
                      className='text-uppercase text-center'
                      style={{ fontSize: "24px", fontWeight: "700" }}
                    >
                      {translate("Vote to Earn")}
                    </strong>
                  </h2> */}
                    {/* <TextContainer className="mt-2" style={{textTransform:'none',fontWeight:'400'}}>
                  <p>{translate("Make better investment decisions with the world’s first social indicator")}</p>
                </TextContainer> */}
                    {/* <span className="ms-xl-2">{translate("Crypto & NFT")}</span> */}
          {window.screen.width > 979 ? (
            <>
              {/* <h2
             style={{ zIndex: 0, position: "relative",marginTop:window?.screen?.width<768?'90px': "200px" }}
             className=' d-block text-center mb-2'
           >
             <strong
               className='text-uppercase text-center'
               style={{ fontSize: "44px", fontWeight: "700" }}
             >
               {translate("Vote to Earn")}
             </strong>
           </h2> */}
             {/* <TextContainer className="mt-2" style={{textTransform:'none',fontWeight:'400'}}>
           <p>{translate("Make better investment decisions with the world’s first social indicator")}</p>
         </TextContainer> */}
             {/* <span className="ms-xl-2">{translate("Crypto & NFT")}</span> */}
            <H2
              style={{
                  // zIndex: 1,
                  fontWeight: "400",
                  position: "relative",
                  // marginTop: "200px",
                  fontSize: "30px",                  
                  marginTop: window?.screen?.width < 768 ? '100px' : window?.screen?.width >= 1024 && window?.screen?.width <= 1366 ? '-40px' : "222px",

                }}

              className="mb-4"
            >
              {texts.HereYourChance}
              {/* {translate("Here's your chance to VOTE, IMPACT & EARN! ")} */}
            </H2>
            </>
          ): <TextContainer
          className='mt-2 d-xl-none'
          style={{
            textTransform: "none",
            fontWeight: "400",
            maxWidth: "250px",
          }}
        >
     
          <H2
            style={{
              zIndex: 0,
              fontWeight: "400",
              position: "relative",
              marginTop: "130px",
            }}

            className="mb-4"
          >
            {texts.HereYourChance}
            {/* {translate("Here's your chance to VOTE, IMPACT & EARN! ")} */}
          </H2>
        </TextContainer>}
          <Pairs
            onFavClick={async (...args) => {
              if (user) {
                await calcFavorites(...args);
              } else {
                showModal(<NotLoggedInPopup />);
              }
            }}
          />
          {/* <Coins
            onFavClick={async (...args) => {
              if (user) {
                await calcFavorites(...args);
              } else {
                setLoginRedirectMessage("add coin to favorites");
                setLogin(true);
                // showModal(<NotLoggedInPopup/>);
              }
            }}
          /> */}



        </div>
        <div className='mb-4 mx-0'>
          <H2
            style={{
              zIndex: 1,
              fontWeight: "400",
              position: "relative",
              marginBottom: "20px",
            }}
          >
            {translate("")}
          </H2>
          {/* <Pairs
            onFavClick={async (...args) => {
              if (user) {
                await calcFavorites(...args);
              } else {
                showModal(<NotLoggedInPopup />);
              }
            }}
          /> */}
          <Coins
            onFavClick={async (...args) => {
              if (user) {
                await calcFavorites(...args);
              } else {
                setLoginRedirectMessage("add coin to favorites");
                setLogin(true);
                // showModal(<NotLoggedInPopup/>);
              }
            }}
          />
        </div>
        <div className='mb-5 mx-0'>
          <div className='mb-4'>
            {/* <H2 style={{ zIndex: 0, fontWeight: "400", position: "relative" }}>
              {texts.Influencers}
            </H2> */}
            {!user?.uid ? <div className='d-sx-none'> {window.screen.width > 979 && <><Buttons.Primary style={{ margin: 'auto', marginTop: '4rem', fontSize: '2rem', padding: '2rem' }} onClick={e => {
              setLogin(true)
              setSignup(true)
            }}>{texts.signUp}</Buttons.Primary>
              <H2 className='mt-3' style={{ margin: 'auto', textAlign: 'center', fontSize: '1.5rem' }}>
              {("Join now and start earning rewards before anyone else").toUpperCase()}
              </H2>

            </>}</div> : <></>}



            {!user?.uid ? <div className='d-xl-none'> {window.screen.width < 979 && <><Buttons.Primary style={{ margin: 'auto', marginTop: '2rem', fontSize: '1rem', padding: '1rem' }} onClick={e => {
              setLogin(true)
              setSignup(true)
            }}>{texts.signUp}</Buttons.Primary><H2 className='mt-3' style={{ margin: 'auto', textAlign: 'center', fontSize: '1rem' }}>{("Join now and start earning rewards before anyone else").toUpperCase()}</H2></>}</div> : <></>}

          </div>
          <InfluencersCarousel />
        </div>
        <div className='mb-5 mx-0'>
          <div className='mb-4'>
            <H2 style={{ zIndex: 1, fontWeight: "400", position: "relative" }}>
              {translate("")}
            </H2>
          </div>
          <div>
            <Quotes quotes={quotes} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
