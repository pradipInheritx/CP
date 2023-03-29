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
  const { login, firstTimeLogin, setLogin, setLoginRedirectMessage } =
    useContext(AppContext);
  const { showModal } = useContext(NotificationContext);
  const { quotes } = useContext(ContentContext);
  const { width } = useWindowSize();
  const src = `/hpbanner${width && width > 979 ? "" : "_m"}.png`;

  
  return (
    <>
      <div className='p-0 w-100' style={{ background: "#160133" }}>
        <div style={{ background: "#160133" }}>
          
          <HomeContainer width={width} className='mb-4 p-0'>
            {!(login || firstTimeLogin) && (
              <>
                <Image
                  src={src}
                  style={{
                    width: width && width > 969 ? "auto" : "100%",
                    height:
                      width && width > 969
                        ? "auto"
                        : ((width || 0) * 392) / 408,
                    // marginTop: width && width > 969 ? -50 : -130,
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
                  <h2
                    style={{ zIndex: 0, position: "relative" }}
                    className='d-xl-none d-block'
                  >
                    <strong
                      className='text-uppercase'
                      style={{ fontSize: "24px", fontWeight: "700" }}
                    >
                      {translate("Vote to Earn")}
                    </strong>
                    {/* <TextContainer className="mt-2" style={{textTransform:'none',fontWeight:'400'}}>
                  <p>{translate("Make better investment decisions with the world’s first social indicator")}</p>
                </TextContainer> */}
                    {/* <span className="ms-xl-2">{translate("Crypto & NFT")}</span> */}
                  </h2>

                  {/* <TextContainer className="mt-2" >
                  <p>{translate("Make better investment decisions with the world’s first social voting indicator")}</p>
                </TextContainer> */}
                </div>
              </>
            )}
          </HomeContainer>
        </div>
        <div className='mb-4 mx-0'>
          <TextContainer
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
                marginTop: "200px",
              }}
            >
              {texts.HereYourChance}
              {/* {translate("Here's your chance to VOTE, IMPACT & EARN! ")} */}
            </H2>
          </TextContainer>
          {window.screen.width > 979 && (
            <H2
              style={{
                // zIndex: 1,
                fontWeight: "400",
                position: "relative",
                marginTop: "200px",
                fontSize: "30px",
              }}
            >
              {texts.HereYourChance}
              {/* {translate("Here's your chance to VOTE, IMPACT & EARN! ")} */}
            </H2>
          )}
          <Coins
            onFavClick={async (...args) => {
              if (user) {
                await calcFavorites(...args);
              } else {
                setLoginRedirectMessage("add coin to favorites.");
                setLogin(true);
                // showModal(<NotLoggedInPopup/>);
              }
            }}
          />
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
          <Pairs
            onFavClick={async (...args) => {
              if (user) {
                await calcFavorites(...args);
              } else {
                showModal(<NotLoggedInPopup />);
              }
            }}
          />
        </div>
        <div className='mb-5 mx-0'>
          <div className='mb-4'>
            <H2 style={{ zIndex: 0, fontWeight: "400", position: "relative" }}>
              {/* {translate("Influencers").toUpperCase()} */}
              {texts.Influencers}
            </H2>
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
