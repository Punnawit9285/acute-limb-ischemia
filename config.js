/* Public address of the deck. Every QR code is generated from this (see tools/build-qr.js). */
window.ALI_BASE = 'https://punnawit9285.github.io/acute-limb-ischemia/';

/* Shown on the cover. Left empty, the website shows nothing and the PDF prints blank lines to write on. */
window.ALI_PRESENTER = { name: '', id: '', group: '' };

/* Live sync and vote counts are OFF: GitHub Pages is static, so they need a realtime relay.
   Leave this empty and the deck runs with no network dependency at all.
   To switch on, list MQTT-over-WebSocket relay URLs, for example ['wss://your-relay:8084/mqtt'].
   With no relay, or if a relay is unreachable, phones stay in self-paced mode. */
window.ALI_LIVE = { relays: [], room: 'mdcu82-ali-case4' };
