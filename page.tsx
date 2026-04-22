'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Home,
  Settings,
  Maximize,
  ExternalLink,
  X,
  RefreshCw,
  Gamepad2,
  MessageCircle,
  Film,
  Grid3X3,
  Handshake,
  ChevronDown,
  Sparkles,
  Wrench,
  Globe,
  FileText,
  FolderOpen,
  BookOpen,
  GraduationCap,
  Star,
  CircleDot,
  Loader2,
  Trash2,
  RotateCcw,
  Keyboard,
  Shield,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface GameData {
  id: string;
  name: string;
  cover: string;
  url: string;
  special: string[];
  [key: string]: unknown;
}

interface ThemeConfig {
  name: string;
  primary: string;
  background: string;
  card: string;
  foreground: string;
  secondary: string;
  muted: string;
  accent: string;
  border: string;
  ring: string;
}

interface CloakConfig {
  name: string;
  title: string;
  favicon: string;
  color: string;
  description: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LOGO_URL = 'https://www.image2url.com/r2/default/images/1776781342340-eff4309f-5ae6-44db-bccb-8fb24ed120dc.png';
const COVER_BASE = 'https://cdn.jsdelivr.net/gh/freebuisness/covers@main';
const HTML_BASE = 'https://cdn.jsdelivr.net/gh/freebuisness/html@main';
const GAMES_API = 'https://cdn.jsdelivr.net/gh/freebuisness/assets@main/zones.json';
const DISCORD_URL = 'https://discord.gg/29MKAyFMF9';
const WIDGETBOT_SERVER = '1487435823283572898';
const WIDGETBOT_CHANNEL = '1487435824982397131';

const FEATURED_GAME_NAMES = ['10 Minutes Till Dawn', '1v1lol', 'Drive Mad', 'Subway Surfers', 'Slope', 'Cookie Clicker'];

const THEMES: Record<string, ThemeConfig> = {
  'red-black': { name: 'Red & Black', primary: '#DC2626', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#DC2626' },
  'blue-dark': { name: 'Blue & Dark', primary: '#2563EB', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#2563EB' },
  'purple-dark': { name: 'Purple & Dark', primary: '#9333EA', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#9333EA' },
  'green-dark': { name: 'Green & Dark', primary: '#16A34A', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#16A34A' },
  'orange-dark': { name: 'Orange & Dark', primary: '#EA580C', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#EA580C' },
  'pink-dark': { name: 'Pink & Dark', primary: '#EC4899', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#EC4899' },
  'cyan-dark': { name: 'Cyan & Dark', primary: '#06B6D4', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#06B6D4' },
  'yellow-dark': { name: 'Yellow & Dark', primary: '#EAB308', background: '#0a0a0a', card: '#111111', foreground: '#fafafa', secondary: '#1a1a1a', muted: '#1a1a1a', accent: '#1f1f1f', border: 'rgba(255,255,255,0.1)', ring: '#EAB308' },
};

const CLOAKS: CloakConfig[] = [
  { name: 'i-Ready', title: 'i-Ready', favicon: 'https://login.i-ready.com/favicon.ico', color: '#0D6EFD', description: 'Online learning platform' },
  { name: 'Clever', title: 'Clever | Portal', favicon: 'https://clever.com/favicon.ico', color: '#2E77D6', description: 'Single sign-on for education' },
  { name: 'McGraw Hill', title: 'McGraw Hill', favicon: 'https://www.mheducation.com/favicon.ico', color: '#E31937', description: 'Educational content & resources' },
  { name: 'Google Docs', title: 'Google Docs', favicon: 'https://fonts.googleapis.com/favicon?folder=docs', color: '#4285F4', description: 'Document editing & collaboration' },
  { name: 'Google Drive', title: 'Google Drive', favicon: 'https://fonts.googleapis.com/favicon?folder=drive', color: '#0F9D58', description: 'Cloud storage & file sharing' },
];

const PARTICLE_TYPES: { id: ParticleType; name: string; icon: React.ReactNode }[] = [
  { id: 'none', name: 'None', icon: <X className="h-4 w-4" /> },
  { id: 'bubbles', name: 'Bubbles', icon: <CircleDot className="h-4 w-4" /> },
  { id: 'stars', name: 'Stars', icon: <Star className="h-4 w-4" /> },
  { id: 'snow', name: 'Snow', icon: <CircleDot className="h-4 w-4" /> },
  { id: 'matrix', name: 'Matrix', icon: <Globe className="h-4 w-4" /> },
];

type TabType = 'home' | 'games' | 'chat' | 'media' | 'apps' | 'partners' | 'settings';
type SortType = 'name' | 'id' | 'popular';
type ParticleType = 'none' | 'bubbles' | 'stars' | 'snow' | 'matrix';

// ─── Particle System ─────────────────────────────────────────────────────────

function useParticles(type: ParticleType) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (type === 'none') {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      return;
    }

    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Record<string, unknown>[] = [];

    const createParticle = () => {
      switch (type) {
        case 'bubbles': return { x: Math.random() * canvas.width, y: canvas.height + Math.random() * 20, size: Math.random() * 20 + 5, speedY: Math.random() * 1.5 + 0.5, speedX: (Math.random() - 0.5) * 0.5, opacity: Math.random() * 0.5 + 0.2, color: `rgba(220, 38, 38, ` };
        case 'stars': return { x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 3 + 1, twinkle: Math.random() * Math.PI * 2, twinkleSpeed: Math.random() * 0.05 + 0.01, opacity: Math.random() * 0.8 + 0.2 };
        case 'snow': return { x: Math.random() * canvas.width, y: -10, size: Math.random() * 4 + 2, speedY: Math.random() * 1.5 + 0.5, speedX: (Math.random() - 0.5) * 1, opacity: Math.random() * 0.7 + 0.3, wobble: Math.random() * Math.PI * 2, wobbleSpeed: Math.random() * 0.03 + 0.01 };
        case 'matrix': return { x: Math.random() * canvas.width, y: -20, size: 14, speedY: Math.random() * 4 + 2, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*', currentChar: '', changeRate: Math.random() * 5 + 2, frameCount: 0, opacity: Math.random() * 0.5 + 0.3 };
        default: return {};
      }
    };

    const count = type === 'matrix' ? 60 : 50;
    for (let i = 0; i < count; i++) {
      const p = createParticle();
      if (type === 'bubbles' || type === 'snow') (p as Record<string, unknown>).y = Math.random() * canvas.height;
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        switch (type) {
          case 'bubbles': {
            p.y -= p.speedY; p.x += p.speedX;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.strokeStyle = `${p.color}${p.opacity})`; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.fillStyle = `${p.color}${p.opacity * 0.1})`; ctx.fill();
            if (p.y + p.size < 0) particles[i] = createParticle();
            break;
          }
          case 'stars': {
            p.twinkle += p.twinkleSpeed;
            const alpha = p.opacity * ((Math.sin(p.twinkle) + 1) / 2);
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`; ctx.fill();
            break;
          }
          case 'snow': {
            p.wobble += p.wobbleSpeed; p.x += p.speedX + Math.sin(p.wobble) * 0.5; p.y += p.speedY;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`; ctx.fill();
            if (p.y > canvas.height + 10) particles[i] = createParticle();
            break;
          }
          case 'matrix': {
            p.y += p.speedY; p.frameCount++;
            if (p.frameCount % Math.floor(p.changeRate) === 0) p.currentChar = p.chars[Math.floor(Math.random() * p.chars.length)];
            ctx.font = `${p.size}px monospace`; ctx.fillStyle = `rgba(0, 255, 70, ${p.opacity})`; ctx.fillText(p.currentChar, p.x, p.y);
            for (let t = 1; t < 5; t++) { const to = p.opacity * (1 - t * 0.2); if (to > 0) { ctx.fillStyle = `rgba(0, 255, 70, ${to})`; ctx.fillText(p.chars[Math.floor(Math.random() * p.chars.length)], p.x, p.y - t * p.size); } }
            if (p.y > canvas.height + 100) particles[i] = createParticle();
            break;
          }
        }
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, [type]);

  return canvasRef;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ChinaTown() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [games, setGames] = useState<GameData[]>([]);
  const [filteredGames, setFilteredGames] = useState<GameData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('name');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGame, setActiveGame] = useState<GameData | null>(null);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [showBeta, setShowBeta] = useState(false);
  const [footerDialog, setFooterDialog] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState('red-black');
  const [particleType, setParticleType] = useState<ParticleType>('none');
  const [activeCloak, setActiveCloak] = useState<string | null>(null);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [panicKey, setPanicKey] = useState('`');
  const [panicKeyInput, setPanicKeyInput] = useState('`');

  const gameIframeRef = useRef<HTMLIFrameElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mediaIframeRef = useRef<HTMLIFrameElement>(null);
  const widgetbotScriptLoaded = useRef(false);
  const chatInitialized = useRef(false);

  useParticles(particleType);

  // Load preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('chinatown-theme');
    const savedParticle = localStorage.getItem('chinatown-particle');
    const savedCloak = localStorage.getItem('chinatown-cloak');
    const savedPanicKey = localStorage.getItem('chinatown-panic-key');

    if (savedTheme && THEMES[savedTheme]) { setCurrentTheme(savedTheme); applyTheme(savedTheme); }
    if (savedParticle) setParticleType(savedParticle as ParticleType);
    if (savedCloak) { setActiveCloak(savedCloak); applyCloak(savedCloak); }
    if (savedPanicKey) { setPanicKey(savedPanicKey); setPanicKeyInput(savedPanicKey); }

    setTimeout(() => { setShowBeta(true); }, 500);
  }, []);

  // Panic key listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === panicKey) window.location.href = 'https://www.google.com';
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [panicKey]);

  // Fetch games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(GAMES_API);
        const data = await res.json();
        if (Array.isArray(data)) {
          const parsed = data.map((game: GameData) => ({
            ...game,
            cover: game.cover.replace('{COVER_URL}', COVER_BASE).replace('{HTML_URL}', HTML_BASE),
            url: game.url.replace('{COVER_URL}', COVER_BASE).replace('{HTML_URL}', HTML_BASE),
          }));
          setGames(parsed);
          setFilteredGames(parsed);
          const tagSet = new Set<string>();
          parsed.forEach((g: GameData) => { if (Array.isArray(g.special)) g.special.forEach((s: string) => tagSet.add(s)); });
          setAvailableTags(Array.from(tagSet).sort());
        }
      } catch { /* silently fail */ } finally { setLoading(false); }
    };
    fetchGames();
  }, []);

