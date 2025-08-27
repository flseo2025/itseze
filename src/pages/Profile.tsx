import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { countryCodes } from "@/utils/countryCodes";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";


const Profile = () => {
  const { user } = useAuth();
  const { refreshUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    sponsorUsername: z.string().optional(),
    countryCode: z.string().min(1, "Select country code"),
    cellNumber: z.string().min(6, "Enter a valid phone number"),
    email: z.string().email(),
  });
  type ProfileFormValues = z.infer<typeof profileSchema>;

  const md = (user as any)?.user_metadata || {};

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: md.first_name ?? "",
      lastName: md.last_name ?? "",
      username: md.username ?? "",
      sponsorUsername: md.sponsor_username ?? "",
      countryCode: md.country_code ?? "+1",
      cellNumber: md.cell_number ?? "",
      email: user?.email ?? "",
    },
  });

  // Build a public URL when we have a storage path
  const avatarUrl = useMemo(() => {
    if (!avatarPath) return null;
    const { data } = supabase.storage.from("avatars").getPublicUrl(avatarPath);
    return data.publicUrl;
  }, [avatarPath]);

  useEffect(() => {
    document.title = "Profile - ItsEZE";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', 'Manage your ItsEZE profile and avatar.');
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', `${window.location.origin}/profile`);
    document.head.appendChild(canonical);
  }, []);

useEffect(() => {
  const loadProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await (supabase as any)
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();
      if (!error) setAvatarPath((data?.avatar_url as string) ?? null);
    } finally {
      setPageLoading(false);
    }
  };
  loadProfile();
}, [user]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    try {
      setLoading(true);
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await (supabase as any)
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setAvatarPath(filePath);
      toast({ description: "Avatar updated." });
      await refreshUser();
    } catch (err: any) {
      toast({ description: err?.message ?? "Failed to upload avatar" });
    } finally {
      setLoading(false);
      // reset file input value so the same file can be re-selected
      e.currentTarget.value = "";
    }
  };

  const onRemove = async () => {
    if (!avatarPath || !user) return;
    try {
      setLoading(true);
      await supabase.storage.from("avatars").remove([avatarPath]);
      const { error: updateError } = await (supabase as any)
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", user.id);
      if (updateError) throw updateError;
      setAvatarPath(null);
      toast({ description: "Avatar removed." });
      await refreshUser();
    } catch (err: any) {
      toast({ description: err?.message ?? "Failed to remove avatar" });
    } finally {
      setLoading(false);
    }
  };

  const onSave = async (values: ProfileFormValues) => {
    try {
      setSaving(true);
      const metadata = {
        first_name: values.firstName,
        last_name: values.lastName,
        username: values.username,
        sponsor_username: values.sponsorUsername || null,
        country_code: values.countryCode,
        cell_number: values.cellNumber,
        phone_number: `${values.countryCode}${values.cellNumber}`,
      };
      const payload: any = { data: metadata };
      if (values.email && values.email !== user?.email) {
        payload.email = values.email;
      }
      const { error } = await supabase.auth.updateUser(payload);
      if (error) throw error;
      toast({ description: payload.email ? "Profile updated. Check your inbox to confirm email changes." : "Profile updated." });
      await refreshUser();
    } catch (err: any) {
      toast({ description: err?.message ?? "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.email || "U").slice(0, 2).toUpperCase();

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-app-background/40 p-4">
        <main className="mx-auto w-full max-w-xl bg-card shadow-brand-lg rounded-lg p-6 animate-fade-in">
          <header className="mb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64 mt-2" />
          </header>

          <section className="flex items-center gap-4 mb-6">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-9 w-56" />
              <Skeleton className="h-4 w-40 mt-2" />
            </div>
          </section>

          <Separator className="my-6" />

          <section className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </section>

          <footer className="mt-8">
            <Skeleton className="h-10 w-24" />
          </footer>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-background/40 p-4">
      <main className="mx-auto w-full max-w-xl bg-card shadow-brand-lg rounded-lg p-6 animate-fade-in">
        <header className="mb-4">
          <h1 className="text-xl font-semibold">Your Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your account details and avatar.</p>
        </header>

        <section className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl || undefined} alt="User avatar - ItsEZE profile" loading="lazy" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Label htmlFor="avatar-upload" className="mb-2 block">Change avatar</Label>
            <div className="flex items-center gap-2">
              <Input id="avatar-upload" type="file" accept="image/*" onChange={onUpload} disabled={loading} aria-label="Upload new avatar" />
              <Button variant="destructive" onClick={onRemove} disabled={!avatarPath || loading} aria-label="Remove current avatar">Remove</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Recommended: square image, under 2MB.</p>
          </div>
        </section>

        <Separator className="my-6" />

        <section className="space-y-4">
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onSave)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
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
                  control={profileForm.control}
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
                control={profileForm.control}
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
                control={profileForm.control}
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
                  control={profileForm.control}
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
                  control={profileForm.control}
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
                control={profileForm.control}
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

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" onClick={() => window.history.back()} variant="outline">Back</Button>
                <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
              </div>
            </form>
          </Form>
        </section>
      </main>
    </div>
  );
};

export default Profile;
