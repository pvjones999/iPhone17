export interface AppConfig {
  id: string;
  name: string;
  iconType: 'facetime' | 'calendar' | 'photos' | 'camera' | 'mail' | 'notes' | 'reminders' | 'clock' | 'appletv' | 'podcasts' | 'appstore' | 'maps' | 'health' | 'wallet' | 'settings' | 'phone' | 'safari' | 'messages' | 'music' | 'monipay' | 'polynational' | 'shopit' | 'storage';
  color: string;
  isDock?: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface Reminder {
  id: string;
  text: string;
  completed: boolean;
  category: 'today' | 'scheduled' | 'all' | 'flagged';
  date?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  location?: string;
  day: number; // Day of month
}

export interface MailMessageThreadItem {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhoto?: string;
  toName: string;
  toEmail: string;
  body: string;
  time: string;
}

export interface MailMessage {
  id: string;
  sender: string;
  senderEmail?: string;
  senderPhoto?: string;
  toName?: string;
  toEmail?: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  read: boolean;
  isSent?: boolean;
  thread?: MailMessageThreadItem[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'contact';
  timestamp: string;
}

export interface ChatThread {
  id: string;
  contactName: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: ChatMessage[];
}

export interface Alarm {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  days: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  album: string;
  coverGradient: string;
}

export interface AppStoreItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  iconColor: string;
  isInstalled: boolean;
  downloads: string;
  description: string;
}
