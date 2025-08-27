export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  accountType: 'user' | 'admin' | 'super_admin';
  language: 'en' | 'es' | 'fr';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
  fromAdmin: boolean;
}

export interface UserContextType {
  user: User | null;
  notifications: Notification[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllAsRead: () => void;
  logout: () => void;
  updateLanguage: (language: 'en' | 'es' | 'fr') => void;
  refreshUser: () => Promise<void>;
}