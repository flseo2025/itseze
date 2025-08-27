"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const date_fns_1 = require("date-fns");
const lucide_react_1 = require("lucide-react");
const UserContext_1 = require("@/contexts/UserContext");
const badge_1 = require("@/components/ui/badge");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const NotificationScreen = ({ onBack }) => {
    const { notifications, unreadCount, markNotificationAsRead, markAllAsRead } = (0, UserContext_1.useUser)();
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return '✅';
            case 'warning':
                return '⚠️';
            case 'error':
                return '❌';
            default:
                return 'ℹ️';
        }
    };
    const getBadgeVariant = (type) => {
        switch (type) {
            case 'success':
                return 'default';
            case 'warning':
                return 'secondary';
            case 'error':
                return 'destructive';
            default:
                return 'outline';
        }
    };
    return (<div className="h-full flex flex-col bg-background">
      
      <div className="p-4 border-b bg-gradient-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button_1.Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
              <lucide_react_1.ArrowLeft className="h-4 w-4"/>
            </button_1.Button>
            <div className="flex items-center gap-2">
              <lucide_react_1.Bell className="h-5 w-5 text-white"/>
              <h1 className="text-lg font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (<badge_1.Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </badge_1.Badge>)}
            </div>
          </div>
          {unreadCount > 0 && (<button_1.Button variant="outline" size="sm" onClick={markAllAsRead} className="text-white border-white hover:bg-white/20">
              <lucide_react_1.CheckCheck className="h-4 w-4 mr-1"/>
              Mark All Read
            </button_1.Button>)}
        </div>
      </div>

      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (<div className="text-center py-8">
            <lucide_react_1.Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
            <p className="text-muted-foreground">No notifications yet</p>
          </div>) : (notifications.map((notification) => (<card_1.Card key={notification.id} className={`cursor-pointer transition-all hover:shadow-md ${!notification.read
                ? 'border-primary bg-primary/5'
                : 'border-border'}`} onClick={() => markNotificationAsRead(notification.id)}>
              <card_1.CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <card_1.CardTitle className="text-sm font-medium">
                        {notification.title}
                        {!notification.read && (<span className="ml-2 h-2 w-2 bg-primary rounded-full inline-block"/>)}
                      </card_1.CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(0, date_fns_1.formatDistanceToNow)(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <badge_1.Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                    {notification.type}
                  </badge_1.Badge>
                </div>
              </card_1.CardHeader>
              <card_1.CardContent className="pt-0">
                <p className="text-sm text-foreground">{notification.message}</p>
                {notification.fromAdmin && (<div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full"/>
                    From Admin
                  </div>)}
              </card_1.CardContent>
            </card_1.Card>)))}
      </div>
    </div>);
};
exports.default = NotificationScreen;
//# sourceMappingURL=NotificationScreen.js.map