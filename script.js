// ─── Constants ───────────────────────────────────────────────────────────────

const LOGO_URL = 'https://www.image2url.com/r2/default/images/1776781342340-eff4309f-5ae6-44db-bccb-8fb24ed120dc.png';
const COVER_BASE = 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main';
const HTML_BASE = 'https://cdn.jsdelivr.net/gh/freebuisness/html@main';
const GAMES_API = 'https://cdn.jsdelivr.net/gh/freebuisness/assets@main/zones.json';
const DISCORD_URL = 'https://discord.gg/FwdtmV7e';
const WIDGETBOT_SERVER = '1487435823283572898';
const WIDGETBOT_CHANNEL = '1487435824982397131';

const FEATURED_GAME_NAMES = ['10 Minutes Till Dawn', '1v1lol', 'Drive Mad', 'Subway Surfers', 'Slope', 'Cookie Clicker'];

// Only cloaks with reliable favicons that actually show an icon
const CLOAKS = [
  { name: 'Clever', title: 'Clever | Portal', favicon: 'https://clever.com/favicon.ico', color: '#2E77D6' },
  { name: 'Google', title: 'Google', favicon: 'https://www.google.com/favicon.ico', color: '#4285F4' },
  { name: 'Google Drive', title: 'Google Drive', favicon: 'https://drive.google.com/favicon.ico', color: '#0F9D58' },
  { name: 'YouTube', title: 'YouTube', favicon: 'https://www.youtube.com/favicon.ico', color: '#FF0000' },
  { name: 'Wikipedia', title: 'Wikipedia', favicon: 'https://en.wikipedia.org/favicon.ico', color: '#636466' },
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
let activeCloak = null;
let panicKey = '`';
let sortDropdownOpen = false;
let tagDropdownOpen = false;
let weatherData = null;

// ─── Clock & Weather ─────────────────────────────────────────────────────────

function updateClock() {
  const el = document.getElementById('clock-time');
  const dateEl = document.getElementById('clock-date');
  if (!el) return;
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  el.textContent = `${h}:${m}:${s}`;
  if (dateEl) {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    dateEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  }
}

async function fetchWeather() {
  try {
    const res = await fetch('https://wttr.in/?format=j1');
    const data = await res.json();
    if (data.current_condition && data.current_condition[0]) {
      const c = data.current_condition[0];
      const temp = c.temp_F;
      const desc = c.weatherDesc && c.weatherDesc[0] ? c.weatherDesc[0].value : '';
      const el = document.getElementById('weather-text');
      if (el) {
        el.textContent = `${temp}F - ${desc}`;
      }
      weatherData = { temp, desc };
    }
  } catch (e) {
    const el = document.getElementById('weather-text');
    if (el) el.textContent = 'N/A';
  }
}

function getWeatherIcon() {
  if (!weatherData) return 'fa-cloud';
  const d = weatherData.desc.toLowerCase();
  if (d.includes('sun') || d.includes('clear')) return 'fa-sun';
  if (d.includes('rain') || d.includes('shower')) return 'fa-cloud-rain';
  if (d.includes('snow') || d.includes('blizzard')) return 'fa-snowflake';
  if (d.includes('thunder') || d.includes('storm')) return 'fa-cloud-bolt';
  if (d.includes('cloud') || d.includes('overcast')) return 'fa-cloud';
  if (d.includes('fog') || d.includes('mist')) return 'fa-smog';
  return 'fa-cloud';
}

// ─── Init ────────────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  loadPreferences();
  renderTabs();
  renderContent();
  fetchGames();
  updateClock();
  setInterval(updateClock, 1000);
  fetchWeather();

  setTimeout(() => {
    const beta = document.getElementById('beta-overlay');
    if (beta) beta.classList.remove('hidden');
  }, 600);

  document.addEventListener('keydown', (e) => {
    if (e.key === panicKey) window.location.href = 'https://www.google.com';
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-wrap')) {
      sortDropdownOpen = false;
      tagDropdownOpen = false;
      renderContent();
    }
  });
});

function loadPreferences() {
  const sc = localStorage.getItem('chinatown-cloak');
  const sk = localStorage.getItem('chinatown-panic-key');
  localStorage.removeItem('chinatown-theme');
  localStorage.removeItem('chinatown-particle');
  if (sc) { activeCloak = sc; applyCloak(sc); }
  if (sk) panicKey = sk;
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
  document.title = 'chinatown.w';
  document.querySelectorAll("link[rel*='icon']").forEach(l => l.remove());
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = LOGO_URL;
  document.head.appendChild(link);
  localStorage.removeItem('chinatown-cloak');
  renderContent();
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
  if (type === 'dmca') { title.innerHTML = 'DMCA'; desc.textContent = 'If you own or developed a game on China Town and would like it removed, please join our Discord or email us.'; }
  else if (type === 'contact') { title.innerHTML = 'Contact'; desc.textContent = 'Discord: https://discord.gg/FwdtmV7e'; }
  else if (type === 'privacy') { title.innerHTML = 'Privacy Policy'; desc.textContent = 'We do not collect personal information. Game data is fetched from public CDNs. Settings are stored locally in your browser.'; }
}

