import { AppConfig, Note, Reminder, CalendarEvent, MailMessage, ChatThread, Song, AppStoreItem } from './types';

export const WALLPAPERS = [
  { id: 'ios18', name: 'iOS 18 Default', value: 'linear-gradient(135deg, #e3f0e5 0%, #bfdad0 25%, #daebd3 50%, #bbc5de 75%, #a6bcd8 100%)' },
  { id: 'solaris', name: 'Solaris Light', value: 'linear-gradient(135deg, #fffcf0 0%, #ffebcc 33%, #ffe0b3 66%, #ffd1b3 100%)' },
  { id: 'aurora', name: 'Aurora Teal', value: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 40%, #20b2aa 100%)' },
  { id: 'sunset', name: 'Desert Sunset', value: 'linear-gradient(135deg, #2c3e50 0%, #fd746c 100%)' },
  { id: 'dark_neon', name: 'Midnight Violet', value: 'linear-gradient(135deg, #0f0c20 0%, #1a103c 50%, #05040a 100%)' }
];

export const INITIAL_APPS: AppConfig[] = [
  { id: 'facetime', name: 'FaceTime', iconType: 'facetime', color: 'bg-emerald-500' },
  { id: 'calendar', name: 'Calendar', iconType: 'calendar', color: 'bg-white text-black' },
  { id: 'photos', name: 'Photos', iconType: 'photos', color: 'bg-white' },
  { id: 'camera', name: 'Camera', iconType: 'camera', color: 'bg-zinc-800' },
  { id: 'mail', name: 'Mail', iconType: 'mail', color: 'bg-sky-500' },
  { id: 'notes', name: 'Notes', iconType: 'notes', color: 'bg-[#fdf9e2]' },
  { id: 'reminders', name: 'Reminders', iconType: 'reminders', color: 'bg-white' },
  { id: 'clock', name: 'Clock', iconType: 'clock', color: 'bg-zinc-950' },
  { id: 'appletv', name: 'tv', iconType: 'appletv', color: 'bg-zinc-950' },
  { id: 'podcasts', name: 'Podcasts', iconType: 'podcasts', color: 'bg-orange-500' },
  { id: 'appstore', name: 'App Store', iconType: 'appstore', color: 'bg-blue-500' },
  { id: 'maps', name: 'Maps', iconType: 'maps', color: 'bg-emerald-400' },
  { id: 'health', name: 'Health', iconType: 'health', color: 'bg-white' },
  { id: 'wallet', name: 'Wallet', iconType: 'wallet', color: 'bg-zinc-900' },
  { id: 'settings', name: 'Settings', iconType: 'settings', color: 'bg-zinc-400' },
  { id: 'monipay', name: 'MoniPay', iconType: 'monipay', color: 'bg-[#121212]' },
  { id: 'polynational', name: 'Polynational', iconType: 'polynational', color: 'bg-[#0A1128]' },
  { id: 'shopit', name: 'Shopit', iconType: 'shopit', color: 'bg-indigo-600' },
  { id: 'storage', name: 'Storage', iconType: 'storage', color: 'bg-amber-600' },
];

export const DOCK_APPS: AppConfig[] = [
  { id: 'phone', name: 'Phone', iconType: 'phone', color: 'bg-emerald-500', isDock: true },
  { id: 'safari', name: 'Safari', iconType: 'safari', color: 'bg-white', isDock: true },
  { id: 'messages', name: 'Messages', iconType: 'messages', color: 'bg-emerald-500', isDock: true },
  { id: 'music', name: 'Music', iconType: 'music', color: 'bg-rose-500', isDock: true },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_1',
    title: 'iPhone 17 Feature Ideas',
    content: '1. Dynamic Island becomes liquid-resizable.\n2. Sub-screen microscopic thermal sensors.\n3. Native AI-assisted spatial styling presets.\n4. Ultra-high brightness OLED panel peaks.',
    updatedAt: '2:15 PM'
  },
  {
    id: 'note_2',
    title: 'Grocery List',
    content: '- Matcha powder fine grade\n- Almond milk unsweetened\n- Avocado (x3 ripe)\n- Organic mint leaves\n- Sourdough loaf fresh',
    updatedAt: 'Yesterday'
  },
  {
    id: 'note_3',
    title: 'Workout Plan',
    content: 'Warmup: 5 mins mobility\n- Squats: 3x10 @ 185lbs\n- Pushups: 4x15\n- Pullups: 3x8\n- Core: 3 rounds plank (1m) & russian twists',
    updatedAt: 'May 20'
  }
];

