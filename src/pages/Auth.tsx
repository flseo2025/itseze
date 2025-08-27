import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";

import SignupSuccessDialog from "@/components/Auth/SignupSuccessDialog";
import { useAuth } from "@/contexts/AuthContext";
import { countryCodes } from "@/utils/countryCodes";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  sponsorUsername: z.string().optional(),
  countryCode: z.string().min(1, "Select country code"),
  cellNumber: z.string().min(6, "Enter a valid phone number"),
  email: z.string().email(),
  password: z.string().min(6),
  confirm: z.string().min(6)
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

const Auth = () => {
  const { session, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [tab, setTab] = useState<string>("login");

  // New: dialog state for signup success
  const [signupSuccessOpen, setSignupSuccessOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");

  useEffect(() => {
    // SEO
    document.title = "Login or Sign Up - ItsEZE";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', 'ItsEZE app authentication - login or create your account.');
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', `${window.location.origin}/auth`);
    document.head.appendChild(canonical);
  }, []);

  useEffect(() => {
    if (session) {
      navigate("/", { replace: true });
    }
  }, [session, navigate]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
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

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    const { error } = await signIn(values.email, values.password);
    if (!error) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
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
      // Clear the form and show centered confirmation dialog
      setSignupEmail(values.email);
      signupForm.reset();
      setSignupSuccessOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-app-background/40 flex items-center justify-center p-4">
      {/* Centered dialog to inform user to confirm their email */}
      <SignupSuccessDialog
        open={signupSuccessOpen}
        onOpenChange={setSignupSuccessOpen}
        email={signupEmail}
      />

      <main className="w-full max-w-md">
        <header className="text-center mb-6">
          <img src="/lovable-uploads/d894c9ab-5a2d-429b-9fe0-9c3801099d2c.png" alt="ItsEZE logo - business startup app" className="mx-auto h-16 w-auto" loading="lazy" />
          <h1 className="sr-only">Login or Sign Up - ItsEZE</h1>
          <p className="text-sm text-muted-foreground">Your business Startup App</p>
        </header>

        <div className="bg-card shadow-brand-lg rounded-lg p-6">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <button type="button" className="text-sm text-primary underline" onClick={() => navigate('/reset-password')}>Forgot password?</button>
                  </div>

                  <Button type="submit" className="w-full">Login</Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={signupForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={signupForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Choose a username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="sponsorUsername"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sponsor Username (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Sponsor's username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={signupForm.control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>Country Code</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Code" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="z-50 bg-popover max-h-72 overflow-y-auto">
                              {countryCodes.map((c) => (
                                <SelectItem key={`${c.code}-${c.name}`} value={c.code}>
                                  {c.code} {c.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="cellNumber"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Cell Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="5551234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="confirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Re-enter password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">Create account</Button>
                </form>
              </Form>
            </TabsContent>

          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Auth;
