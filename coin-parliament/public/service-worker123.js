importScripts("https://www.gstatic.com/firebasejs/4.13.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/4.13.0/firebase-messaging.js"
);
// develop
let CACHE_NAME = 'coin-parliament';
let urlsToCache = [
  '/',
  '/completed'
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  let cacheWhitelist = ['your-app-name'];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

const config = {
  messagingSenderId: "742294999580",
};

firebase.initializeApp(config);
// console.log("sw initialized");

const messaging = firebase.messaging();

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
  // self.ServiceWorkerRegistration.showNotification(notificationTitle, notificationOptions);

  console.log("showed", notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Add the logic here to redirect the user to the home page of your app
  // const homePageUrl = '/';
  const homePageUrl = '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clients => {
      for (let client of clients) {
        if (client.url === homePageUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(homePageUrl);
      }
    })
  );
});