  // Filter and sort
  useEffect(() => {
    let result = [...games];
    if (searchQuery.trim()) { const q = searchQuery.toLowerCase(); result = result.filter(g => g.name.toLowerCase().includes(q)); }
    if (selectedTags.length > 0) result = result.filter(g => selectedTags.some(tag => g.special?.includes(tag)));
    switch (sortBy) {
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'id': result.sort((a, b) => a.id.localeCompare(b.id)); break;
      case 'popular': result.sort((a, b) => (b.special?.length || 0) - (a.special?.length || 0)); break;
    }
    setFilteredGames(result);
  }, [games, searchQuery, sortBy, selectedTags]);

  // Widgetbot - load script and create element via DOM
  useEffect(() => {
    if (activeTab !== 'chat') return;

    // Load the widgetbot script
    if (!widgetbotScriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/html-embed';
      script.async = true;
      document.body.appendChild(script);
      widgetbotScriptLoaded.current = true;
    }

    // Create widgetbot element via DOM (avoid React JSX issues with custom elements)
    if (!chatInitialized.current && chatContainerRef.current) {
      chatContainerRef.current.innerHTML = '';
      const widgetbotEl = document.createElement('widgetbot');
      widgetbotEl.setAttribute('server', WIDGETBOT_SERVER);
      widgetbotEl.setAttribute('channel', WIDGETBOT_CHANNEL);
      widgetbotEl.setAttribute('width', '100%');
      widgetbotEl.setAttribute('height', '600');
      chatContainerRef.current.appendChild(widgetbotEl);
      chatInitialized.current = true;
    }
  }, [activeTab]);

