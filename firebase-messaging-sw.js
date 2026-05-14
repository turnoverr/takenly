// Takenly — Firebase Cloud Messaging Service Worker
// Handles background push notifications when the app is not open
// Must live at the root of the domain (/firebase-messaging-sw.js)

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDSJD7TijcYck7OFaxcgxpFTTthOh08AoI",
  authDomain: "takenly-182.firebaseapp.com",
  projectId: "takenly-182",
  storageBucket: "takenly-182.firebasestorage.app",
  messagingSenderId: "692426494459",
  appId: "1:692426494459:web:2e3b19884ce2ca74df3b5e"
});

const messaging = firebase.messaging();

// Handle background messages — show as system notification
messaging.onBackgroundMessage(payload => {
  const title = payload.notification ? payload.notification.title : 'Takenly';
  const body  = payload.notification ? payload.notification.body  : 'Time to take your medication';

  self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'takenly-dose',           // replaces previous notification rather than stacking
    renotify: true,
    data: { url: 'https://takenly.app' }
  });
});

// Tap on notification → open or focus the app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || 'https://takenly.app';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for(const client of clientList) {
        if(client.url === url && 'focus' in client) return client.focus();
      }
      if(clients.openWindow) return clients.openWindow(url);
    })
  );
});
