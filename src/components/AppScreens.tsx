import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, CheckCircle2, Circle, AlertCircle, Sparkles, Send, Play, Pause, SkipForward, SkipBack, Search, RefreshCw, Star, ArrowDown, MapPin, Navigation, MapPinOff, Sun, Eye, Info, Chrome, Globe, Compass, Mail, Heart, Settings, ShieldCheck, HelpCircle, HardDrive, Cpu, Radio, Video, Clock,
  MoreVertical, Reply, Smile, Forward, Check, Edit2, ChevronDown, ChevronLeft,
  Phone, User, Voicemail, Grid, Mic, MicOff, Volume2, X, ChevronRight
} from 'lucide-react';
import { Note, Reminder, CalendarEvent, MailMessage, MailMessageThreadItem, ChatThread, Song, AppStoreItem } from '../types';
import { MoniPayApp } from './MoniPayApp';
import { PolynationalApp } from './PolynationalApp';

interface AppScreensProps {
  appId: string;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  mails: MailMessage[];
  setMails: React.Dispatch<React.SetStateAction<MailMessage[]>>;
  chats: ChatThread[];
  setChats: React.Dispatch<React.SetStateAction<ChatThread[]>>;
  songs: Song[];
  setSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  activeSong: Song | null;
  setActiveSong: (song: Song | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  storeItems: AppStoreItem[];
  setStoreItems: React.Dispatch<React.SetStateAction<AppStoreItem[]>>;
  wallpaper: string;
  setWallpaper: (wp: string) => void;
  systemTime: Date;
  setSystemTime: React.Dispatch<React.SetStateAction<Date>>;
  onTriggerNotification: (title: string, body: string) => void;
  addLog: (msg: string) => void;
  onChangeTime: (unit: 'minute' | 'hour' | 'day' | 'week' | 'month', delta: number) => void;
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  setActiveApp: (appId: string | null) => void;
  pendingPayment: any | null;
  setPendingPayment: (payment: any | null) => void;
}

export const AppScreens: React.FC<AppScreensProps> = ({
  appId,
  notes,
  setNotes,
  reminders,
  setReminders,
  events,
  setEvents,
  mails,
  setMails,
  chats,
  setChats,
  songs,
  setSongs,
  activeSong,
  setActiveSong,
  isPlaying,
  setIsPlaying,
  storeItems,
  setStoreItems,
  wallpaper,
  setWallpaper,
  systemTime,
  setSystemTime,
  onTriggerNotification,
  addLog,
  onChangeTime,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  setActiveApp,
  pendingPayment,
  setPendingPayment
}) => {
  // NOTES STATE
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // REMINDERS STATE
  const [newReminderText, setNewReminderText] = useState('');
  const [reminderFilter, setReminderFilter] = useState<'all' | 'today' | 'scheduled' | 'flagged'>('all');

  // CALENDAR STATE
  const [calendarDay, setCalendarDay] = useState(6);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('02:00 PM - 03:00 PM');
  const [newEventLoc, setNewEventLoc] = useState('');

  // MAIL STATE
  const [selectedMail, setSelectedMail] = useState<MailMessage | null>(null);
  const [myEmail, setMyEmail] = useState(() => localStorage.getItem('mail_user_email') || 'princeetim37@gmail.com');
  const [myName, setMyName] = useState(() => localStorage.getItem('mail_user_name') || 'Edward Azubuike');
  const [mailTheme, setMailTheme] = useState(() => localStorage.getItem('mail_user_theme') || 'dark');
  const [isComposingMail, setIsComposingMail] = useState(false);
  const [isMailSettingsOpen, setIsMailSettingsOpen] = useState(false);

  // Compose Form Fields
  const [composeTo, setComposeTo] = useState('');
  const [composeToName, setComposeToName] = useState('');
  const [composeToProfile, setComposeToProfile] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  // Reply Simulator Fields
  const [simSenderName, setSimSenderName] = useState('Sarah Jenkins');
  const [simSenderEmail, setSimSenderEmail] = useState('sarah.j@gmail.com');
  const [simSenderProfile, setSimSenderProfile] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100');
  const [simSubject, setSimSubject] = useState('');
  const [simBody, setSimBody] = useState('');
  const [simTargetMailId, setSimTargetMailId] = useState<string>('new'); // 'new' or specific mail id

  // Thread conversation quick reply body
  const [replyBody, setReplyBody] = useState('');
  const [isConversationReplyOpen, setIsConversationReplyOpen] = useState(false);

  useEffect(() => {
    if (simTargetMailId !== 'new' && !mails.some(m => m.id === simTargetMailId)) {
      setSimTargetMailId('new');
    }
  }, [mails, simTargetMailId]);

  // CHAT STATE
  const [selectedChat, setSelectedChat] = useState<ChatThread | null>(chats[0] || null);
  const [chatInput, setChatInput] = useState('');

  // MUSIC STATE
  const [playbackSeconds, setPlaybackSeconds] = useState(12);
  const [isMusicAdminOpen, setIsMusicAdminOpen] = useState(false);
  const [newTrackName, setNewTrackName] = useState('');
  const [newTrackArtist, setNewTrackArtist] = useState('');
  const [newTrackDurationVal, setNewTrackDurationVal] = useState('3:45');

  // ==========================================
  // SHOPIT APP LOGIC & STATES
  // ==========================================
  const [products, setProducts] = useState<any[]>(() => {
    const saved = localStorage.getItem('shopit_products_v2');
    if (saved) return JSON.parse(saved);
    const defaultProds = [
      {
        id: 'p_cl1',
        name: 'Vintage Oversized Fleece Hoodie',
        usdPrice: 45,
        category: 'Clothes',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80',
        stock: 25,
        description: 'Ultra-soft drop shoulder heavyweight hoodie crafted from 100% organic cotton. Features custom distressing along the cuffs and a double-lined premium comfort hood.',
        rating: 4.8
      },
      {
        id: 'p_cl2',
        name: 'Italian Merino Wool Overcoat',
        usdPrice: 180,
        category: 'Clothes',
        image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
        stock: 8,
        description: 'Expertly tailored double-breasted coat made of luxurious Italian merino wool. Provides superior insulation and unstructured drape for sharp, versatile modern style.',
        rating: 4.9
      },
      {
        id: 'p_el1',
        name: 'iPhone 17 Titanium Case Pack',
        usdPrice: 59,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?w=400&q=80',
        stock: 12,
        description: 'Military-grade drop impact protection sheath machined from high-performance aerospace titanium alloy. Fully Magsafe compatible with tactile micro-knurled side buttons.',
        rating: 4.7
      },
      {
        id: 'p_el2',
        name: 'Studio ANC AirPods Headset',
        usdPrice: 549,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
        stock: 6,
        description: 'High-fidelity acoustic audio array featuring masterclass hybrid Adaptive Noise Cancellation (ANC), immersive 3D spatial dynamic tracking, and stunning brushed titanium ear-cups.',
        rating: 4.9
      },
      {
        id: 'p_car1',
        name: 'Level 2 Smart EV Rapid Charger',
        usdPrice: 799,
        category: 'Cars',
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&q=80',
        stock: 4,
        description: 'Universal high-speed electric vehicle charging terminal providing up to 48A of power. Features dynamic app control, auto-schedule utility off-peak pricing, and weatherproof construct.',
        rating: 4.6
      },
      {
        id: 'p_car2',
        name: 'Smart Dashboard HUD Projector',
        usdPrice: 120,
        category: 'Cars',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80',
        stock: 14,
        description: 'Ultra-bright windshield display projector that syncs with standard vehicle OBD2 interface and mobile maps. Tracks speed, RPM, telemetry curves, and real-time radar route alerts.',
        rating: 4.5
      },
      {
        id: 'p_fd1',
        name: 'Truffle Glazed Wagyu Burger',
        usdPrice: 24,
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
        stock: 50,
        description: 'Single-source A5 Japanese Wagyu beef patty seared to perfection. Glazed in black Burgundy winter truffle reduction, melted gruyere cheese, and fresh toasted brioche bun.',
        rating: 4.9
      },
      {
        id: 'p_fd2',
        name: 'Artisanal Caviar Tasting Board',
        usdPrice: 155,
        category: 'Food',
        image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=400&q=80',
        stock: 15,
        description: 'Premium curation of sustainably sourced Osetra caviar pearls. Accompanied by traditional cold-refracted bone spoons, creme fraiche, and freshly-baked French blini bites.',
        rating: 4.8
      },
      {
        id: 'p_bt1',
        name: 'Organic Bulgarian Rose Face Serum',
        usdPrice: 38,
        category: 'Beauty',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
        stock: 22,
        description: 'A radiant skin-barrier restorative solution infused with cold-pressed rose floral extract. Rich in antioxidants and vegan squalane to deeply hydrate and visibly boost morning glow.',
        rating: 4.7
      },
      {
        id: 'p_bt2',
        name: 'Lux Velvet Matte Scarlet Lipstick',
        usdPrice: 30,
        category: 'Beauty',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80',
        stock: 35,
        description: 'Long-wearing premium pigment lipstick formulated with organic jojoba esters and cocoa liposome buffers. Delivers a feather-light velvety finish that seals in hydration for 12 hours.',
        rating: 4.8
      }
    ];
    localStorage.setItem('shopit_products_v2', JSON.stringify(defaultProds));
    return defaultProds;
  });

  const [cart, setCart] = useState<any[]>(() => {
    const saved = localStorage.getItem('shopit_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shopit_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleCartSync = () => {
      const saved = localStorage.getItem('shopit_cart');
      if (saved) setCart(JSON.parse(saved));
    };
    window.addEventListener('shopit_cart_updated', handleCartSync);
    return () => window.removeEventListener('shopit_cart_updated', handleCartSync);
  }, []);

  const [shopitTab, setShopitTab] = useState<'store' | 'admin' | 'settings'>('store');
  const [shopitCategory, setShopitCategory] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<string | null>(null);
  const [isMusicDeleteOpen, setIsMusicDeleteOpen] = useState(false);
  const [confirmDeleteMusicId, setConfirmDeleteMusicId] = useState<string | null>(null);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcEquation, setCalcEquation] = useState('');
  const [calcStoredValue, setCalcStoredValue] = useState<number | null>(null);
  const [calcPendingOp, setCalcPendingOp] = useState<string | null>(null);
  const [calcShouldReset, setCalcShouldReset] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'init' | 'confirm' | 'processing' | 'receipt'>('init');
  const [checkoutCountdown, setCheckoutCountdown] = useState(3);
  const [checkoutReceiptId, setCheckoutReceiptId] = useState('');
  const [checkoutCardNum, setCheckoutCardNum] = useState('');
  const [shopitMarket, setShopitMarket] = useState<'local' | 'international'>('international');
  const [shopitTheme, setShopitTheme] = useState<string>(() => {
    return localStorage.getItem('shopit_theme') || 'cosmic';
  });

  const [savedCards, setSavedCards] = useState<any[]>(() => {
    const saved = localStorage.getItem('shopit_stored_cards');
    if (saved) return JSON.parse(saved);
    const defaults = [
      { id: 'card_idx_1', name: 'MoniPay Naira (₦)', number: '4352 9012 3345 6178', type: 'monipay', holder: 'Edward Azubuike' },
      { id: 'card_idx_2', name: 'Swiss Elite World (USD)', number: '5543 9012 5543 1892', type: 'polynational', holder: 'Edward Azubuike' }
    ];
    localStorage.setItem('shopit_stored_cards', JSON.stringify(defaults));
    return defaults;
  });

  useEffect(() => {
    localStorage.setItem('shopit_theme', shopitTheme);
  }, [shopitTheme]);

  useEffect(() => {
    localStorage.setItem('shopit_stored_cards', JSON.stringify(savedCards));
  }, [savedCards]);
  
