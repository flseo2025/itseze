"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const use_toast_1 = require("@/components/ui/use-toast");
const client_1 = require("@/integrations/supabase/client");
const AuthContext = (0, react_1.createContext)(undefined);
const AuthProvider = ({ children }) => {
    const [session, setSession] = (0, react_1.useState)(null);
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const { data: { subscription } } = client_1.supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });
        client_1.supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);
    const signIn = async (email, password) => {
        const { error } = await client_1.supabase.auth.signInWithPassword({ email, password });
        if (error) {
            (0, use_toast_1.toast)({ description: error.message });
            return { error };
        }
        (0, use_toast_1.toast)({ description: "Logged in successfully." });
        return { error: null };
    };
    const signUp = async (email, password, metadata = {}) => {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await client_1.supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: redirectUrl, data: metadata }
        });
        if (error) {
            (0, use_toast_1.toast)({ description: error.message });
            return { error };
        }
        return { error: null };
    };
    const signOut = async () => {
        await client_1.supabase.auth.signOut();
        (0, use_toast_1.toast)({ description: "Signed out." });
    };
    const sendPasswordReset = async (email) => {
        const redirectTo = `${window.location.origin}/reset-password`;
        const { error } = await client_1.supabase.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) {
            (0, use_toast_1.toast)({ description: error.message });
            return { error };
        }
        (0, use_toast_1.toast)({ description: "Password reset email sent." });
        return { error: null };
    };
    const updatePassword = async (password) => {
        const { error } = await client_1.supabase.auth.updateUser({ password });
        if (error) {
            (0, use_toast_1.toast)({ description: error.message });
            return { error };
        }
        (0, use_toast_1.toast)({ description: "Password updated. You are now logged in." });
        return { error: null };
    };
    return (<AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, sendPasswordReset, updatePassword }}>
      {children}
    </AuthContext.Provider>);
};
exports.AuthProvider = AuthProvider;
const useAuth = () => {
    const ctx = (0, react_1.useContext)(AuthContext);
    if (!ctx)
        throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
exports.useAuth = useAuth;
//# sourceMappingURL=AuthContext.js.map