export const INITIAL_REMINDERS: Reminder[] = [
  { id: 'rem_1', text: 'Call Mom at 6pm', completed: false, category: 'today', date: '6:00 PM' },
  { id: 'rem_2', text: 'Pick up dry cleaning', completed: true, category: 'today', date: '4:30 PM' },
  { id: 'rem_3', text: 'Submit project proposal draft', completed: false, category: 'scheduled', date: 'Tomorrow' },
  { id: 'rem_4', text: 'Clean coffee maker filters', completed: false, category: 'all' },
  { id: 'rem_5', text: 'Review team feedback report', completed: false, category: 'flagged' }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'evt_1', title: 'Design Sync', time: '10:00 AM - 11:00 AM', location: 'Meeting Room Orange', day: 6 },
  { id: 'evt_2', title: 'Lunch with Emily', time: '12:30 PM - 1:30 PM', location: 'Sweetgreen Yonkers', day: 6 },
  { id: 'evt_3', title: 'Pilates Workout', time: '5:30 PM - 6:30 PM', location: 'CoreStudio', day: 6 },
  { id: 'evt_4', title: 'Project Launch Check-in', time: '2:00 PM - 2:45 PM', location: 'Virtual Meets', day: 24 }
];

export const INITIAL_MAILS: MailMessage[] = [
  {
    id: 'mail_1',
    sender: 'Apple Newsroom',
    subject: 'Welcome to your iPhone 17',
    preview: 'Discover the advanced chip architectures, the redesigned camera systems, and the dynamic haptic glass panels.',
    body: 'Greetings!\n\nYour brand-new iPhone 17 represents the pinnacle of Apple engineering. Powered by the high-efficiency A19 Bionic, it delivers breathtaking computational graphic pipelines, professional-grade physical focal control, and customizable ambient styling layers.\n\nExplore Settings to customize widgets, wallpaper gradients, and haptic feedback profiles.\n\nWarm regards,\nThe Apple Developer Team',
    time: '2:08 PM',
    read: false
  },
  {
    id: 'mail_2',
    sender: 'Sarah Jenkins',
    subject: 'Dinner tonight in Yonkers?',
    preview: 'Hey! Are you still up for grabbing food near the waterfront tonight? There is a new gastro-bar that looks...',
    body: 'Hey there!\n\nHope your Monday is going great! Are you still down for food tonight in Yonkers? That new bistro near the pier has got fantastic reviews, and they have an open deck outdoor area with live music.\n\nLet me know if 7:30 PM works for you, and I can lock down a table!\n\nBest,\nSarah',
    time: '1:45 PM',
    read: false
  },
  {
    id: 'mail_3',
    sender: 'GitHub Alerts',
    subject: '[Success] Applet compiled successfully',
    preview: 'Your Cloud Run container build fdda6daf succeeded on version 4.12.9 with no warnings.',
    body: 'Automated Build Summary:\n\nTrigger: Agent turn completed\nTarget: Cloud Run Container\nNode Version: v21.0.0\nDuration: 22.4 seconds\nStatus: SUCCEEDED\n\nNo lint or compilation warnings were found. Live simulator is fully operating.',
    time: '11:12 AM',
    read: true
  }
];