  // Custom Product creation states
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Clothes');
  const [newProdStock, setNewProdStock] = useState('10');
  const [newProdImg, setNewProdImg] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdRating, setNewProdRating] = useState('4.8');
  const [newProdCurrency, setNewProdCurrency] = useState<'USD' | 'NGN'>('USD');

  // ==========================================
  // STORAGE APP LOGIC & STATES
  // ==========================================
  const [storageTheme, setStorageTheme] = useState<string>(() => {
    return localStorage.getItem('storage_theme') || 'slate';
  });
  const [isStorageSettingsOpen, setIsStorageSettingsOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('storage_theme', storageTheme);
  }, [storageTheme]);
  const [inventory, setInventory] = useState<any[]>(() => {
    const saved = localStorage.getItem('storage_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('storage_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    const handleInvSync = () => {
      const saved = localStorage.getItem('storage_inventory');
      if (saved) setInventory(JSON.parse(saved));
    };
    window.addEventListener('storage_inventory_updated', handleInvSync);
    return () => window.removeEventListener('storage_inventory_updated', handleInvSync);
  }, []);

  const [inventorySearch, setInventorySearch] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryLat, setDeliveryLat] = useState('6.5244');
  const [deliveryLng, setDeliveryLng] = useState('3.3792');
  const [deliveryItemId, setDeliveryItemId] = useState('');
  const [deliveryQty, setDeliveryQty] = useState('1');
  const [activeDeliveryState, setActiveDeliveryState] = useState<any | null>(null);

  useEffect(() => {
    const handleInterval = () => {
      const saved = localStorage.getItem('storage_active_delivery');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.active) {
            setActiveDeliveryState(parsed);
            return;
          }
        } catch (e) {}
      }
      setActiveDeliveryState(null);
    };

    handleInterval();
    const timer = setInterval(handleInterval, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddTrackSubmit = () => {
    if (!newTrackName.trim() || !newTrackArtist.trim() || !newTrackDurationVal.trim()) {
      alert("Please fill in all track fields!");
      return;
    }
    
    // Parse duration like "3:45"
    const parts = newTrackDurationVal.trim().split(":");
    let finalSeconds = 225;
    if (parts.length === 2) {
      const min = parseInt(parts[0], 10);
      const sec = parseInt(parts[1], 10);
      if (!isNaN(min) && !isNaN(sec)) {
        finalSeconds = min * 60 + sec;
      }
    } else {
      const single = parseInt(newTrackDurationVal.trim(), 10);
      if (!isNaN(single)) {
        finalSeconds = single;
      }
    }

    const newSong: Song = {
      id: 'song_' + Date.now(),
      title: newTrackName,
      artist: newTrackArtist,
      duration: finalSeconds,
      album: 'Custom Single',
      coverGradient: 'from-fuchsia-500 to-rose-600'
    };

    const updatedSongs = [...songs, newSong];
    setSongs(updatedSongs);
    localStorage.setItem('ios_songs', JSON.stringify(updatedSongs));
    
    addLog(`Music: Added new track "${newTrackName}" by ${newTrackArtist}`);
    onTriggerNotification("Music Player", `Song "${newTrackName}" added to offline catalog.`);
    
    setNewTrackName('');
    setNewTrackArtist('');
    setNewTrackDurationVal('3:45');
    setIsMusicAdminOpen(false);
  };

  // ==========================================
  // PHONE APP STATES & LOGIC
  // ==========================================
  const [phoneActiveTab, setPhoneActiveTab] = useState<'favorites' | 'recents' | 'contacts' | 'keypad' | 'voicemail'>(() => {
    return (localStorage.getItem('phone_active_tab') as any) || 'contacts';
  });

  useEffect(() => {
    localStorage.setItem('phone_active_tab', phoneActiveTab);
  }, [phoneActiveTab]);

  const [contacts, setContacts] = useState<any[]>(() => {
    const saved = localStorage.getItem('ios_contacts');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'c_mom', firstName: 'Mom', lastName: '💖', phoneCountryCode: '+1', phoneNumber: '555-4309', avatarColor: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', starred: true },
      { id: 'c_sarah', firstName: 'Sarah', lastName: 'Jenkins', phoneCountryCode: '+1', phoneNumber: '(202) 225-6576', avatarColor: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', starred: true },
      { id: 'c_vanessa', firstName: 'Vanessa', lastName: '', phoneCountryCode: '+1', phoneNumber: '(515) 281-5211', avatarColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
      { id: 'c_terry', firstName: 'Terry', lastName: '', phoneCountryCode: '+1', phoneNumber: '(202) 456-1111', avatarColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
      { id: 'c_abby', firstName: 'Abby', lastName: 'Example', phoneCountryCode: '+1', phoneNumber: '(319) 627-2145', avatarColor: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)' },
      { id: 'c_adele', firstName: 'Adele', lastName: 'Example', phoneCountryCode: '+1', phoneNumber: '(319) 456-2045', avatarColor: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
      { id: 'c_andrew', firstName: 'Andrew', lastName: 'Example', phoneCountryCode: '+1', phoneNumber: '(641) 469-6220', avatarColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
      { id: 'c_emily', firstName: 'Emily', lastName: 'Example', phoneCountryCode: '+1', phoneNumber: '1 (866) 837-3145', avatarColor: 'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)' },
      { id: 'c_barbara', firstName: 'Barbara', lastName: 'Example', phoneCountryCode: '+1', phoneNumber: '(202) 555-0199', avatarColor: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('ios_contacts', JSON.stringify(contacts));
  }, [contacts]);

  const [recents, setRecents] = useState<any[]>(() => {
    const saved = localStorage.getItem('ios_call_recents');
    return saved ? JSON.parse(saved) : []; // Starts empty: "Recents set to no recents yet"
  });

  useEffect(() => {
    localStorage.setItem('ios_call_recents', JSON.stringify(recents));
  }, [recents]);

  const [recentsSegment, setRecentsSegment] = useState<'all' | 'missed'>('all');
  const [phoneSearchQuery, setPhoneSearchQuery] = useState('');
  const [dialedDigits, setDialedDigits] = useState('');
  
  // New Contact screen declarations
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactFormFirst, setContactFormFirst] = useState('');
  const [contactFormLast, setContactFormLast] = useState('');
  const [contactFormCompany, setContactFormCompany] = useState('');
  const [contactFormCountry, setContactFormCountry] = useState('+1');
  const [contactFormPhone, setContactFormPhone] = useState('');
  const [contactFormPhoto, setContactFormPhoto] = useState<string | null>(null);
  const [contactFormGradientIndex, setContactFormGradientIndex] = useState(0);

  const [selectedContactDetail, setSelectedContactDetail] = useState<any | null>(null);

  const [activeCall, setActiveCall] = useState<{
    nameOrNumber: string;
    phoneNumber: string;
    isConnected: boolean;
    durationSeconds: number;
    isMuted?: boolean;
    isSpeaker?: boolean;
  } | null>(null);

  // Connection and timing simulator
  useEffect(() => {
    if (!activeCall) return;
    
    let timer: NodeJS.Timeout;
    
    if (!activeCall.isConnected) {
      timer = setTimeout(() => {
        setActiveCall(prev => prev ? { ...prev, isConnected: true } : null);
        addLog(`Call active: Connected with ${activeCall.nameOrNumber}`);
      }, 1500);
    } else {
      timer = setInterval(() => {
        setActiveCall(prev => {
          if (!prev) return null;
          return { ...prev, durationSeconds: prev.durationSeconds + 1 };
        });
      }, 1000);
    }
    
    return () => {
      clearTimeout(timer);
      clearInterval(timer);
    };
  }, [activeCall === null, activeCall?.isConnected]);

  // APP STORE STATE
  const [storeSearch, setStoreSearch] = useState('');

  // SESSIONS & CLOCK MOCKS
  const [alarmHours, setAlarmHours] = useState('07');
  const [alarmMinutes, setAlarmMinutes] = useState('30');
  const [alarms, setAlarms] = useState([
    { id: '1', time: '07:30 AM', label: 'Morning Wakeup', enabled: true },
    { id: '2', time: '08:45 AM', label: 'Work Standup Call', enabled: false },
    { id: '3', time: '11:00 PM', label: 'Wind-down Sleep', enabled: true }
  ]);

  // SAFARI
  const [safariUrl, setSafariUrl] = useState('https://www.apple.com');
  const [safariHistory, setSafariHistory] = useState(['https://www.apple.com', 'https://ai.studio/build', 'https://github.com']);

  // HEALTH
  const [waterIntake, setWaterIntake] = useState(1200); // ml

  // WALLET MOCKS
  const [cards, setCards] = useState([
    { id: 'card_gold', name: 'Gold Prime Card', type: 'Credit', balance: '$2,485.50', number: '•••• 1285', color: 'from-amber-600 to-amber-900' },
    { id: 'card_apple', name: ' Card', type: 'Titanium', balance: '$450.12', number: '•••• 9942', color: 'from-zinc-700 to-black' },
    { id: 'card_transit', name: 'Metro Yonkers Transit', type: 'Prepaid', balance: '$34.20', number: 'SmartPass', color: 'from-cyan-600 to-blue-800' }
  ]);

  // MAPS MOCK STATE
  const [mapsQuery, setMapsQuery] = useState('');
  const [pinLocation, setPinLocation] = useState<'Yonkers Pier' | 'AI Lab Studio' | null>(null);

  // SETTINGS COMPONENT STATE
  const [simName, setSimName] = useState('Edward’s iPhone 17');
  const [batteryHealthPercentage, setBatteryHealthPercentage] = useState(100);

  // RENDERING HELPERS FOR SELECTIVE APPS

  // 1. NOTES APP
  const renderNotesApp = () => {
    const handleSaveNote = () => {
      if (!noteTitle.trim()) return;
      const newNote: Note = {
        id: 'note_' + Date.now(),
        title: noteTitle,
        content: noteContent,
        updatedAt: systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setNotes([newNote, ...notes]);
      setNoteTitle('');
      setNoteContent('');
      setIsCreatingNote(false);
      setSelectedNote(newNote);
    };

    const handleDeleteNote = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setNotes(notes.filter(n => n.id !== id));
      if (selectedNote && selectedNote.id === id) {
        setSelectedNote(null);
      }
    };

    return (
      <div className="flex flex-col h-full bg-stone-50 text-stone-900 font-sans" id="notes_app_container">
        {/* Head Bar */}
        <div className="p-4 bg-amber-50/70 backdrop-blur-md border-b border-amber-100 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-amber-900 flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Notes
          </h2>
          {!isCreatingNote && !selectedNote && (
            <button 
              id="notes_create_btn"
              onClick={() => setIsCreatingNote(true)}
              className="p-1 px-3 bg-amber-600 text-white rounded-full text-xs font-semibold hover:bg-amber-700 active:scale-95 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New Note
            </button>
          )}
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-3">
          {selectedNote ? (
            <div className="flex flex-col h-full animate-fadeIn" id="notes_viewer">
              <button 
                id="notes_back_btn"
                onClick={() => setSelectedNote(null)} 
                className="text-xs text-amber-700 font-medium mb-3 flex items-center gap-1 self-start hover:underline"
              >
                ← Back to List
              </button>
              <h3 className="text-lg font-bold text-stone-800 border-b pb-1 mb-2 leading-tight">{selectedNote.title}</h3>
              <p className="text-[10px] text-stone-400 mb-3 font-mono">Last edited: {selectedNote.updatedAt}</p>
              <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-wrap flex-1 bg-white p-3 rounded-xl border border-stone-100 shadow-sm">
                {selectedNote.content}
              </p>
            </div>
          ) : isCreatingNote ? (
            <div className="flex flex-col h-full gap-3 animate-fadeIn" id="notes_creator">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950">Compose Note</span>
                <button 
                  id="notes_cancel_btn"
                  onClick={() => setIsCreatingNote(false)} 
                  className="text-xs text-stone-400 hover:text-stone-600"
                >
                  Cancel
                </button>
              </div>
              <input 
                id="note_title_input"
                type="text" 
                placeholder="Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="w-full bg-white p-2 text-xs font-semibold rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <textarea 
                id="note_content_textarea"
                placeholder="Start typing your ideas here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                rows={10}
                className="w-full flex-1 bg-white p-2.5 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
              <button 
                id="note_save_btn"
                onClick={handleSaveNote}
                disabled={!noteTitle.trim()}
                className="w-full p-2.5 bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-sm hover:bg-amber-700 disabled:opacity-50 active:scale-98 transition-all"
              >
                Save Note
              </button>
            </div>
          ) : (
            <div className="space-y-2" id="notes_list">
              {notes.length === 0 ? (
                <div className="text-center py-10 text-stone-400 text-xs">No notes found. Create some!</div>
              ) : (
                notes.map(note => (
                  <div 
                    id={`note_item_${note.id}`}
                    key={note.id}
                    onClick={() => setSelectedNote(note)}
                    className="p-3 bg-white rounded-xl border border-stone-100 shadow-xs hover:border-amber-200 cursor-pointer active:scale-98 transition-all flex justify-between items-start gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-stone-800 truncate mb-1">{note.title}</h4>
                      <p className="text-[10px] text-stone-500 truncate">{note.content}</p>
                      <span className="text-[9px] text-stone-400 block mt-2 font-mono">{note.updatedAt}</span>
                    </div>
                    <button 
                      id={`note_delete_${note.id}`}
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="p-1 hover:bg-red-50 text-stone-300 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // 2. REMINDERS APP
  const renderRemindersApp = () => {
    const handleAddReminder = () => {
      if (!newReminderText.trim()) return;
      const newRem: Reminder = {
        id: 'rem_' + Date.now(),
        text: newReminderText,
        completed: false,
        category: reminderFilter === 'all' ? 'today' : reminderFilter,
        date: reminderFilter === 'today' ? 'Today' : undefined
      };
      setReminders([...reminders, newRem]);
      setNewReminderText('');
    };

    const toggleReminder = (id: string) => {
      setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
    };

    const deleteReminder = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setReminders(reminders.filter(r => r.id !== id));
    };

    const filteredReminders = reminders.filter(r => {
      if (reminderFilter === 'all') return true;
      return r.category === reminderFilter;
    });

    return (
      <div className="flex flex-col h-full bg-white text-zinc-900 font-sans" id="reminders_app_container">
        {/* iOS Reminders Header */}
        <div className="p-4 bg-zinc-50 border-b border-zinc-100 shrink-0">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-blue-600">Reminders</h2>
            <span className="text-xs bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full font-mono">
              {reminders.filter(r => !r.completed).length} incomplete
            </span>
          </div>

          {/* Quick Categories Bar */}
          <div className="grid grid-cols-4 gap-1.5 mt-2" id="reminders_filters">
            {(['all', 'today', 'scheduled', 'flagged'] as const).map(cat => (
              <button
                id={`reminder_filter_${cat}`}
                key={cat}
                onClick={() => setReminderFilter(cat)}
                className={`py-1.5 px-0.5 rounded-lg text-[10px] font-bold transition-all text-center ${
                  reminderFilter === cat 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <span className="capitalize">{cat}</span>
                <span className="block text-[8px] font-mono opacity-80">
                  {reminders.filter(r => cat === 'all' || r.category === cat).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Add */}
        <div className="p-3 border-b border-zinc-50 flex gap-1.5 shrink-0 bg-zinc-50/50">
          <input 
            id="new_reminder_input"
            type="text" 
            placeholder="Add a new task..."
            value={newReminderText}
            onChange={(e) => setNewReminderText(e.target.value)}
            className="flex-1 bg-white p-2 text-xs rounded-xl border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAddReminder()}
          />
          <button 
            id="new_reminder_add_btn"
            onClick={handleAddReminder}
            className="p-2 bg-blue-600 text-white rounded-xl active:scale-95 hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* List scroll */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredReminders.length === 0 ? (
            <div className="text-center py-8 text-zinc-300 text-xs">No tasks in this list</div>
          ) : (
            filteredReminders.map(rem => (
              <div 
                id={`reminder_item_${rem.id}`}
                key={rem.id}
                onClick={() => toggleReminder(rem.id)}
                className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  rem.completed 
                    ? 'bg-zinc-50/70 border-zinc-100 text-zinc-400 line-through' 
                    : 'bg-white border-zinc-100 text-zinc-800 shadow-2xs hover:border-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {rem.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-zinc-300 hover:text-blue-500 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate leading-snug">{rem.text}</p>
                    {rem.date && <p className="text-[9px] text-zinc-400 font-mono mt-0.5">{rem.date}</p>}
                  </div>
                </div>
                <button 
                  id={`reminder_delete_${rem.id}`}
                  onClick={(e) => deleteReminder(rem.id, e)}
                  className="p-1 hover:bg-red-50 text-zinc-300 hover:text-red-500 rounded ml-2 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // 3. CALENDAR APP
  const renderCalendarApp = () => {
    const handleAddEvent = () => {
      if (!newEventTitle.trim()) return;
      const newEvt: CalendarEvent = {
        id: 'evt_' + Date.now(),
        title: newEventTitle,
        time: newEventTime,
        location: newEventLoc || undefined,
        day: calendarDay
      };
      setEvents([...events, newEvt]);
      setNewEventTitle('');
      setNewEventLoc('');
    };

    const deleteEvent = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setEvents(events.filter(ev => ev.id !== id));
    };

    const dailyEvents = events.filter(e => e.day === calendarDay);

    return (
      <div className="flex flex-col h-full bg-stone-50 text-stone-900 font-sans" id="calendar_app_container">
        {/* Month Selector Header */}
        <div className="p-4 bg-red-500 text-white shrink-0">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[10px] font-bold tracking-widest uppercase">MAY 2026</h3>
            <span className="text-[10px] bg-red-600/70 py-0.5 px-2 rounded-full font-semibold">Monday</span>
          </div>
          <h2 className="text-xl font-black">Calendar</h2>
        </div>

        {/* Mini Calendar Row */}
        <div className="p-2 border-b border-stone-200 bg-white grid grid-cols-7 gap-1 shrink-0" id="calendar_days_selector">
          {[4, 5, 6, 7, 8, 9, 10].map(day => (
            <button
              id={`calendar_select_day_${day}`}
              key={day}
              onClick={() => setCalendarDay(day)}
              className={`p-1.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                calendarDay === day 
                  ? 'bg-red-500 text-white font-bold' 
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="text-[8px] opacity-75">
                {day === 4 ? 'Fri' : day === 5 ? 'Sat' : day === 6 ? 'Mon' : day === 7 ? 'Tue' : day === 8 ? 'Wed' : day === 9 ? 'Thu' : 'Fri'}
              </span>
              <span className="text-xs font-semibold">{day}</span>
            </button>
          ))}
        </div>

        {/* Add Event Form Overlay Panel */}
        <div className="bg-white p-3 border-b border-stone-200 space-y-2 shrink-0">
          <p className="text-[10px] font-bold text-stone-500 uppercase">Create event on Day {calendarDay}</p>
          <div className="grid grid-cols-1 gap-1.5">
            <input 
              id="new_event_title"
              type="text" 
              placeholder="Event Title..."
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full bg-stone-50 p-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-red-400"
            />
            <div className="grid grid-cols-2 gap-1.5">
              <input 
                id="new_event_time"
                type="text" 
                placeholder="Time (e.g. 2:00 PM)"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                className="bg-stone-50 p-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-red-400"
              />
              <input 
                id="new_event_loc"
                type="text" 
                placeholder="Location (optional)"
                value={newEventLoc}
                onChange={(e) => setNewEventLoc(e.target.value)}
                className="bg-stone-50 p-1.5 text-xs rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-red-400"
              />
            </div>
            <button 
              id="new_event_add_btn"
              onClick={handleAddEvent}
              disabled={!newEventTitle.trim()}
              className="w-full py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg shadow-xs hover:bg-red-600 disabled:opacity-50 active:scale-98 transition-all"
            >
              Add Event
            </button>
          </div>
        </div>

        {/* Events Schedule Scroll */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {dailyEvents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-stone-300 text-xs">No events today</p>
              <p className="text-[10px] text-stone-400">Enjoy some relaxing free time!</p>
            </div>
          ) : (
            dailyEvents.map(evt => (
              <div 
                id={`evt_item_${evt.id}`}
                key={evt.id}
                className="p-3 bg-white border-l-4 border-red-500 rounded-xl border border-stone-100 flex justify-between items-start"
              >
                <div>
                  <h4 className="text-xs font-bold text-stone-800 leading-snug">{evt.title}</h4>
                  <p className="text-[10px] text-stone-500 font-mono mt-1">{evt.time}</p>
                  {evt.location && (
                    <p className="text-[9px] text-stone-400 flex items-center gap-0.5 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-red-400" /> {evt.location}
                    </p>
                  )}
                </div>
                <button 
                  id={`evt_delete_${evt.id}`}
                  onClick={(e) => deleteEvent(evt.id, e)}
                  className="p-1 hover:bg-stone-100 text-stone-300 hover:text-red-500 rounded ml-2"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // 4. MAIL APP
  const renderMailApp = () => {
    // Styling themes dynamic mappings
    const mTheme = {
      light: {
        bg: 'bg-zinc-50 text-zinc-900',
        card: 'bg-white border-zinc-200 shadow-xs text-zinc-900',
        header: 'bg-[#1A73E8] text-white',
        border: 'border-zinc-200',
        input: 'bg-zinc-100 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:bg-white',
        icon: 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800',
        textMuted: 'text-zinc-500',
        textPrimary: 'text-zinc-800 font-bold',
        pill: 'bg-sky-50 text-sky-700 border border-sky-200',
        accentBg: 'bg-[#1A73E8] hover:bg-blue-600 text-white',
        isDark: false
      },
      dark: {
        bg: 'bg-[#0F141C] text-zinc-100',
        card: 'bg-[#1C222E] border-zinc-850 text-zinc-100 shadow-xs',
        header: 'bg-[#151B26] text-zinc-100 border-b border-zinc-800',
        border: 'border-zinc-800',
        input: 'bg-[#0A0E14] border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:bg-black',
        icon: 'text-zinc-400 hover:bg-zinc-800 hover:text-white',
        textMuted: 'text-zinc-400',
        textPrimary: 'text-white font-bold',
        pill: 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/40',
        accentBg: 'bg-indigo-600 hover:bg-indigo-500 text-white',
        isDark: true
      },
      glass: {
        bg: 'bg-slate-950/85 backdrop-blur-md text-slate-100',
        card: 'bg-white/5 border-white/10 text-white backdrop-blur-xs',
        header: 'bg-[#0f172a]/60 border-b border-white/15 text-slate-200',
        border: 'border-white/10',
        input: 'bg-black/40 border-white/10 text-white placeholder-slate-500 focus:bg-black/60',
        icon: 'text-slate-300 hover:bg-white/10 hover:text-white',
        textMuted: 'text-slate-400',
        textPrimary: 'text-white font-semibold',
        pill: 'bg-white/10 text-slate-200 border border-white/10',
        accentBg: 'bg-sky-500/80 hover:bg-sky-500 text-white',
        isDark: true
      },
      slate: {
        bg: 'bg-[#0B132B] text-slate-200',
        card: 'bg-[#1C2541] border-[#3A506B]/30 text-slate-100',
        header: 'bg-[#1C2541] border-b border-[#3A506B]/20 text-slate-100',
        border: 'border-[#3A506B]/20',
        input: 'bg-[#0B132B] border-[#3A506B]/40 text-slate-100 placeholder-slate-500 focus:bg-black/35',
        icon: 'text-slate-300 hover:bg-[#3A506B]/30 hover:text-white',
        textMuted: 'text-[#5BC0BE]',
        textPrimary: 'text-slate-100',
        pill: 'bg-[#5BC0BE]/10 text-[#5BC0BE] border border-[#5BC0BE]/20',
        accentBg: 'bg-[#5BC0BE] hover:bg-[#3A808B] text-[#0B132B] font-extrabold',
        isDark: true
      }
    }[mailTheme as 'light' | 'dark' | 'glass' | 'slate'] || {
      bg: 'bg-[#0f141c] text-zinc-100',
      card: 'bg-[#1c222e] border-zinc-800 text-zinc-100',
      header: 'bg-[#151b26] text-zinc-100 border-b border-zinc-800',
      border: 'border-zinc-800',
      input: 'bg-[#0a0e14] border-zinc-800 text-white placeholder-zinc-500',
      icon: 'text-zinc-400 hover:bg-[#202736]',
      textMuted: 'text-zinc-400',
      textPrimary: 'text-white',
      pill: 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/40',
      accentBg: 'bg-indigo-600 hover:bg-indigo-500 text-white',
      isDark: true
    };

    const handleReadMail = (mail: MailMessage) => {
      setSelectedMail(mail);
      setMails(mails.map(m => m.id === mail.id ? { ...m, read: true } : m));
    };

    const handleDeleteMail = (mailId: string) => {
      const updated = mails.filter(m => m.id !== mailId);
      setMails(updated);
      localStorage.setItem('ios_mails', JSON.stringify(updated));
      setSelectedMail(null);
      onTriggerNotification("Mail Deleted", "Selected email thread has been removed.");
    };

    const handleMarkUnread = (mailId: string) => {
      const updated = mails.map(m => m.id === mailId ? { ...m, read: false } : m);
      setMails(updated);
      localStorage.setItem('ios_mails', JSON.stringify(updated));
      setSelectedMail(null);
    };

    // Helper to calculate avatar visuals
    const getAvatarInfo = (m: MailMessage) => {
      const isMySent = m.isSent === true;
      const label = isMySent 
        ? `To: ${m.toName || m.toEmail || 'Recipient'}` 
        : m.sender;
      
      const emailText = isMySent ? m.toEmail : m.senderEmail;
      const cleanEmailStr = emailText ? ` • ${emailText}` : '';

      const threadCount = m.thread && m.thread.length > 0 ? ` ${m.thread.length + 1}` : '';
      const displayLabel = `${label}${threadCount}`;

      const initialChar = (isMySent 
        ? (m.toName || m.toEmail || 'T') 
        : m.sender)[0].toUpperCase();

      const photoUrl = isMySent ? m.senderPhoto : m.senderPhoto; // custom image url

      // Quick hash to get unique profile background color
      let hash = 0;
      const nameKey = isMySent ? (m.toName || m.toEmail || '') : m.sender;
      for (let i = 0; i < nameKey.length; i++) {
        hash = nameKey.charCodeAt(i) + ((hash << 5) - hash);
      }
      const colors = [
        'bg-rose-500 text-white', 'bg-emerald-600 text-white', 'bg-indigo-600 text-white', 
        'bg-orange-500 text-white', 'bg-amber-500 text-black', 'bg-violet-600 text-white', 
        'bg-sky-600 text-white', 'bg-teal-600 text-white', 'bg-fuchsia-600 text-white'
      ];
      const avatarBg = colors[Math.abs(hash) % colors.length];

      return { displayLabel, initialChar, photoUrl, avatarBg, hasName: isMySent ? !!m.toName : true, cleanEmailStr };
    };

    // Composing Mail Submit Handler
    const handleSendComposedMail = () => {
      if (!composeTo.trim()) {
        alert("Please specify a recipient email address!");
        return;
      }
      const previewText = composeBody.slice(0, 100) + (composeBody.length > 100 ? '...' : '');
      const timeNow = systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Create new mail message
      const sentMail: MailMessage = {
        id: 'mail_sent_' + Date.now(),
        sender: myName,
        senderEmail: myEmail,
        toName: composeToName.trim() || undefined,
        toEmail: composeTo.trim(),
        subject: composeSubject.trim() || 'No Subject',
        preview: previewText,
        body: composeBody,
        time: timeNow,
        read: true,
        isSent: true,
        senderPhoto: composeToProfile.trim() || undefined,
        thread: []
      };

      const updated = [sentMail, ...mails];
      setMails(updated);
      localStorage.setItem('ios_mails', JSON.stringify(updated));

      // Reset compose fields
      setComposeTo('');
      setComposeToName('');
      setComposeToProfile('');
      setComposeSubject('');
      setComposeBody('');
      setIsComposingMail(false);
      // Suppressed sent email notification as per user intent
    };

    // Simulated reply to myself action
    const handleTriggerSimulation = () => {
      // Close Settings and return to Inbox
      setIsMailSettingsOpen(false);
      setSelectedMail(null);
      setIsComposingMail(false);

      setTimeout(() => {
        const timeNow = systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const previewText = simBody.slice(0, 100) + (simBody.length > 100 ? '...' : '');

        if (simTargetMailId === 'new') {
          // Fresh thread
          const simulatedMail: MailMessage = {
            id: 'mail_sim_' + Date.now(),
            sender: simSenderName,
            senderEmail: simSenderEmail,
            senderPhoto: simSenderProfile.trim() || undefined,
            toName: myName,
            toEmail: myEmail,
            subject: simSubject || 'Important Response update',
            preview: previewText,
            body: simBody,
            time: timeNow,
            read: false,
            thread: []
          };

          setMails(prev => {
            const updated = [simulatedMail, ...prev];
            localStorage.setItem('ios_mails', JSON.stringify(updated));
            return updated;
          });
        } else {
          // Reply to existing thread
          const replyItem: MailMessageThreadItem = {
            id: 'r_sim_' + Date.now(),
            senderName: simSenderName,
            senderEmail: simSenderEmail,
            senderPhoto: simSenderProfile.trim() || undefined,
            toName: myName,
            toEmail: myEmail,
            body: simBody,
            time: timeNow
          };

          setMails(prev => {
            const updated = prev.map(m => {
              if (m.id === simTargetMailId) {
                const existingThread = m.thread || [];
                return {
                  ...m,
                  thread: [...existingThread, replyItem],
                  read: false,
                  time: timeNow,
                  preview: previewText
                };
              }
              return m;
            });
            localStorage.setItem('ios_mails', JSON.stringify(updated));
            return updated;
          });
        }

        // Notification alert triggered when simulated mail arrives
        onTriggerNotification("Mail Notification", `${simSenderName} sent you a mail`);
      }, 8000);
    };

    // Handle Thread conversation quick reply
    const handleSubmitThreadReply = () => {
      if (!replyBody.trim() || !selectedMail) return;

      const timeNow = systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newReplyItem: MailMessageThreadItem = {
        id: 'r_reply_' + Date.now(),
        senderName: myName,
        senderEmail: myEmail,
        toName: selectedMail.isSent ? (selectedMail.toName || '') : selectedMail.sender,
        toEmail: selectedMail.isSent ? (selectedMail.toEmail || '') : (selectedMail.senderEmail || 'unknown@domain.com'),
        body: replyBody,
        time: timeNow
      };

      const updatedMails = mails.map(m => {
        if (m.id === selectedMail.id) {
          const currentThread = m.thread || [];
          const updatedMail = {
            ...m,
            thread: [...currentThread, newReplyItem],
            read: true,
            time: timeNow,
            preview: replyBody.slice(0, 100) + (replyBody.length > 100 ? '...' : '')
          };
          setSelectedMail(updatedMail);
          return updatedMail;
        }
        return m;
      });

      setMails(updatedMails);
      localStorage.setItem('ios_mails', JSON.stringify(updatedMails));
      setReplyBody('');
      setIsConversationReplyOpen(false);
      onTriggerNotification("Reply Sent", "Your reply has been successfully added to the conversation.");
    };

    return (
      <div className={`flex flex-col h-full font-sans transition-colors relative ${mTheme.bg}`} id="mail_app_container">
        
        {/* =============== COMPOSE SCREEN OVERLAY (Image 2 format) =============== */}
        {isComposingMail && (
          <div className="absolute inset-0 bg-black/55 z-30 flex flex-col justify-end animate-sliceUp">
            <div className={`w-full h-[90%] rounded-t-3xl border-t flex flex-col ${mTheme.card} overflow-hidden`} id="compose_view_pane">
              {/* Header */}
              <div className="flex justify-between items-center p-3.5 border-b border-zinc-250 border-white/5 shrink-0">
                <button 
                  onClick={() => setIsComposingMail(false)}
                  className="text-xs font-bold text-sky-505 text-sky-500 hover:text-sky-600 transition"
                >
                  Cancel
                </button>
                <h3 className="text-xs font-black uppercase tracking-wider text-inherit">Compose</h3>
                <button 
                  onClick={handleSendComposedMail}
                  className="flex items-center gap-1 bg-sky-500 hover:bg-sky-600 text-white p-2 px-3 rounded-xl hover:scale-98 transition text-xs font-extrabold"
                >
                  <Send className="w-3 h-3 text-white" /> Send
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-left">
                {/* From Field */}
                <div className="flex border-b pb-2 items-center gap-2 border-white/10">
                  <span className="text-zinc-500 text-xs w-14 font-medium">From</span>
                  <div className="flex-1 text-xs font-semibold flex items-center justify-between text-zinc-400">
                    <span>{myEmail}</span>
                    <span className="text-[10px] text-zinc-500 drop-shadow">▼</span>
                  </div>
                </div>

                {/* To Field */}
                <div className="flex border-b pb-2 items-center gap-2 border-white/10">
                  <span className="text-zinc-500 text-xs w-14 font-medium">To</span>
                  <input 
                    type="text" 
                    placeholder="Recipient email address"
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    className="flex-1 bg-transparent text-xs focus:outline-hidden text-inherit border-none p-0 focus:ring-0"
                  />
                </div>

                {/* Recipient Name Field */}
                <div className="flex border-b pb-2 items-center gap-2 border-white/10">
                  <span className="text-zinc-500 text-[10.5px] w-14 font-medium">Name</span>
                  <input 
                    type="text" 
                    placeholder="Recipient Name (optional)"
                    value={composeToName}
                    onChange={(e) => setComposeToName(e.target.value)}
                    className="flex-1 bg-transparent text-xs focus:outline-hidden text-inherit border-none p-0 focus:ring-0"
                  />
                </div>

                {/* Recipient Profile URL Field */}
                <div className="flex border-b pb-2 items-center gap-2 border-white/10">
                  <span className="text-zinc-500 text-[10.5px] w-14 font-medium">Avatar</span>
                  <input 
                    type="text" 
                    placeholder="Profile URL or emoji (optional)"
                    value={composeToProfile}
                    onChange={(e) => setComposeToProfile(e.target.value)}
                    className="flex-1 bg-transparent text-xs focus:outline-hidden text-inherit border-none p-0 focus:ring-0"
                  />
                </div>

                {/* Subject Field */}
                <div className="flex border-b pb-2 items-center gap-2 border-white/10">
                  <span className="text-zinc-500 text-xs w-14 font-medium">Subject</span>
                  <input 
                    type="text" 
                    placeholder="Enter subject header..."
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="flex-1 bg-transparent text-xs focus:outline-hidden text-inherit border-none p-0 focus:ring-0"
                  />
                </div>

                {/* Body Content Form Field */}
                <div className="flex flex-col pt-1 flex-1 min-h-[160px]">
                  <textarea 
                    placeholder="Compose email"
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    className="w-full flex-grow bg-transparent text-xs focus:outline-hidden text-inherit border-none resize-none p-0 focus:ring-0 min-h-[150px] leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============== SETTINGS CONFIGURATION SCREEN OVERLAY =============== */}
        {isMailSettingsOpen && (
          <div className="absolute inset-0 bg-black/60 z-30 flex flex-col justify-end animate-sliceUp text-left">
            <div className={`w-full h-[92%] rounded-t-3xl border-t flex flex-col ${mTheme.card} overflow-hidden`} id="mail_settings_pane">
              {/* Header */}
              <div className="flex justify-between items-center p-3.5 border-b border-white/5 shrink-0">
                <span className="w-10"></span>
                <h3 className="text-xs font-black uppercase tracking-wider text-inherit">Mail Options</h3>
                <button 
                  onClick={() => setIsMailSettingsOpen(false)}
                  className="text-xs font-extrabold text-sky-500 hover:text-sky-600 transition"
                >
                  Close
                </button>
              </div>

              {/* Settings Form Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
                {/* Profile Fields */}
                <div className="space-y-2.5 text-left">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-sky-500 text-left">My Identity Settings</h4>
                  
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-zinc-400">My Display Name</label>
                    <input 
                      type="text"
                      value={myName}
                      onChange={(e) => setMyName(e.target.value)}
                      className={`w-full p-2 rounded-xl text-xs border ${mTheme.input}`}
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[9px] font-bold text-zinc-400">My Email Address</label>
                    <input 
                      type="text"
                      value={myEmail}
                      onChange={(e) => setMyEmail(e.target.value)}
                      className={`w-full p-2 rounded-xl text-xs border ${mTheme.input}`}
                    />
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="space-y-2 text-left">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-sky-500">Interface Theme</h4>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['light', 'dark', 'glass', 'slate'].map((thId) => (
                      <button
                        key={thId}
                        onClick={() => setMailTheme(thId)}
                        className={`py-1.5 rounded-lg text-[9px] font-black capitalize border transition flex items-center justify-center gap-1 cursor-pointer ${
                          mailTheme === thId 
                            ? 'bg-sky-500 border-sky-400 text-white font-black' 
                            : 'bg-zinc-805 bg-black/20 border-zinc-700/30 text-zinc-400 hover:bg-zinc-800/55'
                        }`}
                      >
                        {thId} {mailTheme === thId && <Check className="w-2.5 h-2.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Inbound Replying / Email to Myself */}
                <div className="bg-black/25 p-3 rounded-2xl border border-white/5 space-y-3 mt-1.5 text-left">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B] flex items-center gap-1 leading-none text-left">
                    <span>⚡</span> <span>Simulate Reply To Myself</span>
                  </h4>
                  <p className="text-[8.5px] text-zinc-400 leading-snug text-left">
                    Schedule an incoming response. Takes you back to Gmail where a mail notification triggers after 8 seconds.
                  </p>

                  <div className="space-y-1 text-left">
                    <label className="text-[8.5px] font-bold text-zinc-400">Sender Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. PV Jones"
                      value={simSenderName}
                      onChange={(e) => setSimSenderName(e.target.value)}
                      className={`w-full p-1.5 px-2.5 rounded-xl text-xs border ${mTheme.input}`}
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[8.5px] font-bold text-zinc-400">Sender Email</label>
                    <input 
                      type="text"
                      placeholder="e.g. mdickie@yahoo.com"
                      value={simSenderEmail}
                      onChange={(e) => setSimSenderEmail(e.target.value)}
                      className={`w-full p-1.5 px-2.5 rounded-xl text-xs border ${mTheme.input}`}
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[8.5px] font-bold text-zinc-400">Sender Photo URL / Emoji</label>
                    <input 
                      type="text"
                      placeholder="e.g. https://... or custom symbol"
                      value={simSenderProfile}
                      onChange={(e) => setSimSenderProfile(e.target.value)}
                      className={`w-full p-1.5 px-2.5 rounded-xl text-xs border ${mTheme.input}`}
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[8.5px] font-bold text-zinc-400">Reply Context Target Thread</label>
                    <select
                      value={simTargetMailId}
                      onChange={(e) => setSimTargetMailId(e.target.value)}
                      className="w-full p-2 rounded-xl text-xs bg-zinc-900 border border-zinc-700 text-white font-bold focus:outline-hidden"
                    >
                      <option value="new">[Fresh Conversation Thread]</option>
                      {mails.map(m => (
                        <option key={m.id} value={m.id}>
                          Reply Thread: "{m.subject.substring(0,25)}..."
                        </option>
                      ))}
                    </select>
                  </div>

                  {simTargetMailId === 'new' && (
                    <div className="space-y-1 text-left animate-fadeIn">
                      <label className="text-[8.5px] font-bold text-zinc-400">Custom Subject</label>
                      <input 
                        type="text"
                        placeholder="Subject Line"
                        value={simSubject}
                        onChange={(e) => setSimSubject(e.target.value)}
                        className={`w-full p-1.5 px-2.5 rounded-xl text-xs border ${mTheme.input}`}
                      />
                    </div>
                  )}

                  <div className="space-y-1 text-left">
                    <label className="text-[8.5px] font-bold text-zinc-400">Message Body Content</label>
                    <textarea 
                      placeholder="Type details in your response..."
                      rows={3}
                      value={simBody}
                      onChange={(e) => setSimBody(e.target.value)}
                      className={`w-full p-2 rounded-xl text-xs border ${mTheme.input} resize-none`}
                    />
                  </div>

                  <button
                    onClick={handleTriggerSimulation}
                    className="w-full py-2.5 bg-[#F59E0B] hover:bg-amber-600 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition shadow-md active:scale-98 cursor-pointer"
                  >
                    Simulate Inbound (8 Secs Hold)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============== CONVERSATION DETAIL VIEW (Image 3 format) =============== */}
        {selectedMail ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden text-left" id="mail_conversation_box">
            {/* Image 3 styled action topbar */}
            <div className={`p-2 px-3 flex justify-between items-center bg-zinc-500/5 hover:bg-zinc-500/10 transition shrink-0 ${mTheme.border} border-b`}>
              <div className="flex items-center gap-2 text-left">
                <button 
                  onClick={() => setSelectedMail(null)}
                  className={`p-1.5 rounded-full ${mTheme.icon} transition`}
                  title="Back"
                >
                  <ChevronLeft className="w-5 h-5 text-inherit" />
                </button>
              </div>

              {/* Action bundle from Image 3 */}
              <div className="flex items-center gap-2">
                <button className={`p-1.5 rounded-full ${mTheme.icon} transition`} title="Gemini Magic">
                  <Sparkles className="w-4.5 h-4.5 text-sky-400" />
                </button>
                <button 
                  onClick={() => handleMarkUnread(selectedMail.id)}
                  className={`p-1.5 rounded-full ${mTheme.icon} transition`} 
                  title="Mark as Unread"
                >
                  <Mail className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={() => handleDeleteMail(selectedMail.id)}
                  className={`p-1.5 rounded-full ${mTheme.icon} hover:text-red-500 transition`} 
                  title="Delete Thread"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
                {/* Mail button visible in Image 3 to reply to my own email */}
                <button 
                  onClick={() => {
                    setReplyBody('');
                    setIsConversationReplyOpen(true);
                  }}
                  className="p-1.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-400/20 transition flex items-center justify-center shrink-0 cursor-pointer"
                  title="Reply to own / this email thread"
                >
                  <Reply className="w-4.5 h-4.5 shrink-0" />
                </button>
                <button className={`p-1.5 rounded-full ${mTheme.icon} transition`}>
                  <MoreVertical className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Scrolling Conversation list */}
            <div className="flex-grow overflow-y-auto p-3.5 space-y-4 text-left" id="conversation_scroller">
              {/* Dynamic Subject & Badge */}
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div className="space-y-1.5 text-left">
                  <h3 className="text-base font-black tracking-tight leading-snug flex items-center flex-wrap gap-1.5 text-inherit">
                    <span>{selectedMail.subject}</span>
                    <span className="text-[8px] bg-indigo-600 text-white font-extrabold py-0.5 px-2 border border-indigo-400/20 rounded uppercase font-mono shadow-xs shrink-0">
                      Inbox
                    </span>
                  </h3>
                </div>
                <button className="text-amber-400 self-start p-1 bg-black/20 rounded-full cursor-pointer">
                  <Star className="w-4 h-4 fill-amber-400" />
                </button>
              </div>

              {/* Messages chain stacked vertically */}
              <div className="space-y-3">
                {/* 1. Original Message card */}
                <div className={`p-3 rounded-2xl border ${mTheme.card} relative text-left`}>
                  <div className="flex items-start gap-2.5">
                    {/* Visual Avatar */}
                    {(() => {
                      const av = getAvatarInfo(selectedMail);
                      return av.photoUrl && av.photoUrl.startsWith('http') ? (
                        <img 
                          src={av.photoUrl} 
                          alt={selectedMail.sender} 
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10" 
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-black text-xs select-none ${av.avatarBg}`}>
                          {av.photoUrl || av.initialChar}
                        </div>
                      );
                    })()}

                    {/* Meta Row */}
                    <div className="flex-grow min-w-0 text-left">
                      <div className="flex justify-between items-center gap-1">
                        <span className="text-xs font-black truncate text-inherit">{selectedMail.sender}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[8.5px] text-zinc-400 font-mono">{selectedMail.time}</span>
                          <button 
                            onClick={() => {
                              setReplyBody('');
                              setIsConversationReplyOpen(true);
                            }}
                            className="p-1 hover:bg-black/20 rounded cursor-pointer"
                          >
                            <Reply className="w-3.5 h-3.5 text-zinc-400 hover:text-sky-400" />
                          </button>
                          <button className="p-1 hover:bg-black/20 rounded">
                            <MoreVertical className="w-3.5 h-3.5 text-zinc-400" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[9px] text-zinc-500 leading-none mt-0.5 text-left">
                        to {selectedMail.toName || myName} <span className="text-[7.5px] scale-80">▼</span>
                      </p>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="whitespace-pre-wrap font-sans text-xs pt-4 text-inherit leading-relaxed text-left">
                    {selectedMail.body}
                  </div>
                </div>

                {/* 2. Map through subsequent replies */}
                {selectedMail.thread && selectedMail.thread.map((rep, idx) => {
                  const isUserSender = rep.senderEmail === myEmail;
                  const profileBg = isUserSender ? 'bg-sky-500 text-white' : 'bg-emerald-600 text-white';

                  return (
                    <div key={rep.id || idx} className={`p-3 rounded-2xl border ${mTheme.card} relative text-left`}>
                      <div className="flex items-start gap-2.5">
                        {/* Thread Member Avatar */}
                        {rep.senderPhoto && rep.senderPhoto.startsWith('http') ? (
                          <img 
                            src={rep.senderPhoto} 
                            alt={rep.senderName} 
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-white/10" 
                          />
                        ) : (
                          <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-black text-xs ${profileBg}`}>
                            {rep.senderPhoto || rep.senderName[0].toUpperCase()}
                          </div>
                        )}

                        {/* Meta Row */}
                        <div className="flex-grow min-w-0 text-left">
                          <div className="flex justify-between items-center gap-1">
                            <span className="text-xs font-black truncate text-inherit">{rep.senderName}</span>
                            <div className="flex items-center gap-1.5 shrink-0 text-left">
                              <span className="text-[8.5px] text-zinc-400 font-mono">{rep.time}</span>
                              <button 
                                onClick={() => {
                                  setReplyBody('');
                                  setIsConversationReplyOpen(true);
                                }}
                                className="p-1 hover:bg-black/20 rounded cursor-pointer"
                              >
                                <Reply className="w-3.5 h-3.5 text-zinc-400 hover:text-sky-400" />
                              </button>
                              <button className="p-1 hover:bg-black/20 rounded">
                                <MoreVertical className="w-3 h-3 text-zinc-400" />
                              </button>
                            </div>
                          </div>
                          <p className="text-[9px] text-zinc-500 leading-none mt-0.5 text-left">
                            to {rep.toName || myName} <span className="text-[7.5px] scale-80">▼</span>
                          </p>
                        </div>
                      </div>

                      {/* Body Text */}
                      <div className="whitespace-pre-wrap font-sans text-xs pt-4 text-inherit leading-relaxed text-left">
                        {rep.body}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Spacer */}
              <div className="h-6"></div>
            </div>

            {/* Sticky pill action bar bottom (from Image 3) */}
            <div className={`p-3.5 bg-black/10 shrink-0 flex items-center justify-between border-t ${mTheme.border}`}>
              <div className="flex gap-2.5 w-full max-w-[270px] mx-auto">
                <button
                  onClick={() => {
                    setReplyBody('');
                    setIsConversationReplyOpen(true);
                  }}
                  className="flex-1 py-2 bg-sky-500/15 text-sky-450 text-sky-400 hover:bg-sky-500/25 border border-sky-400/20 font-black text-[10.5px] rounded-full inline-flex items-center justify-center gap-1 transition select-none cursor-pointer"
                >
                  <Reply className="w-3 h-3 text-sky-450 text-sky-400 shrink-0" /> Reply
                </button>
                <button
                  onClick={() => {
                    alert("Self routing / forwarding in sandbox setup.");
                  }}
                  className={`flex-1 py-1.5 px-3.5 border ${mTheme.border} text-inherit font-black text-[10.5px] rounded-full inline-flex items-center justify-center gap-1 transition hover:bg-white/10`}
                >
                  <Forward className="w-3 h-3 shrink-0" /> Forward
                </button>
                <button
                  onClick={() => {
                    alert("Fun context replies are accessible via Settings.");
                  }}
                  className={`w-9 h-9 rounded-full border ${mTheme.border} flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition shrink-0`}
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick reply composing bottom sheet drawer */}
            {isConversationReplyOpen && (
              <div className="absolute inset-0 bg-black/60 z-35 flex flex-col justify-end animate-sliceUp">
                <div className={`p-4 rounded-t-3xl border-t ${mTheme.card} flex flex-col max-h-[75%]`} id="inline_thread_reply_pane">
                  {/* Title Bar */}
                  <div className="flex justify-between items-center pb-3 border-b border-white/5 shrink-0">
                    <span className="text-[10px] font-black tracking-widest uppercase text-sky-400">
                      Draft In-Thread Reply
                    </span>
                    <button 
                      onClick={() => setIsConversationReplyOpen(false)}
                      className="text-xs font-extrabold text-[#EF4444]"
                    >
                      Dismiss
                    </button>
                  </div>

                  {/* Form fields review */}
                  <div className="py-2.5 space-y-1.5 border-b border-white/5 text-[9.5px] text-left text-zinc-400 shrink-0">
                    <p><strong>From:</strong> {myEmail}</p>
                    <p><strong>To:</strong> {selectedMail.isSent ? (selectedMail.toEmail || 'Recipient') : (selectedMail.senderEmail || selectedMail.sender)}</p>
                    <p><strong>Subject:</strong> Re: {selectedMail.subject}</p>
                  </div>

                  {/* Message body input */}
                  <div className="flex-grow py-3 flex flex-col min-h-[140px]">
                    <textarea
                      placeholder="Type details or requested info..."
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      className="w-full flex-grow bg-transparent text-xs focus:outline-hidden text-inherit border-none resize-none p-0 focus:ring-0 min-h-[125px] leading-relaxed"
                    />
                  </div>

                  {/* Submit buttons */}
                  <button
                    onClick={handleSubmitThreadReply}
                    className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-[10.5px] uppercase tracking-wider rounded-xl transition cursor-pointer text-center flex items-center justify-center gap-1 shrink-0"
                  >
                    <Send className="w-3 h-3 text-white" /> Send Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* =============== THE PRIMARY EMAIL LIST (Image 4 format) =============== */
          <div className="flex flex-col h-full overflow-hidden text-left" id="mail_list_view">
            {/* Header section with GMail config */}
            <div className={`p-4 bg-sky-500 text-white shrink-0 flex justify-between items-center ${mTheme.header}`}>
              <div className="text-left">
                <span className="text-[10px] tracking-wider uppercase font-black opacity-80 font-mono">
                  G-MAIL WORKSPACE
                </span>
                <h2 className="text-base font-black tracking-tight leading-none mt-1">
                  Inbox ({mails.filter(m => !m.read).length})
                </h2>
              </div>

              {/* Config Cog & Compose Toolbar */}
              <div className="flex items-center gap-2.5">
                <button
                  id="mail_config_icon"
                  onClick={() => setIsMailSettingsOpen(true)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 transition cursor-pointer"
                  title="Configure email options"
                >
                  <Settings className="w-4 h-4 text-white" />
                </button>
                <span className="text-xxs bg-white/20 px-2.5 py-1 rounded-full font-bold">
                  {mails.length} Items
                </span>
              </div>
            </div>

            {/* List box container */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 select-none" id="mail_scrolling_box">
              {mails.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 select-none">
                  Inbox is empty. Customize dynamic replying inside Settings!
                </div>
              ) : (
                <div className="space-y-1.5" id="mail_item_container">
                  {mails.map(mail => {
                    const av = getAvatarInfo(mail);
                    return (
                      <div 
                        id={`mail_item_${mail.id}`}
                        key={mail.id}
                        onClick={() => handleReadMail(mail)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                          !mail.read 
                            ? `${mTheme.card} border-l-4 border-l-sky-500 font-semibold ring-1 ring-sky-505/10` 
                            : `${mTheme.card} opacity-90 border-transparent hover:border-zinc-300`
                        }`}
                      >
                        {/* Circular Initials or Profile pic */}
                        <div className="shrink-0 flex items-center select-none">
                          {av.photoUrl && av.photoUrl.startsWith('http') ? (
                            <img 
                              src={av.photoUrl} 
                              alt="Avatar" 
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-full object-cover border border-white/5 shadow-xs" 
                            />
                          ) : (
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs tracking-wider select-none ${av.avatarBg}`}>
                              {av.photoUrl || av.initialChar}
                            </div>
                          )}
                        </div>

                        {/* Content text block formatted matching Image 4 */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between text-left">
                          <div className="flex justify-between items-start gap-1">
                            {/* To: MDickie or Sender Name */}
                            <p className="text-xs font-black truncate text-inherit leading-tight">
                              {av.displayLabel}
                            </p>
                            <span className="text-[8.5px] text-zinc-400 font-mono shrink-0 whitespace-nowrap pt-0.5">
                              {mail.time}
                            </span>
                          </div>

                          {/* Email Subject Line */}
                          <p className="text-[10.5px] text-inherit font-extrabold truncate leading-tight mt-0.5" style={{ opacity: mail.read ? 0.8 : 1 }}>
                            {mail.subject}
                          </p>

                          {/* Body snippet and unread dot or blue inbox badge */}
                          <div className="flex justify-between items-center gap-1.5 mt-0.5">
                            <p className="text-[10px] text-zinc-500 truncate leading-snug flex-1">
                              {mail.preview}
                            </p>
                            
                            {/* Blue Inbox Badge matching Image 4 */}
                            <div className="shrink-0 flex items-center gap-1.5 select-none">
                              {!mail.isSent && (
                                <span className="text-[7px] bg-[#1A73E8]/10 text-[#1A73E8] font-bold py-0.5 px-1.5 rounded font-mono uppercase">
                                  Inbox
                                </span>
                              )}
                              <Star className="w-3 h-3 text-zinc-450" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* floating compose button pinned to bottom right */}
            <button
              id="mail_app_compose_fab"
              onClick={() => {
                setComposeTo('');
                setComposeToName('');
                setComposeToProfile('');
                setComposeSubject('');
                setComposeBody('');
                setIsComposingMail(true);
              }}
              className="absolute bottom-4 right-4 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white flex items-center justify-center gap-1.5 shadow-xl hover:shadow-sky-500/25 transition p-3.5 px-5 rounded-full cursor-pointer z-20 font-black text-xs tracking-wide border border-sky-400/25 uppercase shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5 text-white" /> Compose
            </button>
          </div>
        )}
      </div>
    );
  };

  // 5. APPS ON DOCK/MESSAGES
  const renderMessagesApp = () => {
    const handleSendMessage = () => {
      if (!chatInput.trim() || !selectedChat) return;
      const sentMessage = {
        id: 'msg_' + Date.now(),
        text: chatInput,
        sender: 'user' as const,
        timestamp: '2:08 PM'
      };

      const updatedThread: ChatThread = {
        ...selectedChat,
        lastMessage: chatInput,
        unread: false,
        messages: [...selectedChat.messages, sentMessage]
      };

      setChats(chats.map(c => c.id === selectedChat.id ? updatedThread : c));
      setSelectedChat(updatedThread);
      setChatInput('');

      // Add dummy responsive contact answer shortly after
      setTimeout(() => {
        const replyMessage = {
          id: 'reply_' + Date.now(),
          text: 'Sounds great! Enjoy your brand-new virtual iPhone Simulator setup!',
          sender: 'contact' as const,
          timestamp: '2:09 PM'
        };

        const fullyRepliedThread: ChatThread = {
          ...updatedThread,
          messages: [...updatedThread.messages, replyMessage],
          lastMessage: 'Sounds great! Enjoy your brand-new...'
        };

        setChats(chats => chats.map(c => c.id === selectedChat.id ? fullyRepliedThread : c));
        if (selectedChat && selectedChat.id === updatedThread.id) {
          setSelectedChat(fullyRepliedThread);
        }
      }, 1500);
    };

    return (
      <div className="flex flex-col h-full bg-zinc-50 font-sans text-zinc-900" id="messages_app_container">
        {/* Messages Header */}
        <div className="p-4 bg-emerald-500 text-white shrink-0 flex justify-between items-center">
          <h2 className="text-lg font-black">Messages</h2>
          {selectedChat && (
            <button 
              id="msg_all_threads_btn"
              onClick={() => setSelectedChat(null)}
              className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-bold hover:bg-white/30"
            >
              All Threads
            </button>
          )}
        </div>

        {selectedChat ? (
          <div className="flex-1 flex flex-col overflow-hidden h-full" id="chat_thread_view">
            {/* Thread Details Header */}
            <div className="p-2 border-b bg-white flex items-center gap-2 shrink-0">
              <div className={`w-8 h-8 rounded-full ${selectedChat.avatarColor} text-white flex items-center justify-center font-bold text-xs uppercase`}>
                {selectedChat.contactName[0]}
              </div>
              <div>
                <p className="text-xs font-bold">{selectedChat.contactName}</p>
                <p className="text-[8px] text-green-500 font-semibold">• Active Now</p>
              </div>
            </div>

            {/* Bubble list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-stone-50">
              {selectedChat.messages.map(msg => (
                <div 
                  id={`chat_msg_${msg.id}`}
                  key={msg.id} 
                  className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <p className={`p-2.5 rounded-2xl text-xs leading-normal leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-zinc-200 text-zinc-800 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </p>
                  <span className="text-[8px] text-zinc-400 font-mono mt-0.5 px-1">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Send chat action bar */}
            <div className="p-2.5 bg-white border-t border-zinc-100 flex gap-2 shrink-0 items-center">
              <input 
                id="chat_message_input"
                type="text" 
                placeholder="Aa"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-zinc-100 px-3 py-1.5 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <button 
                id="chat_send_btn"
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className="p-1.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:opacity-45 active:scale-90 transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-2 space-y-1" id="chat_threads_list">
            {chats.map(thread => (
              <div 
                id={`thread_item_${thread.id}`}
                key={thread.id}
                onClick={() => setSelectedChat(thread)}
                className={`p-3 bg-white rounded-xl border border-zinc-100 cursor-pointer hover:border-emerald-200 transition-all flex justify-between items-center ${
                  thread.unread ? 'border-l-4 border-l-emerald-500' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full ${thread.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                    {thread.contactName[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold leading-none ${thread.unread ? 'text-black font-extrabold' : 'text-zinc-700'}`}>{thread.contactName}</h4>
                    <p className="text-[10px] text-zinc-500 truncate mt-1 leading-normal">{thread.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] text-zinc-400 font-mono">{thread.time}</span>
                  {thread.unread && (
                    <span className="block w-20 h-2 bg-blue-500 rounded-full mt-1 ml-auto"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // 6. PHOTO STREAM COMPONENT
  const renderPhotosApp = () => {
    const photoGradients = [
      'from-rose-400 to-indigo-500',
      'from-yellow-200 via-pink-400 to-indigo-400',
      'from-teal-300 via-emerald-400 to-cyan-500',
      'from-amber-200 to-red-500',
      'from-emerald-400 to-teal-800',
      'from-fuchsia-600 to-pink-500',
      'from-indigo-400 to-purple-800',
      'from-lime-300 to-emerald-500',
      'from-cyan-300 to-violet-500'
    ];

    return (
      <div className="flex flex-col h-full bg-black text-white font-sans" id="photos_app_container">
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 shrink-0 flex justify-between items-center">
          <h2 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-300 via-green-300 to-blue-400 animate-pulse">Photos</h2>
          <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-full text-zinc-400 font-mono">Camera Roll</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider mb-2">My iPhone 17 Spatial Frames</p>
          <div className="grid grid-cols-3 gap-2" id="photos_grid">
            {photoGradients.map((grad, i) => (
              <div 
                id={`photo_gradient_item_${i}`}
                key={i} 
                className={`aspect-square bg-gradient-to-tr ${grad} rounded-xl shadow-xs transition transform hover:scale-102 hover:shadow-md cursor-pointer relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white font-mono">Frame {i + 1}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[10px] text-zinc-600 mt-6 font-mono">All captures optimized with A19 bionic ISP</p>
        </div>
      </div>
    );
  };

  // 7. CAMERA VIEWER
  const renderCameraApp = () => {
    return (
      <div className="flex flex-col h-full bg-black text-white font-mono select-none" id="camera_app_container">
        {/* Header Options */}
        <div className="p-3 bg-zinc-950 flex justify-between items-center text-[10px] font-bold tracking-widest shrink-0 text-zinc-300">
          <span className="text-amber-400">HDR</span>
          <span>SLO-MO</span>
          <span className="bg-zinc-800 px-1.5 py-0.5 rounded text-white font-mono">RAW MAX</span>
          <span>1.0X</span>
        </div>

        {/* Viewfinder simulation */}
        <div className="flex-1 bg-zinc-900 overflow-hidden relative flex flex-col justify-between p-4" id="camera_viewfinder">
          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/5 opacity-40">
            <div className="border border-white/5"></div>
            <div className="border border-white/5"></div>
            <div className="border border-white/5"></div>
            <div className="border border-white/5"></div>
            <div className="border border-white/5"></div>
            <div className="border border-white/5"></div>
            <div className="border border-white/5"></div>
            <div className="border border-white/5"></div>
            <div className="border border-white/5"></div>
          </div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[10px] bg-black/40 backdrop-blur-md py-1 px-2.5 rounded-full text-white border border-white/10 flex items-center gap-1">
              <Video className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> REC NOW
            </span>
            <span className="text-[9px] bg-black/50 py-1 px-2 rounded-full text-zinc-400">ISO 120 FPS 60</span>
          </div>

          {/* Absolute centered capture warning */}
          <div className="self-center text-center max-w-[80%] bg-black/60 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
            <HardDrive className="w-6 h-6 text-zinc-400 mx-auto mb-1 flex items-center" />
            <p className="text-[10px] font-bold text-zinc-200 leading-tight">iPhone 17 Physical Lens Simulated</p>
            <p className="text-[8px] text-zinc-400 mt-0.5">Click the shutter below to record a high resolution focal frame</p>
          </div>

          <div className="flex justify-center gap-8 text-[9px] text-zinc-400 tracking-wider font-sans z-10 font-bold mb-1">
            <span>PHOTO</span>
            <span className="text-bright-yellow text-amber-500 uppercase">PORTRAIT</span>
            <span>VIDEO</span>
          </div>
        </div>

        {/* Camera Footer Trigger Controls */}
        <div className="p-3 bg-black flex justify-around items-center shrink-0">
          {/* Gallery Preview */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-400 to-indigo-500 border border-white/20"></div>

          {/* Massive Shutter */}
          <button 
            id="camera_shutter_btn"
            onClick={() => alert('Photo captured successfully to camera roll (gradient preview)!')}
            className="w-12 h-12 rounded-full border-4 border-zinc-200 bg-white hover:bg-zinc-100 transition text-black active:scale-90"
          ></button>

          {/* Camera flip icon */}
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition cursor-pointer">
            <RefreshCw className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    );
  };

  // 8. MUSIC PLAYER
  const renderMusicApp = () => {
    const activeSongSelected = activeSong || songs[0];

    const togglePlay = () => {
      setIsPlaying(!isPlaying);
    };

    const nextSong = () => {
      const idx = songs.findIndex(s => s.id === activeSongSelected.id);
      const nextIdx = (idx + 1) % songs.length;
      setActiveSong(songs[nextIdx]);
      setPlaybackSeconds(0);
    };

    const prevSong = () => {
      const idx = songs.findIndex(s => s.id === activeSongSelected.id);
      const prevIdx = idx === 0 ? songs.length - 1 : idx - 1;
      setActiveSong(songs[prevIdx]);
      setPlaybackSeconds(0);
    };

    const formatSeconds = (sec: number) => {
      const mins = Math.floor(sec / 60);
      const rem = sec % 60;
      return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
    };

    return (
      <div className="flex flex-col h-full bg-zinc-900 text-white font-sans" id="music_app_container">
        {/* Top Header */}
        <div className="p-4 bg-zinc-950/60 border-b border-zinc-800 flex justify-between items-center shrink-0">
          <h2 className="text-md font-bold flex items-center gap-1.5 text-zinc-200">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span> Music Player
          </h2>
          <div className="flex items-center gap-1.5 select-none">
            <button 
              id="music_toggle_delete_mode_btn"
              onClick={() => {
                setIsMusicDeleteOpen(!isMusicDeleteOpen);
                setConfirmDeleteMusicId(null);
              }}
              className={`text-[9px] font-black py-1 px-2.5 rounded-lg active:scale-95 transition ${
                isMusicDeleteOpen ? "bg-red-650 text-white animate-pulse" : "bg-zinc-805 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700/50"
              }`}
            >
              {isMusicDeleteOpen ? "Done" : "Delete Track"}
            </button>
            <button 
              id="music_toggle_admin_btn"
              onClick={() => {
                setIsMusicAdminOpen(!isMusicAdminOpen);
                setIsMusicDeleteOpen(false);
              }}
              className="text-[9px] bg-rose-600 hover:bg-rose-700 text-white font-black py-1 px-2.5 rounded-lg active:scale-95 transition whitespace-nowrap"
            >
              {isMusicAdminOpen ? "Player" : "Add Track"}
            </button>
          </div>
        </div>

        {isMusicAdminOpen ? (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-start space-y-3.5 bg-zinc-900 text-left">
            <div className="text-center pb-2 border-b border-zinc-800">
              <h3 className="text-xs font-black uppercase text-rose-500 tracking-wider">Music Custom Board</h3>
              <p className="text-[8.5px] text-zinc-400">Add offline tracks into your system repository</p>
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-400 font-mono">Track/Song Name</label>
              <input 
                id="music_new_title_input"
                type="text"
                value={newTrackName}
                onChange={(e) => setNewTrackName(e.target.value)}
                placeholder="e.g. Neon Shadows"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500 text-left"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-400 font-mono">Artist Name</label>
              <input 
                id="music_new_artist_input"
                type="text"
                value={newTrackArtist}
                onChange={(e) => setNewTrackArtist(e.target.value)}
                placeholder="e.g. Cyber Runner"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500 text-left"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-zinc-400 font-mono">Duration (e.g. 3:45)</label>
              <input 
                id="music_new_duration_input"
                type="text"
                value={newTrackDurationVal}
                onChange={(e) => setNewTrackDurationVal(e.target.value)}
                placeholder="e.g. 3:45"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-500 text-left"
              />
            </div>

            <button 
              id="music_submit_track_btn"
              onClick={handleAddTrackSubmit}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-bold text-white transition active:scale-95 shadow-lg shadow-rose-600/20 cursor-pointer"
            >
              Add Song to Playlist
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
            {/* Active Album view */}
            <div className="flex flex-col items-center py-2">
              <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${activeSongSelected.coverGradient} shadow-xl relative overflow-hidden flex items-center justify-center transition-all duration-300 ${isPlaying ? 'scale-105 shadow-pink-500/10' : 'scale-95'}`}>
                <Radio className="w-10 h-10 text-white/50 animate-pulse" />
                {isPlaying && (
                  <div className="absolute inset-x-0 bottom-0 py-1 bg-black/40 backdrop-blur-md flex items-center justify-center gap-0.5">
                    <span className="w-1 h-3 bg-white rounded-full animate-bounce"></span>
                    <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
              </div>

              <div className="text-center mt-3 max-w-full">
                <h3 className="text-xs font-bold text-zinc-100 truncate">{activeSongSelected.title}</h3>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5">{activeSongSelected.artist} — {activeSongSelected.album}</p>
              </div>
            </div>

          {/* Seek Progress bar */}
          <div className="space-y-1">
            <div className="h-1 bg-zinc-800 rounded-full w-full relative overflow-hidden">
              <div 
                id="music_progress_bar"
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-full transition-all" 
                style={{ width: `${(playbackSeconds / activeSongSelected.duration) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[8px] font-mono text-zinc-500">
              <span>{formatSeconds(playbackSeconds)}</span>
              <span>{formatSeconds(activeSongSelected.duration)}</span>
            </div>
          </div>

          {/* Trigger Playback buttons */}
          <div className="flex justify-center items-center gap-6" id="music_controls">
            <button 
              id="music_prev_btn"
              onClick={prevSong}
              className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition active:scale-90"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              id="music_toggle_play_btn"
              onClick={togglePlay}
              className="p-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition shadow-lg shadow-rose-500/20 active:scale-90"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
            </button>
            <button 
              id="music_next_btn"
              onClick={nextSong}
              className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition active:scale-90"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Playlist choices */}
          <div className="mt-2 border-t border-zinc-800 pt-2 flex-1 overflow-y-auto">
            <p className="text-[8px] text-zinc-500 uppercase font-mono tracking-widest mb-1.5">Up Next</p>
            <div className="space-y-1" id="song_list">
              {songs.map(song => (
                <div 
                  id={`song_item_${song.id}`}
                  key={song.id}
                  onClick={() => {
                    if (isMusicDeleteOpen) return;
                    setActiveSong(song);
                    setPlaybackSeconds(0);
                    setIsPlaying(true);
                  }}
                  className={`p-2 rounded-xl text-left text-xs cursor-pointer hover:bg-zinc-800 flex justify-between items-center transition-all ${
                    activeSongSelected.id === song.id ? 'bg-zinc-800 text-rose-400 font-semibold' : 'text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
                    {/* Tiny delete confirmation control */}
                    {isMusicDeleteOpen && (
                      <div className="shrink-0 flex items-center gap-1 select-none">
                        {confirmDeleteMusicId === song.id ? (
                          <div className="flex items-center gap-1">
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                const filteredSongs = songs.filter(s => s.id !== song.id);
                                setSongs(filteredSongs);
                                if (activeSongSelected.id === song.id && filteredSongs.length > 0) {
                                  setActiveSong(filteredSongs[0]);
                                }
                                setConfirmDeleteMusicId(null);
                                onTriggerNotification("Music Player", `Deleted track "${song.title}".`);
                              }}
                              className="text-[7.5px] bg-red-650 bg-red-600 text-white px-1.5 py-0.5 rounded font-black hover:bg-red-700 uppercase cursor-pointer shrink-0"
                            >
                              Del
                            </span>
                            <span 
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteMusicId(null);
                              }}
                              className="text-[7.5px] bg-zinc-700 text-zinc-300 px-1.5 py-0.5 rounded font-black hover:bg-zinc-650 uppercase cursor-pointer shrink-0"
                            >
                              No
                            </span>
                          </div>
                        ) : (
                          <span 
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteMusicId(song.id);
                            }}
                            className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-[9px] hover:bg-red-650 cursor-pointer transition active:scale-80 select-none shrink-0"
                            title="Delete track"
                          >
                            ×
                          </span>
                        )}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-medium leading-none">{song.title}</p>
                      <p className="text-[8px] text-zinc-500 truncate mt-0.5">{song.artist}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-mono text-zinc-500 shrink-0">{formatSeconds(song.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  // 9. SAFARI SIMULATOR
  const renderSafariApp = () => {
    return (
      <div className="flex flex-col h-full bg-zinc-100 text-zinc-950 font-sans" id="safari_app_container">
        {/* Sleek Browser Toolbar */}
        <div className="p-3 bg-zinc-200/90 border-b border-zinc-300 shrink-0 space-y-1.5">
          <div className="bg-zinc-900/10 px-3 py-1 rounded-full flex items-center justify-between gap-2 border border-zinc-300">
            <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            <input 
              id="safari_url_input"
              type="text" 
              value={safariUrl}
              onChange={(e) => setSafariUrl(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-xs text-zinc-800 select-all font-mono"
            />
            <Compass className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          </div>
        </div>

        {/* Browser simulated output */}
        <div className="flex-grow overflow-y-auto bg-white p-4" id="safari_browser_content">
          <div className="border border-indigo-100 p-4 rounded-2xl bg-indigo-50/50 mb-3 text-center">
            <Chrome className="w-7 h-7 mx-auto text-indigo-600 mb-1" />
            <h3 className="text-xs font-bold text-indigo-900 leading-tight">Mock Webview Active</h3>
            <p className="text-[10px] text-indigo-700 font-mono mt-1 leading-normal">{safariUrl}</p>
            <p className="text-[8px] text-indigo-400 mt-2 font-sans">Rendered securely using A19 virtual proxy pipeline.</p>
          </div>

          <p className="text-[10px] text-zinc-400 uppercase font-mono tracking-wider mb-2">Popular Dev Bookmarks</p>
          <div className="grid grid-cols-1 gap-2" id="safari_bookmarks">
            {[
              { title: 'Google AI Studio Build', desc: 'Generate web apps using natural speech input.', link: 'https://ai.studio/build' },
              { title: 'Apple Official Developer Hub', desc: 'Read modern iOS system paradigms.', link: 'https://newsroom.apple.com' },
              { title: 'Antigravity Code Agent Repo', desc: 'Explore the high performance agent framework.', link: 'https://github.com/google/aistudio' }
            ].map((bm, idx) => (
              <button 
                id={`safari_bm_btn_${idx}`}
                key={idx}
                onClick={() => setSafariUrl(bm.link)}
                className="p-2.5 bg-zinc-50 rounded-xl hover:bg-zinc-100 text-left border border-zinc-100 w-full hover:border-zinc-300 transition-all cursor-pointer block active:scale-98"
              >
                <div className="font-bold text-[10px] text-zinc-800">{bm.title}</div>
                <div className="text-[8px] text-zinc-500 mt-0.5 truncate leading-tight">{bm.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 10. APP STORE APP
  const renderAppStoreApp = () => {
    const handleToggleInstall = (item: AppStoreItem) => {
      setStoreItems(storeItems.map(s => s.id === item.id ? { ...s, isInstalled: !s.isInstalled } : s));
    };

    const filteredItems = storeItems.filter(item => 
      item.name.toLowerCase().includes(storeSearch.toLowerCase()) || 
      item.category.toLowerCase().includes(storeSearch.toLowerCase())
    );

    return (
      <div className="flex flex-col h-full bg-white text-zinc-950 font-sans" id="appstore_app_container">
        {/* iOS style bold title heading */}
        <div className="p-4 border-b border-zinc-100 shrink-0">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-500 tracking-wide font-mono">May 24</span>
              <h2 className="text-xl font-bold tracking-tight">Today</h2>
            </div>
            <span className="text-xs bg-zinc-100 p-1 rounded-full text-zinc-500"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /></span>
          </div>

          <div className="bg-zinc-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-zinc-200">
            <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <input 
              id="app_store_search"
              type="text" 
              placeholder="Search Apps, Games, Developer kits..."
              value={storeSearch}
              onChange={(e) => setStoreSearch(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs text-zinc-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Store Feed Scroll */}
        <div className="flex-Grow overflow-y-auto p-3 space-y-3.5 flex-1">
          {filteredItems.map(item => (
            <div 
              id={`appstore_item_card_${item.id}`}
              key={item.id} 
              className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-2xs space-y-2.5 hover:border-blue-200 transition-all"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl ${item.iconColor} flex items-center justify-center font-bold text-xs shadow-xs`}>
                    {item.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-non-tight text-zinc-800">{item.name}</h4>
                    <p className="text-[9px] text-zinc-500 mt-0.5 leading-none">{item.category}</p>
                    <p className="text-[8px] text-amber-500 font-bold mt-1">★ {item.rating} • {item.downloads} DL</p>
                  </div>
                </div>
                <button 
                  id={`appstore_install_btn_${item.id}`}
                  onClick={() => handleToggleInstall(item)}
                  className={`px-3 py-1.5 rounded-full text-[9px] font-bold text-center transition-all shadow-xs active:scale-95 ${
                    item.isInstalled 
                      ? 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {item.isInstalled ? 'OPEN' : 'GET'}
                </button>
              </div>
              <p className="text-[10px] text-zinc-600 leading-normal bg-white p-2 rounded-xl border border-zinc-100">
                {item.description}
              </p>
            </div>
          ))}
          <p className="text-center text-[9px] text-zinc-400 font-mono py-2">Secure installations protected by Apple Gatekeeper.</p>
        </div>
      </div>
    );
  };

  // 11. MAPS APPLICATION
  const renderMapsApp = () => {
    return (
      <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans" id="maps_app_container">
        {/* Simple Maps Search Bar */}
        <div className="p-3 bg-white/90 border-b border-slate-200 shadow-sm shrink-0 flex items-center gap-2">
          <div className="flex-1 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input 
              id="maps_search_input"
              type="text" 
              placeholder="Search Places near Yonkers Pier..." 
              value={mapsQuery}
              onChange={(e) => setMapsQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-xs flex-1 text-slate-800"
            />
          </div>
          <button 
            id="maps_pin_btn"
            onClick={() => setPinLocation(pinLocation === 'Yonkers Pier' ? 'AI Lab Studio' : 'Yonkers Pier')}
            className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Map Canvas Grid Simulation */}
        <div className="flex-1 bg-sky-100 relative overflow-hidden flex items-center justify-center" id="maps_canvas_view">
          {/* Roads grid pattern simulation */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 border-slate-300 opacity-25">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="border border-slate-300"></div>
            ))}
          </div>

          {/* Yellow highways */}
          <div className="absolute h-4 bg-amber-200 border-y border-amber-300 w-full top-1/3 origin-center -rotate-12 flex justify-center items-center">
            <span className="text-[7px] text-amber-700 tracking-wider font-mono">Broadway Route 9</span>
          </div>
          <div className="absolute w-4 bg-amber-200 border-x border-amber-300 h-full left-2/3 origin-center rotate-45 flex items-center justify-center">
            <span className="text-[7px] text-amber-700 tracking-wider font-mono uppercase text-center">Sprain Pkwy</span>
          </div>

          {/* Blue Hudson River section */}
          <div className="absolute top-0 bottom-0 left-0 w-1/4 bg-blue-300 border-r border-blue-400/80 flex items-center justify-center">
            <span className="text-[9px] text-blue-700 -rotate-90 italic tracking-widest font-serif font-black">Hudson River</span>
          </div>

          {/* Maps Marker HUD Popup */}
          <div className="absolute z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 shadow-xl max-w-[80%] text-center">
            <MapPin className="w-7 h-7 text-rose-500 fill-rose-500 mx-auto mb-1 animate-bounce" />
            <span className="text-xs font-bold block">{pinLocation || "Yonkers, New York"}</span>
            <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">Coordinates: 40.9312° N, 73.8987° W</p>
            <p className="text-[8px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full inline-block font-semibold mt-1.5">GPS signal strong </p>
          </div>
        </div>
      </div>
    );
  };

  // 12. HEALTH APP
  const renderHealthApp = () => {
    return (
      <div className="flex flex-col h-full bg-stone-50 text-stone-900 font-sans" id="health_app_container">
        <div className="p-4 bg-white border-b border-stone-200 shrink-0 flex items-center justify-between">
          <h2 className="text-lg font-black text-rose-500 flex items-center gap-1">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Health App
          </h2>
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-400">Edward</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Main Ring/Banner */}
          <div className="bg-white p-3 rounded-2xl border border-stone-200/60 shadow-xs flex justify-between items-center">
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Active Energy</span>
              <p className="text-sm font-bold text-stone-850">450 / 600 CAL</p>
              <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-3/4 rounded-full"></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-red-500 border-t-transparent animate-spin-slow"></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-3 rounded-2xl border border-stone-250/60 flex flex-col justify-between">
              <span className="text-[8px] font-mono font-bold text-sky-500 uppercase block">Daily Steps</span>
              <p className="text-sm font-extrabold text-stone-800 m-1">9,240 <span className="text-[9px] font-medium text-stone-400 font-sans">steps</span></p>
              <span className="text-[8px] text-stone-400">Goal: 10,000</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-stone-250/60 flex flex-col justify-between">
              <span className="text-[8px] font-mono font-bold text-amber-500 uppercase block">Water Tracker</span>
              <p className="text-sm font-extrabold text-stone-800 m-1">{waterIntake} <span className="text-[9px] font-medium text-stone-400 font-sans">ml</span></p>
              <button 
                id="water_drink_btn"
                onClick={() => setWaterIntake(w => w + 250)}
                className="py-1 px-2.5 bg-sky-500 font-mono font-bold text-white text-[8px] rounded-full hover:bg-sky-600 transition tracking-wider uppercase inline-block self-start"
              >
                +250ml Drink
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 text-white p-3 rounded-2xl border border-zinc-800 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[8px] uppercase tracking-widest font-mono text-zinc-400">Simulated Heart Monitor</p>
              <p className="text-md font-bold mt-0.5 text-rose-400">72 BPM</p>
            </div>
            <Heart className="w-7 h-7 text-red-500 fill-red-500 animate-pulse shrink-0" />
          </div>
        </div>
      </div>
    );
  };

  // 13. SETTINGS APP
  const renderSettingsApp = () => {
    return (
      <div className="flex flex-col h-full bg-zinc-100 text-zinc-900 font-sans" id="settings_app_container">
        {/* iOS style standard settings header */}
        <div className="p-4 bg-white/80 border-b border-zinc-200 shrink-0 select-none">
          <h2 className="text-xl font-bold tracking-tight">Settings</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* User Account Profile Section */}
          <div className="p-3.5 bg-white rounded-2xl border border-zinc-200/50 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#00C37A] to-blue-500 text-white flex items-center justify-center font-extrabold text-sm uppercase shrink-0">
                {firstName[0] || 'E'}{lastName[0] || 'A'}
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-black text-zinc-800 leading-none">{firstName} {lastName}</h4>
                <p className="text-[9px] text-zinc-400 mt-1 leading-none font-mono">Simulated Apple Account ID</p>
                <p className="text-[8px] text-[#00C37A] mt-1 font-bold leading-none"> Profile Cascading Live</p>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-100 flex gap-2">
              <div className="flex-1 space-y-0.5">
                <label className="text-[7.5px] font-extrabold text-zinc-400 uppercase tracking-widest pl-1">First Name</label>
                <input 
                  id="profile_firstname_input"
                  type="text" 
                  value={firstName} 
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    const updateEvent = new CustomEvent('monipay_profile_updated', {
                      detail: { firstName: e.target.value, lastName }
                    });
                    window.dispatchEvent(updateEvent);
                  }} 
                  placeholder="First Name"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
              <div className="flex-1 space-y-0.5">
                <label className="text-[7.5px] font-extrabold text-zinc-400 uppercase tracking-widest pl-1">Last Name</label>
                <input 
                  id="profile_lastname_input"
                  type="text" 
                  value={lastName} 
                  onChange={(e) => {
                    setLastName(e.target.value);
                    const updateEvent = new CustomEvent('monipay_profile_updated', {
                      detail: { firstName, lastName: e.target.value }
                    });
                    window.dispatchEvent(updateEvent);
                  }} 
                  placeholder="Last Name"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
            </div>
          </div>

          {/* Quick Custom Simulator Customization Options */}
          <div className="space-y-1.5">
            <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Simulated Settings Device</p>
            <div className="bg-white rounded-2xl border border-zinc-200/50 p-1 divide-y divide-zinc-100">
              <div className="p-2.5 flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-700 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Device Name</span>
                <input 
                  id="settings_device_name_input"
                  type="text" 
                  value={simName}
                  onChange={(e) => setSimName(e.target.value)}
                  className="bg-transparent text-right font-semibold text-zinc-500 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 px-1 rounded"
                />
              </div>

              <div className="p-2.5 text-xs">
                <span className="font-semibold text-zinc-700 block mb-2 flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-amber-500" /> Active Wallpapers</span>
                <div className="grid grid-cols-2 gap-1" id="settings_wallpapers">
                  {[
                    { id: 'ios18', name: 'Original Sage' },
                    { id: 'solaris', name: 'Solaris Peach' },
                    { id: 'aurora', name: 'Aurora Forest' },
                    { id: 'dark_neon', name: 'Midnight Neon' }
                  ].map(w => (
                    <button
                      id={`wp_toggle_btn_${w.id}`}
                      key={w.id}
                      onClick={() => {
                        if (w.id === 'ios18') setWallpaper('linear-gradient(135deg, #e3f0e5 0%, #bfdad0 25%, #daebd3 50%, #bbc5de 75%, #a6bcd8 100%)');
                        if (w.id === 'solaris') setWallpaper('linear-gradient(135deg, #fffcf0 0%, #ffebcc 33%, #ffe0b3 66%, #ffd1b3 100%)');
                        if (w.id === 'aurora') setWallpaper('linear-gradient(135deg, #1e3c72 0%, #2a5298 40%, #20b2aa 100%)');
                        if (w.id === 'dark_neon') setWallpaper('linear-gradient(135deg, #0f0c20 0%, #1a103c 50%, #05040a 100%)');
                      }}
                      className="py-1 px-1 rounded bg-zinc-100 font-mono hover:bg-zinc-200 text-[8px] truncate font-bold text-zinc-600 block active:scale-95 cursor-pointer"
                    >
                      {w.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-2.5 flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-700 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-blue-500" /> Chip Model</span>
                <span className="font-mono text-zinc-400 text-[10px]">Apple A19 Bionic SP</span>
              </div>

              <div className="p-2.5 flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-700 flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-purple-500" /> System ROM Storage</span>
                <span className="font-mono text-zinc-400 text-[10px]">512 GB Solid NVMe</span>
              </div>
            </div>
          </div>

          {/* Time & Date Override Settings Row Group */}
          <div className="space-y-1.5" id="settings_time_override_block">
            <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Time & Date Override (Time Machine)</p>
            <div className="bg-white rounded-2xl border border-zinc-200/50 p-3.5 space-y-3 shadow-xs">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-zinc-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" /> Current System Time
                </span>
                <span id="settings_current_system_time_display" className="font-mono text-[9.5px] text-indigo-650 font-extrabold bg-indigo-50 py-0.5 px-2 rounded-lg leading-none">
                  {systemTime.toLocaleDateString([], { month: 'short', day: 'numeric' })} • {systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <p className="text-[8px] text-zinc-400 leading-normal">
                Adjust the central clock state forward or backward. Time stamps across MoniPay and system widgets reflect this detached clock instantly.
              </p>

              {/* Adjusters Row */}
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {[
                  { label: '1 Min', unit: 'minute' },
                  { label: '1 Hr', unit: 'hour' },
                  { label: '1 Day', unit: 'day' },
                  { label: '1 Wk', unit: 'week' },
                  { label: '1 Mo', unit: 'month' }
                ].map((adj) => (
                  <div key={adj.unit} className="space-y-1">
                    <span className="text-[8.5px] font-semibold text-zinc-550 block leading-none">{adj.label}</span>
                    <div className="flex gap-0.5 justify-center">
                      <button
                        id={`time_machine_minus_${adj.unit}`}
                        onClick={() => onChangeTime(adj.unit as any, -1)}
                        className="py-1 bg-zinc-100 hover:bg-rose-50 hover:text-rose-600 rounded text-[9.5px] font-extrabold text-zinc-700 active:scale-90 transition duration-100 flex-1 cursor-pointer"
                        title={`Subtract 1 ${adj.unit}`}
                      >
                        -
                      </button>
                      <button
                        id={`time_machine_plus_${adj.unit}`}
                        onClick={() => onChangeTime(adj.unit as any, 1)}
                        className="py-1 bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-600 text-emerald-600 rounded text-[9.5px] font-extrabold text-zinc-750 active:scale-90 transition duration-100 flex-1 cursor-pointer"
                        title={`Add 1 ${adj.unit}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Central Custom Precise Date/Time Picker */}
              <div className="pt-2 border-t border-zinc-100 space-y-2">
                <span className="text-[8.5px] font-bold text-zinc-500 uppercase tracking-widest block text-[7.5px]">Precise Date/Time Picker</span>
                <div className="flex gap-2 text-left">
                  <div className="flex-1">
                    <span className="text-[7.5px] font-extrabold text-zinc-400 block mb-0.5 uppercase">Set Date</span>
                    <input 
                      id="precise_date_picker"
                      type="date"
                      value={systemTime.toISOString().substring(0, 10)}
                      onChange={(e) => {
                        if (e.target.value) {
                          const [year, month, day] = e.target.value.split('-').map(Number);
                          const newD = new Date(systemTime);
                          newD.setFullYear(year);
                          newD.setMonth(month - 1);
                          newD.setDate(day);
                          setSystemTime(newD);
                        }
                      }}
                      className="w-full p-2 text-xs font-bold font-mono text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400 select-none cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[7.5px] font-extrabold text-zinc-400 block mb-0.5 uppercase">Set Time</span>
                    <input 
                      id="precise_time_picker"
                      type="time"
                      value={systemTime.toTimeString().substring(0, 5)}
                      onChange={(e) => {
                        if (e.target.value) {
                          const [hours, minutes] = e.target.value.split(':').map(Number);
                          const newD = new Date(systemTime);
                          newD.setHours(hours);
                          newD.setMinutes(minutes);
                          setSystemTime(newD);
                        }
                      }}
                      className="w-full p-2 text-xs font-bold font-mono text-zinc-700 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400 select-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Applet Metadata Disclaimer */}
          <div className="bg-zinc-900 text-white rounded-2xl border border-zinc-800 p-3 text-center space-y-1">
            <Info className="w-6 h-6 text-indigo-400 mx-auto" />
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">iPhone 17 Simulator</h4>
            <p className="text-[8px] text-zinc-400 leading-normal">
              Built with high-contrast Tailwind styling and strict interactive state controllers for professional web presentations.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // 14. WALLET APPLICATION
  const renderWalletApp = () => {
    return (
      <div className="flex flex-col h-full bg-zinc-950 text-white font-sans" id="wallet_app_container">
        {/* iOS style elegant wallet header */}
        <div className="p-4 border-b border-zinc-900 shrink-0 flex items-center justify-between">
          <h2 className="text-lg font-black tracking-tight text-white">Apple Wallet</h2>
          <span className="text-[10px] bg-zinc-800 text-zinc-300 py-0.5 px-2 rounded-full font-mono">+ Add Card</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-[9px] uppercase tracking-widest font-mono text-zinc-500">My Titanium & Credit Cards</p>
          <div className="space-y-3.5" id="wallet_cards_list">
            {cards.map(card => (
              <div 
                id={`wallet_card_${card.id}`}
                key={card.id} 
                className={`p-4 bg-gradient-to-br ${card.color} rounded-2xl opacity-90 border border-white/10 hover:opacity-100 transition duration-200 transform hover:scale-102 flex flex-col justify-between aspect-[1.586/1] w-full shadow-lg shadow-black/35`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase text-white/80">{card.name}</span>
                  <span className="text-[9px] bg-white/20 font-mono uppercase px-1.5 py-0.5 rounded text-white">{card.type}</span>
                </div>
                <div className="mt-8">
                  <p className="text-xs text-white/50 font-mono tracking-wider">{card.number}</p>
                  <p className="text-lg font-bold mt-1 text-white">{card.balance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 15. COGNITIVE CLOCK / ALARM LIST
  const renderClockApp = () => {
    const handleAlarmToggle = (id: string) => {
      setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    };

    return (
      <div className="flex flex-col h-full bg-black text-white font-sans" id="clock_app_container">
        <div className="p-4 bg-zinc-950 border-b border-zinc-900 shrink-0 flex justify-between items-center text-none">
          <h2 className="text-md font-bold text-amber-500">Clock Alarms</h2>
          <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500">iPhone 17</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Classic big UTC clock reading */}
          <div className="border border-zinc-800 bg-zinc-950/80 p-4 text-center rounded-2xl">
            <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-mono">Current Simulator Time</p>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1">2:08 PM</h1>
            <p className="text-[9px] text-zinc-400 mt-1">Yonkers (New York) • May 24</p>
          </div>

          <p className="text-[9px] text-zinc-400 uppercase font-mono tracking-widest ml-1 mb-1 block">Saved Alarms</p>
          <div className="space-y-1.5" id="clock_alarms_list">
            {alarms.map(alarm => (
              <div 
                id={`alarm_item_${alarm.id}`}
                key={alarm.id} 
                className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex justify-between items-center transition"
              >
                <div>
                  <h3 className="text-sm font-black text-zinc-200">{alarm.time}</h3>
                  <span className="text-[8px] text-zinc-400">{alarm.label}</span>
                </div>
                <button
                  id={`alarm_toggle_btn_${alarm.id}`}
                  onClick={() => handleAlarmToggle(alarm.id)}
                  className={`w-9 h-5 rounded-full p-0.5 transition ${alarm.enabled ? 'bg-orange-500 flex justify-end' : 'bg-zinc-700 flex justify-start'}`}
                >
                  <span className="w-4 h-4 bg-white rounded-full block shadow-md"></span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // RENDER SHOPIT APP
  // ==========================================
  const renderShopitApp = () => {
    // Styling themes dynamic mappings
    const getThemeStyles = () => {
      switch (shopitTheme) {
        case 'amber':
          return {
            bg: 'bg-[#FAF7F0] text-[#3D3A30]',
            bgCard: 'bg-[#F2ECE1] border border-[#E4D9C4]',
            border: 'border-[#E4D9C4]',
            accent: 'accent-[#C5A880] text-[#A68A5E]',
            accentBg: 'bg-[#C5A880] hover:bg-[#B3966E] text-white',
            input: 'bg-[#F9F5EE] border-[#DCD3C0] text-[#3D3A30] placeholder-[#A29A89]',
            title: 'text-[#4A3E3D] font-bold font-sans',
            pill: 'bg-[#C5A880]/15 text-[#9E8256] border border-[#C5A880]/20',
            textMuted: 'text-[#7D7869]'
          };
        case 'cyber':
          return {
            bg: 'bg-black text-[#00FF66] font-mono',
            bgCard: 'bg-zinc-950 border border-[#00FF66]/35',
            border: 'border-[#00FF66]/30',
            accent: 'accent-[#00FF66] text-[#00FF66]',
            accentBg: 'bg-[#00FF66] hover:bg-[#00DD55] text-black font-extrabold',
            input: 'bg-black border-[#00FF66] text-[#00FF66] placeholder-zinc-700',
            title: 'text-[#00FF66] font-bold uppercase tracking-widest',
            pill: 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30',
            textMuted: 'text-zinc-500'
          };
        case 'blush':
          return {
            bg: 'bg-[#FFF5F5] text-[#5C3D46]',
            bgCard: 'bg-white border border-[#F3D1D1] shadow-xs',
            border: 'border-[#F3D1D1]',
            accent: 'accent-[#D58B95] text-[#C06C7A]',
            accentBg: 'bg-[#D58B95] hover:bg-[#C97B86] text-white',
            input: 'bg-[#FFF9F9] border-[#E5B6B6] text-[#5C3D46] placeholder-[#C69EA9]',
            title: 'text-[#5C3D46] font-semibold tracking-tight',
            pill: 'bg-[#D58B95]/10 text-[#C06C7A] border border-[#D58B95]/15',
            textMuted: 'text-[#8A6D75]'
          };
        case 'cosmic':
        default:
          return {
            bg: 'bg-slate-950 text-slate-100',
            bgCard: 'bg-slate-900/60 border border-slate-800',
            border: 'border-slate-800',
            accent: 'accent-indigo-500 text-indigo-400',
            accentBg: 'bg-indigo-650 hover:bg-indigo-600 text-white',
            input: 'bg-slate-900/80 border border-slate-800 text-white placeholder-slate-650',
            title: 'text-white font-black tracking-tight',
            pill: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/10',
            textMuted: 'text-slate-400'
          };
      }
    };

    const t = getThemeStyles();

    // Price extraction
    const getProductPriceVal = (prod: any) => {
      return prod.usdPrice !== undefined ? prod.usdPrice : prod.price;
    };

    const getProductPriceDisplay = (prod: any) => {
      const usdVal = getProductPriceVal(prod);
      if (shopitMarket === 'local') {
        return `₦${(usdVal * 1500).toLocaleString()}`;
      }
      return `$${usdVal}`;
    };

    const handleAddToCart = (prod: any) => {
      if (prod.stock <= 0) {
        alert("This item is currently out of stock!");
        return;
      }
      
      const updatedCart = [...cart];
      const match = updatedCart.find(it => it.id === prod.id);
      if (match) {
        if (match.quantity >= prod.stock) {
          alert(`You already added the maximum available stock (${prod.stock}) to your cart.`);
          return;
        }
        match.quantity += 1;
      } else {
        updatedCart.push({ ...prod, quantity: 1 });
      }
      setCart(updatedCart);
      onTriggerNotification("Shopit Cart", `Added ${prod.name} to cart.`);
      addLog(`Shopit: Added ${prod.name} to checkout cart.`);
    };

    const removeFromCart = (prodId: string) => {
      const updated = cart.filter(it => it.id !== prodId);
      setCart(updated);
    };

    // Computes cart subtotal based on current active storefront market NGN vs USD
    const cartTotalUSD = cart.reduce((sum, it) => sum + (getProductPriceVal(it) * it.quantity), 0);
    const cartTotalNGN = cartTotalUSD * 1500;

    const handleCheckoutSubmit = () => {
      if (cart.length === 0) {
        alert("Your shopping cart is empty!");
        return;
      }

      // Check credit card
      const cNoClean = checkoutCardNum.replace(/\s/g, '');
      if (cNoClean.length !== 16) {
        alert("Please enter a valid 16-digit card number.");
        return;
      }

      // Enforce international cards beginning with 5
      if (shopitMarket === 'international' && cNoClean[0] !== '5') {
        alert("International checkouts require a Swiss Elite wire credit card (beginning with '5'). Please choose or configure a Polynational Swiss Card.");
        return;
      }

      // Advance to visual confirmation step "Are you sure?"
      setCheckoutStep('confirm');
    };

    const startCheckoutDirectDeduction = () => {
      setCheckoutStep('processing');
      setCheckoutCountdown(3);
      
      let count = 3;
      const interval = setInterval(() => {
        count--;
        setCheckoutCountdown(count);
        if (count === 0) {
          clearInterval(interval);
          executeCheckoutSuccessDeduction();
        }
      }, 1000);
    };

    const executeCheckoutSuccessDeduction = () => {
      const receiptNo = 'SHOP-REC-' + Math.floor(100000 + Math.random() * 900000);
      setCheckoutReceiptId(receiptNo);

      if (shopitMarket === 'local') {
        // MONIPAY NAIRA TRANSACTION DEDUCTION
        const currentBal = parseFloat(localStorage.getItem('monipay_balance') || '148500');
        const nextBal = Math.max(0, currentBal - cartTotalNGN);
        localStorage.setItem('monipay_balance', nextBal.toString());

        const savedMoniTx = localStorage.getItem('monipay_transactions');
        let moniTx = savedMoniTx ? JSON.parse(savedMoniTx) : [];
        const newMoniTx = {
          id: 'tx_shopit_' + Date.now(),
          type: 'outbound' as const,
          title: 'Shopit Local Centre',
          subtitle: `Card • ${checkoutCardNum.replace(/\s/g, '').substring(12)}`,
          amount: cartTotalNGN,
          timeStr: 'Just now'
        };
        localStorage.setItem('monipay_transactions', JSON.stringify([newMoniTx, ...moniTx]));
        window.dispatchEvent(new Event('monipay_external_update'));
      } else {
        // POLYNATIONAL SWISS USD DEDUCTION
        const savedWallets = localStorage.getItem('polynational_wallets') || '{"usd":9480,"eur":4500,"gbp":2800,"ngn":150000}';
        let polynationalWallets = JSON.parse(savedWallets);
        polynationalWallets.usd = Math.max(0, (polynationalWallets.usd || 0) - cartTotalUSD);
        localStorage.setItem('polynational_wallets', JSON.stringify(polynationalWallets));

        const savedPNTx = localStorage.getItem('polynational_transactions');
        let pnTx = savedPNTx ? JSON.parse(savedPNTx) : [];
        const newPNTx = {
          id: 'pn_tx_shopit_' + Date.now(),
          type: 'Debit' as const,
          source: 'Shopit International',
          amount: cartTotalUSD,
          currency: 'USD' as const,
          timestamp: 'Just now'
        };
        localStorage.setItem('polynational_transactions', JSON.stringify([newPNTx, ...pnTx]));
        window.dispatchEvent(new Event('polynational_external_update'));
      }

      // Register items into Storage inventory
      const existingInventoryStr = localStorage.getItem('storage_inventory') || '[]';
      let existingInventory: any[] = [];
      try {
        existingInventory = JSON.parse(existingInventoryStr);
      } catch (e) {}

      const boughtItems = cart.map((it: any) => {
        const itemPriceVal = getProductPriceVal(it);
        const unitPrice = shopitMarket === 'local' ? (itemPriceVal * 1500) : itemPriceVal;
        const formattedPrice = shopitMarket === 'local' ? `₦${unitPrice.toLocaleString()}` : `$${unitPrice}`;
        const currency = shopitMarket === 'local' ? 'NGN' : 'USD';
        return {
          ...it,
          id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          purchaseDate: systemTime.toLocaleDateString() + ' ' + systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          paidPriceText: formattedPrice,
          purchasePrice: unitPrice,
          purchaseCurrency: currency,
          quantity: it.quantity || 1
        };
      });

      localStorage.setItem('storage_inventory', JSON.stringify([...existingInventory, ...boughtItems]));

      const exactAmountString = shopitMarket === 'local' ? `₦${cartTotalNGN.toLocaleString()}` : `$${cartTotalUSD.toLocaleString()}`;
      const sourcePortfolioName = shopitMarket === 'local' ? 'MoniPay Naira Wallet' : 'Polynational Swiss USD';

      const itemsListText = cart.map((it: any) => {
        const itemPriceVal = getProductPriceVal(it);
        const singlePriceStr = shopitMarket === 'local' 
          ? `₦${(itemPriceVal * 1500).toLocaleString()}` 
          : `$${itemPriceVal.toLocaleString()}`;
        const rowTotalStr = shopitMarket === 'local'
          ? `₦${((itemPriceVal * 1500) * (it.quantity || 1)).toLocaleString()}`
          : `$${(itemPriceVal * (it.quantity || 1)).toLocaleString()}`;
        return `- ${it.name} [Qty: ${it.quantity || 1} x ${singlePriceStr} = ${rowTotalStr}]`;
      }).join('\n');

      // Send transactional mail details
      window.dispatchEvent(new CustomEvent('send_virtual_mail', {
        detail: {
          sender: 'Shopit Store',
          senderEmail: 'orders@shopit.com',
          senderPhoto: '🛒',
          toName: 'Edward Azubuike',
          toEmail: myEmail,
          subject: 'Your Shopit Purchase Receipt',
          preview: `Receipt for your purchase of ${cart.length} item(s) • Total Paid: ${exactAmountString}`,
          body: `Dear Edward Azubuike,\n\nYour payment has been cleared successfully via direct API ledger extraction.\n\nOrder & Receipt Details:\n- Invoice No: ${receiptNo}\n- Sourced Portfolio: ${sourcePortfolioName}\n- Amount Cleared: ${exactAmountString}\n- Subtotal: ${exactAmountString}\n- Processing Surcharge: $0.00\n- Status: CAPTURED & CLEARED\n\nPurchased Items:\n${itemsListText}\n\nYour modern items are now safely stored inside your virtual "Storage" registry. Open the Storage App on your home screen to deploy or configure real-time express delivery.\n\nThank you for shopping on Shopit!\nCustomer Checkout Operations`
        }
      }));

      onTriggerNotification("Shopit Store", `🛍️ Pay Complete! Deducted ${exactAmountString} from ${shopitMarket === 'local' ? 'MoniPay' : 'Polynational'}`);

      // Reset cart
      setCart([]);
      localStorage.setItem('shopit_cart', JSON.stringify([]));

      // Reload storage and checkout registers
      window.dispatchEvent(new Event('shopit_cart_updated'));
      window.dispatchEvent(new Event('storage_inventory_updated'));

      setCheckoutStep('receipt');
    };

    const handleAutofillCard = (type: 'monipay' | 'polynational') => {
      // Find dynamic cards first
      const matches = savedCards.filter(c => c.type === type);
      if (matches.length > 0) {
        setCheckoutCardNum(matches[0].number);
      } else {
        setCheckoutCardNum(type === 'monipay' ? '4352 9012 3345 6178' : '5543 9012 5543 1892');
      }
    };

    const handleCreateProduct = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newProdName.trim() || !newProdPrice.trim()) {
        alert("Please enter a name and price!");
        return;
      }

      const inputPrice = parseFloat(newProdPrice);
      const computedUsdPrice = newProdCurrency === 'NGN' ? parseFloat((inputPrice / 1500).toFixed(2)) : inputPrice;

      const imgToUse = newProdImg || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';
      const created = {
        id: 'p_custom_' + Date.now(),
        name: newProdName,
        usdPrice: computedUsdPrice,
        category: newProdCategory,
        stock: parseInt(newProdStock) || 10,
        image: imgToUse,
        description: newProdDesc.trim() || "Elite performance item designed with high-quality custom specifications for long-lasting tier-three operation.",
        rating: parseFloat(newProdRating) || 4.8
      };

      const updatedProds = [created, ...products];
      setProducts(updatedProds);
      localStorage.setItem('shopit_products_v2', JSON.stringify(updatedProds));

      // Reset fields
      setNewProdName('');
      setNewProdPrice('');
      setNewProdStock('10');
      setNewProdImg('');
      setNewProdDesc('');
      setNewProdRating('4.8');
      setNewProdCurrency('USD');

      alert(`✓ Product "${created.name}" created successfully and synced to catalog (${newProdCurrency === 'NGN' ? '₦' + inputPrice.toLocaleString() + ' converted to NGN price' : '$' + computedUsdPrice + ' USD Price'})!`);
      onTriggerNotification("Shopit Admin", `Created and registered product ${created.name}.`);
      addLog(`Shopit Admin: Registered custom item ${created.name} in inventory registers.`);
    };

    const handleImgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            setNewProdImg(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    // Filtered by Category
    const filteredProds = shopitCategory === 'All' 
      ? products 
      : products.filter(p => p.category.toLowerCase() === shopitCategory.toLowerCase());

    return (
      <div className={`flex flex-col h-full ${t.bg} relative font-sans select-none overflow-hidden`} id="shopit_app_panel">
        
        {/* PREMIUM UPPER NAVIGATION HEADER */}
        <div className={`p-3 border-b flex items-center justify-between z-10 shrink-0 ${t.border} bg-black/15`}>
          <div className="flex items-center gap-1.5 text-left">
            <span className="text-sm">🛒</span>
            <div>
              <h2 className={`text-xs uppercase tracking-wider ${t.title} leading-none`}>Shopit Connect</h2>
              <span className={`text-[7.5px] uppercase font-mono tracking-widest leading-none ${t.textMuted}`}>Premium E-Shop</span>
            </div>
          </div>

          {/* Sub-Tabs selection */}
          <div className="flex bg-black/20 p-0.5 rounded-lg border border-white/5">
            <button
              onClick={() => { setShopitTab('store'); }}
              className={`px-2 py-1 rounded text-[8px] font-bold uppercase transition ${shopitTab === 'store' ? t.accentBg : 'text-zinc-400 hover:text-white'}`}
            >
              Store
            </button>
            <button
              onClick={() => { setShopitTab('admin'); }}
              className={`px-2 py-1 rounded text-[8px] font-bold uppercase transition ${shopitTab === 'admin' ? t.accentBg : 'text-zinc-400 hover:text-white'}`}
            >
              Admin
            </button>
            <button
              onClick={() => { setShopitTab('settings'); }}
              className={`px-2 py-1 rounded text-[8px] font-bold uppercase transition ${shopitTab === 'settings' ? t.accentBg : 'text-zinc-400 hover:text-white'}`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* PRIMARY VIEWPORTS */}
        {shopitTab === 'store' ? (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative" id="shopit_storefront_body">
            
            {/* Left Side Product Space */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col space-y-3">
              
              {/* Dynamic Market Selection Banner */}
              <div className={`p-2.5 rounded-2xl ${t.bgCard} flex items-center justify-between shrink-0 text-left`}>
                <div className="space-y-0.5 text-left">
                  <span className="text-[7.5px] uppercase tracking-wider font-extrabold bg-[#00C37A]/10 text-[#00C37A] border border-[#00C37A]/25 px-2 py-0.5 rounded-full inline-block">Center Sourcing</span>
                  <h3 className="text-[11px] font-extrabold text-white">Active Purchasing Node</h3>
                </div>

                <div className="flex bg-black/20 rounded-xl p-0.5 border border-white/5 shrink-0">
                  <button
                    onClick={() => {
                      setShopitMarket('local');
                      onTriggerNotification("Shopit Exchange", "Sourced Market set to Local Centre (Naira prices).");
                    }}
                    className={`px-3 py-1 text-[8.5px] font-black uppercase rounded-lg transition ${shopitMarket === 'local' ? 'bg-[#00C37A] text-black shadow' : 'text-zinc-400'}`}
                  >
                    ₦ Naira
                  </button>
                  <button
                    onClick={() => {
                      setShopitMarket('international');
                      onTriggerNotification("Shopit Exchange", "Sourced Market set to Global Imports ($ USD prices).");
                    }}
                    className={`px-3 py-1 text-[8.5px] font-black uppercase rounded-lg transition ${shopitMarket === 'international' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400'}`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              {/* HORIZONTAL CATEGORY SCROLLER BAR */}
              <div className="shrink-0 flex flex-col text-left space-y-1">
                <span className={`text-[8px] font-bold uppercase font-sans tracking-wide ${t.textMuted} px-1`}>Top Categories</span>
                <div className="scroll-smooth overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none py-1 px-1" id="shopit_category_scroller">
                  {['All', 'Clothes', 'Electronics', 'Cars', 'Food', 'Beauty'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setShopitCategory(cat)}
                      className={`inline-block py-1 px-3 text-[9px] font-bold rounded-lg transition uppercase tracking-wider shrink-0 cursor-pointer ${
                        shopitCategory === cat 
                          ? 'bg-indigo-650 text-white shadow-md border border-indigo-500/30 font-extrabold' 
                          : `${t.bgCard} text-inherit opacity-75 hover:opacity-100`
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* PRODUCTS DYNAMIC CSS GRID */}
              <div className="grid grid-cols-2 gap-2.5" id="shopit_grid_container">
                {filteredProds.map(prod => (
                  <div 
                    id={`shopit_item_${prod.id}`}
                    key={prod.id} 
                    className={`p-2 rounded-2xl flex flex-col justify-between transition hover:scale-98 ${t.bgCard} border ${t.border}`}
                  >
                    {/* Visual Card Trigger */}
                    <div className="space-y-2 text-left cursor-pointer" onClick={() => setSelectedProduct(prod)}>
                      <div className="w-full h-44 rounded-lg overflow-hidden bg-zinc-950/25 relative border border-white/5 flex items-center justify-center">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          referrerPolicy="no-referrer"
                          className="max-w-full max-h-full object-contain select-none pointer-events-none" 
                        />
                        <span className={`absolute top-1.5 right-1.5 text-[7px] font-bold px-1.5 py-0.5 rounded-full uppercase ${t.pill}`}>
                          {prod.category}
                        </span>
                      </div>
                      <div className="space-y-0.5 text-left">
                        <h4 className="text-[10px] font-black leading-snug truncate text-white" title={prod.name}>{prod.name}</h4>
                        <div className="flex justify-between items-center text-[10.5px] font-extrabold mt-0.5 text-left">
                          <span className="text-amber-400 font-mono">{getProductPriceDisplay(prod)}</span>
                          <span className={`text-[8px] px-1 rounded ${prod.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            {prod.stock > 0 ? `${prod.stock} left` : 'Out'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      id={`shopit_add_btn_${prod.id}`}
                      onClick={() => handleAddToCart(prod)}
                      className="w-full mt-2.5 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white font-black text-[9px] rounded-xl tracking-wider uppercase transition active:scale-95 cursor-pointer text-center"
                    >
                      Add To Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side Cart Container block */}
            <div className="w-full md:w-[155px] bg-slate-950/80 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col shrink-0">
              <div className="p-3 border-b border-slate-800 flex justify-between items-center text-none">
                <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase text-left">My Shelf ({cart.reduce((sum, it) => sum + it.quantity, 0)})</p>
                {cart.length > 0 && (
                  <button 
                    id="shopit_clear_cart_btn"
                    onClick={() => setCart([])} 
                    className="text-[8px] text-red-400 hover:text-red-300 font-bold cursor-pointer uppercase text-right"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[140px] md:max-h-none">
                {cart.length === 0 ? (
                  <div className="h-28 flex flex-col items-center justify-center text-center p-2 text-none">
                    <span className="text-lg select-none opacity-20">&#128722;</span>
                    <span className="text-[7.5px] text-slate-500 mt-1 uppercase tracking-widest font-extrabold">Cart Empty</span>
                  </div>
                ) : (
                  cart.map(it => (
                    <div 
                      id={`cart_item_${it.id}`}
                      key={it.id} 
                      className="p-2 bg-slate-900/60 rounded-xl border border-slate-850 flex items-center justify-between text-left relative"
                    >
                      <div className="min-w-0 flex-1 space-y-0.5 text-left">
                        <p className="text-[9px] font-bold truncate text-white leading-none">{it.name}</p>
                        <p className="text-[8px] text-zinc-400 font-mono mt-0.5">
                          {getProductPriceDisplay(it)} &times; {it.quantity}
                        </p>
                      </div>
                      <button
                        id={`cart_delete_btn_${it.id}`}
                        onClick={() => removeFromCart(it.id)}
                        className="text-red-500 hover:text-red-400 p-1 cursor-pointer text-[10px] font-bold shrink-0 text-right"
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Subtotal footer indicators */}
              <div className="p-3 bg-slate-950 border-t border-slate-850 shrink-0 space-y-2">
                <div className="flex justify-between items-center text-[10px] text-left">
                  <span className="text-slate-400 font-sans">Subtotal</span>
                  <span className="text-[#00C37A] font-extrabold font-mono text-[11px] text-right">
                    {shopitMarket === 'local' ? `₦${cartTotalNGN.toLocaleString()}` : `$${cartTotalUSD.toLocaleString()}`}
                  </span>
                </div>
                <button
                  id="shopit_pay_btn"
                  onClick={() => {
                    if (cart.length === 0) {
                      alert("Cart is empty!");
                      return;
                    }
                    setCheckoutStep('init');
                    setCheckoutCountdown(3);
                    const matchingCard = savedCards.find(cd => cd.type === (shopitMarket === 'local' ? 'monipay' : 'polynational'));
                    if (matchingCard) {
                      setCheckoutCardNum(matchingCard.number);
                    } else {
                      setCheckoutCardNum('');
                    }
                    setIsCheckoutOpen(true);
                  }}
                  disabled={cart.length === 0}
                  className="w-full py-2 bg-[#00C37A] hover:bg-[#00B06F] text-black font-black text-[9.5px] uppercase tracking-widest rounded-xl transition duration-150 active:scale-97 disabled:opacity-30 cursor-pointer text-center"
                >
                  Checkout Market
                </button>
              </div>
            </div>
          </div>
        ) : shopitTab === 'admin' ? (
          /* Admin Catalog Portal View */
          <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-8">
            <div className={`p-4 rounded-2xl flex flex-col text-left space-y-1 ${t.bgCard}`}>
              <span className="text-[7px] bg-[#00C37A]/15 text-[#00C37A] border border-[#00C37A]/20 font-black font-mono tracking-wider py-0.5 px-3 rounded-full inline-block uppercase self-start">Manager Terminal</span>
              <h3 className="text-xs font-black text-white mt-1">Manage Catalog & Upload Products</h3>
              <p className={`text-[9.5px] leading-normal ${t.textMuted}`}>Configure product parameters and upload high-fidelity references into persistent device registers in local storage.</p>
            </div>

            <form onSubmit={handleCreateProduct} className={`p-4 rounded-[24px] text-left space-y-3.5 shadow-xl ${t.bgCard}`}>
              <h3 className="text-[10px] font-black uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-1.5 text-white"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> Create Custom Product Form</h3>

              <div className="space-y-3 text-[10px]">
                {/* Product Name */}
                <div className="space-y-1 text-left">
                  <label className="font-bold uppercase opacity-65 text-[7.5px] tracking-wider text-inherit">Product Name</label>
                  <input
                    id="shopit_add_name_input"
                    type="text"
                    required
                    placeholder="e.g. Premium Fleece Jacket"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className={`w-full rounded-xl p-2.5 text-xs ${t.input}`}
                  />
                </div>

                {/* Grid Price & Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="font-bold uppercase opacity-65 text-[7.5px] tracking-wider">Price / Currency</label>
                    <div className="flex gap-1">
                      <select
                        id="shopit_add_currency_select"
                        value={newProdCurrency}
                        onChange={(e) => setNewProdCurrency(e.target.value as 'USD' | 'NGN')}
                        className={`w-[52px] shrink-0 rounded-xl p-2 px-1 text-xs text-white border border-white/5 cursor-pointer bg-black/40 text-center`}
                      >
                        <option value="USD" className="bg-slate-900">$</option>
                        <option value="NGN" className="bg-slate-900">₦</option>
                      </select>
                      <input
                        id="shopit_add_price_input"
                        type="number"
                        required
                        min="1"
                        placeholder="e.g. 89"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className={`flex-1 rounded-xl p-2.5 text-xs ${t.input}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="font-bold uppercase opacity-65 text-[7.5px] tracking-wider">Initial Stock</label>
                    <input
                      id="shopit_add_stock_input"
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 15"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className={`w-full rounded-xl p-2.5 text-xs ${t.input}`}
                    />
                  </div>
                </div>

                {/* Category select - expanded to support new categories */}
                <div className="space-y-1 text-left">
                  <label className="font-bold uppercase opacity-65 text-[7.5px] tracking-wider">Category</label>
                  <select
                    id="shopit_add_cat_select"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className={`w-full rounded-xl p-2.5 text-xs text-white ${t.input}`}
                  >
                    <option value="Clothes">Clothes</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Cars">Cars</option>
                    <option value="Food">Food</option>
                    <option value="Beauty">Beauty</option>
                  </select>
                </div>

                {/* Rating & Short description fields */}
                <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                  <div className="space-y-1 text-left">
                    <label className="font-bold uppercase opacity-65 text-[7.5px] tracking-wider">Rating (1.0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={newProdRating}
                      onChange={(e) => setNewProdRating(e.target.value)}
                      className={`w-full rounded-xl p-2.5 text-xs ${t.input}`}
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="font-bold uppercase opacity-65 text-[7.5px] tracking-wider">Short Description</label>
                    <input
                      type="text"
                      placeholder="e.g. 100% Merino wool"
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      className={`w-full rounded-xl p-2.5 text-xs ${t.input}`}
                    />
                  </div>
                </div>

                {/* Custom File Upload Drag and Drop box */}
                <div className="space-y-1.5 text-left">
                  <label className="font-bold uppercase opacity-65 text-[7.5px] tracking-wider text-zinc-400">Product Image reference</label>
                  <div className={`border border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-black/10 transition relative flex flex-col items-center ${t.border}`}>
                    <input 
                      id="shopit_add_img_file"
                      type="file" 
                      accept="image/*" 
                      onChange={handleImgUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    />
                    <ArrowDown className="w-5 h-5 text-indigo-400 mb-1" />
                    <span className="text-[9px] font-bold text-zinc-300">Drag image here or click to select</span>
                    <span className="text-[7.5px] text-zinc-500 mt-0.5">Base64 converter keeps reference persistent</span>
                  </div>
                  {newProdImg && (
                    <div className="flex items-center gap-2 mt-1 bg-black/30 p-2 rounded-lg text-[9px] border border-white/5 text-left">
                      <img src={newProdImg} className="w-8 h-8 rounded object-cover" />
                      <span className="truncate flex-1 text-emerald-400 font-extrabold text-left">Image loaded successfully!</span>
                      <button type="button" onClick={() => setNewProdImg('')} className="text-red-500 font-bold px-1">&times;</button>
                    </div>
                  )}
                </div>
              </div>

              <button
                id="shopit_add_submit_btn"
                type="submit"
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition duration-150 shadow-md cursor-pointer text-center"
              >
                Insert custom Catalog Item
              </button>
            </form>
          </div>
        ) : (
          /* Custom Settings and Credit Cards Sub-Tab inside Shopit app */
          <div className="flex-1 overflow-y-auto p-3 space-y-4 pb-12 text-left" id="shopit_settings_panel">
            
            {/* Theme Customization Section */}
            <div className={`p-4 rounded-[24px] ${t.bgCard} space-y-3`}>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-white border-b border-white/5 pb-1.5 text-left">Customize Styling Themes</h3>
              <p className="text-[9px] text-zinc-400 leading-normal text-left">Switch the active visual interface style of Shopit instantly. Adjust layouts to suit your context.</p>
              
              <div className="grid grid-cols-2 gap-2 text-left">
                {[
                  { id: 'cosmic', name: '🪐 Cosmic Dark', styles: 'bg-slate-950 border-slate-700 text-slate-100' },
                  { id: 'amber', name: '🌾 Warm Amber', styles: 'bg-[#FAF7F0] border-[#E4D9C4] text-[#4A3E3D]' },
                  { id: 'cyber', name: '📟 Cyber Terminal', styles: 'bg-black border-[#00FF66] text-[#00FF66]' },
                  { id: 'blush', name: '🌷 Blush Pink', styles: 'bg-[#FFF5F5] border-[#F2D7D9] text-[#5C3D46]' }
                ].map(th => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setShopitTheme(th.id);
                      onTriggerNotification("Theme Setup", `Visual environment updated to ${th.name}!`);
                    }}
                    className={`p-2.5 rounded-xl border text-[9.5px] font-bold text-center transition flex justify-between items-center cursor-pointer ${th.styles} ${shopitTheme === th.id ? 'ring-2 ring-indigo-500' : 'opacity-80 hover:opacity-100'}`}
                  >
                    <span>{th.name}</span>
                    {shopitTheme === th.id && <span className="text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Product Inventory Deletion Segment */}
            <div className={`p-4 rounded-[24px] ${t.bgCard} space-y-4`}>
              <div className="border-b border-white/5 pb-2 text-left">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-white">Active Product Catalog</h3>
                <p className="text-[9px] text-zinc-400 mt-1">Permanently remove catalog products from local and international markets.</p>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto" id="shopit_settings_products_delete_list">
                {products.length === 0 ? (
                  <p className="text-[9px] text-zinc-500 text-center font-mono py-4">No products currently in store.</p>
                ) : (
                  products.map(p => (
                    <div key={p.id} className="p-2 bg-black/45 border border-white/5 rounded-xl flex items-center justify-between text-left gap-2.5">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <img src={p.image} className="w-8 h-8 rounded object-cover shrink-0 bg-zinc-800" referrerPolicy="no-referrer" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold text-white truncate">{p.name}</p>
                          <p className="text-[8px] text-zinc-400 font-mono">
                            Category: <span className="text-indigo-400 uppercase">{p.category}</span> • {p.usdPrice !== undefined ? `$${p.usdPrice}` : `₦${p.price?.toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                      {confirmDeleteProductId === p.id ? (
                        <div className="flex items-center gap-1 shrink-0 select-none">
                          <button
                            onClick={() => {
                              const nextProds = products.filter(x => x.id !== p.id);
                              setProducts(nextProds);
                              localStorage.setItem('shopit_products_v2', JSON.stringify(nextProds));
                              onTriggerNotification("Shopit Admin", `Successfully deleted ${p.name}`);
                              setConfirmDeleteProductId(null);
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-[8px] px-2 py-1 rounded-lg cursor-pointer transition uppercase shrink-0"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDeleteProductId(null)}
                            className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-extrabold text-[8px] px-2 py-1 rounded-lg cursor-pointer transition uppercase shrink-0"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteProductId(p.id)}
                          className="text-red-500 hover:text-red-400 p-1.5 focus:outline-none transition shrink-0 cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Credit Cards Wallet Management Section */}
            <div className={`p-4 rounded-[24px] ${t.bgCard} space-y-4`}>
              <div className="border-b border-white/5 pb-2 text-left">
                <h3 className="text-[11px] font-black uppercase tracking-wider text-white">Saved Credit Cards Storage</h3>
                <p className="text-[9px] text-zinc-400 mt-1">Manage credit authorization profiles mapping to system checkouts.</p>
              </div>

              {/* Saved Card List */}
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {savedCards.map(c => (
                  <div key={c.id} className="p-2.5 bg-black/45 border border-white/5 rounded-xl flex items-center justify-between text-left">
                    <div className="space-y-0.5 text-left">
                      <p className="text-[10px] font-bold text-white uppercase">{c.name}</p>
                      <p className="text-[9px] text-zinc-400 font-mono tracking-wide">{c.number} • <span className="text-amber-500 capitalize">{c.type}</span></p>
                      <p className="text-[7.5px] uppercase tracking-wider text-zinc-500">Holder: {c.holder}</p>
                    </div>
                    {savedCards.length > 2 && (
                      <button
                        onClick={() => {
                          const filtr = savedCards.filter(cd => cd.id !== c.id);
                          setSavedCards(filtr);
                          onTriggerNotification("Card Registry", `Deleted card profile ${c.name}.`);
                        }}
                        className="text-red-500 hover:text-red-400 font-extrabold text-[12px] px-1.5 cursor-pointer text-right"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add New Card Form */}
              <div className="bg-black/25 p-3 rounded-xl border border-white/5 space-y-2.5 text-left text-[10px]">
                <h4 className="font-extrabold text-white uppercase text-[8.5px] tracking-widest text-[#00C37A]">Register New Checking Card</h4>
                
                <div className="space-y-1 text-left">
                  <span className="text-[7px] font-bold uppercase tracking-wider text-zinc-400">Card Nickname</span>
                  <input
                    id="new_card_nickname"
                    type="text"
                    placeholder="e.g. My Zenith Naira Virtual"
                    className={`w-full p-2 rounded-lg text-xs ${t.input}`}
                  />
                </div>

                <div className="space-y-1 text-left">
                  <span className="text-[7px] font-bold uppercase tracking-wider text-zinc-400">16-Digit Card Number</span>
                  <input
                    id="new_card_number"
                    type="text"
                    maxLength={19}
                    placeholder="4352 8892 0012 5543"
                    className={`w-full p-2 rounded-lg text-xs font-mono text-center ${t.input}`}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                      e.target.value = v;
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="space-y-1 text-left">
                    <span className="text-[7px] font-bold uppercase tracking-wider text-zinc-400">Issuer Core Network</span>
                    <select
                      id="new_card_issuer"
                      className={`w-full p-2 rounded-lg text-xs tracking-tight text-white ${t.input}`}
                    >
                      <option value="monipay">MoniPay Naira (₦)</option>
                      <option value="polynational">Polynational SWIFT ($)</option>
                    </select>
                  </div>
                  <div className="space-y-1 text-left">
                    <span className="text-[7px] font-bold uppercase tracking-wider text-zinc-400">Holder Legal Name</span>
                    <input
                      id="new_card_holder"
                      type="text"
                      defaultValue="Edward Azubuike"
                      className={`w-full p-2 rounded-lg text-xs ${t.input}`}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const nickEl = document.getElementById('new_card_nickname') as HTMLInputElement;
                    const numEl = document.getElementById('new_card_number') as HTMLInputElement;
                    const issuerEl = document.getElementById('new_card_issuer') as HTMLSelectElement;
                    const holderEl = document.getElementById('new_card_holder') as HTMLInputElement;

                    if (!nickEl?.value.trim() || !numEl?.value.trim()) {
                      alert("Please fill out nickname and credit number!");
                      return;
                    }

                    const clean = numEl.value.replace(/\s/g, '');
                    if (clean.length !== 16) {
                      alert("Your entry must contain exactly 16 decimal digest!");
                      return;
                    }

                    const added = {
                      id: 'card_reg_' + Date.now(),
                      name: nickEl.value,
                      number: numEl.value,
                      type: issuerEl.value,
                      holder: holderEl.value || 'Edward Azubuike'
                    };

                    setSavedCards(prev => [...prev, added]);
                    onTriggerNotification("Card Registry", `Card "${added.name}" registered successfully!`);
                    
                    // Clear fields
                    nickEl.value = '';
                    numEl.value = '';
                  }}
                  className="w-full py-2 bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold uppercase rounded-lg tracking-wider text-[8px] cursor-pointer text-center"
                >
                  Mount Credit Wire Profile Card
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 1. DYNAMIC COMPACT STAR RATING PRODUCT DETAIL ZOOM IN OVERLAY MODAL */}
        {selectedProduct && (
          <div 
            id="shopit_detail_backdrop"
            className="absolute inset-0 bg-black z-50 flex flex-col justify-between text-left animate-fadeIn text-zinc-250 font-sans"
          >
            {/* Dark Sleek Backdrop */}
            <div className="absolute inset-0 bg-[#0c1020]/98 z-0" />

            {/* Exactly same size as uploaded, not magnified */}
            <div className="absolute top-16 bottom-[260px] left-4 right-4 flex items-center justify-center select-none pointer-events-none z-10">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                referrerPolicy="no-referrer"
                className="max-w-full max-h-full object-contain" 
              />
            </div>

            {/* Immersive Floating Action Header */}
            <div className="relative w-full p-4 flex justify-between items-center z-50 pointer-events-auto shrink-0 select-none">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/95 border border-white/10 text-white flex items-center justify-center transition active:scale-90 cursor-pointer shadow-lg shadow-black/40"
                title="Go Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-[7.5px] uppercase font-black tracking-widest bg-[#00C37A] text-black px-3 py-1 rounded-full border border-white/20 shadow-md">
                {selectedProduct.category}
              </span>
            </div>

            {/* Glassmorphic Drawer anchoring the scrollable specs/details at the bottom */}
            <div className="relative z-15 mt-auto w-full flex flex-col pointer-events-auto">
              <div className="backdrop-blur-md bg-zinc-950/80 border-t border-white/10 p-4 rounded-t-[28px] space-y-3.5 shadow-2xl flex flex-col">
                {/* Visual Pull Bar */}
                <div className="w-9 h-1.2 bg-white/20 hover:bg-white/40 rounded-full mx-auto cursor-pointer transition" onClick={() => setSelectedProduct(null)} />

                <div className="space-y-1 text-left">
                  <h3 className="text-[12.5px] font-black uppercase text-white tracking-wide leading-tight">{selectedProduct.name}</h3>
                  <p className="text-[#00C37A] text-xs font-black font-mono">{getProductPriceDisplay(selectedProduct)}</p>
                </div>

                {/* Star Verified Grade Badge */}
                <div className="bg-white/5 p-2 rounded-xl border border-white/5 flex items-center justify-between text-left">
                  <div className="flex items-center gap-1.5 text-left">
                    <span className="text-[10px] font-black text-amber-500 font-mono leading-none">{selectedProduct.rating || 4.8}</span>
                    <div className="flex text-amber-500 leading-none">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          style={{ fill: i < Math.floor(selectedProduct.rating || 4.8) ? 'currentColor' : 'none' }} 
                          className="w-2.5 h-2.5" 
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-[7px] uppercase font-bold text-zinc-400 font-mono tracking-wider">Premium Grade</span>
                </div>

                {/* Description details segment */}
                <div className="space-y-1 text-left">
                  <span className="text-[7.5px] font-bold uppercase text-zinc-400 tracking-wider">Product Specifications</span>
                  <div className="max-h-20 overflow-y-auto text-[8.5px] text-zinc-300 leading-relaxed font-normal bg-black/40 p-2.5 rounded-xl border border-white/5 text-left">
                    {selectedProduct.description || "Premium imported material, built in a dynamic modern profile for high fidelity, durability, and daily use, matching industry gold standard checks."}
                  </div>
                </div>

                {/* Buy Action buttons */}
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setSelectedProduct(null); // Back to catalog
                  }}
                  className="w-full py-2.5 bg-[#00C37A] hover:bg-[#00B06F] text-black font-extrabold text-[9px] uppercase tracking-widest rounded-xl transition duration-150 active:scale-97 cursor-pointer text-center select-none"
                >
                  Buy & Cart Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECURE HIGH FIDELITY SECURE CHECKOUT OVERLAY MODAL */}
        {isCheckoutOpen && (
          <div 
            id="shopit_checkout_modal_backdrop"
            className="absolute inset-0 bg-black/85 flex items-center justify-center p-3 z-50 animate-fadeIn text-left"
          >
            <div 
              id="shopit_checkout_modal_content" 
              className="w-full max-w-[245px] bg-[#0E1530] border border-zinc-800 rounded-3xl p-4 space-y-3 text-left shadow-2xl relative"
            >
              {checkoutStep !== 'processing' && (
                <button 
                  id="checkout_close_modal_btn"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 flex items-center justify-center text-[11px] font-bold cursor-pointer"
                >
                  &times;
                </button>
              )}

              {checkoutStep === 'init' && (
                <>
                  <div className="text-center pb-1">
                    <span className="text-[6.5px] uppercase tracking-widest bg-[#00C37A]/15 text-[#00C37A] font-black px-2 rounded-full border border-emerald-500/15 mb-0.5 inline-block">NFC Payment Tunnel</span>
                    <h3 className="text-xs font-black text-white">Secure Checking Desk</h3>
                    <p className="text-[8px] text-zinc-400 leading-normal">Confirm currency balances and checkout methods below.</p>
                  </div>

                  <div className="space-y-3 text-left text-zinc-200">
                    <div className="bg-black/35 p-2 rounded-xl flex justify-between items-center text-[9px] border border-white/5 font-mono">
                      <span className="text-zinc-400 font-sans text-left">Total Due Amount:</span>
                      <span className="text-amber-400 font-black text-right">
                        {shopitMarket === 'local' ? `₦${cartTotalNGN.toLocaleString()}` : `$${cartTotalUSD.toLocaleString()}`}
                      </span>
                    </div>

                    <div className="p-2 bg-zinc-900/60 rounded-xl border border-zinc-850 text-[8px] space-y-0.5 text-left">
                      <span className="font-bold uppercase tracking-wider text-[#00C37A] block leading-none">
                        {shopitMarket === 'local' ? '✦ LOCAL MARKETS ROUTING' : '✦ WORLD ELITE ROUTING'}
                      </span>
                      <p className="text-zinc-400 leading-normal text-left">
                        {shopitMarket === 'local' 
                          ? "Naira checkouts deduct directly from your MoniPay wallet. Using saved card credentials." 
                          : "Global imports deduct directly from your Polynational Swiss USD portfolio account."
                        }
                      </p>
                    </div>

                    {/* Check if we have select matching saved card */}
                    {savedCards.some(cd => cd.type === (shopitMarket === 'local' ? 'monipay' : 'polynational') && cd.number === checkoutCardNum) ? (
                      // Display elegant saved card block instead of inputs
                      <div className="bg-slate-950 p-3 rounded-2xl border border-white/5 space-y-1 relative text-left">
                        <div className="flex justify-between items-center">
                          <span className="text-[7.5px] uppercase font-bold text-[#00C37A] tracking-wider">💳 Active Checking Card</span>
                          <span className="text-[7.5px] font-bold text-zinc-500 bg-zinc-900 px-1 rounded">Pre-Saved</span>
                        </div>
                        <p className="text-[10px] font-black text-white truncate uppercase m-0 leading-tight">
                          {savedCards.find(cd => cd.type === (shopitMarket === 'local' ? 'monipay' : 'polynational') && cd.number === checkoutCardNum)?.name}
                        </p>
                        <p className="text-[9.5px] text-zinc-300 font-mono tracking-wider m-0">
                          {checkoutCardNum}
                        </p>
                        <p className="text-[7.5px] text-zinc-500 uppercase tracking-widest m-0 leading-none">
                          Owner: {savedCards.find(cd => cd.type === (shopitMarket === 'local' ? 'monipay' : 'polynational') && cd.number === checkoutCardNum)?.holder || 'Edward Azubuike'}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1 text-left">
                          <span className="text-[7.5px] font-black text-zinc-400 uppercase tracking-widest block font-sans">Quick Select Saved Card</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {savedCards.filter(cd => cd.type === (shopitMarket === 'local' ? 'monipay' : 'polynational')).length === 0 ? (
                              <span className="col-span-2 text-center text-[7.5px] text-zinc-400 italic">No saved card configured. See settings tab.</span>
                            ) : (
                              savedCards.filter(cd => cd.type === (shopitMarket === 'local' ? 'monipay' : 'polynational')).map(c => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => setCheckoutCardNum(c.number)}
                                  className="p-1 bg-black/30 border border-white/5 hover:border-[#00C37A]/35 rounded-lg text-[8px] font-bold text-zinc-300 truncate cursor-pointer text-left"
                                  title={c.name}
                                >
                                  💳 {c.name}
                                </button>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="space-y-1 text-left">
                          <label className="text-[7.5px] font-bold uppercase opacity-65 text-zinc-400">16-Digit Card Number</label>
                          <input
                            id="checkout_credit_card_input"
                            type="text"
                            placeholder="xxxx xxxx xxxx xxxx"
                            value={checkoutCardNum}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
                              setCheckoutCardNum(value);
                            }}
                            maxLength={19}
                            className="w-full bg-slate-950 border border-zinc-800 rounded-xl p-2 text-xs font-mono text-white text-center"
                          />
                        </div>
                      </>
                    )}

                    <button
                      id="checkout_modal_action_btn"
                      type="button"
                      onClick={handleCheckoutSubmit}
                      className="w-full py-2.5 bg-[#00C37A] hover:bg-[#00B06F] text-black font-black text-[10px] uppercase tracking-wider rounded-xl shadow-md transition duration-150 active:scale-95 cursor-pointer text-center"
                    >
                      Initiate Secure Checkout
                    </button>
                  </div>
                </>
              )}

              {checkoutStep === 'confirm' && (
                <div className="space-y-3.5 text-center py-2 text-zinc-200">
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-base mx-auto mb-1">❓</div>
                  <h4 className="text-[11px] font-black uppercase text-white tracking-widest text-center m-0 leading-tight">Are you absolutely sure?</h4>
                  <p className="text-[8.5px] text-zinc-300 leading-normal text-center bg-black/30 p-2.5 rounded-xl border border-white/5 m-0">
                    Confirm direct payment of <strong className="text-[#00C37A]">{shopitMarket === 'local' ? `₦${cartTotalNGN.toLocaleString()}` : `$${cartTotalUSD.toLocaleString()}`}</strong> from your {shopitMarket === 'local' ? 'MoniPay Naira Wallet' : 'Polynational Swiss USD portfolio'} via Card **** {checkoutCardNum.replace(/\s/g, '').slice(-4)}.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('init')}
                      className="py-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-bold text-[9px] uppercase tracking-wider rounded-xl cursor-pointer text-center"
                    >
                      No, Cancel
                    </button>
                    <button
                      id="confirm_checkout_yes_btn"
                      type="button"
                      onClick={startCheckoutDirectDeduction}
                      className="py-2 bg-[#00C37A] hover:bg-[#00B06F] text-black font-black text-[9px] uppercase tracking-wider rounded-xl cursor-pointer text-center"
                    >
                      Yes, Checkout
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 'processing' && (
                <div className="space-y-4 text-center py-4 text-zinc-200">
                  <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-t-[#00C37A] border-r-transparent border-b-[#00C37A]/10 border-l-transparent"></div>
                    <span className="absolute text-[11px] font-black text-white font-mono">{checkoutCountdown}s</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10.5px] font-black uppercase text-white tracking-wider animate-pulse m-0 leading-none">Processing Payment</h4>
                    <p className="text-[8px] text-zinc-400 m-0 leading-tight">Deducting funds securely from checking registers...</p>
                  </div>
                </div>
              )}

              {checkoutStep === 'receipt' && (
                <div className="space-y-3 text-zinc-200 text-left">
                  <div className="text-center py-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-[#00C37A] flex items-center justify-center mx-auto text-sm mb-1">✓</div>
                    <h4 className="text-[11px] font-black uppercase text-white tracking-wider m-0 leading-tight">Payment Approved</h4>
                    <p className="text-[7.5px] text-zinc-400 font-mono mt-0.5 m-0 leading-none">ID: {checkoutReceiptId}</p>
                  </div>
                  
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-1.5 text-left text-[8.5px]">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>Payment Source:</span>
                      <strong className="text-white">{shopitMarket === 'local' ? 'MoniPay Balance' : 'Polynational USD'}</strong>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>Card Sourced:</span>
                      <strong className="text-white font-mono">**** {checkoutCardNum.replace(/\s/g, '').slice(-4)}</strong>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400 border-t border-white/5 pt-1.5">
                      <span className="font-bold text-zinc-300">Total Charged:</span>
                      <strong className="text-[#00C37A] font-extrabold font-mono text-[9.5px]">
                        {shopitMarket === 'local' ? `₦${cartTotalNGN.toLocaleString()}` : `$${cartTotalUSD.toLocaleString()}`}
                      </strong>
                    </div>
                  </div>

                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/15 rounded-xl text-[7.5px] text-emerald-400 leading-normal text-left">
                    📬 Transactional receipts have been sent to your Mails inbox. Bought items registered inside your <strong>Storage App</strong>.
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setCheckoutStep('init');
                    }}
                    className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-[9px] uppercase tracking-wider rounded-xl cursor-pointer text-center"
                  >
                    Return to Store
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================================
  // RENDER STORAGE APP
  // ==========================================
  const renderStorageApp = () => {
    const getStorageThemeStyles = () => {
      switch (storageTheme) {
        case 'cyberpunk':
          return {
            bg: 'bg-[#090514] text-pink-400 font-mono',
            bgHeader: 'bg-[#150a29] border-b border-pink-500/35',
            bgCard: 'bg-[#120a22]/90 border border-purple-500/30 text-slate-100',
            input: 'bg-[#0f071e] border border-purple-500/45 text-pink-100 placeholder-purple-700/60',
            button: 'bg-pink-600 hover:bg-pink-500 text-white font-mono',
            badge: 'bg-purple-500/25 text-purple-300 border border-purple-505/20',
            textTitle: 'text-pink-400 font-extrabold font-mono',
            textMuted: 'text-purple-350/50',
            border: 'border-purple-500/20',
            accent: '#EC4899',
          };
        case 'forest':
          return {
            bg: 'bg-[#0B1511] text-emerald-350',
            bgHeader: 'bg-[#081f18] border-b border-emerald-500/25',
            bgCard: 'bg-[#0f241d]/95 border border-emerald-800/40 text-emerald-105',
            input: 'bg-[#06100d] border border-emerald-900 text-emerald-100 placeholder-emerald-905',
            button: 'bg-[#10B981] hover:bg-emerald-500 text-white',
            badge: 'bg-emerald-800/25 text-emerald-300 border border-emerald-700/30',
            textTitle: 'text-emerald-400 font-extrabold',
            textMuted: 'text-emerald-550/50',
            border: 'border-emerald-800/20',
            accent: '#10B981',
          };
        case 'cosmic':
          return {
            bg: 'bg-[#070A15] text-sky-450',
            bgHeader: 'bg-[#0e162d] border-b border-sky-500/25',
            bgCard: 'bg-[#111e3b]/95 border border-sky-900/40 text-sky-100',
            input: 'bg-[#050917] border border-sky-950 text-white placeholder-sky-900',
            button: 'bg-sky-600 hover:bg-sky-505 text-white',
            badge: 'bg-sky-500/25 text-sky-300 border border-sky-500/15',
            textTitle: 'text-sky-305 font-black',
            textMuted: 'text-sky-400/45',
            border: 'border-sky-950',
            accent: '#0EA5E9',
          };
        case 'slate':
        default:
          return {
            bg: 'bg-[#1E293B] text-slate-105',
            bgHeader: 'bg-[#0F172A] border-b border-slate-700',
            bgCard: 'bg-[#0F172A] border border-slate-755 text-slate-100',
            input: 'bg-[#1E293B] border border-slate-700 text-white placeholder-slate-500',
            button: 'bg-indigo-600 hover:bg-indigo-550 text-white',
            badge: 'bg-indigo-500/20 text-indigo-305 border border-indigo-505/15',
            textTitle: 'text-white font-black',
            textMuted: 'text-slate-400',
            border: 'border-slate-755',
            accent: '#6366F1'
          };
      }
    };

    const s = getStorageThemeStyles();

    const handleStartDelivery = (e: React.FormEvent) => {
      e.preventDefault();
      if (!deliveryAddress.trim() || !deliveryLat.trim() || !deliveryLng.trim() || !deliveryItemId) {
        alert("Please complete all delivery coordinates!");
        return;
      }
      
      const qtyToDeliver = parseInt(deliveryQty);
      const matchItem = inventory.find(it => it.id === deliveryItemId);
      if (!matchItem) {
        alert("Selected inventory item not found!");
        return;
      }
      if (qtyToDeliver <= 0 || qtyToDeliver > matchItem.quantity) {
        alert(`Please enter a valid quantity between 1 and ${matchItem.quantity}.`);
        return;
      }

      // Check if there is already an active delivery running
      const running = localStorage.getItem('storage_active_delivery');
      if (running) {
        try {
          const parsed = JSON.parse(running);
          if (parsed && parsed.active) {
            alert("A standard delivery route is already active! Please wait until it completes.");
            return;
          }
        } catch (e) {}
      }

      // Initialize 45-seconds delivery simulation loop!
      const initialDelivery = {
        active: true,
        itemName: matchItem.name,
        qty: qtyToDeliver,
        itemId: matchItem.id,
        address: deliveryAddress,
        startLat: 40.7128,
        startLng: -73.9352,
        targetLat: parseFloat(deliveryLat),
        targetLng: parseFloat(deliveryLng),
        currentLat: 40.7128,
        currentLng: -73.9352,
        progress: 0,
        status: 'Package Dispatched'
      };

      localStorage.setItem('storage_active_delivery', JSON.stringify(initialDelivery));
      setActiveDeliveryState(initialDelivery);

      onTriggerNotification("Delivery Dispatched", `En-route with ${qtyToDeliver}x ${matchItem.name} to ${deliveryAddress}.`);
      addLog(`Storage: En-route dispatch loop started.`);

      // Reset delivery inputs
      setDeliveryAddress('');
      setDeliveryItemId('');
      setDeliveryQty('1');

      // Start the interactive timer ticks
      let currentPercent = 0;
      const stepTimerForLoop = setInterval(() => {
        const saved = localStorage.getItem('storage_active_delivery');
        if (!saved) {
          clearInterval(stepTimerForLoop);
          return;
        }
        
        try {
          const ongoing = JSON.parse(saved);
          if (!ongoing || !ongoing.active) {
            clearInterval(stepTimerForLoop);
            return;
          }

          currentPercent += 2.5;
          
          if (currentPercent >= 100) {
            clearInterval(stepTimerForLoop);
            
            // 1. Decrement inventory item qty
            setInventory(prevInv => {
              const nextInv = prevInv.map(it => {
                if (it.id === ongoing.itemId) {
                  return { ...it, quantity: it.quantity - ongoing.qty };
                }
                return it;
              }).filter(it => it.quantity > 0);
              
              localStorage.setItem('storage_inventory', JSON.stringify(nextInv));
              return nextInv;
            });

            // 2. Resolve Active delivery
            localStorage.removeItem('storage_active_delivery');
            setActiveDeliveryState(null);

            onTriggerNotification("Delivery Completed", `Successfully delivered ${ongoing.qty}x ${ongoing.itemName} to destination!`);
            addLog(`Storage Tracker: Drone safe arrival completed! Inventory adjusted.`);
            window.dispatchEvent(new Event('storage_inventory_updated'));
          } else {
            // STEP TOWARD TARGET GEOLOCATIONS
            const deltaLat = (ongoing.targetLat - ongoing.startLat) * (currentPercent / 100);
            const deltaLng = (ongoing.targetLng - ongoing.startLng) * (currentPercent / 100);
            ongoing.currentLat = parseFloat((ongoing.startLat + deltaLat).toFixed(4));
            ongoing.currentLng = parseFloat((ongoing.startLng + deltaLng).toFixed(4));
            ongoing.progress = Math.min(Math.floor(currentPercent), 100);
            
            if (currentPercent < 30) {
              ongoing.status = 'Pre-Flight Controls';
            } else if (currentPercent < 75) {
              ongoing.status = 'In Air (Cruising)';
            } else {
              ongoing.status = 'Descending On-Site';
            }

            localStorage.setItem('storage_active_delivery', JSON.stringify(ongoing));
            setActiveDeliveryState(ongoing);
          }
        } catch (e) {
          clearInterval(stepTimerForLoop);
        }
      }, 1000);
    };

    const searchFiltered = inventory.filter(it => 
      it.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      it.category.toLowerCase().includes(inventorySearch.toLowerCase())
    );

    return (
      <div className={`flex flex-col h-full ${s.bg} font-sans`} id="storage_app_container">
        {/* Navigation Bar */}
        <div className={`p-3.5 ${s.bgHeader} shrink-0 flex items-center justify-between text-none`}>
          <div className="flex items-center gap-2">
            <div className="w-5.5 h-5.5 rounded bg-indigo-500 flex items-center justify-center text-[10px] font-black tracking-tight text-white shadow-md">&#128230;</div>
            <span className="text-[11px] font-black uppercase text-white tracking-widest">Storage & Delivery</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsStorageSettingsOpen(!isStorageSettingsOpen)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-350 hover:text-white transition cursor-pointer"
              title="Storage Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <span className="text-[8px] bg-[#00C37A]/10 text-[#00C37A] font-black px-2.5 py-0.5 rounded border border-[#00C37A]/20 uppercase font-mono">Drone Carrier</span>
          </div>
        </div>

        {/* Expandable Settings Tab */}
        {isStorageSettingsOpen && (
          <div className={`p-3.5 border-b shrink-0 text-left space-y-3 animate-fadeIn ${s.bgCard}`}>
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] uppercase font-black tracking-widest text-[#00C37A] m-0">Storage Palette Settings</h4>
              <button
                onClick={() => setIsStorageSettingsOpen(false)}
                className="text-xs font-bold text-zinc-400 hover:text-white px-1 cursor-pointer bg-transparent border-none"
              >
                &times;
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[8px] font-bold uppercase tracking-wider text-slate-450 block">Select Visual Theme Style</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'slate', name: 'Slate', color: 'bg-slate-650' },
                  { id: 'cyberpunk', name: 'Cyberpunk', color: 'bg-rose-500' },
                  { id: 'forest', name: 'Forest', color: 'bg-emerald-600' },
                  { id: 'cosmic', name: 'Cosmic', color: 'bg-sky-600' }
                ].map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setStorageTheme(th.id);
                      onTriggerNotification("Storage Tracker", `Changed visual theme style to ${th.name}`);
                    }}
                    className={`py-1.5 px-0.5 rounded-lg text-[9px] font-bold flex flex-col items-center gap-1 border transition cursor-pointer ${
                      storageTheme === th.id
                        ? 'border-[#00C37A] bg-black/40 text-white'
                        : 'border-white/5 bg-black/10 text-slate-400 hover:border-white/10'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${th.color} border border-white/20`}></span>
                    <span>{th.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2 bg-black/35 rounded-xl text-[8px] text-slate-400 leading-normal flex justify-between items-center font-mono">
              <span>Drone Interface Systems:</span>
              <strong className="text-[#00C37A]">STANDBY & SECURE</strong>
            </div>
          </div>
        )}

        {/* Dynamic Island Delivery Banner Status Tracker If Active */}
        {activeDeliveryState && (
          <div className="p-3 bg-indigo-950 border-b border-indigo-900/40 text-left shrink-0 space-y-1 animate-fadeIn" id="storage_active_delivery_info">
            <div className="flex justify-between items-center text-[9px] text-none">
              <div className="flex items-center gap-1.5 font-bold text-amber-500 font-mono animate-pulse text-left">
                <span>&#128666; En-Route Trip Active</span>
              </div>
              <span className="font-bold text-[#00C37A] font-mono">{activeDeliveryState.progress}%</span>
            </div>
            <p className="text-[10px] font-bold text-white text-left leading-none m-0">Delivering {activeDeliveryState.qty}x {activeDeliveryState.itemName}</p>
            <div className="grid grid-cols-2 gap-2 text-[7.5px] font-mono text-slate-400 mt-1">
              <div className="text-left">COORDS: <span className="text-[#00C37A] font-bold">{activeDeliveryState.currentLat}, {activeDeliveryState.currentLng}</span></div>
              <div className="text-right">STATUS: <span className="text-amber-400 font-bold">{activeDeliveryState.status}</span></div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
          
          {/* Dashboard Summary Specs */}
          <div className="grid grid-cols-2 gap-2.5 text-none">
            <div className={`p-2.5 rounded-xl text-left ${s.bgCard}`}>
              <span className={`text-[8px] uppercase tracking-wider font-bold font-sans ${s.textMuted}`}>Total items</span>
              <h2 className="text-md font-black text-white mt-1 font-sans leading-none">{inventory.reduce((sum, item) => sum + item.quantity, 0)}</h2>
            </div>
            <div className={`p-2.5 rounded-xl text-left ${s.bgCard}`}>
              <span className={`text-[8px] uppercase tracking-wider font-bold font-sans ${s.textMuted}`}>Categories</span>
              <h2 className="text-md font-black text-white mt-1 font-sans leading-none">
                {Array.from(new Set(inventory.map(item => item.category))).length}
              </h2>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="storage_search_input"
              type="text"
              placeholder="Search physical inventory..."
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              className={`w-full border rounded-xl py-2 pl-8.5 pr-4 text-xs text-white ${s.input}`}
            />
          </div>

          {/* Inventory Catalog list */}
          <div className="space-y-2">
            <p className="text-[9px] uppercase font-bold text-slate-400 text-left tracking-widest pl-0.5">Physical Goods Box</p>
            {searchFiltered.length === 0 ? (
              <div className={`p-6 text-center text-none rounded-2xl border ${s.bgCard}`}>
                <span className="text-2xl select-none">&#128148;</span>
                <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-wider font-sans">No matching physical goods</p>
              </div>
            ) : (
              searchFiltered.map(it => (
                <div 
                  id={`inventory_item_${it.id}`}
                  key={it.id} 
                  className={`p-2.5 rounded-2xl flex gap-3 text-left transition ${s.bgCard}`}
                >
                  <img src={it.image} className="w-11 h-11 rounded-xl object-cover bg-slate-800 border border-slate-700/60 shrink-0" referrerPolicy="no-referrer" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex justify-between items-start text-none">
                      <h4 className="text-[10.5px] font-black text-white truncate pr-2" title={it.name}>{it.name}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono font-sans ${s.badge}`}>Qty: {it.quantity}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-[8.5px] text-slate-400 font-mono">
                      <span>Cat: <strong className="text-indigo-300 uppercase">{it.category}</strong></span>
                      <span>Price: <strong className="text-emerald-400">{it.paidPriceText || (it.usdPrice ? `$${it.usdPrice}` : `$${it.price || 0}`)}</strong></span>
                    </div>
                    
                    <div className="flex justify-between items-center text-[7.5px] text-slate-500 font-mono">
                      <span>Total Paid: <strong className="text-white">{(it.paidPriceText ? (it.paidPriceText.startsWith('₦') ? '₦' + (it.purchasePrice * it.quantity).toLocaleString() : '$' + (it.purchasePrice * it.quantity).toLocaleString()) : (it.usdPrice ? `$${it.usdPrice * it.quantity}` : `$${(it.price || 0) * it.quantity}`))}</strong></span>
                      <span>{it.purchaseDate || 'Just now'}</span>
                    </div>

                    {/* Remove Product Options and Actions */}
                    <div className="flex justify-end pt-1.5 border-t border-white/5 mt-1">
                      {confirmDeleteId === it.id ? (
                        <div className="flex gap-1 items-center animate-fadeIn">
                          <span className="text-[7px] text-amber-500 font-bold uppercase mr-1">Confirm deletion?</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextInv = inventory.filter(x => x.id !== it.id);
                              setInventory(nextInv);
                              localStorage.setItem('storage_inventory', JSON.stringify(nextInv));
                              setConfirmDeleteId(null);
                              onTriggerNotification("Storage Registry", `Removed item "${it.name}" from your virtual storage.`);
                              addLog(`Storage: Removed item "${it.name}" successfully.`);
                              window.dispatchEvent(new Event('storage_inventory_updated'));
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white font-bold text-[7.5px] px-1.5 py-0.5 rounded uppercase cursor-pointer"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(null);
                            }}
                            className="bg-zinc-700 hover:bg-zinc-650 text-zinc-200 text-[7.5px] px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(it.id);
                          }}
                          className="flex items-center gap-1 py-0.5 px-2 rounded bg-red-650/10 hover:bg-red-500/15 text-rose-450 hover:text-red-400 border border-rose-500/10 transition cursor-pointer text-[7.5px] font-mono"
                          title="Remove from Storage"
                        >
                          <Trash2 className="w-2.5 h-2.5" /> Remove Good
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // RENDER PHONE APP (Fully Featured, Interactive iOS-like Call/Phone Application)
  // ==========================================
  const renderPhoneApp = () => {
    const COUNTRY_CODES = [
      { flag: '🇺🇸', code: '+1', name: 'United States' },
      { flag: '🇳🇬', code: '+234', name: 'Nigeria' },
      { flag: '🇬🇧', code: '+44', name: 'United Kingdom' },
      { flag: '🇨🇦', code: '+1', name: 'Canada' },
      { flag: '🇮🇳', code: '+91', name: 'India' },
      { flag: '🇿🇦', code: '+27', name: 'South Africa' },
      { flag: '🇩🇪', code: '+49', name: 'Germany' },
      { flag: '🇫🇷', code: '+33', name: 'France' },
      { flag: '🇦🇺', code: '+61', name: 'Australia' },
      { flag: '🇸🇬', code: '+65', name: 'Singapore' },
      { flag: '🇧🇷', code: '+55', name: 'Brazil' },
      { flag: '🇯🇵', code: '+81', name: 'Japan' },
    ];

    const CONTACT_GRADIENTS = [
      'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)', // Soft blue-purple (like image 3)
      'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', // Pale magenta-violet
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)', // Sweet blush pink
      'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', // Mint sea
      'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', // Blue metallic
      'linear-gradient(135deg, #fda085 0%, #f6d365 100%)', // Sun Apricot
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Mystic purple
    ];

    const formatDuration = (secs: number) => {
      const min = Math.floor(secs / 60);
      const s = secs % 60;
      return `${min}:${s < 10 ? '0' : ''}${s}`;
    };

    const playDialTone = (digit: string) => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        const freqs: { [key: string]: [number, number] } = {
          '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
          '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
          '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
          '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
        };

        const f = freqs[digit] || [350, 440];
        osc1.frequency.value = f[0];
        osc2.frequency.value = f[1];

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.12);
        osc2.stop(ctx.currentTime + 0.12);
      } catch (e) {}
    };

    const handleKeypadTap = (digit: string) => {
      playDialTone(digit);
      setDialedDigits(prev => prev + digit);
    };

    const handleBackspace = () => {
      setDialedDigits(prev => prev.slice(0, -1));
    };

    const initiateCall = (name: string, number: string) => {
      setActiveCall({
        nameOrNumber: name,
        phoneNumber: number,
        isConnected: false,
        durationSeconds: 0,
        isMuted: false,
        isSpeaker: false
      });
      addLog(`Calling simulated: Dialing ${name} (${number})...`);
    };

    const endCall = () => {
      if (!activeCall) return;
      const durationStr = activeCall.isConnected ? formatDuration(activeCall.durationSeconds) : '0:00';
      const callTimeStr = systemTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Save call to local recents
      const newRecent = {
        id: 'call_' + Date.now(),
        nameOrNumber: activeCall.nameOrNumber,
        phoneNumber: activeCall.phoneNumber,
        timestamp: callTimeStr,
        type: activeCall.isConnected ? 'outgoing' : 'missed',
        duration: durationStr
      };

      setRecents(prev => [newRecent, ...prev]);
      addLog(`Call logged: ${activeCall.nameOrNumber} call ended. Duration: ${durationStr}`);
      setActiveCall(null);
    };

    // Photo input handler for contact compilation
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          if (loadEvt.target?.result) {
            setContactFormPhoto(loadEvt.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const getInitials = (first: string, last: string) => {
      const f = first ? first.charAt(0).toUpperCase() : '';
      const l = last ? last.charAt(0).toUpperCase() : '';
      return f + l || '?';
    };

    // Handle adding contact action
    const handleSaveContact = () => {
      if (!contactFormFirst.trim()) {
        alert("First name is required to save a contact!");
        return;
      }

      const gradientVal = CONTACT_GRADIENTS[contactFormGradientIndex];
      const newContact = {
        id: 'contact_' + Date.now(),
        firstName: contactFormFirst.trim(),
        lastName: contactFormLast.trim(),
        companyName: contactFormCompany.trim(),
        phoneCountryCode: contactFormCountry,
        phoneNumber: contactFormPhone.trim() || 'No number',
        avatarColor: gradientVal,
        photoUrl: contactFormPhoto,
        starred: false
      };

      setContacts(prev => [...prev].concat(newContact));
      addLog(`Contact added: Saved ${newContact.firstName} ${newContact.lastName}`);
      
      // Close forms, clear inputs
      setIsAddingContact(false);
      setContactFormFirst('');
      setContactFormLast('');
      setContactFormCompany('');
      setContactFormCountry('+1');
      setContactFormPhone('');
      setContactFormPhoto(null);
      setContactFormGradientIndex(0);
    };

    // Star/Favorite toggle
    const toggleStarContact = (cid: string) => {
      setContacts(prev => prev.map(c => c.id === cid ? { ...c, starred: !c.starred } : c));
    };

    const handleDeleteContact = (cid: string) => {
      setContacts(prev => prev.filter(c => c.id !== cid));
      setSelectedContactDetail(null);
    };

    // Filtered lists
    const filteredContacts = contacts.filter(c => {
      const full = `${c.firstName} ${c.lastName}`.toLowerCase();
      const num = c.phoneNumber.replace(/[^0-9]/g, '');
      const query = phoneSearchQuery.toLowerCase();
      return full.includes(query) || num.includes(query) || c.phoneNumber.includes(query);
    });

    const contactsGrouped = filteredContacts.reduce((groups: { [key: string]: any[] }, contact) => {
      const letter = contact.firstName.charAt(0).toUpperCase() || '#';
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(contact);
      return groups;
    }, {});

    // Sorted section letters
    const sortedLetters = Object.keys(contactsGrouped).sort();

    // Recents filtering
    const filteredRecents = recents.filter(r => {
      if (recentsSegment === 'missed' && r.type !== 'missed') return false;
      const q = phoneSearchQuery.toLowerCase();
      return r.nameOrNumber.toLowerCase().includes(q) || r.phoneNumber.includes(q);
    });

    const favorites = contacts.filter(c => c.starred);

    return (
      <div className="flex flex-col h-full bg-black text-white p-0 font-sans select-none relative" id="phone_app_container">
        
        {/* ==================================== */}
        {/* TAB SCREENS BODY */}
        {/* ==================================== */}
        <div className="flex-1 overflow-y-auto px-4.5 pt-4 pb-20">
          
          {/* TAB 1: FAVORITES */}
          {phoneActiveTab === 'favorites' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pt-2">
                <span className="text-sky-500 text-xs md:text-sm cursor-pointer hover:opacity-80">Edit</span>
                <Plus className="w-5 h-5 text-sky-500 cursor-pointer hover:opacity-85" onClick={() => {
                  setPhoneActiveTab('contacts');
                }} />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">Favorites</h1>
              
              {favorites.length === 0 ? (
                <div className="h-44 flex flex-col items-center justify-center text-center space-y-2">
                  <Star className="w-10 h-10 text-zinc-650 text-zinc-600 animate-pulse" />
                  <p className="text-zinc-400 font-bold text-xs">No Favorites Yet</p>
                  <p className="text-zinc-550 text-[10px] max-w-[70%] leading-relaxed">Starred contacts live here for fast automated spatial dial workflows.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800 border-t border-zinc-800">
                  {favorites.map(fav => (
                    <div 
                      key={fav.id}
                      className="flex items-center justify-between py-3 cursor-pointer hover:bg-zinc-900/40"
                      onClick={() => setSelectedContactDetail(fav)}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white relative shadow-inner shrink-0 overflow-hidden"
                          style={{ background: fav.photoUrl ? 'none' : fav.avatarColor }}
                        >
                          {fav.photoUrl ? (
                            <img src={fav.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            getInitials(fav.firstName, fav.lastName)
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{fav.firstName} {fav.lastName}</p>
                          <p className="text-[10px] text-zinc-500 font-medium">{fav.phoneNumber}</p>
                        </div>
                      </div>
                      <Phone className="w-4 h-4 text-sky-400 fill-sky-400/10 hover:scale-110 active:scale-95 transition" onClick={(e) => {
                        e.stopPropagation();
                        initiateCall(`${fav.firstName} ${fav.lastName}`, fav.phoneNumber);
                      }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RECENTS (Image 1 replica) */}
          {phoneActiveTab === 'recents' && (
            <div className="space-y-3 pt-1">
              {/* Header bar controls */}
              <div className="flex items-center justify-between py-1">
                <span className="text-sky-500 text-xs md:text-sm font-medium hover:opacity-80 cursor-pointer">Edit</span>
                
                {/* Segment Controls All/Missed */}
                <div className="bg-zinc-850 p-0.5 rounded-lg flex gap-0.5 w-28 text-center shrink-0 border border-zinc-800 shadow-inner">
                  <button 
                    onClick={() => setRecentsSegment('all')}
                    className={`text-[9px] font-bold py-0.5 px-3 rounded-md flex-1 transition-all ${recentsSegment === 'all' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setRecentsSegment('missed')}
                    className={`text-[9px] font-bold py-0.5 px-3 rounded-md flex-1 transition-all ${recentsSegment === 'missed' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    Missed
                  </button>
                </div>
                
                <div className="w-6 h-6 flex items-center justify-end">
                  {recents.length > 0 && (
                    <span 
                      onClick={() => {
                        if (confirm("Clear all simulated call logs?")) setRecents([]);
                      }} 
                      className="text-red-500 font-bold text-[10px] hover:opacity-90 cursor-pointer"
                    >
                      Clear
                    </span>
                  )}
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Recents</h1>

              {/* iOS-styled Search Bar */}
              <div className="relative flex items-center py-0.5">
                <Search className="absolute left-2.5 w-3.5 h-3.5 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full bg-zinc-900 text-zinc-200 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-zinc-800/80 outline-none placeholder-zinc-550 focus:border-zinc-700/80"
                  value={phoneSearchQuery}
                  onChange={(e) => setPhoneSearchQuery(e.target.value)}
                />
              </div>

              {/* Recents list or no recents yet */}
              {filteredRecents.length === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-center space-y-2">
                  <p className="text-zinc-400 font-black text-lg md:text-xl">No Recents</p>
                  <p className="text-zinc-555 text-[10.5px] max-w-[70%] text-zinc-500 leading-normal">
                    {phoneSearchQuery ? "No search results match." : "No actual or simulated calls recorded yet."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800 border-t border-zinc-800">
                  {filteredRecents.map((rec) => {
                    const matchedContact = contacts.find(c => `${c.firstName} ${c.lastName}`.trim() === rec.nameOrNumber);
                    return (
                      <div 
                        key={rec.id}
                        className="flex items-center justify-between py-2.5 hover:bg-zinc-900/30 cursor-pointer"
                        onClick={() => {
                          const contactMatch = contacts.find(c => `${c.firstName} ${c.lastName}`.trim().toLowerCase() === rec.nameOrNumber.toLowerCase() || c.phoneNumber === rec.phoneNumber);
                          if (contactMatch) {
                            setSelectedContactDetail(contactMatch);
                          } else {
                            initiateCall(rec.nameOrNumber, rec.phoneNumber);
                          }
                        }}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Circle matching list */}
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 text-white relative shadow-sm overflow-hidden"
                            style={{ background: matchedContact?.photoUrl ? 'none' : (matchedContact?.avatarColor || 'linear-gradient(135deg, #71717a 0%, #3f3f46 100%)') }}
                          >
                            {matchedContact?.photoUrl ? (
                              <img src={matchedContact.photoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              getInitials(matchedContact?.firstName || rec.nameOrNumber, matchedContact?.lastName || '')
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className={`text-xs font-extrabold truncate ${rec.type === 'missed' ? 'text-red-500' : 'text-white'}`}>
                              {rec.nameOrNumber}
                            </p>
                            <span className="text-[9px] text-zinc-500 font-medium flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5 shrink-0" />
                              {rec.type === 'outgoing' ? 'outgoing' : 'incoming'} • {rec.duration ? `(${rec.duration})` : 'calling'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-550 text-zinc-500 font-semibold shrink-0">{rec.timestamp}</span>
                          <button 
                            className="w-5 h-5 rounded-full border border-sky-500/10 flex items-center justify-center text-sky-500 hover:bg-sky-500/10 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              initiateCall(rec.nameOrNumber, rec.phoneNumber);
                            }}
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTACTS (Image 2 replica) */}
          {phoneActiveTab === 'contacts' && (
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center py-1">
                <span className="text-sky-500 text-xs md:text-sm cursor-pointer hover:opacity-80">Lists</span>
                <Plus className="w-5 h-5 text-sky-500 cursor-pointer hover:opacity-85" onClick={() => setIsAddingContact(true)} />
              </div>

              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none mb-1">Contacts</h1>

              {/* iOS-styled search input */}
              <div className="relative flex items-center py-0.5">
                <Search className="absolute left-2.5 w-3.5 h-3.5 text-zinc-500 animate-duration-1000" />
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full bg-zinc-900 text-zinc-200 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-zinc-800/80 outline-none placeholder-zinc-550 focus:border-zinc-700/80"
                  value={phoneSearchQuery}
                  onChange={(e) => setPhoneSearchQuery(e.target.value)}
                />
              </div>

              {/* User profile row 'My Card' */}
              <div 
                className="flex items-center gap-3 py-2 border-b border-zinc-850 cursor-pointer hover:bg-zinc-900/20"
                onClick={() => setSelectedContactDetail({
                  id: 'c_me',
                  firstName: firstName || 'Edward',
                  lastName: lastName || 'Azubuike',
                  phoneCountryCode: '+1',
                  phoneNumber: 'Edward\'s Personal ID',
                  avatarColor: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  starred: false,
                  isOwner: true
                })}
              >
                <div className="w-13 h-13 rounded-full bg-zinc-700 font-extrabold text-white text-base flex items-center justify-center border border-zinc-800 shadow-md">
                  {getInitials(firstName, lastName)}
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">{firstName} {lastName}</h3>
                  <p className="text-[9.5px] text-zinc-500 font-bold uppercase tracking-wider leading-none mt-0.5">My Card</p>
                </div>
              </div>

              {/* Alphabetic index listing */}
              <div className="relative">
                {sortedLetters.length === 0 ? (
                  <div className="py-20 text-center text-zinc-550 text-xs font-bold text-zinc-500">
                    No contacts match search query.
                  </div>
                ) : (
                  <div className="space-y-4 pr-5">
                    {sortedLetters.map(letter => (
                      <div key={letter} className="space-y-1">
                        {/* Alphabet index header */}
                        <div className="text-[10px] font-black text-sky-450 uppercase border-b border-zinc-850 pb-1 pt-1 tracking-widest pl-1">
                          {letter}
                        </div>
                        {/* List group */}
                        <div className="divide-y divide-zinc-850/60 pl-1">
                          {contactsGrouped[letter].map(contact => (
                            <div 
                              key={contact.id}
                              className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-zinc-950 transition"
                              onClick={() => setSelectedContactDetail(contact)}
                            >
                              <span className="text-xs font-bold text-zinc-250 text-zinc-300">
                                <span className="text-white">{contact.firstName}</span> {contact.lastName}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5 text-zinc-650 text-zinc-600" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Vertical alpha bar along the right edge */}
                <div className="absolute right-0 top-1 bottom-1 flex flex-col items-center justify-center text-[7.5px] font-extrabold text-sky-500/80 space-y-0.5 select-none shrink-0 pointer-events-none pr-1">
                  {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ#').map(char => (
                    <span key={char} className={`${sortedLetters.includes(char) ? 'text-sky-400 font-black' : 'opacity-40'}`}>
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KEYPAD (Sleek layout + dial tones) */}
          {phoneActiveTab === 'keypad' && (
            <div className="flex flex-col h-full justify-between items-center py-1">
              
              {/* Dialed Display output */}
              <div className="w-full text-center h-16 flex flex-col items-center justify-center p-2">
                <p className="text-2xl md:text-3xl font-light text-white font-mono tracking-tight tracking-wider truncate max-w-full">
                  {dialedDigits || ' '}
                </p>
                {dialedDigits && (
                  <button 
                    onClick={() => {
                      setContactFormPhone(dialedDigits);
                      setIsAddingContact(true);
                    }}
                    className="text-[9.5px] text-sky-400 font-bold hover:underline mt-1 cursor-pointer"
                  >
                    Add Number
                  </button>
                )}
              </div>

              {/* Keyboard Grid */}
              <div className="grid grid-cols-3 gap-x-5.5 gap-y-3.5 max-w-[260px] mx-auto pt-2 pb-4">
                {[
                  { main: '1', sub: ' ' },
                  { main: '2', sub: 'A B C' },
                  { main: '3', sub: 'D E F' },
                  { main: '4', sub: 'G H I' },
                  { main: '5', sub: 'J K L' },
                  { main: '6', sub: 'M N O' },
                  { main: '7', sub: 'P Q R S' },
                  { main: '8', sub: 'T U V' },
                  { main: '9', sub: 'W X Y Z' },
                  { main: '*', sub: ' ' },
                  { main: '0', sub: '+' },
                  { main: '#', sub: ' ' }
                ].map(key => (
                  <button
                    key={key.main}
                    onClick={() => handleKeypadTap(key.main)}
                    className="w-14 h-14 md:w-15 md:h-15 rounded-full bg-zinc-850 hover:bg-zinc-750 active:bg-zinc-650 text-white flex flex-col items-center justify-center leading-none transition duration-100 cursor-pointer shadow-sm select-none"
                  >
                    <span className="text-lg font-extrabold">{key.main}</span>
                    <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{key.sub}</span>
                  </button>
                ))}
              </div>

              {/* Outermost functional bar for keypad dial & deleting keys */}
              <div className="w-full max-w-[260px] flex items-center justify-between relative mt-1 select-none">
                <div className="w-14 h-14" /> {/* spacer */}
                
                {/* Big dial key */}
                <button
                  onClick={() => {
                    if (!dialedDigits) return;
                    initiateCall('Unknown Number', dialedDigits);
                  }}
                  disabled={!dialedDigits}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition active:scale-95 duration-100 cursor-pointer ${dialedDigits ? 'bg-emerald-500 hover:bg-emerald-450 text-white' : 'bg-emerald-800/30 text-emerald-700/60 cursor-not-allowed'}`}
                >
                  <Phone className="w-6 h-6 fill-current" />
                </button>

                {/* Delete backspace */}
                {dialedDigits ? (
                  <button
                    onClick={handleBackspace}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition cursor-pointer select-none"
                  >
                    <span className="text-xs font-bold leading-none bg-zinc-850 rounded-full px-2.5 py-1 text-[10px] uppercase font-mono tracking-widest">Del</span>
                  </button>
                ) : (
                  <div className="w-14 h-14" />
                )}
              </div>

            </div>
          )}

          {/* TAB 5: VOICEMAIL */}
          {phoneActiveTab === 'voicemail' && (
            <div className="space-y-4 pt-4">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">Voicemail</h1>
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                <Voicemail className="w-12 h-12 text-zinc-650 text-zinc-600 scale-125" />
                <p className="text-zinc-400 font-extrabold text-sm mt-3">No Voicemail Available</p>
                <p className="text-zinc-550 text-[10px] max-w-[70%] text-zinc-500">No voice mailbox is active on this carrier sim card profile.</p>
                <button 
                  onClick={() => initiateCall('Voicemail Portal', '*86')}
                  className="bg-zinc-800 hover:bg-zinc-700 hover:scale-105 select-none active:scale-95 transition text-[9px] font-black tracking-widest uppercase border border-zinc-700 px-4 py-2 mt-4 rounded-xl cursor-pointer shadow-sm text-sky-400"
                >
                  Call Voicemail Port
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ==================================== */}
        {/* NEW CONTACT OVERLAY (Image 3 replica) */}
        {/* ==================================== */}
        <AnimatePresence>
          {isAddingContact && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 240 }}
              className="absolute inset-0 bg-zinc-950/98 z-50 flex flex-col justify-between overflow-hidden"
              id="new_contact_modal_sheet"
            >
              {/* Image 3 header circles bar */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950/80 shrink-0 select-none">
                
                {/* Cancel button: standard X inside a circle */}
                <button 
                  onClick={() => setIsAddingContact(false)}
                  className="w-8 h-8 rounded-full bg-zinc-850 hover:bg-zinc-800 flex items-center justify-center text-red-500 transition-all cursor-pointer shadow"
                >
                  <X className="w-4 h-4" />
                </button>

                <span className="text-xs font-bold text-white tracking-wide">New Contact</span>

                {/* Save button: checkmark circle */}
                <button 
                  onClick={handleSaveContact}
                  className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center text-white transition-all cursor-pointer shadow-md shadow-sky-900/20"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>

              {/* Form viewport */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 select-none bg-zinc-950">
                
                {/* Visual Circle Initial/Photo and select-gradient controls */}
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  
                  {/* The profile circle matching image 3 */}
                  <div 
                    onClick={() => {
                      // Cycle gradient indices to toggle background colors!
                      setContactFormGradientIndex(prev => (prev + 1) % CONTACT_GRADIENTS.length);
                    }}
                    className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-extrabold text-white shadow-xl cursor-pointer relative group border border-zinc-800 overflow-hidden"
                    style={{ background: contactFormPhoto ? 'none' : CONTACT_GRADIENTS[contactFormGradientIndex] }}
                    title="Tap to change initials background color gradient!"
                  >
                    {contactFormPhoto ? (
                      <img src={contactFormPhoto} alt="Uploaded headshot" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(contactFormFirst, contactFormLast)
                    )}

                    {/* Quick overlay tooltip instructions */}
                    <div className="absolute inset-0 bg-black/40 text-[7px] font-mono select-none uppercase tracking-widest leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-zinc-300">
                      Color Cycle
                    </div>
                  </div>

                  {/* Add photo action */}
                  <label 
                    htmlFor="contact_photo_input" 
                    className="bg-zinc-850 hover:bg-zinc-800 text-[10px] font-black text-sky-400 tracking-wider px-3.5 py-1.5 rounded-full select-none cursor-pointer border border-zinc-800 hover:scale-105 active:scale-95 transition"
                  >
                    Add Photo
                  </label>
                  <input 
                    type="file" 
                    id="contact_photo_input" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </div>

                {/* Structured form inputs card stack */}
                <div className="space-y-4">
                  {/* Core names group card */}
                  <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-1 divide-y divide-zinc-850/60 shadow">
                    <input 
                      type="text" 
                      placeholder="First Name" 
                      className="w-full bg-transparent text-white text-xs px-3.5 py-3.5 outline-none placeholder-zinc-500 font-medium"
                      value={contactFormFirst}
                      onChange={(e) => setContactFormFirst(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Last Name" 
                      className="w-full bg-transparent text-white text-xs px-3.5 py-3.5 outline-none placeholder-zinc-500 font-medium"
                      value={contactFormLast}
                      onChange={(e) => setContactFormLast(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="Company" 
                      className="w-full bg-transparent text-white text-xs px-3.5 py-3.5 outline-none placeholder-zinc-500 font-medium"
                      value={contactFormCompany}
                      onChange={(e) => setContactFormCompany(e.target.value)}
                    />
                  </div>

                  {/* Mobile phones collection matching exact image 3 structure */}
                  <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-1.5 shadow space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9.5px] font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded border border-rose-500/10 uppercase shrink-0">mobile</span>
                      
                      {/* Select country codes */}
                      <select 
                        className="bg-zinc-950 text-zinc-300 border border-zinc-800 text-[10.5px] py-1 px-1.5 rounded outline-none font-bold shrink-0 cursor-pointer"
                        value={contactFormCountry}
                        onChange={(e) => setContactFormCountry(e.target.value)}
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.name} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>

                      {/* Number inputs list */}
                      <input 
                        type="text" 
                        placeholder="Phone Number" 
                        className="flex-1 bg-zinc-950 text-white text-xs px-3 py-2 rounded border border-zinc-800 outline-none font-mono tracking-wider placeholder-zinc-650"
                        value={contactFormPhone}
                        onChange={(e) => setContactFormPhone(e.target.value)}
                      />
                    </div>
                    <div className="pt-1.5 pl-1.5 flex items-center gap-1.5 text-[9.5px] font-black text-sky-400">
                      <Plus className="w-3.5 h-3.5" /> add phone row
                    </div>
                  </div>

                  {/* General Ringtone section indicator */}
                  <div className="bg-zinc-900 border border-zinc-850 rounded-2xl px-4 py-3 flex justify-between items-center text-xs select-none shadow">
                    <span className="font-bold text-zinc-300">Ringtone</span>
                    <span className="text-zinc-500 font-medium">Default</span>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================================== */}
        {/* CONTACT VIEW DETAILS MODAL */}
        {/* ==================================== */}
        <AnimatePresence>
          {selectedContactDetail && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 bg-black/98 z-40 flex flex-col justify-between overflow-hidden"
              id="contact_detail_view_overlay"
            >
              {/* Detail header */}
              <div className="flex items-center justify-between p-4 border-b border-zinc-900 shrink-0">
                <button 
                  onClick={() => setSelectedContactDetail(null)}
                  className="text-sky-500 text-xs md:text-sm font-bold flex items-center gap-1 hover:opacity-80 transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <span className="text-xs font-bold text-zinc-400">Card details</span>
                <button 
                  onClick={() => toggleStarContact(selectedContactDetail.id)}
                  className="text-yellow-400 hover:scale-110 active:scale-90 transition cursor-pointer"
                >
                  <Star className={`w-4.5 h-4.5 ${selectedContactDetail.starred ? 'fill-current' : 'text-zinc-500'}`} />
                </button>
              </div>

              {/* View layout */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 select-none">
                
                {/* Big headshot circle matching details */}
                <div className="flex flex-col items-center justify-center py-6 space-y-3">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-4xl font-extrabold text-white shadow-xl relative overflow-hidden"
                    style={{ background: selectedContactDetail.photoUrl ? 'none' : selectedContactDetail.avatarColor }}
                  >
                    {selectedContactDetail.photoUrl ? (
                      <img src={selectedContactDetail.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(selectedContactDetail.firstName, selectedContactDetail.lastName || '')
                    )}
                  </div>
                  <h2 className="text-lg md:text-xl font-black text-white text-center">
                    {selectedContactDetail.firstName} {selectedContactDetail.lastName}
                  </h2>
                  {selectedContactDetail.companyName && (
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0">{selectedContactDetail.companyName}</p>
                  )}
                </div>

                {/* Sub-actions buttons stack */}
                <div className="grid grid-cols-4 gap-2.5 max-w-[280px] mx-auto text-center shrink-0">
                  <button 
                    onClick={() => initiateCall(`${selectedContactDetail.firstName} ${selectedContactDetail.lastName || ''}`, selectedContactDetail.phoneNumber)}
                    className="flex flex-col items-center justify-center gap-1.5 p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 rounded-2xl hover:scale-105 active:scale-95 transition cursor-pointer"
                  >
                    <Phone className="w-4.5 h-4.5 text-sky-400 fill-sky-400/5 animate-duration-1000" />
                    <span className="text-[8.5px] font-bold text-zinc-400">call</span>
                  </button>
                  <button 
                    className="flex flex-col items-center justify-center gap-1.5 p-2 bg-zinc-900 border border-zinc-850 rounded-2xl opacity-40 cursor-not-allowed"
                    disabled
                  >
                    <Mail className="w-4.5 h-4.5 text-zinc-400" />
                    <span className="text-[8.5px] font-bold text-zinc-400">message</span>
                  </button>
                  <button 
                    className="flex flex-col items-center justify-center gap-1.5 p-2 bg-zinc-900 border border-zinc-850 rounded-2xl opacity-40 cursor-not-allowed"
                    disabled
                  >
                    <Video className="w-4.5 h-4.5 text-zinc-400" />
                    <span className="text-[8.5px] font-bold text-zinc-400">video</span>
                  </button>
                  <button 
                    className="flex flex-col items-center justify-center gap-1.5 p-2 bg-zinc-900 border border-zinc-850 rounded-2xl opacity-40 cursor-not-allowed"
                    disabled
                  >
                    <Mail className="w-4.5 h-4.5 text-zinc-400 animate-duration-1000" />
                    <span className="text-[8.5px] font-bold text-zinc-400">mail</span>
                  </button>
                </div>

                {/* Number lists */}
                <div className="space-y-4">
                  <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-4 space-y-1 shadow">
                    <p className="text-[8.5px] text-zinc-500 font-black uppercase tracking-wider">mobile</p>
                    <p className="text-sm font-bold text-white font-mono tracking-wide">{selectedContactDetail.phoneCountryCode} {selectedContactDetail.phoneNumber}</p>
                  </div>
                </div>

              </div>

              {/* Bottom control row */}
              {!selectedContactDetail.isOwner && (
                <div className="p-4 border-t border-zinc-900 bg-zinc-950 shrink-0 select-none">
                  <button 
                    onClick={() => handleDeleteContact(selectedContactDetail.id)}
                    className="w-full bg-red-650/10 hover:bg-red-500/20 text-rose-500 text-xs font-bold border border-red-500/20 py-3 rounded-2xl select-none transition cursor-pointer text-center"
                  >
                    Delete Contact
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================================== */}
        {/* ACTIVE CALL VIEW SHEET OVERLAY */}
        {/* ==================================== */}
        <AnimatePresence>
          {activeCall && (
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="absolute inset-0 bg-[#09090b]/98 z-50 flex flex-col justify-between p-6 overflow-hidden select-none"
              id="active_phone_calling_screen"
            >
              {/* Caller state */}
              <div className="flex flex-col items-center text-center space-y-2.5 pt-10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#00C37A] bg-[#00C37A]/10 px-3 py-1 rounded-full space-x-1 animate-pulse shrink-0">
                  ● GSM Line Simulated
                </span>
                
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight pt-2">
                  {activeCall.nameOrNumber}
                </h1>
                
                <p className="text-xs font-bold text-zinc-500 tracking-wide font-mono">
                  {activeCall.phoneNumber}
                </p>

                {/* Status timer count */}
                <span className="text-sm font-black text-white font-mono h-6 pt-1 flex items-center justify-center">
                  {activeCall.isConnected ? (
                    <span className="text-sky-400 font-black">{formatDuration(activeCall.durationSeconds)}</span>
                  ) : (
                    <span className="text-zinc-500 animate-pulse tracking-wide font-semibold text-[11px] uppercase">calling...</span>
                  )}
                </span>
              </div>

              {/* Central stylized pulsing wave ring for dialing realism */}
              <div className="flex-1 flex items-center justify-center select-none py-4">
                <div className="relative flex items-center justify-center">
                  <span className={`absolute w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0 ${activeCall.isConnected ? 'animate-ping' : ''}`} />
                  <div className="w-18 h-18 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-extrabold text-white text-base shadow">
                    {getInitials(activeCall.nameOrNumber, '')}
                  </div>
                </div>
              </div>

              {/* Call Control Keyboard Grid Stack */}
              <div className="max-w-[240px] mx-auto grid grid-cols-3 gap-x-6 gap-y-4 mb-10 shrink-0">
                
                {/* Button Mute */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => setActiveCall(prev => prev ? { ...prev, isMuted: !prev.isMuted } : null)}
                    className={`w-13 h-13 rounded-full flex items-center justify-center border transition-all cursor-pointer ${activeCall.isMuted ? 'bg-white border-white text-black' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white'}`}
                  >
                    {activeCall.isMuted ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                  <span className="text-[8px] font-black uppercase text-zinc-500 mt-1">mute</span>
                </div>

                {/* Button Keypad */}
                <div className="flex flex-col items-center opacity-40 cursor-not-allowed">
                  <button className="w-13 h-13 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white" disabled>
                    <Grid className="w-5 h-5" />
                  </button>
                  <span className="text-[8px] font-black uppercase text-zinc-500 mt-1">keypad</span>
                </div>

                {/* Button Speaker */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => setActiveCall(prev => prev ? { ...prev, isSpeaker: !prev.isSpeaker } : null)}
                    className={`w-13 h-13 rounded-full flex items-center justify-center border transition-all cursor-pointer ${activeCall.isSpeaker ? 'bg-white border-white text-black' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white'}`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <span className="text-[8px] font-black uppercase text-zinc-500 mt-1">speaker</span>
                </div>

              </div>

              {/* Bottom end call bar */}
              <div className="flex justify-center shrink-0 mb-6">
                <button
                  onClick={endCall}
                  className="w-16 h-16 rounded-full bg-red-650 bg-rose-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <Phone className="w-7 h-7 rotate-[135deg] fill-current" />
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* ==================================== */}
        {/* BOTTOM REALISTIC TABS SWITCH NAVIGATION BAR */}
        {/* ==================================== */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-zinc-950/95 border-t border-zinc-900 h-[50px] flex justify-around items-center select-none z-30 shadow-2xl overflow-hidden px-1"
          id="phone_bottom_tabs_bar"
        >
          {[
            { id: 'favorites', label: 'Favorites', icon: Star },
            { id: 'recents', label: 'Recents', icon: Clock, badge: recents.length === 0 ? null : recents.length },
            { id: 'contacts', label: 'Contacts', icon: User },
            { id: 'keypad', label: 'Keypad', icon: Grid },
            { id: 'voicemail', label: 'Voicemail', icon: Voicemail }
          ].map(tab => {
            const IconComponent = tab.icon;
            const isActive = phoneActiveTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`phone_tab_${tab.id}`}
                onClick={() => setPhoneActiveTab(tab.id as any)}
                className="flex flex-col items-center justify-center py-1.5 flex-1 relative cursor-pointer"
              >
                <div className="relative">
                  <IconComponent className={`w-4 h-4 transition ${isActive ? 'text-sky-500 scale-105' : 'text-zinc-550 text-zinc-500 hover:text-zinc-450'}`} />
                  
                  {/* Badge notifier */}
                  {tab.badge !== null && tab.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2 bg-red-505 bg-rose-600 border border-zinc-950 text-white font-black text-[7.5px] rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none scale-90">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[8px] font-bold tracking-tight mt-0.5 ${isActive ? 'text-sky-400 font-black' : 'text-zinc-500'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    );
  };

  // 10. CALCULATOR APP (Fully functional, pixel-perfect iOS theme)
  const renderCalculatorApp = () => {
    // Button click engine
    const handleCalcPress = (val: string) => {
      if (val === 'AC') {
        setCalcDisplay('0');
        setCalcEquation('');
        setCalcStoredValue(null);
        setCalcPendingOp(null);
        setCalcShouldReset(false);
      } else if (val === '+/-') {
        if (calcDisplay !== '0') {
          if (calcDisplay.startsWith('-')) {
            setCalcDisplay(calcDisplay.substring(1));
          } else {
            setCalcDisplay('-' + calcDisplay);
          }
        }
      } else if (val === '%') {
        const num = parseFloat(calcDisplay);
        if (!isNaN(num)) {
          setCalcDisplay((num / 100).toString());
        }
      } else if (['/', '*', '-', '+'].includes(val)) {
        const num = parseFloat(calcDisplay);
        setCalcStoredValue(num);
        setCalcPendingOp(val);
        setCalcShouldReset(true);
        setCalcEquation(calcDisplay + ' ' + (val === '/' ? '÷' : val === '*' ? '×' : val === '+' ? '+' : '-') + ' ');
      } else if (val === '=') {
        if (calcPendingOp && calcStoredValue !== null) {
          const current = parseFloat(calcDisplay);
          let result = 0;
          switch (calcPendingOp) {
            case '+': result = calcStoredValue + current; break;
            case '-': result = calcStoredValue - current; break;
            case '*': result = calcStoredValue * current; break;
            case '/': result = calcPendingOp === '/' && current === 0 ? 0 : calcStoredValue / current; break;
          }
          // Format output correctly, round decimal points
          const roundedResult = Math.round(result * 1000000000) / 1000000000;
          setCalcDisplay(roundedResult.toString());
          setCalcEquation('');
          setCalcStoredValue(null);
          setCalcPendingOp(null);
          setCalcShouldReset(true);
        }
      } else if (val === '.') {
        if (calcShouldReset) {
          setCalcDisplay('0.');
          setCalcShouldReset(false);
        } else if (!calcDisplay.includes('.')) {
          setCalcDisplay(calcDisplay + '.');
        }
      } else {
        // Digits
        if (calcDisplay === '0' || calcShouldReset) {
          setCalcDisplay(val);
          setCalcShouldReset(false);
        } else {
          // Max length check to prevent overflow
          if (calcDisplay.length < 9) {
            setCalcDisplay(calcDisplay + val);
          }
        }
      }
    };

    const buttons = [
      ['AC', '+/-', '%', '/'],
      ['7', '8', '9', '*'],
      ['4', '5', '6', '-'],
      ['1', '2', '3', '+'],
      ['0', '.', '=']
    ];

    const getBtnStyle = (val: string) => {
      if (['AC', '+/-', '%'].includes(val)) {
        return "bg-[#a5a5a5] text-black active:bg-[#d9d9d9]";
      }
      if (['/', '*', '-', '+', '='].includes(val)) {
        const isActive = calcPendingOp === val && !calcShouldReset && val !== '=';
        return isActive 
          ? "bg-white text-[#f1a33c] active:bg-[#fbcb8b]" 
          : "bg-[#f1a33c] text-white active:bg-[#fbcb8b]";
      }
      return "bg-[#333333] text-white active:bg-[#737373]";
    };

    const getBtnLabel = (val: string) => {
      switch (val) {
        case '/': return '÷';
        case '*': return '×';
        default: return val;
      }
    };

    return (
      <div className="flex flex-col h-full bg-black text-white p-4 font-sans select-none justify-between" id="calculator_app_container">
        {/* Sleek status indicators */}
        <div className="flex-1 flex flex-col justify-end pb-3 text-right">
          {calcEquation && (
            <p className="text-zinc-500 font-mono text-[11px] mb-1 tracking-wider h-4 text-right pr-2">
              {calcEquation}
            </p>
          )}
          <h1 className="text-5xl font-light tracking-tight text-white font-sans text-right pr-2 truncate">
            {calcDisplay}
          </h1>
        </div>

        {/* Buttons grid */}
        <div className="grid grid-cols-4 gap-2 pb-2" id="calc_buttons_grid">
          {buttons.map((row, idx) => {
            if (idx === 4) {
              // Row 0, ., =
              return row.map(btn => (
                <button
                  key={btn}
                  id={`calc_btn_${btn === '.' ? 'dot' : btn}`}
                  onClick={() => handleCalcPress(btn)}
                  className={`h-14 font-medium text-lg rounded-full flex items-center transition-all cursor-pointer ${
                    btn === '0' 
                      ? 'col-span-2 px-6 justify-start ' + getBtnStyle(btn)
                      : 'justify-center ' + getBtnStyle(btn)
                  }`}
                >
                  {btn}
                </button>
              ));
            }
            return row.map(btn => (
              <button
                key={btn}
                id={`calc_btn_${btn}`}
                onClick={() => handleCalcPress(btn)}
                className={`h-14 rounded-full flex items-center justify-center font-medium text-lg transition-all cursor-pointer ${getBtnStyle(btn)}`}
              >
                {getBtnLabel(btn)}
              </button>
            ));
          })}
        </div>
      </div>
    );
  };

  // MAIN ROUTING ACCORDING TO USER'S APP CLICK
  switch (appId) {
    case 'phone': return renderPhoneApp();
    case 'calculator': return renderCalculatorApp();
    case 'notes': return renderNotesApp();
    case 'reminders': return renderRemindersApp();
    case 'calendar': return renderCalendarApp();
    case 'mail': return renderMailApp();
    case 'messages': return renderMessagesApp();
    case 'photos': return renderPhotosApp();
    case 'camera': return renderCameraApp();
    case 'music': return renderMusicApp();
    case 'safari': return renderSafariApp();
    case 'appstore': return renderAppStoreApp();
    case 'maps': return renderMapsApp();
    case 'health': return renderHealthApp();
    case 'settings': return renderSettingsApp();
    case 'wallet': return renderWalletApp();
    case 'clock': return renderClockApp();
    case 'shopit': return renderShopitApp();
    case 'storage': return renderStorageApp();
    case 'monipay':
      return (
        <MoniPayApp 
          systemTime={systemTime}
          onTriggerNotification={onTriggerNotification}
          addLog={addLog}
          pendingPayment={pendingPayment}
          setPendingPayment={setPendingPayment}
        />
      );
    case 'polynational':
      return (
        <PolynationalApp 
          systemTime={systemTime}
          onTriggerNotification={onTriggerNotification}
          addLog={addLog}
          pendingPayment={pendingPayment}
          setPendingPayment={setPendingPayment}
        />
      );
    default:
      return (
        <div className="p-4 bg-zinc-100 col-span-full h-full flex flex-col justify-center items-center text-center">
          <AlertCircle className="w-8 h-8 text-indigo-500 mb-2" />
          <h3 className="text-xs font-bold uppercase text-zinc-700">App simulated is being developed</h3>
          <p className="text-[10px] text-zinc-400 mt-1 max-w-[80%] leading-normal">
            We support complete responsive mock layers for Calendar, Notes, Reminders, Mail, Clock, Maps, Music, App Store, Health, Wallet, Settings, Camera, Photos, messages, and Safari!
          </p>
        </div>
      );
  }
};
