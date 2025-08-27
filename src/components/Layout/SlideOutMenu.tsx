import { 
  User, 
  Settings, 
  Globe, 
  Mail, 
  MessageCircle, 
  Phone, 
  FileText, 
  Shield, 
  HelpCircle, 
  Bell, 
  LogOut,
  ChevronRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@/contexts/UserContext';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';

interface SlideOutMenuProps {
  children: React.ReactNode;
  onNavigate: (screen: string) => void;
}

const SlideOutMenu = ({ children, onNavigate }: SlideOutMenuProps) => {
  const { user, unreadCount, logout, updateLanguage } = useUser();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleNotifications = () => {
    onNavigate('notifications');
  };

  const handleLanguageChange = (lang: 'en' | 'es' | 'fr') => {
    updateLanguage(lang);
  };

  const menuItems = [
    {
      section: 'Main',
      items: [
        { icon: User, label: 'Dashboard', action: () => onNavigate('main') },
        { icon: Settings, label: 'Settings', action: () => navigate('/profile') },
      ]
    },
    {
      section: 'Support',
      items: [
        { icon: Mail, label: 'Email Support', action: () => window.open('mailto:support@itseze.com') },
        { icon: MessageCircle, label: 'Live Chat', action: () => console.log('Open chat') },
        { icon: Phone, label: 'Call Support', action: () => window.open('tel:+1234567890') },
      ]
    },
    {
      section: 'Information',
      items: [
        { icon: FileText, label: 'Terms of Use', action: () => console.log('Terms') },
        { icon: Shield, label: 'Privacy Policy', action: () => console.log('Privacy') },
        { icon: HelpCircle, label: 'Help & FAQ', action: () => console.log('Help') },
      ]
    }
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 flex flex-col">
        <SheetHeader className="p-0">
          <div className="bg-gradient-primary p-6 text-white">
            <SheetClose asChild>
              <button onClick={() => navigate('/profile')} className="flex items-center gap-4 w-full text-left">
                <Avatar className="h-16 w-16 border-2 border-white/20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
                    {user ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <SheetTitle className="text-white text-lg font-bold mb-1">
                    {user?.name || 'Guest User'}
                  </SheetTitle>
                  <p className="text-white/80 text-sm">{user?.email}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {user?.accountType === 'super_admin' ? 'Super Admin' : 
                     user?.accountType === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                </div>
              </button>
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Language Selector */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Language</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={user?.language === lang.code ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLanguageChange(lang.code as 'en' | 'es' | 'fr')}
                  className="text-xs"
                >
                  {lang.label}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Menu Sections */}
          <div className="py-2">
            {menuItems.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-4">
                <div className="px-4 py-2">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {section.section}
                  </h3>
                </div>
                <div className="space-y-1 px-2">
                  {section.items.map((item, itemIndex) => (
                    <SheetClose asChild key={itemIndex}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start h-12 text-left font-normal"
                        onClick={item.action}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span className="flex-1">{item.label}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </SheetClose>
                  ))}
                </div>
              </div>
            ))}

            {/* Notifications */}
            <div className="mb-4">
              <div className="px-4 py-2">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Updates
                </h3>
              </div>
              <div className="px-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-left font-normal"
                  onClick={handleNotifications}
                >
                  <Bell className="h-5 w-5 mr-3" />
                  <span className="flex-1">Notifications</span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs px-2 py-1 min-w-[20px] h-5">
                        {unreadCount}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-3">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">ItsEZE™ v1.0.0</p>
            <p className="text-xs text-muted-foreground">By Fast Forward App ®</p>
          </div>
          <Button 
            variant="outline" 
            className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SlideOutMenu;