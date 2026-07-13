import React, { useState, useEffect, useRef } from 'react';
import { Signal, Wifi, Battery, Play, Pause, Radio, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Song } from '../types';

interface DeviceFrameProps {
  children: React.ReactNode;
  activeApp: string | null;
  onHomeClick: () => void;
  onHomeLongPress: () => void;
  wallpaper: string;
  activeSong: Song | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  systemTime: Date;
  globalNotification: { title: string; body: string } | null;
  onClearNotification: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  activeApp,
  onHomeClick,
  onHomeLongPress,
  wallpaper,
  activeSong,
  isPlaying,
  setIsPlaying,
  systemTime,
  globalNotification,
  onClearNotification
}) => {
  const [timeStr, setTimeStr] = useState('2:08');
  const [islandState, setIslandState] = useState<'standard' | 'expanded-music' | 'expanded-alert' | 'expanded-notification' | 'expanded-delivery'>('standard');
  const [activeDelivery, setActiveDelivery] = useState<any | null>(null);
  const [notifBanners, setNotifBanners] = useState<{ id: string; title: string; body: string }[]>([]);

  const getNotificationType = (title: string = '') => {
    const t = title.toLowerCase();
    if (t.includes('shopit') || t.includes('cart') || t.includes('delivery') || t.includes('card registry') || t.includes('exchange')) {
      return {
        appName: 'Shopit Notification',
        color: '#818cf8', // Indigo
        symbol: '🛍️',
        circleClass: 'bg-indigo-600 border border-indigo-400/20 text-white',
      };
    }
    if (t.includes('polynational') || t.includes('swiss wire') || t.includes('world elite') || t.includes('wire successful') || t.includes('poly')) {
      return {
        appName: 'Polynational Notification',
        color: '#fbbf24', // Amber/yellow
        symbol: '🌐',
        circleClass: 'bg-[#0F172A] border border-amber-500/30 text-amber-400',
      };
    }
    if (t.includes('monipay')) {
      return {
        appName: 'MoniPay Notification',
        color: '#34d399', // Emerald
        symbol: '₦',
        circleClass: 'bg-[#00C37A] border border-emerald-400/20 text-black font-extrabold',
      };
    }
    if (t.includes('music') || t.includes('song')) {
      return {
        appName: 'Music Notification',
        color: '#fb7185', // Rose
        symbol: '🎵',
        circleClass: 'bg-gradient-to-tr from-rose-500 to-pink-600 text-white',
      };
    }
    if (t.includes('mail') || t.includes('email') || t.includes('inbox')) {
      return {
        appName: 'Mail Notification',
        color: '#38bdf8', // Sky
        symbol: '✉️',
        circleClass: 'bg-gradient-to-b from-sky-400 to-sky-600 text-white',
      };
    }
    if (t.includes('storage') || t.includes('inventory')) {
      return {
        appName: 'Storage Notification',
        color: '#fb923c', // Orange
        symbol: '📦',
        circleClass: 'bg-gradient-to-tr from-amber-400 to-orange-600 text-white',
      };
    }
    return {
      appName: `${title || 'System'} Notification`,
      color: '#00C37A',
      symbol: '📱',
      circleClass: 'bg-zinc-850 text-white border border-zinc-700/40',
    };
  };

  useEffect(() => {
    const handleInterval = () => {
      const saved = localStorage.getItem('storage_active_delivery');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.active) {
            setActiveDelivery(parsed);
            return;
          }
        } catch (e) {}
      }
      setActiveDelivery(null);
    };

    handleInterval();
    const timer = setInterval(handleInterval, 1000);
    return () => clearInterval(timer);
  }, []);

  // Digital clock update synchronized with global systemTime
  useEffect(() => {
    const hrs = systemTime.getHours();
    let displayHrs = hrs % 12;
    displayHrs = displayHrs ? displayHrs : 12; // 12-hour format
    const mins = systemTime.getMinutes().toString().padStart(2, '0');
    setTimeStr(`${displayHrs}:${mins}`);
  }, [systemTime]);

  // Stable ref to clear notification callback to prevent timer resetting on parent re-renders
  const onClearNotificationRef = useRef(onClearNotification);
  useEffect(() => {
    onClearNotificationRef.current = onClearNotification;
  }, [onClearNotification]);

  const lastNotifRef = useRef<{ title: string; body: string; time: number } | null>(null);

  const isDuplicateNotification = (title: string, body: string) => {
    const now = Date.now();
    if (
      lastNotifRef.current &&
      lastNotifRef.current.title === title &&
      lastNotifRef.current.body === body &&
      now - lastNotifRef.current.time < 1500
    ) {
      return true;
    }
    lastNotifRef.current = { title, body, time: now };
    return false;
  };

  // Listen to global notifications and custom event emitters to expand Dynamic Island and push to stacked active banners
  useEffect(() => {
    if (globalNotification) {
      if (!isDuplicateNotification(globalNotification.title, globalNotification.body)) {
        setIslandState('expanded-notification');
        
        const isDuplicateBanner = notifBanners.some(
          n => n.title === globalNotification.title && n.body === globalNotification.body
        );
        if (!isDuplicateBanner) {
          const id = 'banner_' + Date.now() + '_' + Math.random();
          setNotifBanners(prev => [...prev, { id, title: globalNotification.title, body: globalNotification.body }]);
          
          // Timer to clear specific banner after 4.5 seconds
          setTimeout(() => {
            setNotifBanners(prev => prev.filter(n => n.id !== id));
          }, 4500);
        }

        const timer = setTimeout(() => {
          setIslandState('standard');
          onClearNotificationRef.current();
        }, 4000); // collapse after 4s
        return () => clearTimeout(timer);
      }
    }
  }, [globalNotification]);

  useEffect(() => {
    const handleCustomNotif = (e: Event) => {
      const customEvent = e as CustomEvent<{ title: string; body: string }>;
      if (!customEvent.detail) return;
      const { title, body } = customEvent.detail;
      
      if (!isDuplicateNotification(title, body)) {
        setIslandState('expanded-notification');
        
        const id = 'banner_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        setNotifBanners(prev => [...prev, { id, title, body }]);
        
        // Clear specific banner after 4.5 seconds
        setTimeout(() => {
          setNotifBanners(prev => prev.filter(n => n.id !== id));
        }, 4500);

        const timer = setTimeout(() => {
          setIslandState('standard');
          if (onClearNotificationRef.current) {
            onClearNotificationRef.current();
          }
        }, 4000); // collapse after 4s
      }
    };

    window.addEventListener('app_trigger_custom_notification', handleCustomNotif);
    return () => window.removeEventListener('app_trigger_custom_notification', handleCustomNotif);
  }, []);

  // Listen to music state changes to expand Dynamic Island temporarily
  useEffect(() => {
    if (isPlaying && activeSong && !globalNotification) {
      setIslandState('expanded-music');
      const timer = setTimeout(() => {
        setIslandState('standard');
      }, 5000); // Collapse back to standard standard layout after 5s
      return () => clearTimeout(timer);
    }
  }, [isPlaying, activeSong]);

  return (
    <div id="physical_phone_bezel_wrapper" className="relative flex items-center justify-center py-6 min-h-screen bg-transparent select-none">
      
      {/* Phone Left Buttons (Volume keys, silent switch) */}
      <div className="absolute left-[-16px] top-40 flex flex-col gap-4 z-10 w-1 bg-transparent">
        {/* Silent switch */}
        <div className="w-[4px] h-[28px] bg-zinc-700/90 rounded-l-md border-r border-zinc-950 shadow-md"></div>
        {/* Vol Up */}
        <div className="w-[4px] h-[52px] bg-zinc-750/90 rounded-l-md border-r border-zinc-950 shadow-md transform hover:translate-x-[1px] cursor-pointer" onClick={() => alert('Volume Up (+)')}></div>
        {/* Vol Down */}
        <div className="w-[4px] h-[52px] bg-zinc-755/90 rounded-l-md border-r border-zinc-950 shadow-md transform hover:translate-x-[1px] cursor-pointer" onClick={() => alert('Volume Down (-)')}></div>
      </div>

      {/* Phone Right Buttons (Power button) */}
      <div className="absolute right-[-16px] top-56 z-10 w-1 bg-transparent">
        <div className="w-[4px] h-[75px] bg-zinc-750/90 rounded-r-md border-l border-zinc-950 shadow-md transform hover:translate-x-[-1px] cursor-pointer" onClick={() => onHomeClick()}></div>
      </div>

      {/* Main Bezel Body */}
      <div 
        id="iphone17_bezel" 
        className="relative w-[390px] h-[844px] bg-black rounded-[55px] p-[12px] shadow-[0_0_80px_rgba(0,0,0,0.8),inset_0_0_2px_rgba(255,255,255,0.4)] ring-1 ring-zinc-800 flex flex-col overflow-hidden" 
        style={{ boxSizing: 'border-box' }}
      >
        
        {/* Screen Content Capsule */}
        <div 
          id="iphone17_screen" 
          className="relative w-full h-full rounded-[44px] overflow-hidden flex flex-col select-none relative"
          style={{ background: wallpaper, transition: 'background 0.5s ease-in-out' }}
        >
          
          {/* iOS Status Bar */}
          {(() => {
            const isLightStatusBar = activeApp === null || ['safari', 'messages', 'mail', 'notes', 'reminders', 'calendar', 'health', 'appstore'].includes(activeApp);
            const statusBarColorClass = isLightStatusBar ? 'text-zinc-800/90 font-semibold' : 'text-white/90 font-semibold';
            const iconColorClass = isLightStatusBar ? 'text-zinc-800' : 'text-white';
            
            return (
              <div className={`absolute top-0 inset-x-0 h-11 px-8 flex justify-between items-center z-50 ${statusBarColorClass} font-sans text-[11px] select-none`}>
                {/* Time */}
                <span className="font-semibold tracking-tight mt-2">{timeStr}</span>
                
                {/* Status Icons */}
                <div className="flex items-center gap-1.5 mt-2" id="statusbar_icons">
                  <Signal className={`w-3.5 h-3.5 ${iconColorClass}`} />
                  <Wifi className={`w-3.5 h-3.5 ${iconColorClass}`} />
                  <div className="flex items-center gap-1" id="statusbar_battery">
                    <span className="text-[9.5px] font-semibold mr-0.5">100%</span>
                    <div className={`w-5 h-2.5 border ${isLightStatusBar ? 'border-black/50' : 'border-white/50'} rounded-sm relative shrink-0`}>
                      <div className={`absolute left-0.5 top-0.5 bottom-0.5 rounded-2xs ${isLightStatusBar ? 'bg-black/80' : 'bg-white'} w-3.5`}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Dynamic Island Container centered at the top */}
          <div className="absolute top-2.5 inset-x-0 flex justify-center z-50 pointer-events-none">
            <motion.div
              id="dynamic_island"
              animate={{
                width: islandState === 'expanded-music' ? 260 : islandState === 'expanded-alert' ? 220 : islandState === 'expanded-notification' ? 320 : islandState === 'expanded-delivery' ? 280 : 110,
                height: islandState === 'expanded-music' ? 54 : islandState === 'expanded-alert' ? 44 : islandState === 'expanded-notification' ? 56 : islandState === 'expanded-delivery' ? 52 : 30,
                borderRadius: 24,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={() => {
                if (islandState === 'expanded-notification') {
                  setIslandState('standard');
                  onClearNotification();
                } else if (islandState === 'expanded-delivery') {
                  setIslandState('standard');
                } else if (islandState === 'standard' && activeDelivery) {
                  setIslandState('expanded-delivery');
                } else if (islandState === 'standard' && isPlaying && activeSong) {
                  setIslandState('expanded-music');
                } else {
                  setIslandState('standard');
                }
              }}
              className="bg-black border border-white/5 shadow-lg flex items-center justify-between px-3.5 py-1 text-white hover:border-zinc-800 transition-all pointer-events-auto cursor-pointer"
            >
              <AnimatePresence mode="wait">
                {islandState === 'expanded-notification' && globalNotification ? (() => {
                  const nt = getNotificationType(globalNotification.title);
                  return (
                    <motion.div
                      id="island_notification_widget"
                      key="notification"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center gap-2.5 w-full h-full text-left"
                    >
                      <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center text-xs shrink-0 shadow-sm font-sans select-none overflow-hidden ${nt.circleClass}`}>
                        {nt.symbol}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[8.5px] font-black uppercase tracking-wider leading-none" style={{ color: nt.color }}>
                          {nt.appName}
                        </p>
                        <p className="text-[10px] font-bold text-white truncate mt-1 leading-tight">{globalNotification.body}</p>
                      </div>
                    </motion.div>
                  );
                })() : islandState === 'expanded-delivery' && activeDelivery ? (
                  <motion.div
                    id="island_delivery_widget"
                    key="delivery"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col justify-center w-full h-full text-left font-sans pr-1"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[7.5px] uppercase tracking-widest text-[#00C37A] font-black font-mono">Real-Time Dispatch</span>
                      <span className="text-[8.5px] text-amber-400 font-extrabold font-mono">{activeDelivery.progress}%</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] mt-0.5 font-bold">
                      <span className="truncate max-w-[130px] text-slate-100">{activeDelivery.itemName}</span>
                      <span className="text-zinc-400 text-[8px] font-mono shrink-0">{activeDelivery.status}</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1 rounded-full mt-1 overflow-hidden">
                      <div className="bg-[#00C37A] h-full transition-all duration-300" style={{ width: `${activeDelivery.progress}%` }}></div>
                    </div>
                  </motion.div>
                ) : islandState === 'expanded-music' && activeSong ? (
                  <motion.div 
                    id="island_music_widget"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between w-full h-full text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${activeSong.coverGradient} flex items-center justify-center text-white shrink-0`}>
                        <Radio className="w-4 h-4 text-white/70" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold truncate text-white leading-tight">{activeSong.title}</p>
                        <p className="text-[8px] text-zinc-400 truncate mt-0.5 leading-none">{activeSong.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button 
                        id="island_music_control_btn"
                        onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }} 
                        className="p-1 hover:bg-zinc-850 rounded-full cursor-pointer focus:outline-none"
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                      </button>
                      {/* Interactive voice spectrum animation lines */}
                      <div className="flex gap-0.5 items-end h-3 shrink-0">
                        <span className="w-0.5 h-2 bg-rose-400 rounded-full animate-bounce"></span>
                        <span className="w-0.5 h-3 bg-rose-450 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                        <span className="w-0.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.25s]"></span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    id="island_collapsed_widget"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-between items-center w-full"
                  >
                    {/* Collapsed small capsule components */}
                    {activeDelivery ? (
                      <div className="flex items-center justify-between w-full h-full text-[9px] font-mono select-none px-0.5">
                        <span className="text-amber-400 font-bold">&#128666; Trip</span>
                        <span className="text-emerald-400 font-extrabold">{activeDelivery.progress}%</span>
                      </div>
                    ) : (
                      <>
                        {isPlaying ? (
                          <div className="flex justify-between items-center w-full">
                            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm animate-pulse animate-duration-1000"></span>
                            <div className="flex gap-0.5 items-end h-2">
                              <span className="w-0.5 h-2.5 bg-emerald-400 rounded-full animate-bounce"></span>
                              <span className="w-0.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-between px-1.5">
                            {/* Realistic camera lens and front-facing sensors, static, premium and blending into the deep black background */}
                            <div className="w-2.5 h-2.5 rounded-full bg-[#0d0d0d] border border-zinc-900/80 shadow-inner shrink-0" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[#050505] shrink-0" />
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Core Embedded Operating System Screen Area */}
          <div className="flex-1 w-full pt-12 relative overflow-hidden flex flex-col justify-between" id="active_app_viewport">
            {children}

            {/* Overlay Multiple Active Floating Banners Stacking Simultaneously */}
            <div className="absolute top-1.5 inset-x-2.5 gap-2 flex flex-col items-center z-[100] pointer-events-none">
              <AnimatePresence>
                {notifBanners.map((notif) => {
                  const nt = getNotificationType(notif.title);
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: -50, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      className="w-[98%] bg-black/95 border border-zinc-850/95 rounded-2xl p-2.5 px-3 shadow-[0_10px_25px_rgba(0,0,0,0.9)] flex items-center gap-3 pointer-events-auto cursor-pointer"
                      onClick={() => {
                        // Dismiss this specific banner on tap
                        setNotifBanners(prev => prev.filter(n => n.id !== notif.id));
                      }}
                    >
                      <div className={`w-8 h-8 rounded-full font-black flex items-center justify-center text-xs shrink-0 select-none overflow-hidden ${nt.circleClass}`}>
                        {nt.symbol}
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="text-[8px] font-black uppercase tracking-widest leading-none m-0" style={{ color: nt.color }}>
                          {nt.appName}
                        </p>
                        <p className="text-[10px] font-bold text-white truncate mt-1 leading-tight m-0">{notif.body}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Swipe Indicator Home Strip Capsule */}
          {activeApp !== null && (
            <div 
              id="home_indicator_trigger" 
              onMouseDown={() => {
                const timer = setTimeout(() => {
                  onHomeLongPress();
                }, 600);
                (window as any)._homeTimer = timer;
              }}
              onMouseUp={() => {
                clearTimeout((window as any)._homeTimer);
              }}
              onTouchStart={() => {
                const timer = setTimeout(() => {
                  onHomeLongPress();
                }, 600);
                (window as any)._homeTimer = timer;
              }}
              onTouchEnd={() => {
                clearTimeout((window as any)._homeTimer);
              }}
              onClick={() => {
                onHomeClick();
              }}
              className="absolute bottom-1.5 inset-x-0 h-6 flex items-center justify-center z-50 cursor-pointer active:scale-95 transition-all group"
              title="Hold to activate App Switcher, click to exit"
            >
              {/* iOS Home Indicator Bar */}
              <div className="w-32 h-1.5 bg-white rounded-full group-hover:bg-zinc-200/90 shadow-xl transition-colors duration-250"></div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
