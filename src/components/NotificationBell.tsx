
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellRing,
  Check,
  X 
} from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  subscribeToNotifications,
  type Notification 
} from '@/services/notifications';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Fetch notifications on mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotifications();
      setNotifications(data);
    };
    
    fetchData();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const cleanup = subscribeToNotifications((newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
    });
    
    return () => {
      cleanup();
    };
  }, []);

  // Handle marking a notification as read
  const handleMarkAsRead = async (id: string) => {
    const success = await markNotificationAsRead(id);
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    const success = await markAllNotificationsAsRead();
    if (success) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'match':
        if (notification.related_entity_id) {
          navigate(`/messages/${notification.related_entity_id}`);
        }
        break;
      case 'message':
        if (notification.related_entity_id) {
          navigate(`/messages/${notification.related_entity_id}`);
        }
        break;
      case 'like':
        navigate('/matches');
        break;
      case 'profile_view':
        navigate('/profile');
        break;
      default:
        break;
    }
    
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
        >
          {unreadCount > 0 ? (
            <>
              <BellRing className="h-5 w-5 text-love" />
              <span className="absolute top-0 right-0 -mr-1 -mt-1 h-4 w-4 rounded-full bg-love text-[10px] font-medium text-white flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </>
          ) : (
            <Bell className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 max-h-[450px] flex flex-col"
        align="end"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-2 rounded-md cursor-pointer flex justify-between items-start ${
                    notification.is_read ? 'bg-background' : 'bg-love/5'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div>
                    <p className="text-sm font-medium">{notification.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