function closeDialog() { document.getElementById('dialog-overlay').classList.add('hidden'); }
function closeBeta() { document.getElementById('beta-overlay').classList.add('hidden'); }

// ─── Panic Key ───────────────────────────────────────────────────────────────

function savePanicKey() {
  const input = document.getElementById('panic-input');
  if (input) { panicKey = input.value; localStorage.setItem('chinatown-panic-key', panicKey); }
  renderContent();
}

// ─── Reset ───────────────────────────────────────────────────────────────────

function resetSettings() {
  localStorage.removeItem('chinatown-cloak');
  localStorage.removeItem('chinatown-panic-key');
  removeCloak();
  panicKey = '`';
  renderContent();
}

function clearAllData() {
  Object.keys(localStorage).filter(k => k.startsWith('chinatown-')).forEach(k => localStorage.removeItem(k));
  window.location.reload();
}

// ─── Tabs ────────────────────────────────────────────────────────────────────

function renderTabs() {
  document.querySelectorAll('.nav-icon').forEach(btn => {
    const tab = btn.getAttribute('onclick').match(/'([^']+)'/)?.[1];
    btn.classList.toggle('active', tab === activeTab);
  });
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
      wb.setAttribute('height', '560');
      container.appendChild(wb);
    }
  }, 500);
}

