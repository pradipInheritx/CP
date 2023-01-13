importScripts("https://www.gstatic.com/firebasejs/4.13.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/4.13.0/firebase-messaging.js"
);

const config = {
  messagingSenderId: "742294999580",
};

firebase.initializeApp(config);
console.log("sw initialized");

const messaging = firebase.messaging(); //firebase.getMessaging;

messaging.setBackgroundMessageHandler(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: JSON.stringify(payload.data),
    icon: "/firebase-logo.png",
  };

  /* eslint-disable-next-line no-restricted-globals */
  self.registration.showNotification(notificationTitle, notificationOptions);

  console.log("showed", notificationTitle, notificationOptions);
});
