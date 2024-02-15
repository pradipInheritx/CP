/** @format */

import React, { useContext } from "react";
import { Image } from "react-bootstrap";
import { useTranslation } from "../common/models/Dictionary";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import AppContext from "../Contexts/AppContext";
import { HomeContainer } from "../Components/App/App";
import Quotes from "../Components/Quotes";
import ContentContext from "../Contexts/ContentContext";
import { useWindowSize } from "../hooks/useWindowSize";
import { texts } from "../Components/LoginComponent/texts";
import { Buttons } from "../Components/Atoms/Button/Button";
import Pairs from "Components/Admin/Pairs";
import PairsCopy from "Components/Pairs/PairsCopy";
import NotLoggedInPopup from "Components/App/NotLoggedInPopup";
import { calcFavorites } from "common/utils/coins";
import UserContext from "Contexts/User";
import NotificationContext from "Contexts/Notification";


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
  const { login, firstTimeLogin, } = useContext(AppContext);
  const { quotes } = useContext(ContentContext);
  const { width } = useWindowSize();
  const src = `/hpbanner${width && width > 979 ? "" : ""}.png`;

  const { user } = useContext(UserContext);
  const { showModal } = useContext(NotificationContext);
  return (
    <>
      <div className='p-0 w-100' style={{ background: "#160133" }}>
        <div style={{ background: "#160133" }}>
          <HomeContainer fluid className='mb-4 p-0 w-100'>
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
                    marginTop: width && width > 969 ? "0" : "0px",
                    // marginTop:'120px',
                    position: "relative",
                  }}
                />

                <div
                  className='w-100 d-none'
                  style={{
                    marginTop: window.screen.width > 979 ? "150px" : "-48px",
                  }}
                >
                </div>
              </>
            )}
          </HomeContainer>
        </div>
        <div className='mb-4 mx-0 position-relative'>
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
                marginTop: "10px",
              }}

              className="mb-4"
            >
              {texts.HereYourChance}
            </H2>
          </TextContainer>
          {window.screen.width > 979 && (
            <>
              <H2
                style={{
                  // zIndex: 1,
                  fontWeight: "400",
                  position: "relative",
                  // marginTop: "200px",
                  fontSize: "30px",
                  marginTop: window?.screen?.width < 768 ? '100px' : "10px",
                }}

                className="mb-4"
              >
                {texts.HereYourChance}
                {/* {translate("Here's your chance to VOTE, IMPACT & EARN! ")} */}
              </H2>
            </>
          )}
          <div className="mt-5">
            <PairsCopy
              onFavClick={async (...args) => {
                if (user) {
                  await calcFavorites(...args);
                } else {
                  showModal(<NotLoggedInPopup />);
                }
              }}
            />
          </div>
        </div>
        {/* <div className='mb-5 mt-5  mx-0'>
          <div className='mb-4'>
            <H2 style={{ zIndex: 1, fontWeight: "400", position: "relative" }}>
              {translate("")}
            </H2>
          </div>
          <div>
            <Quotes quotes={quotes} />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Home;
