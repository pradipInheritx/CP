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
// console.log("sw initialized");

const messaging = firebase.messaging();
self.addEventListener('push', (event) => {
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (clientList) {
                const isForeground = clientList.some(function (client) {
                    return client.visibilityState === 'visible';
                });
                if (isForeground && false) {
                    // Handle foreground push notification event
                    const data = event.data.json();
                    const title = data.notification.title;
                    const options = {
                        body: data.notification.body,
                        icon: data.notification.icon,
                        click_action: data.notification.click_action
                    };
                    return self.registration.showNotification(title, options);
                }

            })
    );

});

// if (messaging) {
// messaging.setBackgroundMessageHandler(function (payload) {
//     console.log('[firebase-messaging-sw.js] Received background message', payload.data);
//     const notification = payload.data;
//     const notificationTitle = notification.title;
//     const notificationOptions = {
//         body: 'notification.message',
//         icon: notification.icon || "",
//     };
//     return self.registration.showNotification(notificationTitle, notificationOptions);
// });
// }
