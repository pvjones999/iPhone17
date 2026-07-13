import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Layout, Smartphone, Calendar, Compass, Volume2, ShieldAlert, Sparkles, Wand2, RefreshCw, Layers, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import { AppConfig, Note, Reminder, CalendarEvent, MailMessage, ChatThread, Song, AppStoreItem } from './types';
import { INITIAL_APPS, DOCK_APPS, INITIAL_NOTES, INITIAL_REMINDERS, INITIAL_EVENTS, INITIAL_MAILS, INITIAL_CHATS, INITIAL_SONGS, INITIAL_STORE_ITEMS } from './data';
import { DeviceFrame } from './components/DeviceFrame';
import { HomeScreen } from './components/HomeScreen';
import { AppScreens } from './components/AppScreens';

export default function App() {
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [wallpaper, setWallpaper] = useState(() => localStorage.getItem('ios_wallpaper') || 'linear-gradient(45deg, #d1fae5 0%, #bfdbfe 50%, #fef3c7 100%)');
  
  // Profile information states
  const [firstName, setFirstName] = useState(() => localStorage.getItem('ios_firstName') || 'Edward');
  const [lastName, setLastName] = useState(() => localStorage.getItem('ios_lastName') || 'Azubuike');

  // Detached Global System Time drives all clocks and ledger logs
  const [systemTime, setSystemTime] = useState<Date>(() => {
    const saved = localStorage.getItem('ios_system_time');
    return saved ? new Date(saved) : new Date('2026-05-24T17:59:48Z');
  });

  // Global Notification Block (drops dynamically from the Dynamic Island)
  const [globalNotification, setGlobalNotification] = useState<{ title: string; body: string } | null>(null);

  // App Switchers (Global open apps sessions array)
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  // App data states (for in-memory persistence of creations)
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('ios_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('ios_reminders');
    return saved ? JSON.parse(saved) : INITIAL_REMINDERS;
  });
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [mails, setMails] = useState<MailMessage[]>(() => {
    const saved = localStorage.getItem('ios_mails');
    return saved ? JSON.parse(saved) : INITIAL_MAILS;
  });
  
  useEffect(() => {
    localStorage.setItem('ios_mails', JSON.stringify(mails));
  }, [mails]);

  useEffect(() => {
    const handleSendMail = (e: Event) => {
      const customEvent = e as CustomEvent<{ 
        sender: string; 
        senderEmail?: string;
        senderPhoto?: string;
        toName?: string;
        toEmail?: string;
        subject: string; 
        preview: string; 
        body: string;
        isSent?: boolean;
        thread?: any[];
      }>;
      if (!customEvent.detail) return;
      const { sender, senderEmail, senderPhoto, toName, toEmail, subject, preview, body, isSent, thread } = customEvent.detail;
      const newMail: MailMessage = {
        id: 'mail_dyn_' + Date.now(),
        sender,
        senderEmail,
        senderPhoto,
        toName,
        toEmail,
        subject,
        preview,
        body,
        time: systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        isSent,
        thread: thread || []
      };
      setMails(prev => [newMail, ...prev]);
      triggerNotification("Mail Notification", `${sender} sent you a mail`);
    };

    window.addEventListener('send_virtual_mail', handleSendMail);
    return () => window.removeEventListener('send_virtual_mail', handleSendMail);
  }, []);

  const [chats, setChats] = useState<ChatThread[]>(INITIAL_CHATS);
  
  // Media states
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('ios_songs');
    return saved ? JSON.parse(saved) : INITIAL_SONGS;
  });
  const [activeSong, setActiveSong] = useState<Song | null>(() => {
    return songs[0] || INITIAL_SONGS[0];
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(12);

  // Home Screen Layout Pages (persisted reordering)
  const [homePages, setHomePages] = useState<(string | null)[][]>(() => {
    const saved = localStorage.getItem('ios_home_pages');
    let loaded: (string | null)[][] | null = null;
    if (saved) {
      try {
        loaded = JSON.parse(saved);
      } catch (e) {}
    }
    const defaultPages = [
      ['facetime', 'calendar', 'photos', 'camera', 'mail', 'notes', 'reminders', 'clock'],
      ['appletv', 'podcasts', 'appstore', 'maps', 'health', 'wallet', 'settings', 'monipay', 'polynational', 'calculator', 'shopit', 'storage']
    ];
    const initialRaw = loaded && Array.isArray(loaded) ? loaded : defaultPages;
    
    // Ensure shopit and storage exist somewhere across pages, otherwise place them
    const hasShopit = initialRaw.some(page => page.includes('shopit'));
    const hasStorage = initialRaw.some(page => page.includes('storage'));
    
    const normalized = initialRaw.map(page => {
      const padded = [...page];
      while (padded.length < 16) {
        padded.push(null);
      }
      return padded.slice(0, 16);
    });

    if (!hasShopit) {
      let placed = false;
      for (let pIdx = 0; pIdx < normalized.length; pIdx++) {
        const nullIdx = normalized[pIdx].indexOf(null);
        if (nullIdx !== -1) {
          normalized[pIdx][nullIdx] = 'shopit';
          placed = true;
          break;
        }
      }
      if (!placed) {
        const newPage = Array(16).fill(null);
        newPage[0] = 'shopit';
        normalized.push(newPage);
      }
    }

    if (!hasStorage) {
      let placed = false;
      for (let pIdx = 0; pIdx < normalized.length; pIdx++) {
        const nullIdx = normalized[pIdx].indexOf(null);
        if (nullIdx !== -1) {
          normalized[pIdx][nullIdx] = 'storage';
          placed = true;
          break;
        }
      }
      if (!placed) {
        const newPage = Array(16).fill(null);
        newPage[0] = 'storage';
        normalized.push(newPage);
      }
    }

    return normalized;
  });

  // App Store extra installed apps state
  const [storeItems, setStoreItems] = useState<AppStoreItem[]>(() => {
    const saved = localStorage.getItem('ios_store_items');
    return saved ? JSON.parse(saved) : INITIAL_STORE_ITEMS;
  });

  // Telemetry logs
  const [logs, setLogs] = useState<string[]>([
    'System initialization successful.',
    'A19 Bionic graphics pipeline: online.',
    'Ready for user haptic interaction.'
  ]);

  const addLog = (message: string) => {
    const time = systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [`[${time}] ${message}`, ...prev.slice(0, 5)]);
  };

  // Sync state changes to localstorage
  useEffect(() => {
    localStorage.setItem('ios_firstName', firstName);
  }, [firstName]);

  useEffect(() => {
    localStorage.setItem('ios_lastName', lastName);
  }, [lastName]);

  useEffect(() => {
    localStorage.setItem('ios_wallpaper', wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    localStorage.setItem('ios_system_time', systemTime.toISOString());
  }, [systemTime]);

  useEffect(() => {
    localStorage.setItem('ios_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('ios_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('ios_songs', JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem('ios_home_pages', JSON.stringify(homePages));
  }, [homePages]);

  useEffect(() => {
    localStorage.setItem('ios_store_items', JSON.stringify(storeItems));
  }, [storeItems]);

  // Tick the detached central system time forward naturally 1s at a time
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setSystemTime(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Sync newly installed store apps into home pages
  useEffect(() => {
    const installedIds = storeItems.filter(item => item.isInstalled).map(item => item.id);
    let updated = false;
    const newPages = homePages.map(page => [...page]);
    
    installedIds.forEach(id => {
      const found = homePages.some(page => page.includes(id));
      if (!found) {
        let placed = false;
        for (let pIdx = 0; pIdx < newPages.length; pIdx++) {
          const emptyIdx = newPages[pIdx].indexOf(null);
          if (emptyIdx !== -1) {
            newPages[pIdx][emptyIdx] = id;
            placed = true;
            break;
          }
        }
        if (!placed) {
          const newPage = Array(16).fill(null);
          newPage[0] = id;
          newPages.push(newPage);
        }
        updated = true;
      }
    });
    
    if (updated) {
      setHomePages(newPages);
    }
  }, [storeItems]);


  const triggerNotification = (title: string, body: string) => {
    setGlobalNotification({ title, body });
    addLog(`Notification: ${title} - ${body}`);
    window.dispatchEvent(new CustomEvent('app_trigger_custom_notification', {
      detail: { title, body }
    }));
  };

  const handleClearNotification = () => {
    setGlobalNotification(null);
  };

  const handleChangeTime = (unit: 'minute' | 'hour' | 'day' | 'week' | 'month', delta: number) => {
    setSystemTime(prev => {
      const newD = new Date(prev.getTime());
      if (unit === 'minute') newD.setMinutes(newD.getMinutes() + delta);
      if (unit === 'hour') newD.setHours(newD.getHours() + delta);
      if (unit === 'day') newD.setDate(newD.getDate() + delta);
      if (unit === 'week') newD.setDate(newD.getDate() + delta * 7);
      if (unit === 'month') newD.setMonth(newD.getMonth() + delta);
      addLog(`Time Override: Adjusted 1 ${unit} (${delta > 0 ? '+' : '-'}).`);
      return newD;
    });
  };

  // Music progress timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && activeSong) {
      timer = setInterval(() => {
        setPlaybackSeconds(sec => {
          if (sec >= activeSong.duration) {
            // Loop or skip to next song
            const nextIndex = (songs.findIndex(s => s.id === activeSong.id) + 1) % songs.length;
            const nextSongToPlay = songs[nextIndex] || songs[0];
            setActiveSong(nextSongToPlay);
            addLog(`Now playing: ${nextSongToPlay.title}`);
            return 0;
          }
          return sec + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeSong, songs]);

  // Handle switching apps
  const handleAppClick = (appId: string) => {
    const appName = [...INITIAL_APPS, ...DOCK_APPS, { id: 'calculator', name: 'Calculator' }].find(a => a.id === appId)?.name || appId;
    setActiveApp(appId);
    setOpenApps(prev => prev.includes(appId) ? prev : [...prev, appId]);
    setIsSwitcherOpen(false);
    addLog(`Launched: ${appName}`);
  };

  const handleHomeClick = () => {
    if (isSwitcherOpen) {
      setIsSwitcherOpen(false);
      return;
    }
    if (activeApp) {
      const appName = [...INITIAL_APPS, ...DOCK_APPS].find(a => a.id === activeApp)?.name || activeApp;
      addLog(`Suspended session: ${appName}`);
    }
    setActiveApp(null);
  };

  // Extract installed extras that should render on home grid
  const installedExtraApps = storeItems.filter(item => item.isInstalled);

  return (
    <div id="simulator_desktop_backdrop" className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      
      {/* Decorative ambient blurred backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-1%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Responsive outer grid layout */}
      <div className="max-w-7xl mx-auto w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 py-6 items-center">
        
        {/* Left Side: Desktop presentation card & shortcut actions panel */}
        <div className="lg:col-span-4 flex flex-col gap-5 text-left h-full justify-center" id="desktop_presentation_panel">
          <div className="space-y-2">
            <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full inline-block border border-indigo-500/30 font-mono tracking-wider animate-pulse uppercase">
              Apple Concept Simulator
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight leading-none">iPhone 17 Interface</h1>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              An interactive web replication of the upcoming iOS design language. Experience a live running UTC clock, widgets, interactive standard applications, and a live App Store that lets you "GET" apps and watch them load dynamically into the home screen grid in real-time.
            </p>
          </div>

          {/* Quick Hardware Telemetry specs */}
          <div className="bg-slate-900/65 border border-slate-800/80 p-4 rounded-3xl space-y-3" id="hardware_telemetry_specs">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Cpu className="w-4 h-4 text-emerald-400" /> Device Telemetry
            </h3>
            
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
              <div className="p-2 bg-slate-950/40 rounded-xl">
                <span className="text-slate-550 block">CHIPSET</span>
                <span className="font-bold text-slate-200">Apple A19 Bionic</span>
              </div>
              <div className="p-2 bg-slate-950/40 rounded-xl">
                <span className="text-slate-550 block">SYSTEM DISPLAY</span>
                <span className="font-bold text-slate-200">6.1" OLED 120Hz</span>
              </div>
              <div className="p-2 bg-slate-950/40 rounded-xl">
                <span className="text-slate-550 block">WEATHER LOC</span>
                <span className="font-bold text-slate-200">Yonkers (59°C)</span>
              </div>
              <div className="p-2 bg-slate-950/40 rounded-xl">
                <span className="text-slate-550 block">BATTERY STATE</span>
                <span className="font-bold text-emerald-400">100% Charged</span>
              </div>
            </div>
          </div>

          {/* Interactive shortcuts button bar */}
          <div className="space-y-2" id="shortcut_actions_panel">
            <p className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Quick Actions</p>
            <div className="flex flex-wrap gap-2">
              <button 
                id="action_btn_open_appstore"
                onClick={() => { handleAppClick('appstore'); }}
                className="text-xs bg-slate-900 hover:bg-indigo-600 border border-slate-800 text-slate-200 font-semibold py-2 px-3.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-indigo-500/20 active:scale-95"
              >
                <Layers className="w-3.5 h-3.5" /> App Store
              </button>
              <button 
                id="action_btn_open_settings"
                onClick={() => { handleAppClick('settings'); }}
                className="text-xs bg-slate-900 hover:bg-emerald-600 border border-slate-800 text-slate-200 font-semibold py-2 px-3.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm hover:shadow-emerald-500/20 active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Wallpaper Settings
              </button>
              <button 
                id="action_btn_toggle_multitasking"
                onClick={() => { setIsSwitcherOpen(!isSwitcherOpen); }}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 border border-indigo-500/30 text-white font-bold py-2 px-3.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Layers className="w-3.5 h-3.5 text-[#00C37A]" /> Multitasking (Switcher)
              </button>
            </div>
          </div>
        </div>

        {/* Center Screen: The physical iPhone Bezel & simulation screen */}
        <div className="lg:col-span-5 flex justify-center py-2" id="iphone_frame_container">
          <DeviceFrame 
            activeApp={activeApp} 
            onHomeClick={handleHomeClick} 
            onHomeLongPress={() => {
              setIsSwitcherOpen(true);
              addLog("Switcher triggered via homeindicator longpress.");
            }}
            wallpaper={wallpaper}
            activeSong={activeSong}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            systemTime={systemTime}
            globalNotification={globalNotification}
            onClearNotification={handleClearNotification}
          >
            <AnimatePresence mode="wait">
              {isSwitcherOpen ? (
                <motion.div
                  id="rendered_switcher_view"
                  key="switcher"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  className="w-full h-full"
                >
                  <div id="app_switcher_overlay" className="flex flex-col h-full bg-zinc-950 text-white font-sans p-4 justify-between select-none">
                    
                    {/* Switcher Header */}
                    <div className="text-center pt-2 shrink-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#00C37A]">App Switcher</p>
                      <span className="text-[8.5px] text-zinc-400">Tap a card to maximize session or click '✕' to terminate</span>
                    </div>

                    {/* Horizontal scroll grid */}
                    {openApps.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                        <Layers className="w-8 h-8 text-zinc-700 mb-2 animate-pulse" />
                        <h4 className="text-xs font-bold text-zinc-400">No Open Apps</h4>
                        <span className="text-[9px] text-zinc-650 mt-1">Ready for iOS sessions</span>
                      </div>
                    ) : (
                      <div id="switcher_cards_scroller" className="flex-1 flex items-center gap-3.5 overflow-x-auto py-4 px-1 scrollbar-none snap-x snap-mandatory">
                        {openApps.map(appId => {
                          const appConfig = [...INITIAL_APPS, ...DOCK_APPS].find(a => a.id === appId);
                          const appName = appConfig?.name || appId;
                          
                          return (
                            <div 
                              id={`switcher_card_${appId}`}
                              key={appId}
                              onClick={() => {
                                setActiveApp(appId);
                                setIsSwitcherOpen(false);
                                addLog(`Switcher: Maximized ${appName}`);
                              }}
                              className="w-[180px] h-[300px] rounded-[28px] bg-zinc-900 border border-zinc-800 shadow-2xl relative flex flex-col justify-between shrink-0 snap-center select-none active:scale-98 transition duration-200 cursor-pointer overflow-hidden p-[1px]"
                            >
                              {/* Card Header & Tiny Close Icon */}
                              <div className="p-3 bg-zinc-900 border-b border-zinc-850 flex items-center justify-between shrink-0 z-10">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className={`w-5 h-5 rounded-lg ${appConfig?.color || 'bg-zinc-700'} flex items-center justify-center text-[8.5px] font-black shrink-0`}>
                                    {appName[0].toUpperCase()}
                                  </div>
                                  <span className="text-[9.5px] font-extrabold truncate text-zinc-100">{appName}</span>
                                </div>

                                <button
                                  id={`switcher_force_close_${appId}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenApps(prev => prev.filter(id => id !== appId));
                                    if (activeApp === appId) {
                                      setActiveApp(null);
                                    }
                                    addLog(`Switcher: Terminated ${appName}`);
                                  }}
                                  className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30 flex items-center justify-center shadow-md active:scale-95 cursor-pointer z-50 text-[10px] font-black hover:bg-rose-500 hover:text-white"
                                  title={`Terminate ${appName}`}
                                >
                                  ✕
                                </button>
                              </div>

                              {/* Preview Card Area */}
                              <div className="flex-1 bg-zinc-950/60 m-2 rounded-[18px] flex flex-col justify-center items-center text-center p-3 border border-zinc-850 relative">
                                <div className="space-y-1.5 animate-fadeIn">
                                  <span className="text-[8px] uppercase tracking-widest font-black text-[#00C37A] font-mono">Session Live</span>
                                  <p className="text-[11px] font-extrabold text-[#00C37A]">{appName}</p>
                                  <span className="text-[8px] opacity-40 block font-mono">Sim. Background Port</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Switcher Back to Home btn */}
                    <div className="pb-1 text-center shrink-0">
                      <button
                        id="switcher_close_btn_home"
                        onClick={() => setIsSwitcherOpen(false)}
                        className="py-1.5 px-5 bg-zinc-900 hover:bg-opacity-80 text-zinc-350 font-black text-[9px] uppercase tracking-widest rounded-xl border border-zinc-800 active:scale-95"
                      >
                        Close Switcher
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : activeApp === null ? (
                <motion.div
                  id="rendered_homescreen_view"
                  key="home"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.22 }}
                  className="w-full h-full"
                >
                  <HomeScreen 
                    onAppClick={handleAppClick}
                    installedExtraApps={installedExtraApps}
                    homePages={homePages}
                    setHomePages={setHomePages}
                    dockApps={DOCK_APPS}
                  />
                </motion.div>
              ) : (
                <motion.div
                  id="rendered_appscreen_view"
                  key={activeApp}
                  initial={{ opacity: 0, y: 100, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100, scale: 0.9 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className="w-full h-full overflow-hidden"
                >
                  <AppScreens 
                    appId={activeApp} 
                    notes={notes}
                    setNotes={setNotes}
                    reminders={reminders}
                    setReminders={setReminders}
                    events={events}
                    setEvents={setEvents}
                    mails={mails}
                    setMails={setMails}
                    chats={chats}
                    setChats={setChats}
                    songs={songs}
                    setSongs={setSongs}
                    activeSong={activeSong}
                    setActiveSong={setActiveSong}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    storeItems={storeItems}
                    setStoreItems={setStoreItems}
                    wallpaper={wallpaper}
                    setWallpaper={setWallpaper}
                    systemTime={systemTime}
                    setSystemTime={setSystemTime}
                    onTriggerNotification={triggerNotification}
                    addLog={addLog}
                    onChangeTime={handleChangeTime}
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </DeviceFrame>
        </div>

        {/* Right Side: Interactive console logger & how-to instructions */}
        <div className="lg:col-span-3 h-full flex flex-col justify-center gap-5 text-left" id="telemetry_logs_panel">
          
          <div className="bg-slate-900/65 border border-slate-800/80 p-4.5 rounded-3xl space-y-3.5">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Wand2 className="w-4 h-4 text-bright-orange text-amber-400" /> Interactive Guide
            </h3>
            <ul className="space-y-2 text-[11px] text-slate-400 list-none leading-relaxed">
              <li className="flex gap-2 items-start">
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Click **FaceTime** or **Camera** to test lens camera simulations</span>
              </li>
              <li className="flex gap-2 items-start">
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Use **Notes**, **Reminders** & **Calendar** to create custom events loaded directly in real time</span>
              </li>
              <li className="flex gap-2 items-start">
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Go to **App Store**, click **GET** to see custom apps render onto the home grid dynamically</span>
              </li>
              <li className="flex gap-2 items-start">
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Launch **Settings** to swap wallpaper themes or rename your physical device</span>
              </li>
              <li className="flex gap-2 items-start">
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>Click the glowing **Dynamic Island** or the white **Home Bar Indicator** at the bottom anytime</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-800/80 space-y-2 font-mono text-[9px]" id="system_logs_widget">
            <p className="text-[10px] font-bold text-slate-350 tracking-wider font-sans uppercase mb-1">Interactive Log Stream</p>
            <div className="space-y-1 text-slate-450 h-32 overflow-y-auto" id="log_messages_stream">
              {logs.map((log, index) => (
                <div key={index} className="truncate"><span className="text-slate-500 font-bold">&gt;</span> {log}</div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Humble footer */}
      <footer className="text-center py-4 border-t border-slate-900 bg-slate-950/80 shrink-0 z-10">
        <p className="text-[10px] text-slate-500 tracking-wide font-medium">iPhone 17 Web Simulator • Powered by React & Tailwind 4 • Designed and Built in AI Studio</p>
      </footer>
    </div>
  );
}
