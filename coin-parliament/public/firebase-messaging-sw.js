let CACHE_NAME = 'application';
const OFFLINE_URL = '/offline.html';
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll([OFFLINE_URL, '/homescreen.png', 'mobile_homeScreen.png']))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
            .catch(() => caches.match(OFFLINE_URL))
    );
});
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            // Iterate through all the cached storage
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    // Filter out old cache names
                    return cacheName !== CACHE_NAME;
                }).map((cacheName) => {
                    // Delete the caches that are not needed anymore
                    return caches.delete(cacheName);
                })
            );
        })
    );
});


// this.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             urls = [
//                 '/static/js/bundle.js',
//                 '/static/js/main.chunk.js',
//                 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.1/font/bootstrap-icons.css',
//                 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.rtl.min.css',
//                 'https://s3.tradingview.com/tv.js',
//                 'https://bridgeapp-dev.welldapp.com/widget/wldp-widget.js?application=votetoearn&init=true&autoconnect=false&visible=true',
//                 '/favicon.ico',
//                 '/manifest.json',
//                 'https://bridgeapp-dev.welldapp.com/assets/data/netwoks-rpc.json',
//                 '/static/js/vendors~main.chunk.js',
//                 'https://api.coingecko.com/api/v3/coins/ethereum',
//                 'https://bridgeapp-dev.welldapp.com/assets/data/networks-names.json',
//                 'https://bridgeapp-dev.welldapp.com/assets/data/tokens.json',
//                 '/firebase-messaging-sw.js',
//                 '/android-chrome-192x192.png',
//                 '/images/no_logo.png',
//                 '/index.html',
//                 '/',
//                 '/homescreem.png',
//                 OFFLINE_URL
//             ]
//             cache.addAll(urls);
//         }).catch(() => { })
//     )
// });

// this.addEventListener('fetch', (event) => {

//     // event.waitUntil(this.registration.showNotification('Hello', {
//     //     body: 'Body',
//     //     click_action: "http://localhost:3000"
//     // }))
//     if (!navigator.onLine) {
//         event.respondWith(
//             caches.match(event.request).then((res) => {
//                 if (res) {
//                     return res;
//                 }
//                 let requestUrl = event.request.clone();
//                 fetch(requestUrl);
//             }).catch(() => caches.match(OFFLINE_URL))
//         )
//     }
// });



importScripts("https://www.gstatic.com/firebasejs/4.13.0/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/4.13.0/firebase-messaging.js"
);
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js').then((res) => {
        console.log('FB ServiceWorker Registered');

    }).catch(() => {
        console.log('FB ServiceWorker Error');
    });
}
firebase.initializeApp({
    messagingSenderId: "950952702753",
});

const messaging = firebase.messaging();