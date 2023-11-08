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
import axios from "axios";
import { LessTimeVoteDetailProvider } from "Contexts/LessTimeVoteDetails";


axios.defaults.baseURL = process.env.REACT_APP_API;
// @ts-ignore
window.changeLanguage = (lang: string) => {
  const langDetector = document.getElementById("lang-detector");
  if (langDetector) {
    (langDetector as HTMLInputElement).value = lang;
    langDetector?.dispatchEvent(new CustomEvent("change"));
  }
};
// const parameters = new URLSearchParams(window.location.search);
// const cardImageUrl = parameters.get('cardImageUrl');
ReactDOM.hydrate(
  <>
    <BrowserRouter>
      <LessTimeVoteDetailProvider>
        <VoteEndCoinPriceProvider>
          <VoteProvider>
            <CompletedVotesProvider>
              <CurrentCMPProvider>
                <App />
              </CurrentCMPProvider>
            </CompletedVotesProvider>
          </VoteProvider>
        </VoteEndCoinPriceProvider>
      </LessTimeVoteDetailProvider>
    </BrowserRouter>
  </>
  , document.getElementById("app")
);
//register service worker
register();