export const INITIAL_CHATS: ChatThread[] = [
  {
    id: 'chat_1',
    contactName: 'Sarah Jenkins',
    avatarColor: 'bg-emerald-500',
    lastMessage: 'Awesome, see you at 7:30!',
    time: '1:47 PM',
    unread: true,
    messages: [
      { id: 'm1_1', text: 'Hey Sarah! Are we still on for dinner?', sender: 'user', timestamp: '1:42 PM' },
      { id: 'm1_2', text: 'Yes, absolutely! Let’s meet near the Yonkers waterfront table at 7:30 PM.', sender: 'contact', timestamp: '1:45 PM' },
      { id: 'm1_3', text: 'Great, see you then!', sender: 'user', timestamp: '1:46 PM' },
      { id: 'm1_4', text: 'Awesome, see you at 7:30!', sender: 'contact', timestamp: '1:47 PM' }
    ]
  },
  {
    id: 'chat_2',
    contactName: 'Mom 💖',
    avatarColor: 'bg-fuchsia-400',
    lastMessage: 'Make sure to call me when you are free!',
    time: 'Yesterday',
    unread: false,
    messages: [
      { id: 'm2_1', text: 'Hey mom, I am testing out my new iPhone 17 interface.', sender: 'user', timestamp: 'Yesterday' },
      { id: 'm2_2', text: 'Wow, it looks so beautiful and crisp! Did you customize the weather widget?', sender: 'contact', timestamp: 'Yesterday' },
      { id: 'm2_3', text: 'I did, it is set to Yonkers and has the moon clear sky layout!', sender: 'user', timestamp: 'Yesterday' },
      { id: 'm2_4', text: 'Make sure to call me when you are free!', sender: 'contact', timestamp: 'Yesterday' }
    ]
  },
  {
    id: 'chat_3',
    contactName: 'Developer Support',
    avatarColor: 'bg-blue-600',
    lastMessage: 'Let us know if you need any assistance!',
    time: 'May 20',
    unread: false,
    messages: [
      { id: 'm3_1', text: 'Welcome to Google AI Studio Build environment.', sender: 'contact', timestamp: 'May 20' },
      { id: 'm3_2', text: 'How do I install dependencies?', sender: 'user', timestamp: 'May 20' },
      { id: 'm3_3', text: 'We pre-compile standard directories, and you can use the package manager for custom ones or code standard imports.', sender: 'contact', timestamp: 'May 20' },
      { id: 'm3_4', text: 'Let us know if you need any assistance!', sender: 'contact', timestamp: 'May 20' }
    ]
  }
];

export const INITIAL_SONGS: Song[] = [
  { id: 'song_1', title: 'Solar Flares', artist: 'Neon Horizon', duration: 184, album: 'Retroactive Space', coverGradient: 'from-amber-400 to-rose-600' },
  { id: 'song_2', title: 'Midnight City Lights', artist: 'Velvet Dreamer', duration: 215, album: 'Synthetic Heartbeat', coverGradient: 'from-violet-600 to-indigo-900' },
  { id: 'song_3', title: 'Ethereal Forest', artist: 'Cedar & Fern', duration: 242, album: 'Nordic Echoes', coverGradient: 'from-emerald-400 to-teal-800' },
  { id: 'song_4', title: 'Chilled Matcha Latte', artist: 'Lazy afternoon', duration: 156, album: 'Lo-Fi Cafe Vol. 3', coverGradient: 'from-lime-300 to-emerald-500' }
];

export const INITIAL_STORE_ITEMS: AppStoreItem[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Entertainment',
    rating: 4.7,
    iconColor: 'bg-red-600 text-white',
    isInstalled: false,
    downloads: '10B+',
    description: 'Watch, stream, and discover millions of video channels, vlogs, live podcasts, and interactive streams worldwide.'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'Music & Audio',
    rating: 4.8,
    iconColor: 'bg-emerald-600 text-black',
    isInstalled: false,
    downloads: '1B+',
    description: 'Listen to your favorite tracks, curate personalized playlists, discover daily fresh releases, and follow top podcast shows.'
  },
  {
    id: 'figma',
    name: 'Figma Mobile',
    category: 'Productivity',
    rating: 4.5,
    iconColor: 'bg-purple-950 text-white',
    isInstalled: false,
    downloads: '5M+',
    description: 'Browse, inspect, and share high-fidelity prototype flows, review wireframe iterations, and respond to designer feedback comments in real time.'
  }
];
