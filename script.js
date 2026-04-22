// ─── Constants ───────────────────────────────────────────────────────────────

const LOGO_URL = 'https://www.image2url.com/r2/default/images/1776781342340-eff4309f-5ae6-44db-bccb-8fb24ed120dc.png';
const COVER_BASE = 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main';
const HTML_BASE = 'https://cdn.jsdelivr.net/gh/freebuisness/html@main';
const GAMES_API = 'https://cdn.jsdelivr.net/gh/freebuisness/assets@main/zones.json';
const DISCORD_URL = 'https://discord.gg/FwdtmV7e';
const WIDGETBOT_SERVER = '1487435823283572898';
const WIDGETBOT_CHANNEL = '1487435824982397131';

const FEATURED_GAME_NAMES = ['10 Minutes Till Dawn', '1v1lol', 'Drive Mad', 'Subway Surfers', 'Slope', 'Cookie Clicker'];

const THEMES = {
  'red-black': { name: 'Red & Black', primary: '#DC2626', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#DC2626' },
  'blue-dark': { name: 'Blue & Dark', primary: '#2563EB', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#2563EB' },
  'purple-dark': { name: 'Purple & Dark', primary: '#9333EA', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#9333EA' },
  'green-dark': { name: 'Green & Dark', primary: '#16A34A', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#16A34A' },
  'orange-dark': { name: 'Orange & Dark', primary: '#EA580C', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#EA580C' },
  'pink-dark': { name: 'Pink & Dark', primary: '#EC4899', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#EC4899' },
  'cyan-dark': { name: 'Cyan & Dark', primary: '#06B6D4', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#06B6D4' },
  'yellow-dark': { name: 'Yellow & Dark', primary: '#EAB308', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#EAB308' },
};

const CLOAKS = [
  { name: 'i-Ready', title: 'i-Ready', favicon: 'https://login.i-ready.com/favicon.ico', color: '#0D6EFD' },
  { name: 'Clever', title: 'Clever | Portal', favicon: 'https://clever.com/favicon.ico', color: '#2E77D6' },
  { name: 'McGraw Hill', title: 'McGraw Hill', favicon: 'https://www.mheducation.com/favicon.ico', color: '#E31937' },
  { name: 'Google Docs', title: 'Google Docs', favicon: 'https://fonts.googleapis.com/favicon?folder=docs', color: '#4285F4' },
  { name: 'Google Drive', title: 'Google Drive', favicon: 'https://fonts.googleapis.com/favicon?folder=drive', color: '#0F9D58' },
];

const PARTICLE_TYPES = [
  { id: 'none', name: 'None', icon: '\u2715' },
  { id: 'bubbles', name: 'Bubbles', icon: '\u25C9' },
  { id: 'stars', name: 'Stars', icon: '\u2605' },
  { id: 'snow', name: 'Snow', icon: '\u25C9' },
  { id: 'matrix', name: 'Matrix', icon: '\u25C9' },
];

const TABS = [
  { id: 'home', label: 'Home', icon: '\u2302' },
  { id: 'games', label: 'Games', icon: '\uD83C\uDFAE' },
  { id: 'chat', label: 'Chat', icon: '\uD83D\uDCAC' },
  { id: 'media', label: 'Media', icon: '\uD83C\uDFAC' },
  { id: 'apps', label: 'Apps', icon: '\u25A6' },
  { id: 'partners', label: 'Partners', icon: '\uD83E\uDD1D' },
  { id: 'settings', label: 'Settings', icon: '\u2699' },
];

// ─── State ───────────────────────────────────────────────────────────────────

let activeTab = 'home';
let games = [];
let filteredGames = [];
let searchQuery = '';
let sortBy = 'name';
let selectedTags = [];
let availableTags = [];
let loading = true;
let activeGame = null;
let gameLoaded = false;
let currentTheme = 'red-black';
let particleType = 'none';
let activeCloak = null;
let panicKey = '`';
let sortDropdownOpen = false;
let tagDropdownOpen = false;
let animFrame = 0;

// ─── Init ────────────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  loadPreferences();
  renderTabs();
  renderContent();
  fetchGames();

  // Beta popup
  setTimeout(() => {
    document.getElementById('beta-overlay').classList.remove('hidden');
  }, 500);

  // Panic key
  document.addEventListener('keydown', (e) => {
    if (e.key === panicKey) window.location.href = 'https://www.google.com';
  });

  // Close dropdowns on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-wrap')) {
      sortDropdownOpen = false;
      tagDropdownOpen = false;
      renderContent();
    }
  });
});

function loadPreferences() {
  const st = localStorage.getItem('chinatown-theme');
  const sp = localStorage.getItem('chinatown-particle');
  const sc = localStorage.getItem('chinatown-cloak');
  const sk = localStorage.getItem('chinatown-panic-key');
  if (st && THEMES[st]) { currentTheme = st; applyTheme(st); }
  if (sp) particleType = sp;
  if (sc) { activeCloak = sc; applyCloak(sc); }
  if (sk) panicKey = sk;
  if (particleType !== 'none') startParticles(particleType);
}

// ─── Theme ───────────────────────────────────────────────────────────────────

function applyTheme(key) {
  const t = THEMES[key];
  if (!t) return;
  const r = document.documentElement.style;
  r.setProperty('--primary', t.primary);
  r.setProperty('--background', t.background);
  r.setProperty('--card', t.card);
  r.setProperty('--foreground', t.foreground);
  r.setProperty('--secondary', t.secondary);
  r.setProperty('--muted', t.muted);
  r.setProperty('--accent', t.accent);
  r.setProperty('--border', t.border);
  r.setProperty('--ring', t.ring);
}

function setTheme(key) {
  currentTheme = key;
  applyTheme(key);
  localStorage.setItem('chinatown-theme', key);
  renderContent();
}

// ─── Cloak ───────────────────────────────────────────────────────────────────

function applyCloak(name) {
  const c = CLOAKS.find(x => x.name === name);
  if (!c) return;
  document.title = c.title;
  document.querySelectorAll("link[rel*='icon']").forEach(l => l.remove());
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = c.favicon;
  document.head.appendChild(link);
}

function setCloak(name) {
  activeCloak = name;
  applyCloak(name);
  localStorage.setItem('chinatown-cloak', name);
  renderContent();
}

function removeCloak() {
  activeCloak = null;
  document.title = 'China Town - Gaming Portal';
  document.querySelectorAll("link[rel*='icon']").forEach(l => l.remove());
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = LOGO_URL;
  document.head.appendChild(link);
  localStorage.removeItem('chinatown-cloak');
  renderContent();
}

// ─── Particles ───────────────────────────────────────────────────────────────

function setParticleType(type) {
  particleType = type;
  localStorage.setItem('chinatown-particle', type);
  if (animFrame) cancelAnimationFrame(animFrame);
  const canvas = document.getElementById('particle-canvas');
  if (canvas) { const ctx = canvas.getContext('2d'); if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height); }
  if (type !== 'none') startParticles(type);
  renderContent();
}

function startParticles(type) {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const createP = () => {
    switch (type) {
      case 'bubbles': return { x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: Math.random()*20+5, speedY: Math.random()*1.5+0.5, speedX: (Math.random()-0.5)*0.5, opacity: Math.random()*0.5+0.2 };
      case 'stars': return { x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: Math.random()*3+1, twinkle: Math.random()*Math.PI*2, twinkleSpeed: Math.random()*0.05+0.01, opacity: Math.random()*0.8+0.2 };
      case 'snow': return { x: Math.random()*canvas.width, y: Math.random()*canvas.height, size: Math.random()*4+2, speedY: Math.random()*1.5+0.5, speedX: (Math.random()-0.5)*1, opacity: Math.random()*0.7+0.3, wobble: Math.random()*Math.PI*2, wobbleSpeed: Math.random()*0.03+0.01 };
      case 'matrix': return { x: Math.random()*canvas.width, y: -20, size: 14, speedY: Math.random()*4+2, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*', currentChar: '', changeRate: Math.random()*5+2, frameCount: 0, opacity: Math.random()*0.5+0.3 };
    }
  };

  const count = type === 'matrix' ? 60 : 50;
  for (let i = 0; i < count; i++) particles.push(createP());

  const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#DC2626';

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      switch (type) {
        case 'bubbles':
          p.y -= p.speedY; p.x += p.speedX;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
          ctx.strokeStyle = primary.replace(')', `,${p.opacity})`).replace('rgb', 'rgba');
          ctx.lineWidth = 1.5; ctx.stroke();
          ctx.fillStyle = primary.replace(')', `,${p.opacity*0.1})`).replace('rgb', 'rgba');
          ctx.fill();
          if (p.y + p.size < 0) particles[i] = createP();
          break;
        case 'stars':
          p.twinkle += p.twinkleSpeed;
          const alpha = p.opacity * ((Math.sin(p.twinkle)+1)/2);
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();
          break;
        case 'snow':
          p.wobble += p.wobbleSpeed; p.x += p.speedX + Math.sin(p.wobble)*0.5; p.y += p.speedY;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,255,255,${p.opacity})`; ctx.fill();
          if (p.y > canvas.height+10) particles[i] = createP();
          break;
        case 'matrix':
          p.y += p.speedY; p.frameCount++;
          if (p.frameCount % Math.floor(p.changeRate) === 0) p.currentChar = p.chars[Math.floor(Math.random()*p.chars.length)];
          ctx.font = `${p.size}px monospace`; ctx.fillStyle = `rgba(0,255,70,${p.opacity})`; ctx.fillText(p.currentChar, p.x, p.y);
          for (let t = 1; t < 5; t++) { const to = p.opacity*(1-t*0.2); if (to > 0) { ctx.fillStyle = `rgba(0,255,70,${to})`; ctx.fillText(p.chars[Math.floor(Math.random()*p.chars.length)], p.x, p.y - t*p.size); } }
          if (p.y > canvas.height+100) particles[i] = createP();
          break;
      }
    }
    animFrame = requestAnimationFrame(animate);
  }
  animate();
}

// ─── Fetch Games ─────────────────────────────────────────────────────────────

async function fetchGames() {
  try {
    const res = await fetch(GAMES_API);
    const data = await res.json();
    if (Array.isArray(data)) {
      games = data.map(g => ({
        ...g,
        cover: g.cover.replace('{COVER_URL}', COVER_BASE).replace('{HTML_URL}', HTML_BASE),
        url: g.url.replace('{COVER_URL}', COVER_BASE).replace('{HTML_URL}', HTML_BASE),
      }));
      filteredGames = [...games];
      const tagSet = new Set();
      games.forEach(g => { if (Array.isArray(g.special)) g.special.forEach(s => tagSet.add(s)); });
      availableTags = Array.from(tagSet).sort();
    }
  } catch (e) { console.error('Failed to fetch games', e); }
  loading = false;
  renderContent();
}

function filterAndSort() {
  let result = [...games];
  if (searchQuery.trim()) { const q = searchQuery.toLowerCase(); result = result.filter(g => g.name.toLowerCase().includes(q)); }
  if (selectedTags.length > 0) result = result.filter(g => selectedTags.some(tag => g.special?.includes(tag)));
  switch (sortBy) {
    case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'id': result.sort((a, b) => a.id.localeCompare(b.id)); break;
    case 'popular': result.sort((a, b) => (b.special?.length||0) - (a.special?.length||0)); break;
  }
  filteredGames = result;
}

// ─── Game Player ─────────────────────────────────────────────────────────────

function loadGame(game) {
  gameLoaded = false;
  activeGame = game;
  const overlay = document.getElementById('game-overlay');
  const iframe = document.getElementById('game-iframe');
  const title = document.getElementById('game-title');
  overlay.classList.remove('hidden');
  title.textContent = game.name;
  iframe.src = '';
  iframe.onload = () => {
    if (gameLoaded) return;
    gameLoaded = true;
    fetch(game.url).then(r => r.text()).then(html => { iframe.srcdoc = html; }).catch(() => { iframe.srcdoc = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;font-size:1.5rem;">Failed to load game</div>'; });
  };
}

function closeGame() {
  activeGame = null;
  gameLoaded = false;
  document.getElementById('game-overlay').classList.add('hidden');
  document.getElementById('game-iframe').src = '';
  document.getElementById('game-iframe').srcdoc = '';
}

function refreshGame() {
  if (!activeGame) return;
  gameLoaded = false;
  const iframe = document.getElementById('game-iframe');
  iframe.src = '';
  iframe.onload = () => {
    if (gameLoaded) return;
    gameLoaded = true;
    fetch(activeGame.url).then(r => r.text()).then(html => { iframe.srcdoc = html; }).catch(() => { iframe.srcdoc = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;">Failed</div>'; });
  };
}

function fullscreenGame() {
  const iframe = document.getElementById('game-iframe');
  if (iframe.requestFullscreen) iframe.requestFullscreen();
}

function openGameAboutBlank() {
  if (!activeGame) return;
  const win = window.open('about:blank', '_blank');
  if (win) {
    win.document.open();
    win.document.write(`<!DOCTYPE html><html><head><title>${activeGame.name} - China Town</title><link rel="icon" href="${LOGO_URL}"><style>*{margin:0;padding:0;box-sizing:border-box;}html,body{width:100%;height:100%;overflow:hidden;}iframe{position:fixed;top:0;left:0;width:100%;height:100%;border:none;}</style></head><body><iframe id="gameFrame"></iframe><script>fetch("${activeGame.url}").then(r=>r.text()).then(html=>{document.getElementById('gameFrame').srcdoc=html;}).catch(()=>{document.getElementById('gameFrame').srcdoc='<h1 style="color:white;text-align:center;margin-top:40vh;">Failed to load game</h1>';});<\/script></body></html>`);
    win.document.close();
  }
}

// ─── About:Blank ─────────────────────────────────────────────────────────────

function openAboutBlank() {
  const win = window.open('about:blank', '_blank');
  if (win) {
    const fav = document.querySelector("link[rel*='icon']")?.getAttribute('href') || LOGO_URL;
    win.document.open();
    win.document.write(`<!DOCTYPE html><html><head><title>${document.title}</title><link rel="icon" href="${fav}"><style>*{margin:0;padding:0;box-sizing:border-box;}html,body{width:100%;height:100%;overflow:hidden;}iframe{position:fixed;top:0;left:0;width:100%;height:100%;border:none;}</style></head><body><iframe src="${window.location.href}"></iframe></body></html>`);
    win.document.close();
  }
}

// ─── Dialogs ─────────────────────────────────────────────────────────────────

function showDialog(type) {
  const overlay = document.getElementById('dialog-overlay');
  const title = document.getElementById('dialog-title');
  const desc = document.getElementById('dialog-desc');
  overlay.classList.remove('hidden');
  if (type === 'dmca') { title.textContent = 'DMCA'; desc.textContent = 'If you own or developed a game on China Town and would like it removed, please join our Discord or email us.'; }
  else if (type === 'contact') { title.textContent = 'Contact'; desc.textContent = 'Discord: https://discord.gg/FwdtmV7e'; }
  else if (type === 'privacy') { title.textContent = 'Privacy Policy'; desc.textContent = 'We do not collect personal information. Game data is fetched from public CDNs. Settings are stored locally in your browser.'; }
}

function closeDialog() { document.getElementById('dialog-overlay').classList.add('hidden'); }
function closeBeta() { document.getElementById('beta-overlay').classList.add('hidden'); }

// ─── Panic Key ───────────────────────────────────────────────────────────────

function savePanicKey() {
  const input = document.getElementById('panic-input');
  if (input) { panicKey = input.value; localStorage.setItem('chinatown-panic-key', panicKey); }
  renderContent();
}

// ─── Data Reset ──────────────────────────────────────────────────────────────

function resetSettings() {
  localStorage.removeItem('chinatown-theme');
  localStorage.removeItem('chinatown-particle');
  localStorage.removeItem('chinatown-cloak');
  localStorage.removeItem('chinatown-panic-key');
  currentTheme = 'red-black'; applyTheme('red-black');
  particleType = 'none';
  removeCloak();
  panicKey = '`';
  renderContent();
}

function clearAllData() {
  Object.keys(localStorage).filter(k => k.startsWith('chinatown-')).forEach(k => localStorage.removeItem(k));
  window.location.reload();
}

// ─── Render Tabs ─────────────────────────────────────────────────────────────

function renderTabs() {
  const nav = document.getElementById('tabs');
  nav.innerHTML = TABS.map(t =>
    `<button class="tab-btn ${activeTab===t.id?'active':''}" onclick="switchTab('${t.id}')">${t.icon} <span class="tab-label">${t.label}</span></button>`
  ).join('');
}

function switchTab(id) {
  activeTab = id;
  renderTabs();
  renderContent();
  if (id === 'chat') initChat();
}

// ─── Chat ────────────────────────────────────────────────────────────────────

let chatInit = false;

function initChat() {
  if (chatInit) return;
  chatInit = true;
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/html-embed';
  script.async = true;
  document.body.appendChild(script);
  setTimeout(() => {
    const container = document.getElementById('chat-container');
    if (container) {
      container.innerHTML = '';
      const wb = document.createElement('widgetbot');
      wb.setAttribute('server', WIDGETBOT_SERVER);
      wb.setAttribute('channel', WIDGETBOT_CHANNEL);
      wb.setAttribute('width', '100%');
      wb.setAttribute('height', '600');
      container.appendChild(wb);
    }
  }, 500);
}

function refreshChat() {
  chatInit = false;
  initChat();
}

function fullscreenChat() {
  const el = document.getElementById('chat-container');
  if (el && el.requestFullscreen) el.requestFullscreen();
}

// ─── Render Content ──────────────────────────────────────────────────────────

function renderContent() {
  filterAndSort();
  const main = document.getElementById('main-content');

  switch (activeTab) {
    case 'home': main.innerHTML = renderHome(); break;
    case 'games': main.innerHTML = renderGames(); break;
    case 'chat': main.innerHTML = renderChat(); break;
    case 'media': main.innerHTML = renderMedia(); break;
    case 'apps': main.innerHTML = renderApps(); break;
    case 'partners': main.innerHTML = renderPartners(); break;
    case 'settings': main.innerHTML = renderSettings(); break;
  }
}

function renderHome() {
  const featured = games.filter(g => FEATURED_GAME_NAMES.some(fn => g.name.toLowerCase().includes(fn.toLowerCase())));
  let cards = '';
  if (loading) {
    cards = '<div class="loading-wrap"><div class="spinner"></div> Loading...</div>';
  } else {
    cards = `<div class="featured-grid">${featured.slice(0,6).map(g => gameCard(g)).join('')}</div>`;
  }

  return `
    <div class="home-tab">
      <div>
        <img src="${LOGO_URL}" alt="China Town" class="home-logo">
        <h1 class="home-title">Welcome to China Town</h1>
        <p class="home-subtitle">this is in beta lilbro dont expect it to be good</p>
      </div>
      <button class="btn btn-primary btn-lg" onclick="switchTab('games')">\uD83C\uDFAE Play Games</button>
      <div class="featured-section">
        <h2 class="featured-title">\u2728 Featured Games</h2>
        ${cards}
      </div>
    </div>`;
}

function renderGames() {
  let cards = '';
  if (loading) {
    cards = '<div class="loading-wrap"><div class="spinner"></div> Loading games...</div>';
  } else if (filteredGames.length === 0) {
    cards = '<div class="no-games"><p>\uD83C\uDFAE</p><p>No games found</p></div>';
  } else {
    cards = `<div class="game-grid">${filteredGames.map(g => gameCard(g, true)).join('')}</div>`;
  }

  let selectedTagsHtml = '';
  if (selectedTags.length > 0) {
    selectedTagsHtml = `<div class="selected-tags">
      ${selectedTags.map(t => `<span class="tag-badge" onclick="toggleTag('${t}')">${t} \u2715</span>`).join('')}
      <span class="tag-badge clear" onclick="selectedTags=[];renderContent()">Clear All</span>
    </div>`;
  }

  return `
    <div>
      <div class="games-toolbar">
        <div class="search-box">
          <span class="search-icon">\uD83D\uDD0D</span>
          <input type="text" placeholder="Search games..." value="${searchQuery}" oninput="searchQuery=this.value;filterAndSort();renderContent()">
        </div>
        <div class="dropdown-wrap">
          <button class="btn btn-outline btn-sm" onclick="sortDropdownOpen=!sortDropdownOpen;tagDropdownOpen=false;renderContent()">Sort: ${sortBy.charAt(0).toUpperCase()+sortBy.slice(1)} \u25BC</button>
          ${sortDropdownOpen ? `<div class="dropdown-menu">
            ${['name','id','popular'].map(s => `<button class="dropdown-item ${sortBy===s?'active':''}" onclick="sortBy='${s}';sortDropdownOpen=false;renderContent()">${s.charAt(0).toUpperCase()+s.slice(1)}</button>`).join('')}
          </div>` : ''}
        </div>
        <div class="dropdown-wrap">
          <button class="btn btn-outline btn-sm" onclick="tagDropdownOpen=!tagDropdownOpen;sortDropdownOpen=false;renderContent()">\u2728 Tags ${selectedTags.length>0?`(${selectedTags.length})`:''} \u25BC</button>
          ${tagDropdownOpen ? `<div class="dropdown-menu large">
            ${availableTags.length === 0 ? '<div class="dropdown-item">No tags</div>' : availableTags.map(t => `<button class="dropdown-item ${selectedTags.includes(t)?'active':''}" onclick="toggleTag('${t}')"><span class="tag-check ${selectedTags.includes(t)?'checked':''}"></span>${t}</button>`).join('')}
          </div>` : ''}
        </div>
      </div>
      ${selectedTagsHtml}
      ${cards}
    </div>`;
}

function renderChat() {
  return `
    <div>
      <div class="chat-controls">
        <button class="btn btn-outline btn-sm" onclick="fullscreenChat()">Fullscreen</button>
        <button class="btn btn-outline btn-sm" onclick="refreshChat()">Refresh</button>
      </div>
      <div id="chat-container" class="chat-container"></div>
    </div>`;
}

function renderMedia() {
  return `
    <div>
      <div class="chat-controls">
        <button class="btn btn-outline btn-sm" onclick="document.querySelector('.media-container').requestFullscreen()">Fullscreen</button>
        <button class="btn btn-outline btn-sm" onclick="const f=document.querySelector('.media-container iframe');const s=f.src;f.src='';setTimeout(()=>f.src=s,100)">Refresh</button>
      </div>
      <div class="media-container">
        <iframe src="https://mlbmovies.com/featured-movies/" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
      </div>
    </div>`;
}

function renderApps() {
  return `
    <div class="placeholder-box">
      <h2>\uD83D\uDD27 Apps Coming Soon!</h2>
      <p>this is in beta lilbro dont expect it to be good</p>
      <p>More apps are being worked on. Check back later!</p>
    </div>`;
}

function renderPartners() {
  return `
    <div class="partners-box">
      <h2 style="font-size:1.5rem;font-weight:700;">No partners yet!</h2>
      <p style="color:var(--muted-fg);">To become a partner, join the Discord:</p>
      <a href="${DISCORD_URL}" target="_blank" rel="noopener noreferrer">
        <button class="btn btn-primary">\uD83D\uDCAC Join Discord</button>
      </a>
    </div>`;
}

function renderSettings() {
  return `
    <div class="settings-wrap">
      <!-- Theme -->
      <div class="settings-section">
        <h2>\u2728 Theme Picker</h2>
        <div class="theme-grid">
          ${Object.entries(THEMES).map(([k, t]) => `
            <button class="theme-card ${currentTheme===k?'active':''}" onclick="setTheme('${k}')">
              <div class="theme-dot" style="background:${t.primary}"></div>
              <div class="theme-name">${t.name}</div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Particles -->
      <div class="settings-section">
        <h2>\u25C9 Background Particles</h2>
        <div class="particle-grid">
          ${PARTICLE_TYPES.map(p => `
            <button class="particle-card ${particleType===p.id?'active':''}" onclick="setParticleType('${p.id}')">
              <div>${p.icon}</div>
              <div class="p-name">${p.name}</div>
            </button>
          `).join('')}
        </div>
        <button class="btn btn-outline btn-sm" style="margin-top:0.75rem;" onclick="setParticleType('none')">\u2715 Remove Particles</button>
      </div>

      <!-- Cloak -->
      <div class="settings-section">
        <h2>\uD83D\uDEE1 Tab Cloak</h2>
        <p class="desc">Disguise your browser tab to look like another website. Click to apply the cloak.</p>
        <div class="cloak-grid">
          ${CLOAKS.map(c => `
            <button class="cloak-card ${activeCloak===c.name?'active':''}" onclick="setCloak('${c.name}')">
              <div class="cloak-icon" style="background:${c.color}22">
                <img src="${c.favicon}" alt="${c.name}" onerror="this.style.display='none'">
              </div>
              <div class="cloak-name">${c.name}</div>
              ${activeCloak===c.name?'<div class="cloak-active">Active</div>':''}
            </button>
          `).join('')}
        </div>
        ${activeCloak ? `
          <div class="cloak-status">
            <span class="tag-badge">Active: ${activeCloak}</span>
            <button class="btn btn-outline btn-sm btn-danger" onclick="removeCloak()">\u2715 Remove Cloak</button>
          </div>
        ` : ''}
      </div>

      <!-- Panic Key -->
      <div class="settings-section">
        <h2>\u2328 Panic Key</h2>
        <p class="desc">Set a key that instantly redirects to Google when pressed.</p>
        <div class="panic-row">
          <input type="text" id="panic-input" value="${panicKey}" maxlength="1">
          <button class="btn btn-primary" onclick="savePanicKey()">Save</button>
          <span class="panic-current">Current: <b>${panicKey===' '?'\u2423':panicKey}</b></span>
        </div>
      </div>

      <!-- About:blank -->
      <div class="settings-section">
        <h2>\u2197 Open in about:blank</h2>
        <p class="desc">Open this site in a new about:blank window to hide it from your history.</p>
        <button class="btn btn-primary" onclick="openAboutBlank()">\u2197 Open in about:blank</button>
      </div>

      <!-- Reset -->
      <div class="settings-section">
        <h2>\uD83D\uDDD1 Data & Reset</h2>
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          <button class="btn btn-outline" style="width:100%;" onclick="resetSettings()">\u21BB Reset All Settings</button>
          <button class="btn btn-outline btn-danger" style="width:100%;" onclick="clearAllData()">\uD83D\uDDD1 Clear All China Town Data</button>
        </div>
      </div>
    </div>`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function gameCard(game, showTags) {
  const tags = showTags && game.special?.length > 0
    ? `<div>${game.special.slice(0,2).map(t => `<span class="tag">${t}</span>`).join('')}</div>` : '';
  return `
    <div class="game-card" onclick='loadGame(${JSON.stringify(game).replace(/'/g, "&#39;")})'>
      <img src="${game.cover}" alt="${game.name}" loading="lazy">
      <div class="overlay"></div>
      <div class="card-info">
        <p>${game.name}</p>
        ${tags}
      </div>
    </div>`;
}

function toggleTag(tag) {
  if (selectedTags.includes(tag)) {
    selectedTags = selectedTags.filter(t => t !== tag);
  } else {
    selectedTags.push(tag);
  }
  tagDropdownOpen = false;
  renderContent();
}
