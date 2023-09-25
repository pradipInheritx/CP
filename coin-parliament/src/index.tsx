import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.min.css";
import "./index.css";
import { VoteProvider } from "Contexts/VoteProvider";
import { CurrentCMPProvider } from "Contexts/CurrentCMP";
import { CompletedVotesProvider } from "Contexts/CompletedVotesProvider";
import { register } from "serviceWorkerRegistration";
import { VoteEndCoinPriceProvider } from "Contexts/VoteEndCoinPrice";
import { Helmet, HelmetProvider } from 'react-helmet-async';
// @ts-ignore
window.changeLanguage = (lang: string) => {
  const langDetector = document.getElementById("lang-detector");
  if (langDetector) {
    (langDetector as HTMLInputElement).value = lang;
    langDetector?.dispatchEvent(new CustomEvent("change"));
  }
};
const parameters = new URLSearchParams(window.location.search);
const cardImageUrl = parameters.get('cardImageUrl');
ReactDOM.hydrate(
  <HelmetProvider>
    <Helmet prioritizeSeoTags>
      {cardImageUrl && <>
        <meta property="og:image" content={cardImageUrl} />
        <meta property="twitter:image" content={cardImageUrl} />
      </>}

    </Helmet>
    <BrowserRouter>
      <VoteEndCoinPriceProvider>
        <VoteProvider>
          <CompletedVotesProvider>
            <CurrentCMPProvider>
              <App />
            </CurrentCMPProvider>
          </CompletedVotesProvider>
        </VoteProvider>
      </VoteEndCoinPriceProvider>
    </BrowserRouter>
  </HelmetProvider>
  , document.getElementById("app")
);
//register service worker
register();
