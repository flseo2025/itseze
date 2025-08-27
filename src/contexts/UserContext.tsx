import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { User, Notification, UserContextType } from '@/types/user';
import type { ReactNode } from 'react';

import { supabase } from '@/integrations/supabase/client';

const UserContext = createContext<UserContextType | undefined>(undefined);

// Seed notifications (kept local for now)
const seedNotifications: Notification[] = [
  {
    id: '1',
    title: 'Welcome to ItsEZE!',
    message: 'Thank you for joining our platform. Get started by exploring the main features.',
    type: 'info',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: false,
    fromAdmin: true,
  },
  {
    id: '2',
    title: 'New Feature Available',
    message: "We've added new growth tracking features to help your business succeed.",
    type: 'success',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    read: false,
    fromAdmin: true,
  },
  {
    id: '3',
    title: 'Maintenance Notice',
    message: 'Scheduled maintenance will occur this weekend. The app may be briefly unavailable.',
    type: 'warning',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    fromAdmin: true,
  },
];

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const buildDisplayName = (md: Record<string, any>, email?: string | null) => {
    const parts = [md?.first_name, md?.last_name].filter(Boolean).join(' ').trim();
    if (parts) return parts;
    if (md?.username) return md.username;
    if (email) return email.split('@')[0];
    return 'User';
  };

  const deriveAccountType = (roles: Array<{ role: string }>): User['accountType'] => {
    const set = new Set(roles?.map((r) => r.role) || []);
    if (set.has('super_admin')) return 'super_admin';
    if (set.has('admin')) return 'admin';
    return 'user';
  };

  const getAvatarUrl = (path?: string | null) => {
    if (!path) return undefined;
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    return data.publicUrl || undefined;
  };

  const refreshUser = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const authUser = authData.user;
    if (!authUser) {
      setUser(null);
      return;
    }

    // Fetch roles and profile in parallel
    const [rolesRes, profileRes] = await Promise.all([
      supabase.from('user_roles').select('role').eq('user_id', authUser.id),
      supabase.from('profiles').select('avatar_url').eq('id', authUser.id).maybeSingle(),
    ]);

    const roles = (rolesRes.data as Array<{ role: string }>) || [];
    const profile = (profileRes.data as { avatar_url?: string | null } | null) || null;

    const md = (authUser as any).user_metadata || {};

    const nextUser: User = {
      id: authUser.id,
      name: buildDisplayName(md, authUser.email),
      email: authUser.email ?? '',
      avatar: getAvatarUrl(profile?.avatar_url ?? undefined),
      accountType: deriveAccountType(roles),
      language: (md.language as 'en' | 'es' | 'fr') || 'en',
    };

    setUser(nextUser);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // Realtime: refresh when profile row changes
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('public:profiles:user')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` },
        () => {
          refreshUser();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setUser(null);
      try { window.location.assign('/auth'); } catch {}
    }
  };

  const updateLanguage = (language: 'en' | 'es' | 'fr') => {
    setUser((prev) => (prev ? { ...prev, language } : prev));
    // Optionally persist: supabase.auth.updateUser({ data: { language } })
  };

  const value: UserContextType = {
    user,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllAsRead,
    logout,
    updateLanguage,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
