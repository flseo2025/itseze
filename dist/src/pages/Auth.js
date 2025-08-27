"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const zod_1 = require("@hookform/resolvers/zod");
const react_1 = require("react");
const react_hook_form_1 = require("react-hook-form");
const react_router_dom_1 = require("react-router-dom");
const zod_2 = require("zod");
const SignupSuccessDialog_1 = tslib_1.__importDefault(require("@/components/Auth/SignupSuccessDialog"));
const AuthContext_1 = require("@/contexts/AuthContext");
const countryCodes_1 = require("@/utils/countryCodes");
const button_1 = require("@/components/ui/button");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const select_1 = require("@/components/ui/select");
const tabs_1 = require("@/components/ui/tabs");
const loginSchema = zod_2.z.object({
    email: zod_2.z.string().email(),
    password: zod_2.z.string().min(6)
});
const signupSchema = zod_2.z.object({
    firstName: zod_2.z.string().min(1, "First name is required"),
    lastName: zod_2.z.string().min(1, "Last name is required"),
    username: zod_2.z.string().min(3, "Username must be at least 3 characters"),
    sponsorUsername: zod_2.z.string().optional(),
    countryCode: zod_2.z.string().min(1, "Select country code"),
    cellNumber: zod_2.z.string().min(6, "Enter a valid phone number"),
    email: zod_2.z.string().email(),
    password: zod_2.z.string().min(6),
    confirm: zod_2.z.string().min(6)
}).refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
});
const Auth = () => {
    const { session, signIn, signUp } = (0, AuthContext_1.useAuth)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const location = (0, react_router_dom_1.useLocation)();
    const [tab, setTab] = (0, react_1.useState)("login");
    const [signupSuccessOpen, setSignupSuccessOpen] = (0, react_1.useState)(false);
    const [signupEmail, setSignupEmail] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        document.title = "Login or Sign Up - ItsEZE";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription)
            metaDescription.setAttribute('content', 'ItsEZE app authentication - login or create your account.');
        const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', `${window.location.origin}/auth`);
        document.head.appendChild(canonical);
    }, []);
    (0, react_1.useEffect)(() => {
        if (session) {
            navigate("/", { replace: true });
        }
    }, [session, navigate]);
    const loginForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(loginSchema),
        defaultValues: { email: "", password: "" }
    });
    const signupForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(signupSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            sponsorUsername: "",
            countryCode: "+1",
            cellNumber: "",
            email: "",
            password: "",
            confirm: ""
        }
    });
    const handleLogin = async (values) => {
        const { error } = await signIn(values.email, values.password);
        if (!error) {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    };
    const handleSignup = async (values) => {
        const metadata = {
            first_name: values.firstName,
            last_name: values.lastName,
            username: values.username,
            sponsor_username: values.sponsorUsername || null,
            country_code: values.countryCode,
            cell_number: values.cellNumber,
            phone_number: `${values.countryCode}${values.cellNumber}`,
        };
        const { error } = await signUp(values.email, values.password, metadata);
        if (!error) {
            setSignupEmail(values.email);
            signupForm.reset();
            setSignupSuccessOpen(true);
        }
    };
    return (<div className="min-h-screen bg-app-background/40 flex items-center justify-center p-4">
      
      <SignupSuccessDialog_1.default open={signupSuccessOpen} onOpenChange={setSignupSuccessOpen} email={signupEmail}/>

      <main className="w-full max-w-md">
        <header className="text-center mb-6">
          <img src="/lovable-uploads/d894c9ab-5a2d-429b-9fe0-9c3801099d2c.png" alt="ItsEZE logo - business startup app" className="mx-auto h-16 w-auto" loading="lazy"/>
          <h1 className="sr-only">Login or Sign Up - ItsEZE</h1>
          <p className="text-sm text-muted-foreground">Your business Startup App</p>
        </header>

        <div className="bg-card shadow-brand-lg rounded-lg p-6">
          <tabs_1.Tabs value={tab} onValueChange={setTab} className="w-full">
            <tabs_1.TabsList className="grid w-full grid-cols-2">
              <tabs_1.TabsTrigger value="login">Login</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="signup">Sign Up</tabs_1.TabsTrigger>
            </tabs_1.TabsList>

            <tabs_1.TabsContent value="login" className="mt-4">
              <form_1.Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <form_1.FormField control={loginForm.control} name="email" render={({ field }) => (<form_1.FormItem>
                        <form_1.FormLabel>Email</form_1.FormLabel>
                        <form_1.FormControl>
                          <input_1.Input type="email" placeholder="you@example.com" {...field}/>
                        </form_1.FormControl>
                        <form_1.FormMessage />
                      </form_1.FormItem>)}/>

                  <form_1.FormField control={loginForm.control} name="password" render={({ field }) => (<form_1.FormItem>
                        <form_1.FormLabel>Password</form_1.FormLabel>
                        <form_1.FormControl>
                          <input_1.Input type="password" placeholder="Your password" {...field}/>
                        </form_1.FormControl>
                        <form_1.FormMessage />
                      </form_1.FormItem>)}/>

                  <div className="flex items-center justify-between">
                    <button type="button" className="text-sm text-primary underline" onClick={() => navigate('/reset-password')}>Forgot password?</button>
                  </div>

                  <button_1.Button type="submit" className="w-full">Login</button_1.Button>
                </form>
              </form_1.Form>
            </tabs_1.TabsContent>

            <tabs_1.TabsContent value="signup" className="mt-4">
              <form_1.Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <form_1.FormField control={signupForm.control} name="firstName" render={({ field }) => (<form_1.FormItem>
                          <form_1.FormLabel>First Name</form_1.FormLabel>
                          <form_1.FormControl>
                            <input_1.Input placeholder="First name" {...field}/>
                          </form_1.FormControl>
                          <form_1.FormMessage />
                        </form_1.FormItem>)}/>
                    <form_1.FormField control={signupForm.control} name="lastName" render={({ field }) => (<form_1.FormItem>
                          <form_1.FormLabel>Last Name</form_1.FormLabel>
                          <form_1.FormControl>
                            <input_1.Input placeholder="Last name" {...field}/>
                          </form_1.FormControl>
                          <form_1.FormMessage />
                        </form_1.FormItem>)}/>
                  </div>

                  <form_1.FormField control={signupForm.control} name="username" render={({ field }) => (<form_1.FormItem>
                        <form_1.FormLabel>Username</form_1.FormLabel>
                        <form_1.FormControl>
                          <input_1.Input placeholder="Choose a username" {...field}/>
                        </form_1.FormControl>
                        <form_1.FormMessage />
                      </form_1.FormItem>)}/>

                  <form_1.FormField control={signupForm.control} name="sponsorUsername" render={({ field }) => (<form_1.FormItem>
                        <form_1.FormLabel>Sponsor Username (optional)</form_1.FormLabel>
                        <form_1.FormControl>
                          <input_1.Input placeholder="Sponsor's username" {...field}/>
                        </form_1.FormControl>
                        <form_1.FormMessage />
                      </form_1.FormItem>)}/>

                  <div className="grid grid-cols-3 gap-4">
                    <form_1.FormField control={signupForm.control} name="countryCode" render={({ field }) => (<form_1.FormItem className="col-span-1">
                          <form_1.FormLabel>Country Code</form_1.FormLabel>
                          <select_1.Select onValueChange={field.onChange} defaultValue={field.value}>
                            <form_1.FormControl>
                              <select_1.SelectTrigger>
                                <select_1.SelectValue placeholder="Code"/>
                              </select_1.SelectTrigger>
                            </form_1.FormControl>
                            <select_1.SelectContent className="z-50 bg-popover max-h-72 overflow-y-auto">
                              {countryCodes_1.countryCodes.map((c) => (<select_1.SelectItem key={`${c.code}-${c.name}`} value={c.code}>
                                  {c.code} {c.name}
                                </select_1.SelectItem>))}
                            </select_1.SelectContent>
                          </select_1.Select>
                          <form_1.FormMessage />
                        </form_1.FormItem>)}/>
                    <form_1.FormField control={signupForm.control} name="cellNumber" render={({ field }) => (<form_1.FormItem className="col-span-2">
                          <form_1.FormLabel>Cell Number</form_1.FormLabel>
                          <form_1.FormControl>
                            <input_1.Input type="tel" placeholder="5551234567" {...field}/>
                          </form_1.FormControl>
                          <form_1.FormMessage />
                        </form_1.FormItem>)}/>
                  </div>

                  <form_1.FormField control={signupForm.control} name="email" render={({ field }) => (<form_1.FormItem>
                        <form_1.FormLabel>Email</form_1.FormLabel>
                        <form_1.FormControl>
                          <input_1.Input type="email" placeholder="you@example.com" {...field}/>
                        </form_1.FormControl>
                        <form_1.FormMessage />
                      </form_1.FormItem>)}/>

                  <form_1.FormField control={signupForm.control} name="password" render={({ field }) => (<form_1.FormItem>
                        <form_1.FormLabel>Password</form_1.FormLabel>
                        <form_1.FormControl>
                          <input_1.Input type="password" placeholder="Create a password" {...field}/>
                        </form_1.FormControl>
                        <form_1.FormMessage />
                      </form_1.FormItem>)}/>

                  <form_1.FormField control={signupForm.control} name="confirm" render={({ field }) => (<form_1.FormItem>
                        <form_1.FormLabel>Confirm Password</form_1.FormLabel>
                        <form_1.FormControl>
                          <input_1.Input type="password" placeholder="Re-enter password" {...field}/>
                        </form_1.FormControl>
                        <form_1.FormMessage />
                      </form_1.FormItem>)}/>

                  <button_1.Button type="submit" className="w-full">Create account</button_1.Button>
                </form>
              </form_1.Form>
            </tabs_1.TabsContent>

          </tabs_1.Tabs>
        </div>
      </main>
    </div>);
};
exports.default = Auth;
//# sourceMappingURL=Auth.js.map