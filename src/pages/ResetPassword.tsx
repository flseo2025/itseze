import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const requestSchema = z.object({ email: z.string().email() });
const updateSchema = z.object({ password: z.string().min(6) });

const ResetPassword = () => {
  const { session, sendPasswordReset, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"request" | "update">("request");

  useEffect(() => {
    document.title = "Reset Password - ItsEZE";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', 'Reset your ItsEZE account password.');
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', `${window.location.origin}/reset-password`);
    document.head.appendChild(canonical);
  }, []);

  useEffect(() => {
    // If Supabase provided a recovery session, allow updating the password
    const hash = window.location.hash;
    if (hash.includes('type=recovery') || session) {
      setMode('update');
    }
  }, [session]);

  const requestForm = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: { email: "" }
  });

  const updateForm = useForm<z.infer<typeof updateSchema>>({
    resolver: zodResolver(updateSchema),
    defaultValues: { password: "" }
  });

  const onRequest = async (values: z.infer<typeof requestSchema>) => {
    const { error } = await sendPasswordReset(values.email);
    if (!error) {
      navigate('/auth');
    }
  };

  const onUpdate = async (values: z.infer<typeof updateSchema>) => {
    const { error } = await updatePassword(values.password);
    if (!error) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-app-background/40 flex items-center justify-center p-4">
      <main className="w-full max-w-md bg-card shadow-brand-lg rounded-lg p-6">
        {mode === 'request' ? (
          <>
            <h1 className="text-xl font-semibold mb-4">Forgot your password?</h1>
            <p className="text-sm text-muted-foreground mb-4">Enter your email and we will send you a reset link.</p>
            <Form {...requestForm}>
              <form onSubmit={requestForm.handleSubmit(onRequest)} className="space-y-4">
                <FormField
                  control={requestForm.control}
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
                <Button type="submit" className="w-full">Send reset email</Button>
              </form>
            </Form>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-4">Set a new password</h1>
            <Form {...updateForm}>
              <form onSubmit={updateForm.handleSubmit(onUpdate)} className="space-y-4">
                <FormField
                  control={updateForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Update password</Button>
              </form>
            </Form>
          </>
        )}
      </main>
    </div>
  );
};

export default ResetPassword;
