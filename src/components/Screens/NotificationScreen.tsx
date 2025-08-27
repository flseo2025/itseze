import { formatDistanceToNow } from 'date-fns';
import { Bell, Check, CheckCheck, ArrowLeft } from 'lucide-react';

import { useUser } from '@/contexts/UserContext';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NotificationScreenProps {
  onBack: () => void;
}

const NotificationScreen = ({ onBack }: NotificationScreenProps) => {
  const { notifications, unreadCount, markNotificationAsRead, markAllAsRead } = useUser();

  const getNotificationIcon = (type: string) => {
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

  const getBadgeVariant = (type: string) => {
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

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-white" />
              <h1 className="text-lg font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-white border-white hover:bg-white/20"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.read 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border'
              }`}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium">
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 h-2 w-2 bg-primary rounded-full inline-block" />
                        )}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getBadgeVariant(notification.type)} className="text-xs">
                    {notification.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-foreground">{notification.message}</p>
                {notification.fromAdmin && (
                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    From Admin
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationScreen;