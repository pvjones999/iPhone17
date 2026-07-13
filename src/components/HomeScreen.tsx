import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, Calendar, Sun, Camera, Mail, FileText, CheckSquare, Clock, Tv2, Rocket, Play, Compass, Heart, Wallet, Settings, Phone, MessageSquare, Music, Star, X
} from 'lucide-react';
import { AppConfig, AppStoreItem } from '../types';
import { WidgetWeather } from './WidgetWeather';
import { WidgetCalendar } from './WidgetCalendar';

interface HomeScreenProps {
  onAppClick: (id: string) => void;
  installedExtraApps: AppStoreItem[];
  homePages: (string | null)[][];
  setHomePages: React.Dispatch<React.SetStateAction<(string | null)[][]>>;
  dockApps: AppConfig[];
}

const ALL_APPS_DATA: Record<string, { name: string; iconType: string; iconColor?: string }> = {
  facetime: { name: 'FaceTime', iconType: 'facetime' },
  calendar: { name: 'Calendar', iconType: 'calendar' },
  photos: { name: 'Photos', iconType: 'photos' },
  camera: { name: 'Camera', iconType: 'camera' },
  mail: { name: 'Mail', iconType: 'mail' },
  notes: { name: 'Notes', iconType: 'notes' },
  reminders: { name: 'Reminders', iconType: 'reminders' },
  clock: { name: 'Clock', iconType: 'clock' },
  appletv: { name: 'tv', iconType: 'appletv' },
  podcasts: { name: 'Podcasts', iconType: 'podcasts' },
  appstore: { name: 'App Store', iconType: 'appstore' },
  maps: { name: 'Maps', iconType: 'maps' },
  health: { name: 'Health', iconType: 'health' },
  wallet: { name: 'Wallet', iconType: 'wallet' },
  settings: { name: 'Settings', iconType: 'settings' },
  monipay: { name: 'MoniPay', iconType: 'monipay' },
  polynational: { name: 'Polynational', iconType: 'polynational' },
  calculator: { name: 'Calculator', iconType: 'calculator' },
  shopit: { name: 'Shopit', iconType: 'shopit' },
  storage: { name: 'Storage', iconType: 'storage' },
};

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onAppClick,
  installedExtraApps,
  homePages,
  setHomePages,
  dockApps
}) => {
  const [currentPage, setCurrentPageState] = useState(0);
  const directionRef = useRef(0);

  const setCurrentPage = (newPage: number | ((prev: number) => number)) => {
    setCurrentPageState(prev => {
      const resolvedPage = typeof newPage === 'function' ? newPage(prev) : newPage;
      directionRef.current = resolvedPage > prev ? 1 : resolvedPage < prev ? -1 : 0;
      return resolvedPage;
    });
  };

  const [isJiggleMode, setIsJiggleMode] = useState(false);

  // Swipe gesture detection
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isJiggleMode) return;
    const touch = e.touches[0];
    swipeStartX.current = touch.clientX;
    swipeStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isJiggleMode) return;
    if (swipeStartX.current === null || swipeStartY.current === null) return;
    
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - swipeStartX.current;
    const diffY = touch.clientY - swipeStartY.current;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        setCurrentPage(prev => Math.max(prev - 1, 0));
      } else {
        setCurrentPage(prev => Math.min(prev + 1, homePages.length - 1));
      }
    }
    swipeStartX.current = null;
    swipeStartY.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isJiggleMode) return;
    const target = e.target as HTMLElement;
    if (target.closest('[draggable]') || target.closest('button')) return;
    
    swipeStartX.current = e.clientX;
    swipeStartY.current = e.clientY;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isJiggleMode) return;
    if (swipeStartX.current === null || swipeStartY.current === null) return;
    
    const diffX = e.clientX - swipeStartX.current;
    const diffY = e.clientY - swipeStartY.current;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        setCurrentPage(prev => Math.max(prev - 1, 0));
      } else {
        setCurrentPage(prev => Math.min(prev + 1, homePages.length - 1));
      }
    }
    swipeStartX.current = null;
    swipeStartY.current = null;
  };

  // Drag states
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  // Helper to resolve metadata
  const getAppMetadata = (id: string) => {
    if (ALL_APPS_DATA[id]) {
      return ALL_APPS_DATA[id];
    }
    const extra = installedExtraApps.find(a => a.id === id);
    if (extra) {
      return { 
        name: extra.name, 
        iconType: 'generic', 
        iconColor: extra.iconColor 
      };
    }
    return { 
      name: id, 
      iconType: 'generic', 
      iconColor: 'bg-zinc-300' 
    };
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string, pageIdx: number, slotIdx: number) => {
    setDraggedAppId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.setData("sourcePageIdx", String(pageIdx));
    e.dataTransfer.setData("sourceSlotIdx", String(slotIdx));
    // iOS long-press drag visual
    e.currentTarget.classList.add('opacity-40');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedAppId(null);
    e.currentTarget.classList.remove('opacity-40');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToIcon = (e: React.DragEvent, targetId: string | null, targetPageIdx: number, targetSlotIdx: number) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain") || draggedAppId;
    const sourcePageStr = e.dataTransfer.getData("sourcePageIdx");
    const sourceSlotStr = e.dataTransfer.getData("sourceSlotIdx");
    
    if (!sourceId) return;

    let sourcePageIdx = sourcePageStr !== "" ? parseInt(sourcePageStr) : -1;
    let sourceSlotIdx = sourceSlotStr !== "" ? parseInt(sourceSlotStr) : -1;

    if (sourcePageIdx === -1 || sourceSlotIdx === -1) {
      sourcePageIdx = homePages.findIndex(p => p.includes(sourceId));
      if (sourcePageIdx !== -1) {
        sourceSlotIdx = homePages[sourcePageIdx].indexOf(sourceId);
      }
    }

    if (sourcePageIdx === -1 || sourceSlotIdx === -1) return;
    if (sourcePageIdx === targetPageIdx && sourceSlotIdx === targetSlotIdx) return;

    const newPages = homePages.map(page => [...page]);
    
    // Swap value at target and source
    const targetVal = newPages[targetPageIdx][targetSlotIdx];
    newPages[targetPageIdx][targetSlotIdx] = sourceId;
    newPages[sourcePageIdx][sourceSlotIdx] = targetVal;

    setHomePages(newPages);
  };

  // Helper to render high fidelity iOS icons
  const renderAppIconGraphics = (id: string, iconType: string, overrideColor?: string) => {
    switch (iconType) {
      case 'shopit':
        return (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-650 flex flex-col items-center justify-center shadow-md select-none pointer-events-none relative overflow-hidden">
            <div className="absolute -top-4 -left-4 w-10 h-10 bg-white/10 rounded-full blur-sm"></div>
            <span className="text-white text-xl font-bold select-none">🛒</span>
          </div>
        );
      case 'storage':
        return (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-600 flex flex-col items-center justify-center shadow-md select-none pointer-events-none relative overflow-hidden">
            <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-white/10 rounded-full blur-sm"></div>
            <span className="text-white text-xl font-bold select-none">📦</span>
          </div>
        );
      case 'facetime':
        return (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-400 to-emerald-650 flex items-center justify-center shadow-md select-none pointer-events-none">
            <Video className="w-7 h-7 text-white fill-white/10" />
          </div>
        );
      case 'calendar':
        return (
          <div className="w-13 h-13 rounded-2xl bg-white border border-zinc-100 flex flex-col items-center justify-start overflow-hidden shadow-md select-none pointer-events-none">
            <div className="bg-red-500 text-white text-[8px] font-black w-full text-center py-0.5 uppercase tracking-wider">Mon</div>
            <span className="text-xl font-extrabold text-zinc-900 mt-0.5">6</span>
          </div>
        );
      case 'photos':
        return (
          <div className="w-13 h-13 rounded-2xl bg-white border border-zinc-50 flex items-center justify-center shadow-md overflow-hidden select-none pointer-events-none relative">
            <div className="w-7 h-7 relative flex items-center justify-center animate-spin-slow">
              <span className="absolute w-3 h-3 bg-red-400 rounded-full scale-100 -translate-x-1.5 -translate-y-1.5 opacity-80"></span>
              <span className="absolute w-3 h-3 bg-yellow-400 rounded-full scale-100 translate-x-1.5 -translate-y-1.5 opacity-80"></span>
              <span className="absolute w-3 h-3 bg-blue-400 rounded-full scale-100 translate-x-1.5 translate-y-1.5 opacity-80"></span>
              <span className="absolute w-3 h-3 bg-emerald-400 rounded-full scale-100 -translate-x-1.5 translate-y-1.5 opacity-80"></span>
              <span className="absolute w-2 h-2 bg-purple-400 rounded-full scale-100"></span>
            </div>
          </div>
        );
      case 'camera':
        return (
          <div className="w-13 h-13 rounded-2xl bg-zinc-800 flex items-center justify-center shadow-md border border-zinc-700 select-none pointer-events-none relative">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-600 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-zinc-950 border-2 border-zinc-700 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-900"></span>
              </div>
            </div>
            <span className="absolute top-2.5 right-2.5 w-1 h-1 bg-amber-400 rounded-full animate-pulse"></span>
          </div>
        );
      case 'mail':
        return (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-sky-450 to-sky-600 flex items-center justify-center shadow-md select-none pointer-events-none">
            <Mail className="w-7 h-7 text-white fill-white/10" />
          </div>
        );
      case 'notes':
        return (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-amber-50 to-yellow-100 border border-amber-250 flex flex-col justify-between p-1.5 overflow-hidden shadow-md select-none pointer-events-none">
            <div className="h-1 bg-amber-500 rounded-full w-2/3"></div>
            <div className="space-y-1 my-1">
              <div className="h-0.5 bg-yellow-600/20 rounded-full w-full"></div>
              <div className="h-0.5 bg-yellow-600/20 rounded-full w-5/6"></div>
              <div className="h-0.5 bg-yellow-600/20 rounded-full w-4/5"></div>
            </div>
            <div className="h-0.5 bg-yellow-600/20 rounded-full w-1/2"></div>
          </div>
        );
      case 'reminders':
        return (
          <div className="w-13 h-13 rounded-2xl bg-white border border-zinc-100 flex flex-col justify-between p-2 shadow-md select-none pointer-events-none">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <div className="h-0.5 bg-zinc-300 rounded-full w-3/4"></div>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <div className="h-0.5 bg-zinc-300 rounded-full w-5/6"></div>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              <div className="h-0.5 bg-zinc-300 rounded-full w-2/3"></div>
            </div>
          </div>
        );
      case 'clock':
        return (
          <div className="w-13 h-13 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-md select-none pointer-events-none relative">
            <Clock className="w-7 h-7 text-white" />
            <span className="absolute w-2 h-0.5 bg-red-400 rotate-45 top-1/2 left-1/2 origin-left -translate-x-0.5"></span>
          </div>
        );
      case 'appletv':
        return (
          <div className="w-13 h-13 rounded-2xl bg-zinc-950 border border-zinc-850 flex items-center justify-center font-black tracking-tight text-white shadow-md select-none pointer-events-none text-[10px]">
             tv
          </div>
        );
      case 'podcasts':
        return (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-400 to-orange-650 flex items-center justify-center shadow-md select-none pointer-events-none">
            <Rocket className="w-7 h-7 text-white fill-orange-300/25" />
          </div>
        );
      case 'appstore':
        return (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center shadow-md select-none pointer-events-none">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <span className="absolute w-5 h-1 bg-white rounded-full rotate-60"></span>
              <span className="absolute w-5 h-1 bg-white rounded-full -rotate-60"></span>
              <span className="absolute w-4.5 h-1 bg-white/90 rounded-full -translate-y-0.5"></span>
            </div>
          </div>
        );
      case 'maps':
        return (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-sky-300 via-emerald-100 to-emerald-300 border border-emerald-300 overflow-hidden relative shadow-md select-none pointer-events-none">
            <div className="absolute h-1.5 w-full bg-amber-100 top-1/2 rotate-12"></div>
            <div className="absolute w-1.5 h-full bg-amber-100 left-1/2 -rotate-12"></div>
            <div className="absolute top-3 left-4 w-5 h-5 rounded-full border-2 border-dashed border-sky-500 animate-pulse"></div>
            <span className="absolute top-4 left-5 text-sky-600 text-[8px] font-bold font-sans"></span>
          </div>
        );
      case 'health':
        return (
          <div className="w-13 h-13 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shadow-md select-none pointer-events-none">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
          </div>
        );
      case 'wallet':
        return (
          <div className="w-13 h-13 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-end p-1.5 shadow-md select-none pointer-events-none relative">
            <div className="absolute top-2 inset-x-2 h-4 rounded bg-gradient-to-r from-teal-400 to-blue-500 opacity-60"></div>
            <div className="absolute top-4 inset-x-2.5 h-4 rounded bg-gradient-to-r from-amber-400 to-rose-500 opacity-70"></div>
            <div className="h-4 w-full rounded bg-zinc-950 border border-zinc-800 flex items-center p-1">
              <span className="w-1 h-1 rounded-full bg-white/40"></span>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-b from-zinc-350 to-zinc-550 flex items-center justify-center shadow-md select-none pointer-events-none">
            <Settings className="w-7 h-7 text-zinc-900 fill-zinc-100/10 animate-spin-slow" />
          </div>
        );
      case 'phone':
        return (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md select-none pointer-events-none">
            <Phone className="w-7 h-7 text-white fill-white/10" />
          </div>
        );
      case 'safari':
        return (
          <div className="w-13 h-13 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shadow-md select-none pointer-events-none relative overflow-hidden">
            <div className="w-9 h-9 rounded-full border border-sky-200 bg-sky-50 flex items-center justify-center rotate-45 text-none">
              <Compass className="w-6 h-6 text-sky-600 font-black" />
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-400 to-emerald-650 flex items-center justify-center shadow-md select-none pointer-events-none">
            <MessageSquare className="w-7 h-7 text-white fill-white" />
          </div>
        );
      case 'music':
        return (
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-450 to-pink-600 flex items-center justify-center shadow-md select-none pointer-events-none">
            <Music className="w-7 h-7 text-white" />
          </div>
        );
      case 'monipay':
        return (
          <div className="w-13 h-13 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center shadow-md select-none pointer-events-none relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-emerald-500/10 rounded-full blur-md"></div>
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-sm select-none">₦</span>
            </div>
            <span className="text-[7.5px] font-bold text-emerald-400 mt-1 uppercase tracking-widest leading-none font-mono">PAY</span>
          </div>
        );
      case 'polynational':
        return (
          <div className="w-13 h-13 rounded-2xl bg-[#0A1128] border border-amber-500/20 flex flex-col items-center justify-center shadow-md select-none pointer-events-none relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-amber-500/10 rounded-full blur-md"></div>
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-sm">
              <span className="text-slate-900 font-extrabold text-xs select-none">🌐</span>
            </div>
            <span className="text-[6.5px] font-black text-amber-500 mt-1 uppercase tracking-widest leading-none font-mono">POLY</span>
          </div>
        );
      case 'calculator':
        return (
          <div className="w-13 h-13 rounded-2xl bg-zinc-950 border border-zinc-900 flex flex-col items-center justify-center shadow-md select-none pointer-events-none">
            <div className="grid grid-cols-2 gap-1 w-7 h-7">
              <div className="bg-orange-500 rounded text-white text-[8.1px] font-bold flex items-center justify-center leading-none">+</div>
              <div className="bg-zinc-700 rounded text-white text-[8.1px] font-bold flex items-center justify-center leading-none">-</div>
              <div className="bg-zinc-700 rounded text-white text-[8.1px] font-bold flex items-center justify-center leading-none">×</div>
              <div className="bg-zinc-700 rounded text-white text-[8.1px] font-bold flex items-center justify-center leading-none">=</div>
            </div>
          </div>
        );
      default:
        return (
          <div className={`${overrideColor || 'bg-blue-600'} w-13 h-13 rounded-2xl flex items-center justify-center font-extrabold text-white text-lg shadow-md select-none pointer-events-none uppercase`}>
            {iconType === 'generic' ? (id ? id[0] : 'A') : (iconType ? iconType[0] : 'A')}
          </div>
        );
    }
  };

  const handleIconClick = (appId: string) => {
    if (isJiggleMode) return;
    onAppClick(appId);
  };

  // Long press timer ref helper
  const pressTimer = React.useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = () => {
    if (isJiggleMode) return;
    pressTimer.current = setTimeout(() => {
      setIsJiggleMode(true);
    }, 850);
  };

  const handlePointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const activePageAppsList = homePages[currentPage] || [];

  return (
    <div 
      className="flex flex-col h-full justify-between pb-4 select-none relative" 
      id="home_screen_dashboard_wrapper"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      
      {/* Done Editing (Jiggle Mode Indicator Overlay) */}
      {isJiggleMode && (
        <div className="absolute top-2 inset-x-4 flex justify-between items-center z-50">
          <span className="text-[10px] bg-black/60 backdrop-blur-md text-amber-400 font-extrabold px-2.5 py-1 rounded-full border border-amber-450/40 animate-pulse font-mono leading-none flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span> JIGGLE MODE ACTIVE
          </span>
          <button 
            id="exit_jiggle_mode_btn"
            onClick={() => setIsJiggleMode(false)}
            className="bg-emerald-500/85 hover:bg-emerald-600 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-lg border border-emerald-450/30 transition active:scale-95 leading-none cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {/* Top Rows: Widgets area (Only visible on first page to match classic layout) */}
      {currentPage === 0 && (
        <div className="px-4.5 pt-4.5 grid grid-cols-2 gap-4 shrink-0 transition-all duration-300 animate-fadeIn" id="homescreen_widgets">
          <WidgetWeather />
          <WidgetCalendar />
        </div>
      )}

      {/* Grid Apps Body with sliding transitions */}
      <div className={`flex-1 relative overflow-hidden flex flex-col min-h-0 ${currentPage !== 0 ? 'mt-8' : ''}`} id="swipe_viewport">
        <AnimatePresence initial={false} custom={directionRef.current} mode="popLayout">
          <motion.div
            key={currentPage}
            custom={directionRef.current}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? 320 : dir < 0 ? -320 : 0,
                opacity: 0
              }),
              center: {
                x: 0,
                opacity: 1
              },
              exit: (dir: number) => ({
                x: dir > 0 ? -320 : dir < 0 ? 320 : 0,
                opacity: 0
              })
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 350, damping: 32 },
              opacity: { duration: 0.15 }
            }}
            className="px-4.5 pt-2 grid grid-cols-4 gap-y-4 gap-x-4 auto-rows-max flex-1 overflow-y-auto align-content-start z-10 relative h-full w-full" 
            id="app_grid"
          >
            {activePageAppsList.map((appId, slotIdx) => {
              if (appId) {
                const meta = getAppMetadata(appId);
                return (
                  <div 
                    id={`homescreen_app_wrapper_${appId}`}
                    key={`app_slot_${appId}`}
                    draggable={isJiggleMode}
                    onDragStart={(e) => handleDragStart(e, appId, currentPage, slotIdx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropToIcon(e, appId, currentPage, slotIdx)}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onClick={() => handleIconClick(appId)}
                    className={`flex flex-col items-center gap-1 group relative cursor-pointer select-none ${isJiggleMode ? 'animate-jiggle' : ''}`}
                  >
                    {renderAppIconGraphics(appId, meta.iconType, meta.iconColor)}
                    
                    <span className="text-[9.5px] font-semibold text-zinc-800 truncate max-w-full tracking-wide scale-100 group-hover:scale-102 transition duration-100 font-sans">
                      {meta.name}
                    </span>

                    {/* Red subtraction minus indicator inside Jiggle Mode */}
                    {isJiggleMode && (
                      <div className="absolute top-[-4px] left-[-3px] w-4.5 h-4.5 rounded-full bg-rose-500 border border-white flex items-center justify-center text-white scale-100 active:scale-90 transition z-50">
                        <span className="w-2 h-0.5 bg-white rounded-full"></span>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div 
                    id={`homescreen_empty_wrapper_${slotIdx}`}
                    key={`empty_slot_${slotIdx}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropToIcon(e, null, currentPage, slotIdx)}
                    className={`flex flex-col items-center justify-center gap-1 relative w-full h-[64px] rounded-2xl transition border ${isJiggleMode ? 'border-dashed border-zinc-300 bg-black/5 hover:bg-black/10' : 'border-transparent'}`}
                  >
                    {/* Invisible spaces or dashed placeholders inside jiggle mode */}
                  </div>
                );
              }
            })}

            {/* Dynamic Gutter overlay zones during Dragover to slip into next drawer */}
            {isJiggleMode && (
              <>
                <div 
                  id="gutter_drag_left"
                  className="absolute left-0 top-12 bottom-12 w-6 h-[80%] z-40 bg-white/5 opacity-0 hover:opacity-20 border-r border-white/20 flex items-center justify-center text-[10px] font-black pointer-events-auto rounded-r-xl"
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (currentPage > 0) {
                      setCurrentPage(prev => prev - 1);
                    }
                  }}
                >
                  ◀
                </div>
                <div 
                  id="gutter_drag_right"
                  className="absolute right-0 top-12 bottom-12 w-6 h-[80%] z-40 bg-white/5 opacity-0 hover:opacity-20 border-l border-white/20 flex items-center justify-center text-[10px] font-black pointer-events-auto rounded-l-xl"
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (currentPage < homePages.length - 1) {
                      setCurrentPage(prev => prev + 1);
                    }
                  }}
                >
                  ▶
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Small Pagination Indicator dot row */}
      <div className="flex justify-center gap-1.5 py-2 shrink-0 z-10" id="pagination_dots">
        {homePages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              currentPage === index ? 'bg-zinc-800 scale-125' : 'bg-zinc-805/20 bg-zinc-400'
            }`}
          ></button>
        ))}
      </div>

      {/* Dock (Translucent blur dock) */}
      <div 
        id="homescreen_dock" 
        className="mx-4 bg-white/30 backdrop-blur-2xl border border-white/20 rounded-[35px] px-2 py-3.5 flex justify-around items-center shadow-sm shrink-0 z-10"
      >
        {dockApps.map(dapp => (
          <button 
            id={`homescreen_app_${dapp.id}`}
            key={dapp.id} 
            onClick={() => handleIconClick(dapp.id)}
            className="flex flex-col items-center hover:scale-105 active:scale-90 transition-transform cursor-pointer"
          >
            {renderAppIconGraphicDock(dapp.iconType)}
          </button>
        ))}
      </div>
    </div>
  );
};

// Extracted dock visual helpers
const renderAppIconGraphicDock = (iconType: string) => {
  switch (iconType) {
    case 'phone':
      return (
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md select-none pointer-events-none">
          <Phone className="w-7 h-7 text-white fill-white/10" />
        </div>
      );
    case 'safari':
      return (
        <div className="w-13 h-13 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center shadow-md select-none pointer-events-none">
          <div className="w-9 h-9 rounded-full border border-sky-100 bg-sky-50 flex items-center justify-center rotate-45 text-none">
            <Compass className="w-6 h-6 text-sky-600" />
          </div>
        </div>
      );
    case 'messages':
      return (
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-400 to-emerald-650 flex items-center justify-center shadow-md select-none pointer-events-none">
          <MessageSquare className="w-7 h-7 text-white fill-white" />
        </div>
      );
    case 'music':
      return (
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-450 to-pink-600 flex items-center justify-center shadow-md select-none pointer-events-none">
          <Music className="w-7 h-7 text-white" />
        </div>
      );
    default:
      return <div className="w-13 h-13 bg-zinc-400 rounded-2xl"></div>;
  }
};