  // ─── Actions ─────────────────────────────────────────────────────────────

  const applyTheme = useCallback((themeKey: string) => {
    const theme = THEMES[themeKey];
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--background', theme.background);
    root.style.setProperty('--card', theme.card);
    root.style.setProperty('--foreground', theme.foreground);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--muted', theme.muted);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--ring', theme.ring);
  }, []);

  const handleThemeChange = useCallback((themeKey: string) => {
    setCurrentTheme(themeKey); applyTheme(themeKey); localStorage.setItem('chinatown-theme', themeKey);
  }, [applyTheme]);

  const handleParticleChange = useCallback((type: ParticleType) => {
    setParticleType(type); localStorage.setItem('chinatown-particle', type);
  }, []);

  const applyCloak = useCallback((cloakName: string) => {
    const cloak = CLOAKS.find(c => c.name === cloakName);
    if (cloak) {
      document.title = cloak.title;
      // Remove old favicon links and add new one
      const existingLinks = document.querySelectorAll("link[rel*='icon']");
      existingLinks.forEach(link => link.remove());
      const newLink = document.createElement('link');
      newLink.rel = 'icon';
      newLink.href = cloak.favicon;
      document.head.appendChild(newLink);
    }
  }, []);

  const handleCloak = useCallback((cloakName: string) => {
    setActiveCloak(cloakName); applyCloak(cloakName); localStorage.setItem('chinatown-cloak', cloakName);
  }, [applyCloak]);

  const removeCloak = useCallback(() => {
    setActiveCloak(null); document.title = 'China Town - Gaming Portal';
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.remove());
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    newLink.href = LOGO_URL;
    document.head.appendChild(newLink);
    localStorage.removeItem('chinatown-cloak');
  }, []);

  // FIX: about:blank - uses position:fixed to guarantee full viewport coverage
  const openAboutBlank = useCallback(() => {
    const win = window.open('about:blank', '_blank');
    if (win) {
      const currentFavicon = document.querySelector("link[rel*='icon']")?.getAttribute('href') || LOGO_URL;
      win.document.open();
      win.document.write(`<!DOCTYPE html><html><head><title>${document.title}</title><link rel="icon" href="${currentFavicon}"><style>*{margin:0;padding:0;box-sizing:border-box;}html,body{width:100%;height:100%;overflow:hidden;}iframe{position:fixed;top:0;left:0;width:100%;height:100%;border:none;}</style></head><body><iframe src="${window.location.href}"></iframe></body></html>`);
      win.document.close();
    }
  }, []);

  // FIX: Game about:blank - uses position:fixed to guarantee full viewport coverage
  const openGameAboutBlank = useCallback((game: GameData) => {
    const win = window.open('about:blank', '_blank');
    if (win) {
      win.document.open();
      win.document.write(`<!DOCTYPE html><html><head><title>${game.name} - China Town</title><link rel="icon" href="${LOGO_URL}"><style>*{margin:0;padding:0;box-sizing:border-box;}html,body{width:100%;height:100%;overflow:hidden;}iframe{position:fixed;top:0;left:0;width:100%;height:100%;border:none;}</style></head><body><iframe id="gameFrame"></iframe><script>fetch("${game.url}").then(r=>r.text()).then(html=>{document.getElementById('gameFrame').srcdoc=html;}).catch(()=>{document.getElementById('gameFrame').srcdoc='<h1 style="color:white;text-align:center;margin-top:40vh;">Failed to load game</h1>';});</script></body></html>`);
      win.document.close();
    }
  }, []);

  // FIX: loadGame - reset gameLoaded state when switching games
  const loadGame = useCallback((game: GameData) => {
    setGameLoaded(false);
    setActiveGame(game);
  }, []);

  // FIX: handleGameLoad - only load once per game, prevent infinite loop
  const handleGameLoad = useCallback((iframe: HTMLIFrameElement | null, gameUrl: string) => {
    if (!iframe || gameLoaded) return;
    setGameLoaded(true);
    fetch(gameUrl).then(r => r.text()).then(html => { iframe.srcdoc = html; }).catch(() => { iframe.srcdoc = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;font-size:1.5rem;">Failed to load game</div>'; });
  }, [gameLoaded]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }, []);

  const fullscreenElement = useCallback((el: HTMLElement | null) => {
    if (!el) return; if (el.requestFullscreen) el.requestFullscreen();
  }, []);

  const clearAllData = useCallback(() => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('chinatown-'));
    keys.forEach(k => localStorage.removeItem(k));
    setCurrentTheme('red-black'); applyTheme('red-black');
    setParticleType('none'); removeCloak();
    setPanicKey('`'); setPanicKeyInput('`');
    window.location.reload();
  }, [applyTheme, removeCloak]);

  const resetSettings = useCallback(() => {
    localStorage.removeItem('chinatown-theme'); localStorage.removeItem('chinatown-particle');
    localStorage.removeItem('chinatown-cloak'); localStorage.removeItem('chinatown-panic-key');
    setCurrentTheme('red-black'); applyTheme('red-black');
    setParticleType('none'); removeCloak();
    setPanicKey('`'); setPanicKeyInput('`');
  }, [applyTheme, removeCloak]);

  const savePanicKey = useCallback(() => {
    setPanicKey(panicKeyInput);
    localStorage.setItem('chinatown-panic-key', panicKeyInput);
  }, [panicKeyInput]);

  // ─── Computed ────────────────────────────────────────────────────────────

  const currentThemeConfig = THEMES[currentTheme];
  const featuredGames = games.filter(g => FEATURED_GAME_NAMES.some(fn => g.name.toLowerCase().includes(fn.toLowerCase())));

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { id: 'games', label: 'Games', icon: <Gamepad2 className="h-4 w-4" /> },
    { id: 'chat', label: 'Chat', icon: <MessageCircle className="h-4 w-4" /> },
    { id: 'media', label: 'Media', icon: <Film className="h-4 w-4" /> },
    { id: 'apps', label: 'Apps', icon: <Grid3X3 className="h-4 w-4" /> },
    { id: 'partners', label: 'Partners', icon: <Handshake className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: currentThemeConfig.background }}>
      <canvas id="particle-canvas" />

      {/* Header */}
      <header className="mx-2 sm:mx-4 mt-3 z-10">
        <div
          className="rounded-2xl px-3 sm:px-6 py-3 flex items-center justify-between gap-2 shadow-2xl border border-white/10"
          style={{ background: currentThemeConfig.primary }}
        >
          <div className="flex items-center gap-2 shrink-0">
            <img src={LOGO_URL} alt="China Town Logo" className="h-12 w-12 rounded-lg" />
            <span className="text-white font-bold text-lg hidden sm:block tracking-wide">China Town</span>
          </div>

          <nav className="flex items-center gap-0.5 overflow-x-auto" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeTab === tab.id ? 'bg-white/25 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-2 sm:px-4 py-4 z-10 relative">

        {/* ═══ HOME TAB ═══ */}
        {activeTab === 'home' && (
          <div className="flex flex-col items-center text-center space-y-8 py-8">
            <div className="space-y-3">
              <img src={LOGO_URL} alt="China Town Logo" className="h-28 w-28 rounded-2xl mx-auto" />
              <h1 className="text-4xl font-black text-foreground">Welcome to China Town</h1>
              <p className="text-muted-foreground text-sm">this is in beta lilbro dont expect it to be good</p>
            </div>

            <Button onClick={() => setActiveTab('games')} className="bg-primary text-white hover:opacity-90 px-8 py-3 text-lg rounded-xl">
              <Gamepad2 className="h-5 w-5 mr-2" /> Play Games
            </Button>

            {/* Featured Games */}
            <div className="w-full max-w-5xl">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Featured Games</h2>
              {loading ? (
                <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="ml-3 text-muted-foreground">Loading...</span></div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {featuredGames.slice(0, 6).map(game => (
                    <button key={game.id} onClick={() => loadGame(game)} className="group relative rounded-xl overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-primary">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img src={game.cover} alt={game.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                      </div>
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="absolute bottom-0 left-0 right-0 p-2"><p className="text-white text-xs font-medium truncate">{game.name}</p></div>
                    </button>
                  ))}
                </div>
              )}
            </div>


          </div>
        )}

        {/* ═══ GAMES TAB ═══ */}
        {activeTab === 'games' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search games..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-card border-border text-foreground" />
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => { setSortDropdownOpen(!sortDropdownOpen); setTagDropdownOpen(false); }} className="bg-card border-border text-foreground hover:bg-accent gap-1">
                    Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)} <ChevronDown className="h-3 w-3" />
                  </Button>
                  {sortDropdownOpen && (
                    <div className="absolute top-full mt-1 right-0 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden min-w-[140px]">
                      {(['name', 'id', 'popular'] as SortType[]).map(s => (
                        <button key={s} onClick={() => { setSortBy(s); setSortDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors ${sortBy === s ? 'text-primary font-medium' : 'text-foreground'}`}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => { setTagDropdownOpen(!tagDropdownOpen); setSortDropdownOpen(false); }} className="bg-card border-border text-foreground hover:bg-accent gap-1">
                    <Sparkles className="h-3 w-3" /> Tags {selectedTags.length > 0 && `(${selectedTags.length})`} <ChevronDown className="h-3 w-3" />
                  </Button>
                  {tagDropdownOpen && (
                    <div className="absolute top-full mt-1 right-0 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto min-w-[180px]">
                      {availableTags.length === 0 ? <div className="px-4 py-3 text-sm text-muted-foreground">No tags</div> : availableTags.map(tag => (
                        <button key={tag} onClick={() => toggleTag(tag)} className={`w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors flex items-center gap-2 ${selectedTags.includes(tag) ? 'text-primary font-medium' : 'text-foreground'}`}>
                          <span className={`w-3 h-3 rounded border ${selectedTags.includes(tag) ? 'bg-primary border-primary' : 'border-border'}`} />{tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => toggleTag(tag)}>{tag} <X className="h-3 w-3 ml-1" /></Badge>)}
                <Badge variant="outline" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors" onClick={() => setSelectedTags([])}>Clear All</Badge>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="ml-3 text-muted-foreground">Loading games...</span></div>
            ) : filteredGames.length === 0 ? (
              <div className="text-center py-20"><Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><p className="text-muted-foreground text-lg">No games found</p></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {filteredGames.map(game => (
                  <button key={game.id} onClick={() => loadGame(game)} className="group relative rounded-xl overflow-hidden border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary">
                    <div className="aspect-[3/4] overflow-hidden"><img src={game.cover} alt={game.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" /></div>
                    <div className="absolute inset-0 bg-black/50" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white text-sm font-medium truncate">{game.name}</p>
                      {game.special?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">{game.special.slice(0, 2).map((tag: string) => <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/80 text-white">{tag}</span>)}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══ CHAT TAB ═══ */}
        {activeTab === 'chat' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => fullscreenElement(chatContainerRef.current)} className="bg-card border-border text-foreground hover:bg-accent"><Maximize className="h-4 w-4 mr-1" /> Fullscreen</Button>
              <Button variant="outline" size="sm" onClick={() => {
                if (chatContainerRef.current) {
                  chatContainerRef.current.innerHTML = '';
                  chatInitialized.current = false;
                  // Re-initialize
                  setTimeout(() => {
                    if (chatContainerRef.current) {
                      const widgetbotEl = document.createElement('widgetbot');
                      widgetbotEl.setAttribute('server', WIDGETBOT_SERVER);
                      widgetbotEl.setAttribute('channel', WIDGETBOT_CHANNEL);
                      widgetbotEl.setAttribute('width', '100%');
                      widgetbotEl.setAttribute('height', '600');
                      chatContainerRef.current!.appendChild(widgetbotEl);
                      chatInitialized.current = true;
                    }
                  }, 100);
                }
              }} className="bg-card border-border text-foreground hover:bg-accent"><RefreshCw className="h-4 w-4 mr-1" /> Refresh</Button>
            </div>
            {/* Widgetbot container - element created via DOM in useEffect */}
            <div ref={chatContainerRef} className="rounded-xl overflow-hidden border border-border bg-card" style={{ height: '600px' }} />
          </div>
        )}

        {/* ═══ MEDIA TAB ═══ */}
        {activeTab === 'media' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => fullscreenElement(mediaIframeRef.current?.parentElement || null)} className="bg-card border-border text-foreground hover:bg-accent"><Maximize className="h-4 w-4 mr-1" /> Fullscreen</Button>
              <Button variant="outline" size="sm" onClick={() => { if (mediaIframeRef.current) { const s = mediaIframeRef.current.src; mediaIframeRef.current.src = ''; setTimeout(() => { if (mediaIframeRef.current) mediaIframeRef.current.src = s; }, 100); } }} className="bg-card border-border text-foreground hover:bg-accent"><RefreshCw className="h-4 w-4 mr-1" /> Refresh</Button>
            </div>
            <div className="rounded-xl overflow-hidden border border-border bg-card" style={{ height: '70vh' }}>
              <iframe ref={mediaIframeRef} src="https://mlbmovies.com/featured-movies/" className="w-full h-full border-none" title="Featured Movies" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" />
            </div>
          </div>
        )}

        {/* ═══ APPS TAB ═══ */}
        {activeTab === 'apps' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
              <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium text-lg">Apps Coming Soon!</p>
              <p className="text-muted-foreground text-sm mt-2">this is in beta lilbro dont expect it to be good</p>
              <p className="text-muted-foreground text-sm mt-1">More apps are being worked on. Check back later!</p>
            </div>
          </div>
        )}

        {/* ═══ PARTNERS TAB ═══ */}
        {activeTab === 'partners' && (
          <div className="flex flex-col items-center text-center py-16 space-y-6">
            <Handshake className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground">No partners yet!</h2>
            <p className="text-muted-foreground">To become a partner, join the Discord:</p>
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary text-white hover:opacity-90 px-6 py-2 rounded-xl"><MessageCircle className="h-4 w-4 mr-2" /> Join Discord</Button>
            </a>
          </div>
        )}

        {/* ═══ SETTINGS TAB ═══ */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-8">

            {/* Theme Picker */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Theme Picker</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(THEMES).map(([key, theme]) => (
                  <button key={key} onClick={() => handleThemeChange(key)} className={`rounded-xl p-3 border-2 transition-all duration-200 text-center ${currentTheme === key ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'}`}>
                    <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ background: theme.primary }} />
                    <p className="text-foreground text-xs font-medium">{theme.name}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Particle Picker */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><CircleDot className="h-5 w-5 text-primary" /> Background Particles</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {PARTICLE_TYPES.map(pt => (
                  <button key={pt.id} onClick={() => handleParticleChange(pt.id)} className={`rounded-xl p-3 border-2 transition-all duration-200 text-center ${particleType === pt.id ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'}`}>
                    <div className="mx-auto mb-1 text-foreground flex justify-center">{pt.icon}</div>
                    <p className="text-foreground text-xs font-medium">{pt.name}</p>
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => handleParticleChange('none')} className="mt-3 border-border text-foreground hover:bg-destructive hover:text-destructive-foreground">
                <X className="h-4 w-4 mr-1" /> Remove Particles
              </Button>
            </section>

            {/* Tab Cloak - with actual favicon images */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-primary" /> Tab Cloak</h2>
              <p className="text-muted-foreground text-sm mb-4">Disguise your browser tab to look like another website. Click to apply the cloak.</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {CLOAKS.map(cloak => (
                  <button key={cloak.name} onClick={() => handleCloak(cloak.name)} className={`rounded-xl p-3 border-2 transition-all duration-200 text-center ${activeCloak === cloak.name ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'}`}>
                    <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden" style={{ background: `${cloak.color}22` }}>
                      <img src={cloak.favicon} alt={cloak.name} className="w-6 h-6 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <p className="text-foreground text-xs font-medium">{cloak.name}</p>
                    {activeCloak === cloak.name && <p className="text-primary text-[10px] mt-1">Active</p>}
                  </button>
                ))}
              </div>
              {activeCloak && (
                <div className="mt-3 flex items-center gap-2">
                  <Badge variant="secondary">Active: {activeCloak}</Badge>
                  <Button variant="outline" size="sm" onClick={removeCloak} className="border-border text-foreground hover:bg-destructive hover:text-destructive-foreground">
                    <X className="h-4 w-4 mr-1" /> Remove Cloak
                  </Button>
                </div>
              )}
            </section>

            {/* Panic Key */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Keyboard className="h-5 w-5 text-primary" /> Panic Key</h2>
              <p className="text-muted-foreground text-sm mb-4">Set a key that instantly redirects to Google when pressed. Useful for quick escape.</p>
              <div className="flex items-center gap-3">
                <Input value={panicKeyInput} onChange={e => setPanicKeyInput(e.target.value)} placeholder="Press a key..." className="w-24 bg-card border-border text-foreground text-center" maxLength={1} />
                <Button onClick={savePanicKey} className="bg-primary text-white hover:opacity-90">Save</Button>
                <span className="text-muted-foreground text-xs">Current: <span className="text-primary font-bold">{panicKey === ' ' ? 'Space' : panicKey}</span></span>
              </div>
            </section>

            {/* Open in about:blank */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><ExternalLink className="h-5 w-5 text-primary" /> Open in about:blank</h2>
              <p className="text-muted-foreground text-sm mb-4">Open this site in a new about:blank window to hide it from your history.</p>
              <Button onClick={openAboutBlank} className="bg-primary text-white hover:opacity-90">
                <ExternalLink className="h-4 w-4 mr-2" /> Open in about:blank
              </Button>
            </section>

            {/* Data & Reset */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><Trash2 className="h-5 w-5 text-primary" /> Data & Reset</h2>
              <div className="space-y-3">
                <Button variant="outline" onClick={resetSettings} className="w-full border-border text-foreground hover:bg-accent">
                  <RotateCcw className="h-4 w-4 mr-2" /> Reset All Settings
                </Button>
                <Button variant="outline" onClick={clearAllData} className="w-full border-border text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <Trash2 className="h-4 w-4 mr-2" /> Clear All China Town Data
                </Button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Game Viewer Overlay - FIXED: only call handleGameLoad once */}
      {activeGame && (
        <div className="fixed inset-0 bg-black z-[1000] flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="bg-primary text-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <h2 className="font-bold truncate">{activeGame.name}</h2>
              <span className="text-white/70 text-sm hidden sm:block">{activeGame.author as string || ''}</span>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => fullscreenElement(gameIframeRef.current)}><Maximize className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => openGameAboutBlank(activeGame)}><ExternalLink className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => { setGameLoaded(false); if (gameIframeRef.current) { handleGameLoad(gameIframeRef.current, activeGame.url); } }}><RefreshCw className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20" onClick={() => { setActiveGame(null); setGameLoaded(false); }}><X className="h-4 w-4" /></Button>
            </div>
          </div>
          <iframe
            ref={gameIframeRef}
            key={activeGame.id}
            className="flex-1 border-none w-full"
            onLoad={() => handleGameLoad(gameIframeRef.current, activeGame.url)}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border px-4 py-3 text-center z-10">
        <div className="flex justify-center gap-6 flex-wrap">

          <button onClick={() => setFooterDialog('dmca')} className="text-primary hover:underline font-semibold text-sm">DMCA</button>
          <button onClick={() => setFooterDialog('contact')} className="text-primary hover:underline font-semibold text-sm">Contact</button>
          <button onClick={() => setFooterDialog('privacy')} className="text-primary hover:underline font-semibold text-sm">Privacy Policy</button>
        </div>
      </footer>

      {/* Footer Dialogs */}
      <Dialog open={footerDialog !== null} onOpenChange={() => setFooterDialog(null)}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{footerDialog === 'dmca' ? 'DMCA' : footerDialog === 'contact' ? 'Contact' : 'Privacy Policy'}</DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              {footerDialog === 'dmca' && 'If you own or developed a game on China Town and would like it removed, please join our Discord or email us.'}
              {footerDialog === 'contact' && 'Discord: https://discord.gg/29MKAyFMF9'}
              {footerDialog === 'privacy' && 'We do not collect personal information. Game data is fetched from public CDNs. Settings are stored locally in your browser.'}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Beta Popup */}
      <Dialog open={showBeta} onOpenChange={setShowBeta}>
        <DialogContent className="max-w-sm bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /> Beta Mode</DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">This is in beta lilbro dont expect it to be good</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowBeta(false)} className="bg-primary text-white hover:opacity-90">Got it!</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
