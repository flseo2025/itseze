"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUser = exports.UserProvider = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const client_1 = require("@/integrations/supabase/client");
const UserContext = (0, react_1.createContext)(undefined);
const seedNotifications = [
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
const UserProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [notifications, setNotifications] = (0, react_1.useState)(seedNotifications);
    const unreadCount = (0, react_1.useMemo)(() => notifications.filter((n) => !n.read).length, [notifications]);
    const buildDisplayName = (md, email) => {
        const parts = [md?.first_name, md?.last_name].filter(Boolean).join(' ').trim();
        if (parts)
            return parts;
        if (md?.username)
            return md.username;
        if (email)
            return email.split('@')[0];
        return 'User';
    };
    const deriveAccountType = (roles) => {
        const set = new Set(roles?.map((r) => r.role) || []);
        if (set.has('super_admin'))
            return 'super_admin';
        if (set.has('admin'))
            return 'admin';
        return 'user';
    };
    const getAvatarUrl = (path) => {
        if (!path)
            return undefined;
        const { data } = client_1.supabase.storage.from('avatars').getPublicUrl(path);
        return data.publicUrl || undefined;
    };
    const refreshUser = async () => {
        const { data: authData } = await client_1.supabase.auth.getUser();
        const authUser = authData.user;
        if (!authUser) {
            setUser(null);
            return;
        }
        const [rolesRes, profileRes] = await Promise.all([
            client_1.supabase.from('user_roles').select('role').eq('user_id', authUser.id),
            client_1.supabase.from('profiles').select('avatar_url').eq('id', authUser.id).maybeSingle(),
        ]);
        const roles = rolesRes.data || [];
        const profile = profileRes.data || null;
        const md = authUser.user_metadata || {};
        const nextUser = {
            id: authUser.id,
            name: buildDisplayName(md, authUser.email),
            email: authUser.email ?? '',
            avatar: getAvatarUrl(profile?.avatar_url ?? undefined),
            accountType: deriveAccountType(roles),
            language: md.language || 'en',
        };
        setUser(nextUser);
    };
    (0, react_1.useEffect)(() => {
        refreshUser();
    }, []);
    (0, react_1.useEffect)(() => {
        if (!user?.id)
            return;
        const channel = client_1.supabase
            .channel('public:profiles:user')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, () => {
            refreshUser();
        })
            .subscribe();
        return () => {
            client_1.supabase.removeChannel(channel);
        };
    }, [user?.id]);
    const markNotificationAsRead = (id) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };
    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };
    const logout = async () => {
        try {
            await client_1.supabase.auth.signOut();
        }
        finally {
            setUser(null);
            try {
                window.location.assign('/auth');
            }
            catch { }
        }
    };
    const updateLanguage = (language) => {
        setUser((prev) => (prev ? { ...prev, language } : prev));
    };
    const value = {
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
exports.UserProvider = UserProvider;
const useUser = () => {
    const context = (0, react_1.useContext)(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
exports.useUser = useUser;
//# sourceMappingURL=UserContext.js.map