function refreshChat() { chatInit = false; initChat(); }

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
        <h1 class="home-title">chinatown.w</h1>
        <p class="home-subtitle">this is in beta lilbro dont expect it to be good</p>
      </div>
      <button class="btn btn-primary btn-lg" onclick="switchTab('games')"><i class="fa-solid fa-gamepad"></i> Play Games</button>
      <div class="featured-section">
        <h2 class="featured-title">Featured</h2>
        ${cards}
      </div>
    </div>`;
}

function renderGames() {
  let cards = '';
  if (loading) {
    cards = '<div class="loading-wrap"><div class="spinner"></div> Loading games...</div>';
  } else if (filteredGames.length === 0) {
    cards = '<div class="no-games"><p>No games found</p></div>';
  } else {
    cards = `<div class="game-grid">${filteredGames.map(g => gameCard(g, true)).join('')}</div>`;
  }

  let selectedTagsHtml = '';
  if (selectedTags.length > 0) {
    selectedTagsHtml = `<div class="selected-tags">
      ${selectedTags.map(t => `<span class="tag-badge" onclick="toggleTag('${t}')">${t} <i class="fa-solid fa-xmark" style="font-size:0.55rem;"></i></span>`).join('')}
      <span class="tag-badge clear" onclick="selectedTags=[];renderContent()">Clear</span>
    </div>`;
  }

  return `
    <div>
      <div class="clock-bar">
        <div>
          <div class="clock-time" id="clock-time">--:--:--</div>
          <div class="clock-date" id="clock-date"></div>
        </div>
        <div class="clock-weather">
          <i class="fa-solid ${getWeatherIcon()}"></i>
          <span id="weather-text">Loading...</span>
        </div>
      </div>
      <div class="games-toolbar">
        <div class="search-box">
          <span class="search-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
          <input type="text" placeholder="Search games..." value="${searchQuery}" oninput="searchQuery=this.value;filterAndSort();renderContent()">
        </div>
        <div class="dropdown-wrap">
          <button class="btn btn-outline btn-sm" onclick="sortDropdownOpen=!sortDropdownOpen;tagDropdownOpen=false;renderContent()"><i class="fa-solid fa-arrow-down-wide-short"></i> ${sortBy.charAt(0).toUpperCase()+sortBy.slice(1)}</button>
          ${sortDropdownOpen ? `<div class="dropdown-menu">
            ${['name','id','popular'].map(s => `<button class="dropdown-item ${sortBy===s?'active':''}" onclick="sortBy='${s}';sortDropdownOpen=false;renderContent()">${s.charAt(0).toUpperCase()+s.slice(1)}</button>`).join('')}
          </div>` : ''}
        </div>
        <div class="dropdown-wrap">
          <button class="btn btn-outline btn-sm" onclick="tagDropdownOpen=!tagDropdownOpen;sortDropdownOpen=false;renderContent()"><i class="fa-solid fa-tags"></i> Tags${selectedTags.length>0?` (${selectedTags.length})`:''}</button>
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
        <button class="btn btn-outline btn-sm" onclick="fullscreenChat()"><i class="fa-solid fa-expand"></i> Fullscreen</button>
        <button class="btn btn-outline btn-sm" onclick="refreshChat()"><i class="fa-solid fa-rotate-right"></i> Refresh</button>
      </div>
      <div id="chat-container" class="chat-container"></div>
    </div>`;
}

function renderMedia() {
  return `
    <div>
      <div class="chat-controls">
        <button class="btn btn-outline btn-sm" onclick="document.querySelector('.media-container').requestFullscreen()"><i class="fa-solid fa-expand"></i> Fullscreen</button>
        <button class="btn btn-outline btn-sm" onclick="const f=document.querySelector('.media-container iframe');const s=f.src;f.src='';setTimeout(()=>f.src=s,100)"><i class="fa-solid fa-rotate-right"></i> Refresh</button>
      </div>
      <div class="media-container">
        <iframe src="https://mlbmovies.com/featured-movies/" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
      </div>
    </div>`;
}

function renderPartners() {
  return `
    <div class="partners-box">
      <h2>No partners yet!</h2>
      <p>To become a partner, join the Discord:</p>
      <a href="${DISCORD_URL}" target="_blank" rel="noopener noreferrer">
        <button class="btn btn-primary"><i class="fa-solid fa-comment"></i> Join Discord</button>
      </a>
    </div>`;
}

function renderSettings() {
  const totalGames = games.length;
  const totalTags = availableTags.length;

  return `
    <div class="settings-wrap">
      <!-- Site Stats -->
      <div class="settings-section">
        <h2><i class="fa-solid fa-chart-simple s-icon"></i> Site Stats</h2>
        <div class="site-info-grid">
          <div class="site-info-card">
            <div class="info-val">${totalGames}</div>
            <div class="info-label">Games</div>
          </div>
          <div class="site-info-card">
            <div class="info-val">${totalTags}</div>
            <div class="info-label">Tags</div>
          </div>
          <div class="site-info-card">
            <div class="info-val">Beta</div>
            <div class="info-label">Status</div>
          </div>
          <div class="site-info-card">
            <div class="info-val">v2.0</div>
            <div class="info-label">Version</div>
          </div>
        </div>
      </div>

      <!-- Cloak -->
      <div class="settings-section">
        <h2><i class="fa-solid fa-shield-halved s-icon"></i> Tab Cloak</h2>
        <p class="desc">Disguise your browser tab to look like another website.</p>
        <div class="cloak-grid">
          ${CLOAKS.map(c => `
            <button class="cloak-card ${activeCloak===c.name?'active':''}" onclick="setCloak('${c.name}')">
              <div class="cloak-icon">
                <img src="${c.favicon}" alt="${c.name}" onerror="this.parentElement.innerHTML='<i class=\\'fa-solid fa-globe\\' style=\\'color:var(--text-dim);font-size:14px\\'></i>'">
              </div>
              <div class="cloak-name">${c.name}</div>
              ${activeCloak===c.name?'<div class="cloak-active">Active</div>':''}
            </button>
          `).join('')}
        </div>
        ${activeCloak ? `
          <div class="cloak-status">
            <span class="tag-badge">Active: ${activeCloak}</span>
            <button class="btn btn-outline btn-sm btn-danger" onclick="removeCloak()"><i class="fa-solid fa-xmark"></i> Remove</button>
          </div>
        ` : ''}
      </div>

      <!-- Panic Key -->
      <div class="settings-section">
        <h2><i class="fa-solid fa-keyboard s-icon"></i> Panic Key</h2>
        <p class="desc">Press this key to instantly redirect to Google.</p>
        <div class="panic-row">
          <input type="text" id="panic-input" value="${panicKey}" maxlength="1">
          <button class="btn btn-primary" onclick="savePanicKey()"><i class="fa-solid fa-floppy-disk"></i> Save</button>
          <span class="panic-current">Current: <b>${panicKey===' '?'Space':panicKey}</b></span>
        </div>
      </div>

      <!-- About:blank -->
      <div class="settings-section">
        <h2><i class="fa-solid fa-up-right-from-square s-icon"></i> about:blank</h2>
        <p class="desc">Open this site in a new about:blank window to hide it from your history.</p>
        <button class="btn btn-primary" onclick="openAboutBlank()"><i class="fa-solid fa-up-right-from-square"></i> Open in about:blank</button>
      </div>

      <!-- Keyboard Shortcuts Info -->
      <div class="settings-section">
        <h2><i class="fa-solid fa-lightbulb s-icon"></i> Quick Tips</h2>
        <p class="desc" style="margin-bottom:0;line-height:1.8;">
          Press your panic key (<b style="color:var(--red)">${panicKey===' '?'Space':panicKey}</b>) to instantly escape to Google.<br>
          Click the logo in the sidebar to go back home.<br>
          Hover over game cards to preview them.<br>
          Use the search bar to find games fast.<br>
          Open games in about:blank to hide them from tab history.
        </p>
      </div>

      <!-- Reset -->
      <div class="settings-section">
        <h2><i class="fa-solid fa-trash-can s-icon"></i> Data & Reset</h2>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <button class="btn btn-outline" style="width:100%;" onclick="resetSettings()"><i class="fa-solid fa-rotate-right"></i> Reset All Settings</button>
          <button class="btn btn-outline btn-danger" style="width:100%;" onclick="clearAllData()"><i class="fa-solid fa-trash-can"></i> Clear All China Town Data</button>
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

      
