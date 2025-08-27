"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lucide_react_1 = require("lucide-react");
const react_router_dom_1 = require("react-router-dom");
const UserContext_1 = require("@/contexts/UserContext");
const avatar_1 = require("@/components/ui/avatar");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const separator_1 = require("@/components/ui/separator");
const sheet_1 = require("@/components/ui/sheet");
const SlideOutMenu = ({ children, onNavigate }) => {
    const { user, unreadCount, logout, updateLanguage } = (0, UserContext_1.useUser)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };
    const handleNotifications = () => {
        onNavigate('notifications');
    };
    const handleLanguageChange = (lang) => {
        updateLanguage(lang);
    };
    const menuItems = [
        {
            section: 'Main',
            items: [
                { icon: lucide_react_1.User, label: 'Dashboard', action: () => onNavigate('main') },
                { icon: lucide_react_1.Settings, label: 'Settings', action: () => navigate('/profile') },
            ]
        },
        {
            section: 'Support',
            items: [
                { icon: lucide_react_1.Mail, label: 'Email Support', action: () => window.open('mailto:support@itseze.com') },
                { icon: lucide_react_1.MessageCircle, label: 'Live Chat', action: () => console.log('Open chat') },
                { icon: lucide_react_1.Phone, label: 'Call Support', action: () => window.open('tel:+1234567890') },
            ]
        },
        {
            section: 'Information',
            items: [
                { icon: lucide_react_1.FileText, label: 'Terms of Use', action: () => console.log('Terms') },
                { icon: lucide_react_1.Shield, label: 'Privacy Policy', action: () => console.log('Privacy') },
                { icon: lucide_react_1.HelpCircle, label: 'Help & FAQ', action: () => console.log('Help') },
            ]
        }
    ];
    const languages = [
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Español' },
        { code: 'fr', label: 'Français' }
    ];
    return (<sheet_1.Sheet>
      <sheet_1.SheetTrigger asChild>
        {children}
      </sheet_1.SheetTrigger>
      <sheet_1.SheetContent side="left" className="w-80 p-0 flex flex-col">
        <sheet_1.SheetHeader className="p-0">
          <div className="bg-gradient-primary p-6 text-white">
            <sheet_1.SheetClose asChild>
              <button onClick={() => navigate('/profile')} className="flex items-center gap-4 w-full text-left">
                <avatar_1.Avatar className="h-16 w-16 border-2 border-white/20">
                  <avatar_1.AvatarImage src={user?.avatar} alt={user?.name}/>
                  <avatar_1.AvatarFallback className="bg-white/20 text-white text-lg font-bold">
                    {user ? getInitials(user.name) : 'U'}
                  </avatar_1.AvatarFallback>
                </avatar_1.Avatar>
                <div className="flex-1">
                  <sheet_1.SheetTitle className="text-white text-lg font-bold mb-1">
                    {user?.name || 'Guest User'}
                  </sheet_1.SheetTitle>
                  <p className="text-white/80 text-sm">{user?.email}</p>
                  <badge_1.Badge variant="secondary" className="mt-2 text-xs">
                    {user?.accountType === 'super_admin' ? 'Super Admin' :
            user?.accountType === 'admin' ? 'Admin' : 'User'}
                  </badge_1.Badge>
                </div>
              </button>
            </sheet_1.SheetClose>
          </div>
        </sheet_1.SheetHeader>

        <div className="flex-1 overflow-y-auto">
          
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <lucide_react_1.Globe className="h-4 w-4 text-muted-foreground"/>
              <span className="text-sm font-medium">Language</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (<button_1.Button key={lang.code} variant={user?.language === lang.code ? "default" : "outline"} size="sm" onClick={() => handleLanguageChange(lang.code)} className="text-xs">
                  {lang.label}
                </button_1.Button>))}
            </div>
          </div>

          <separator_1.Separator />

          
          <div className="py-2">
            {menuItems.map((section, sectionIndex) => (<div key={sectionIndex} className="mb-4">
                <div className="px-4 py-2">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {section.section}
                  </h3>
                </div>
                <div className="space-y-1 px-2">
                  {section.items.map((item, itemIndex) => (<sheet_1.SheetClose asChild key={itemIndex}>
                      <button_1.Button variant="ghost" className="w-full justify-start h-12 text-left font-normal" onClick={item.action}>
                        <item.icon className="h-5 w-5 mr-3"/>
                        <span className="flex-1">{item.label}</span>
                        <lucide_react_1.ChevronRight className="h-4 w-4 text-muted-foreground"/>
                      </button_1.Button>
                    </sheet_1.SheetClose>))}
                </div>
              </div>))}

            
            <div className="mb-4">
              <div className="px-4 py-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Updates
                </h3>
              </div>
              <div className="px-2">
                <button_1.Button variant="ghost" className="w-full justify-start h-12 text-left font-normal" onClick={handleNotifications}>
                  <lucide_react_1.Bell className="h-5 w-5 mr-3"/>
                  <span className="flex-1">Notifications</span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (<badge_1.Badge variant="destructive" className="text-xs px-2 py-1 min-w-[20px] h-5">
                        {unreadCount}
                      </badge_1.Badge>)}
                    <lucide_react_1.ChevronRight className="h-4 w-4 text-muted-foreground"/>
                  </div>
                </button_1.Button>
              </div>
            </div>
          </div>
        </div>

        
        <div className="border-t p-4 space-y-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">ItsEZE™ v1.0.0</p>
            <p className="text-xs text-muted-foreground">By Fast Forward App ®</p>
          </div>
          <button_1.Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={logout}>
            <lucide_react_1.LogOut className="h-4 w-4 mr-2"/>
            Sign Out
          </button_1.Button>
        </div>
      </sheet_1.SheetContent>
    </sheet_1.Sheet>);
};
exports.default = SlideOutMenu;
//# sourceMappingURL=SlideOutMenu.js.map