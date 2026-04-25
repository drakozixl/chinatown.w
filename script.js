// ─── Constants ───────────────────────────────────────────────────────────────

const LOGO_URL = 'https://www.image2url.com/r2/default/images/1776781342340-eff4309f-5ae6-44db-bccb-8fb24ed120dc.png';
const COVER_BASE = 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main';
const HTML_BASE = 'https://cdn.jsdelivr.net/gh/freebuisness/html@main';
const GAMES_API = 'https://cdn.jsdelivr.net/gh/freebuisness/assets@main/zones.json';
const DISCORD_URL = 'https://discord.gg/FwdtmV7e';
const WIDGETBOT_SERVER = '1487435823283572898';
const WIDGETBOT_CHANNEL = '1487435824982397131';

const FEATURED_GAME_NAMES = ['10 Minutes Till Dawn', '1v1lol', 'Drive Mad', 'Subway Surfers', 'Slope', 'Cookie Clicker'];

const CLOAKS = [
  { name: 'i-Ready', title: 'i-Ready', favicon: 'https://login.i-ready.com/favicon.ico', color: '#0D6EFD' },
  { name: 'Clever', title: 'Clever | Portal', favicon: 'https://clever.com/favicon.ico', color: '#2E77D6' },
  { name: 'McGraw Hill', title: 'McGraw Hill', favicon: 'https://www.mheducation.com/favicon.ico', color: '#E31937' },
  { name: 'Google Docs', title: 'Google Docs', favicon: 'https://fonts.googleapis.com/favicon?folder=docs', color: '#4285F4' },
  { name: 'Google Drive', title: 'Google Drive', favicon: 'https://fonts.googleapis.com/favicon?folder=drive', color: '#0F9D58' },
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

// ─── Grey Particles Canvas ───────────────────────────────────────────────────

function initGreyParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  // Grey shades
  const greyShades = [
    'rgba(180,180,180,', // light grey
    'rgba(140,140,140,', // medium grey
    'rgba(100,100,100,', // darker grey
    'rgba(200,200,200,', // very light grey
    'rgba(120,120,120,', // medium-dark grey
    'rgba(160,160,160,', // soft grey
    'rgba(80,80,80,',    // dark grey
    'rgba(220,220,220,', // pale grey
  ];

  const particles = [];
  const PARTICLE_COUNT = 60;

  function createParticle(randomY) {
    const shade = greyShades[Math.floor(Math.random() * greyShades.length)];
    const size = Math.random() * 3 + 0.5;
    const speed = Math.random() * 0.4 + 0.1;
    const direction = Math.random() * Math.PI * 2;
    return {
      x: Math.random() * canvas.width,
      y: randomY ? Math.random() * canvas.height : canvas.height + Math.random() * 50,
      size: size,
      baseSize: size,
      speedX: Math.cos(direction) * speed,
      speedY: Math.sin(direction) * speed - 0.15, // slight upward drift
      shade: shade,
      maxOpacity: Math.random() * 0.35 + 0.05,
      opacity: 0,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.008 + 0.003,
      wobbleAmp: Math.random() * 0.8 + 0.2,
      wobbleSpeed: Math.random() * 0.02 + 0.005,
      life: 0,
      maxLife: Math.random() * 800 + 400,
      // Some particles drift slowly, some faster
      drift: (Math.random() - 0.5) * 0.3,
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = createParticle(true);
    p.life = Math.random() * p.maxLife * 0.5;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Update position
      p.x += p.speedX + Math.sin(p.phase) * p.wobbleAmp * 0.3 + p.drift;
      p.y += p.speedY;
      p.phase += p.phaseSpeed;
      p.life++;

      // Smooth fade in/out
      const lifeRatio = p.life / p.maxLife;
      if (lifeRatio < 0.15) {
        p.opacity = p.maxOpacity * (lifeRatio / 0.15);
      } else if (lifeRatio > 0.7) {
        p.opacity = p.maxOpacity * (1 - (lifeRatio - 0.7) / 0.3);
      } else {
        p.opacity = p.maxOpacity;
      }

      // Gentle size pulse
      const sizePulse = 1 + Math.sin(p.phase * 1.5) * 0.15;
      const currentSize = p.baseSize * sizePulse;

      // Reset if off-screen or life over
      if (p.life >= p.maxLife || p.y < -50 || p.x < -50 || p.x > canvas.width + 50) {
        particles[i] = createParticle(false);
        particles[i].y = canvas.height + Math.random() * 30;
        continue;
      }

      // Draw soft circle with glow
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 4);
      gradient.addColorStop(0, p.shade + p.opacity + ')');
      gradient.addColorStop(0.3, p.shade + (p.opacity * 0.5) + ')');
      gradient.addColorStop(1, p.shade + '0)');

      ctx.beginPath();
      ctx.arc(p.x, p.y, currentSize * 4, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core bright dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
      ctx.fillStyle = p.shade + (p.opacity * 1.2) + ')';
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// ─── Init ────────────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  loadPreferences();
  renderTabs();
  renderContent();
  fetchGames();
  initGreyParticles();

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
  // Remove old theme/particle keys
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

// ─── Data Reset ──────────────────────────────────────────────────────────────

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

// ─── Render Tabs (Sidebar) ──────────────────────────────────────────────────

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
      wb.setAttribute('height', '600');
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
        <div class="home-logo-frame">
          <img src="${LOGO_URL}" alt="China Town">
        </div>
        <h1 class="home-title">Welcome to China Town</h1>
        <p class="home-subtitle">this is in beta lilbro dont expect it to be good</p>
      </div>
      <button class="btn btn-primary btn-lg" onclick="switchTab('games')"><i class="fa-solid fa-gamepad"></i> Play Games</button>
      <div class="featured-section">
        <h2 class="featured-title">Featured Games</h2>
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
      ${selectedTags.map(t => `<span class="tag-badge" onclick="toggleTag('${t}')">${t} <i class="fa-solid fa-xmark" style="font-size:0.6rem;"></i></span>`).join('')}
      <span class="tag-badge clear" onclick="selectedTags=[];renderContent()">Clear All</span>
    </div>`;
  }

  return `
    <div>
      <div class="games-toolbar">
        <div class="search-box">
          <span class="search-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
          <input type="text" placeholder="Search games..." value="${searchQuery}" oninput="searchQuery=this.value;filterAndSort();renderContent()">
        </div>
        <div class="dropdown-wrap">
          <button class="btn btn-outline btn-sm" onclick="sortDropdownOpen=!sortDropdownOpen;tagDropdownOpen=false;renderContent()"><i class="fa-solid fa-arrow-down-wide-short"></i> Sort: ${sortBy.charAt(0).toUpperCase()+sortBy.slice(1)}</button>
          ${sortDropdownOpen ? `<div class="dropdown-menu">
            ${['name','id','popular'].map(s => `<button class="dropdown-item ${sortBy===s?'active':''}" onclick="sortBy='${s}';sortDropdownOpen=false;renderContent()">${s.charAt(0).toUpperCase()+s.slice(1)}</button>`).join('')}
          </div>` : ''}
        </div>
        <div class="dropdown-wrap">
          <button class="btn btn-outline btn-sm" onclick="tagDropdownOpen=!tagDropdownOpen;sortDropdownOpen=false;renderContent()"><i class="fa-solid fa-tags"></i> Tags ${selectedTags.length>0?`(${selectedTags.length})`:''}</button>
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
  return `
    <div class="settings-wrap">
      <!-- Cloak -->
      <div class="settings-section">
        <h2><i class="fa-solid fa-shield-halved s-icon"></i> Tab Cloak</h2>
        <p class="desc">Disguise your browser tab to look like another website.</p>
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
            <button class="btn btn-outline btn-sm btn-danger" onclick="removeCloak()"><i class="fa-solid fa-xmark"></i> Remove Cloak</button>
          </div>
        ` : ''}
      </div>

      <!-- Panic Key -->
      <div class="settings-section">
        <h2><i class="fa-solid fa-keyboard s-icon"></i> Panic Key</h2>
        <p class="desc">Set a key that instantly redirects to Google when pressed.</p>
        <div class="panic-row">
          <input type="text" id="panic-input" value="${panicKey}" maxlength="1">
          <button class="btn btn-primary" onclick="savePanicKey()"><i class="fa-solid fa-floppy-disk"></i> Save</button>
          <span class="panic-current">Current: <b>${panicKey===' '?'Space':panicKey}</b></span>
        </div>
      </div>

      <!-- About:blank -->
      <div class="settings-section">
        <h2><i class="fa-solid fa-up-right-from-square s-icon"></i> Open in about:blank</h2>
        <p class="desc">Open this site in a new about:blank window to hide it from your history.</p>
        <button class="btn btn-primary" onclick="openAboutBlank()"><i class="fa-solid fa-up-right-from-square"></i> Open in about:blank</button>
      </div>

      <!-- Reset -->
      <div class="settings-section">
        <h2><i class="fa-solid fa-trash-can s-icon"></i> Data & Reset</h2>
        <div style="display:flex;flex-direction:column;gap:10px;">
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
