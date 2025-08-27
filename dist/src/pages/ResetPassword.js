"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("@hookform/resolvers/zod");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const react_router_dom_1 = require("react-router-dom");
const zod_2 = require("zod");
const AuthContext_1 = require("@/contexts/AuthContext");
const button_1 = require("@/components/ui/button");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const requestSchema = zod_2.z.object({ email: zod_2.z.string().email() });
const updateSchema = zod_2.z.object({ password: zod_2.z.string().min(6) });
const ResetPassword = () => {
    const { session, sendPasswordReset, updatePassword } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [mode, setMode] = (0, react_1.useState)("request");
    (0, react_1.useEffect)(() => {
        document.title = "Reset Password - ItsEZE";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription)
            metaDescription.setAttribute('content', 'Reset your ItsEZE account password.');
        const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', `${window.location.origin}/reset-password`);
        document.head.appendChild(canonical);
    }, []);
    (0, react_1.useEffect)(() => {
        const hash = window.location.hash;
        if (hash.includes('type=recovery') || session) {
            setMode('update');
        }
    }, [session]);
    const requestForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(requestSchema),
        defaultValues: { email: "" }
    });
    const updateForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(updateSchema),
        defaultValues: { password: "" }
    });
    const onRequest = async (values) => {
        const { error } = await sendPasswordReset(values.email);
        if (!error) {
            navigate('/auth');
        }
    };
    const onUpdate = async (values) => {
        const { error } = await updatePassword(values.password);
        if (!error) {
            navigate('/');
        }
    };
    return (<div className="min-h-screen bg-app-background/40 flex items-center justify-center p-4">
      <main className="w-full max-w-md bg-card shadow-brand-lg rounded-lg p-6">
        {mode === 'request' ? (<>
            <h1 className="text-xl font-semibold mb-4">Forgot your password?</h1>
            <p className="text-sm text-muted-foreground mb-4">Enter your email and we will send you a reset link.</p>
            <form_1.Form {...requestForm}>
              <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
                <form_1.FormField control={requestForm.control} name="email" render={({ field }) => (<form_1.FormItem>
                      <form_1.FormLabel>Email</form_1.FormLabel>
                      <form_1.FormControl>
                        <input_1.Input type="email" placeholder="you@example.com" {...field}/>
                      </form_1.FormControl>
                      <form_1.FormMessage />
                    </form_1.FormItem>)}/>
                <button_1.Button type="submit" className="w-full">Send reset email</button_1.Button>
              </form>
            </form_1.Form>
          </>) : (<>
            <h1 className="text-xl font-semibold mb-4">Set a new password</h1>
            <form_1.Form {...updateForm}>
              <form onSubmit={updateForm.handleSubmit(onUpdate)} className="space-y-4">
                <form_1.FormField control={updateForm.control} name="password" render={({ field }) => (<form_1.FormItem>
                      <form_1.FormLabel>New Password</form_1.FormLabel>
                      <form_1.FormControl>
                        <input_1.Input type="password" placeholder="Enter new password" {...field}/>
                      </form_1.FormControl>
                      <form_1.FormMessage />
                    </form_1.FormItem>)}/>
                <button_1.Button type="submit" className="w-full">Update password</button_1.Button>
              </form>
            </form_1.Form>
          </>)}
      </main>
    </div>);
};
exports.default = ResetPassword;
//# sourceMappingURL=ResetPassword.js.map