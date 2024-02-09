import firebase from "firebase/compat/app";

const messaging = firebase.messaging();
messaging.onMessage((payload) => {
  console.log("Message received. ", payload);
});

const setTokenSentToServer = (sent: boolean) => {
  window.localStorage.setItem("sentToServer", sent ? "1" : "0");
};

const isTokenSentToServer = () =>
  window.localStorage.getItem("sentToServer") === "1";

const sendTokenToServer = (currentToken: string) => {
  if (!isTokenSentToServer()) {
    // TODO(developer): Send the current token to your server.
    sendTokenToServer(currentToken);
    setTokenSentToServer(true);
  }
};

const initToken = async () => {
  try {
    return await messaging.getToken({
      vapidKey: process.env.REACT_APP_FIREBASE_MESSAGING_VAPID_KEY,
    });
  } catch (e) {
    console.log("An error occurred while retrieving token. ", e);
    return undefined;
  }
};

initToken().then(
  (currentToken) => currentToken && sendTokenToServer(currentToken)
);
