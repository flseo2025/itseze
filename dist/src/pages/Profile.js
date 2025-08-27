"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const zod_1 = require("@hookform/resolvers/zod");
const react_1 = tslib_1.__importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const zod_2 = require("zod");
const AuthContext_1 = require("@/contexts/AuthContext");
const UserContext_1 = require("@/contexts/UserContext");
const countryCodes_1 = require("@/utils/countryCodes");
const avatar_1 = require("@/components/ui/avatar");
const button_1 = require("@/components/ui/button");
const form_1 = require("@/components/ui/form");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const select_1 = require("@/components/ui/select");
const separator_1 = require("@/components/ui/separator");
const skeleton_1 = require("@/components/ui/skeleton");
const use_toast_1 = require("@/components/ui/use-toast");
const client_1 = require("@/integrations/supabase/client");
const Profile = () => {
    const { user } = (0, AuthContext_1.useAuth)();
    const { refreshUser } = (0, UserContext_1.useUser)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [avatarPath, setAvatarPath] = (0, react_1.useState)(null);
    const [pageLoading, setPageLoading] = (0, react_1.useState)(true);
    const [saving, setSaving] = (0, react_1.useState)(false);
    const profileSchema = zod_2.z.object({
        firstName: zod_2.z.string().min(1, "First name is required"),
        lastName: zod_2.z.string().min(1, "Last name is required"),
        username: zod_2.z.string().min(3, "Username must be at least 3 characters"),
        sponsorUsername: zod_2.z.string().optional(),
        countryCode: zod_2.z.string().min(1, "Select country code"),
        cellNumber: zod_2.z.string().min(6, "Enter a valid phone number"),
        email: zod_2.z.string().email(),
    });
    const md = user?.user_metadata || {};
    const profileForm = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(profileSchema),
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
    const avatarUrl = (0, react_1.useMemo)(() => {
        if (!avatarPath)
            return null;
        const { data } = client_1.supabase.storage.from("avatars").getPublicUrl(avatarPath);
        return data.publicUrl;
    }, [avatarPath]);
    (0, react_1.useEffect)(() => {
        document.title = "Profile - ItsEZE";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription)
            metaDescription.setAttribute('content', 'Manage your ItsEZE profile and avatar.');
        const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', `${window.location.origin}/profile`);
        document.head.appendChild(canonical);
    }, []);
    (0, react_1.useEffect)(() => {
        const loadProfile = async () => {
            if (!user)
                return;
            try {
                const { data, error } = await client_1.supabase
                    .from("profiles")
                    .select("avatar_url")
                    .eq("id", user.id)
                    .single();
                if (!error)
                    setAvatarPath(data?.avatar_url ?? null);
            }
            finally {
                setPageLoading(false);
            }
        };
        loadProfile();
    }, [user]);
    const onUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user)
            return;
        try {
            setLoading(true);
            const ext = file.name.split(".").pop();
            const filePath = `${user.id}/${Date.now()}.${ext}`;
            const { error: uploadError } = await client_1.supabase.storage
                .from("avatars")
                .upload(filePath, file, { cacheControl: "3600", upsert: true });
            if (uploadError)
                throw uploadError;
            const { error: updateError } = await client_1.supabase
                .from("profiles")
                .update({ avatar_url: filePath })
                .eq("id", user.id);
            if (updateError)
                throw updateError;
            setAvatarPath(filePath);
            (0, use_toast_1.toast)({ description: "Avatar updated." });
            await refreshUser();
        }
        catch (err) {
            (0, use_toast_1.toast)({ description: err?.message ?? "Failed to upload avatar" });
        }
        finally {
            setLoading(false);
            e.currentTarget.value = "";
        }
    };
    const onRemove = async () => {
        if (!avatarPath || !user)
            return;
        try {
            setLoading(true);
            await client_1.supabase.storage.from("avatars").remove([avatarPath]);
            const { error: updateError } = await client_1.supabase
                .from("profiles")
                .update({ avatar_url: null })
                .eq("id", user.id);
            if (updateError)
                throw updateError;
            setAvatarPath(null);
            (0, use_toast_1.toast)({ description: "Avatar removed." });
            await refreshUser();
        }
        catch (err) {
            (0, use_toast_1.toast)({ description: err?.message ?? "Failed to remove avatar" });
        }
        finally {
            setLoading(false);
        }
    };
    const onSave = async (values) => {
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
            const payload = { data: metadata };
            if (values.email && values.email !== user?.email) {
                payload.email = values.email;
            }
            const { error } = await client_1.supabase.auth.updateUser(payload);
            if (error)
                throw error;
            (0, use_toast_1.toast)({ description: payload.email ? "Profile updated. Check your inbox to confirm email changes." : "Profile updated." });
            await refreshUser();
        }
        catch (err) {
            (0, use_toast_1.toast)({ description: err?.message ?? "Failed to update profile" });
        }
        finally {
            setSaving(false);
        }
    };
    const initials = (user?.email || "U").slice(0, 2).toUpperCase();
    if (pageLoading) {
        return (<div className="min-h-screen bg-app-background/40 p-4">
        <main className="mx-auto w-full max-w-xl bg-card shadow-brand-lg rounded-lg p-6 animate-fade-in">
          <header className="mb-4">
            <skeleton_1.Skeleton className="h-6 w-40"/>
            <skeleton_1.Skeleton className="h-4 w-64 mt-2"/>
          </header>

          <section className="flex items-center gap-4 mb-6">
            <skeleton_1.Skeleton className="h-16 w-16 rounded-full"/>
            <div className="flex-1">
              <skeleton_1.Skeleton className="h-9 w-56"/>
              <skeleton_1.Skeleton className="h-4 w-40 mt-2"/>
            </div>
          </section>

          <separator_1.Separator className="my-6"/>

          <section className="space-y-3">
            <skeleton_1.Skeleton className="h-4 w-20"/>
            <skeleton_1.Skeleton className="h-10 w-full"/>
          </section>

          <footer className="mt-8">
            <skeleton_1.Skeleton className="h-10 w-24"/>
          </footer>
        </main>
      </div>);
    }
    return (<div className="min-h-screen bg-app-background/40 p-4">
      <main className="mx-auto w-full max-w-xl bg-card shadow-brand-lg rounded-lg p-6 animate-fade-in">
        <header className="mb-4">
          <h1 className="text-xl font-semibold">Your Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your account details and avatar.</p>
        </header>

        <section className="flex items-center gap-4 mb-6">
          <avatar_1.Avatar className="h-16 w-16">
            <avatar_1.AvatarImage src={avatarUrl || undefined} alt="User avatar - ItsEZE profile" loading="lazy"/>
            <avatar_1.AvatarFallback>{initials}</avatar_1.AvatarFallback>
          </avatar_1.Avatar>
          <div className="flex-1">
            <label_1.Label htmlFor="avatar-upload" className="mb-2 block">Change avatar</label_1.Label>
            <div className="flex items-center gap-2">
              <input_1.Input id="avatar-upload" type="file" accept="image/*" onChange={onUpload} disabled={loading} aria-label="Upload new avatar"/>
              <button_1.Button variant="destructive" onClick={onRemove} disabled={!avatarPath || loading} aria-label="Remove current avatar">Remove</button_1.Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Recommended: square image, under 2MB.</p>
          </div>
        </section>

        <separator_1.Separator className="my-6"/>

        <section className="space-y-4">
          <form_1.Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onSave)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <form_1.FormField control={profileForm.control} name="firstName" render={({ field }) => (<form_1.FormItem>
                      <form_1.FormLabel>First Name</form_1.FormLabel>
                      <form_1.FormControl>
                        <input_1.Input placeholder="First name" {...field}/>
                      </form_1.FormControl>
                      <form_1.FormMessage />
                    </form_1.FormItem>)}/>
                <form_1.FormField control={profileForm.control} name="lastName" render={({ field }) => (<form_1.FormItem>
                      <form_1.FormLabel>Last Name</form_1.FormLabel>
                      <form_1.FormControl>
                        <input_1.Input placeholder="Last name" {...field}/>
                      </form_1.FormControl>
                      <form_1.FormMessage />
                    </form_1.FormItem>)}/>
              </div>

              <form_1.FormField control={profileForm.control} name="username" render={({ field }) => (<form_1.FormItem>
                    <form_1.FormLabel>Username</form_1.FormLabel>
                    <form_1.FormControl>
                      <input_1.Input placeholder="Choose a username" {...field}/>
                    </form_1.FormControl>
                    <form_1.FormMessage />
                  </form_1.FormItem>)}/>

              <form_1.FormField control={profileForm.control} name="sponsorUsername" render={({ field }) => (<form_1.FormItem>
                    <form_1.FormLabel>Sponsor Username (optional)</form_1.FormLabel>
                    <form_1.FormControl>
                      <input_1.Input placeholder="Sponsor's username" {...field}/>
                    </form_1.FormControl>
                    <form_1.FormMessage />
                  </form_1.FormItem>)}/>

              <div className="grid grid-cols-3 gap-4">
                <form_1.FormField control={profileForm.control} name="countryCode" render={({ field }) => (<form_1.FormItem className="col-span-1">
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

                <form_1.FormField control={profileForm.control} name="cellNumber" render={({ field }) => (<form_1.FormItem className="col-span-2">
                      <form_1.FormLabel>Cell Number</form_1.FormLabel>
                      <form_1.FormControl>
                        <input_1.Input type="tel" placeholder="5551234567" {...field}/>
                      </form_1.FormControl>
                      <form_1.FormMessage />
                    </form_1.FormItem>)}/>
              </div>

              <form_1.FormField control={profileForm.control} name="email" render={({ field }) => (<form_1.FormItem>
                    <form_1.FormLabel>Email</form_1.FormLabel>
                    <form_1.FormControl>
                      <input_1.Input type="email" placeholder="you@example.com" {...field}/>
                    </form_1.FormControl>
                    <form_1.FormMessage />
                  </form_1.FormItem>)}/>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button_1.Button type="button" onClick={() => window.history.back()} variant="outline">Back</button_1.Button>
                <button_1.Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button_1.Button>
              </div>
            </form>
          </form_1.Form>
        </section>
      </main>
    </div>);
};
exports.default = Profile;
//# sourceMappingURL=Profile.js.map