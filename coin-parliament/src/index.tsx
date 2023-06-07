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
import { lessTimeVoteContext, LessTimeVoteProvider } from "Contexts/LessTimeVoteProvider";

// @ts-ignore
window.changeLanguage = (lang: string) => {
  const langDetector = document.getElementById("lang-detector");
  if (langDetector) {
    (langDetector as HTMLInputElement).value = lang;
    langDetector?.dispatchEvent(new CustomEvent("change"));
  }
};

ReactDOM.render(
  <BrowserRouter>
    <VoteProvider>
      <LessTimeVoteProvider>
        <CurrentCMPProvider>
          <App />
        </CurrentCMPProvider>
      </LessTimeVoteProvider>
    </VoteProvider>
  </BrowserRouter>
  , document.getElementById("app")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// registerServiceWorker();

const sw =
  process.env.NODE_ENV === "production"
    ? `${process.env.REACT_APP_SITE_URL}wp-content/plugins/coin-parliament/public/firebase-messaging-sw.js`
    : "../firebase-messaging-sw.js";

if ("serviceWorker" in navigator) {
  navigator?.serviceWorker
    .register(sw)
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}
