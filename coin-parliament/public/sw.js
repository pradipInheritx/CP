self.addEventListener('notificationclick', (event) => {
    event.preventDefault();
    const DEFAULT_URL = '/'
    const url = event.notification?.data?.click_action || DEFAULT_URL;
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientsArray) => {
            const hadWindowToFocus = clientsArray.some((windowClient) =>
                windowClient.url === url ? (windowClient.focus(), true) : false
            );
            if (!hadWindowToFocus)
                clients.openWindow(url).then((windowClient) => (windowClient ? windowClient.focus() : null));
        })
    );
    event.notification.close();
});
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
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Cache and return requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
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
    messagingSenderId: "950952702753",
};
firebase.initializeApp(config);
// console.log("sw initialized");

const messaging = /* firebase.messaging.isSupported() ? */ firebase.messaging()/*  : null */;
// if (messaging) {
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message', payload.data);
    const notification = payload.data;
    const notificationTitle = notification.title;
    const notificationOptions = {
        body: notification.message,
        icon: notification.icon || "",
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});
// }


//show when app is on
// self.addEventListener('push', (event) => {
//   if (event.data) {
//     const pushData = event.data.json();

//     const notificationOptions = {
//       body: pushData.notification.body,
//       icon: payload.notification.icon,
//       // Customize other notification options as needed
//     };

//     event.waitUntil(
//       self.registration.showNotification(pushData.notification.title, notificationOptions)
//     );
//   }
// });