import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import './NotificationBell.css';

const NotificationBell = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/notifications/user/${user.id}`);
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read_status).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      await axios.patch(`/api/notifications/${notification.id}/mark_read`);
      
      // Navigate to recipe (except for comment_deleted)
      if (notification.recipe && notification.type !== 'comment_deleted') {
        navigate(`/recipe/${notification.recipe.id}`);
      }
      
      setIsOpen(false);
      fetchNotifications();
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const getNotificationMessage = (notification) => {
    switch (notification.type) {
      case 'like':
        return `${notification.actor.username} liked your recipe`;
      case 'comment':
        return `${notification.actor.username} commented on your recipe`;
      case 'comment_deleted':
        return `${notification.actor.username} deleted your comment`;
      case 'follow':
        return `${notification.actor.username} started following you`;
      default:
        return 'New notification';
    }
  };

  if (!user) return null;

  return (
    <div className="notification-bell">
      <button 
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            <button onClick={() => setIsOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="notification-list">
            {notifications.filter(n => !n.read_status).length === 0 ? (
              <p className="no-notifications">No new notifications</p>
            ) : (
              notifications
                .filter(notification => !notification.read_status)
                .map(notification => (
                  <div 
                    key={notification.id} 
                    className="notification-item unread"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <p>{getNotificationMessage(notification)}</p>
                    {notification.recipe && notification.type !== 'comment_deleted' && (
                      <small className="recipe-title">on "{notification.recipe.title}"</small>
                    )}
                    {notification.type === 'comment_deleted' && notification.recipe && (
                      <small className="recipe-title">from "{notification.recipe.title}"</small>
                    )}
                    <small className="notification-date">{new Date(notification.created_at).toLocaleDateString()}</small>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;