const FRONTEND_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

const WIDGET_SCRIPT = `
(function() {
  if (window.top !== window.self) return;

  var s = document.currentScript || document.querySelector('script[data-user-id]');
  var userId = s ? s.getAttribute('data-user-id') : null;
  if (!userId) { console.error('VoiceAgent: data-user-id is required'); return; }

  var FRONTEND = '${FRONTEND_URL}';
  var BACKEND = '${BACKEND_URL}';
  var accent = '#7C5CFC';

  var FAB_SIZE = 56;
  var SIDE = 20;
  var CHAT_W = 370;
  var CHAT_H = 520;
  var GAP = 16;

  // Keyframes
  var styleSheet = document.createElement('style');
  styleSheet.textContent = '@keyframes va-pulse{0%{transform:scale(1);opacity:0.4}100%{transform:scale(1.8);opacity:0}}@keyframes va-fade-in{0%{opacity:0;transform:scale(0.5)}100%{opacity:1;transform:scale(1)}}';
  document.head.appendChild(styleSheet);

  // --- Chat container (hidden by default) ---
  var chat = document.createElement('div');
  chat.id = 'va-chat';
  chat.style.cssText = 'position:fixed;bottom:' + (SIDE + FAB_SIZE + GAP) + 'px;right:' + SIDE + 'px;width:' + CHAT_W + 'px;height:' + CHAT_H + 'px;border-radius:14px;overflow:hidden;box-shadow:0 8px 48px rgba(0,0,0,0.5);z-index:2147483647;display:none;border:1px solid rgba(255,255,255,0.08);background:#0B0B14;';

  var iframe = document.createElement('iframe');
  iframe.src = FRONTEND + '/widget?userId=' + userId;
  iframe.style.cssText = 'width:100%;height:100%;border:none;';
  iframe.allow = 'microphone';
  chat.appendChild(iframe);
  document.body.appendChild(chat);

  // --- FAB mic button ---
  var micSvg = '<svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>';
  var closeSvg = '<svg width="20" height="20" fill="white" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

  var fabWrap = document.createElement('div');
  fabWrap.id = 'va-fab-wrap';
  fabWrap.style.cssText = 'position:fixed;bottom:' + SIDE + 'px;right:' + SIDE + 'px;z-index:2147483648;animation:va-fade-in 0.4s ease-out;';

  var ring = document.createElement('div');
  ring.style.cssText = 'position:absolute;top:-6px;left:-6px;width:' + (FAB_SIZE + 12) + 'px;height:' + (FAB_SIZE + 12) + 'px;border-radius:50%;background:' + accent + ';opacity:0.3;animation:va-pulse 2.4s ease-out infinite;pointer-events:none;';

  var fabBtn = document.createElement('div');
  fabBtn.id = 'va-fab';
  fabBtn.setAttribute('role', 'button');
  fabBtn.setAttribute('aria-label', 'Open chat');
  fabBtn.style.cssText = 'position:relative;width:' + FAB_SIZE + 'px;height:' + FAB_SIZE + 'px;border-radius:50%;background:linear-gradient(135deg,' + accent + ',' + accent + 'CC);display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 24px ' + accent + '55;z-index:1;transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1);';
  fabBtn.innerHTML = micSvg;

  fabWrap.appendChild(ring);
  fabWrap.appendChild(fabBtn);
  document.body.appendChild(fabWrap);

  fabBtn.addEventListener('mouseenter', function() { fabBtn.style.transform = 'scale(1.1)'; });
  fabBtn.addEventListener('mouseleave', function() { fabBtn.style.transform = 'scale(1)'; });

  var chatOpen = false;

  function openChat() {
    chatOpen = true;
    chat.style.display = 'block';
    fabBtn.innerHTML = closeSvg;
    ring.style.animation = 'none';
    ring.style.opacity = '0';
  }

  function closeChat() {
    chatOpen = false;
    chat.style.display = 'none';
    fabBtn.innerHTML = micSvg;
    ring.style.animation = 'va-pulse 2.4s ease-out infinite';
    ring.style.opacity = '0.3';
  }

  fabBtn.addEventListener('click', function() {
    if (chatOpen) closeChat(); else openChat();
  });

  window.addEventListener('message', function(e) {
    if (e.data === 'va-close-chat') closeChat();
  });

  function applyLayout() {
    var isMobile = window.innerWidth < 480;
    var vh = window.innerHeight;

    if (isMobile) {
      chat.style.cssText = 'position:fixed;bottom:0;right:0;width:100vw;height:100vh;border-radius:0;overflow:hidden;box-shadow:none;z-index:2147483647;display:' + (chatOpen ? 'block' : 'none') + ';border:none;background:#0B0B14;';
    } else {
      var maxH = vh - SIDE - FAB_SIZE - GAP - 24;
      var h = Math.min(CHAT_H, Math.max(300, maxH));
      chat.style.cssText = 'position:fixed;bottom:' + (SIDE + FAB_SIZE + GAP) + 'px;right:' + SIDE + 'px;width:' + CHAT_W + 'px;height:' + h + 'px;border-radius:14px;overflow:hidden;box-shadow:0 8px 48px rgba(0,0,0,0.5);z-index:2147483647;display:' + (chatOpen ? 'block' : 'none') + ';border:1px solid rgba(255,255,255,0.08);background:#0B0B14;';
    }
  }
  applyLayout();
  window.addEventListener('resize', applyLayout);
})();
`;

export default WIDGET_SCRIPT;
