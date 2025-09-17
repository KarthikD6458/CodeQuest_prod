// src/components/dashboard/ActivityCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Bell, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { formatTimeAgo } from '../../services/utils';

const ActivityCard = ({ activity }) => {
  // Get activity icon
  const getIcon = () => {
    if (activity.type === 'session') {
      return <Calendar className="h-5 w-5 text-blue-500" />;
    } else {
      return <Bell className="h-5 w-5 text-purple-500" />;
    }
  };
  
  // Get activity link
  const getLink = () => {
    if (activity.type === 'session') {
      return `/sessions/${activity.data.id}`;
    } else if (activity.type === 'notification') {
      return activity.data.action_url || '/notifications';
    }
    return '#';
  };
  
  return (
    <Link 
      to={getLink()} 
      className={`block p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
        activity.type === 'notification' && !activity.is_read 
          ? 'bg-blue-50 dark:bg-blue-900/20' 
          : ''
      }`}
    >
      <div className="flex">
        <div className="mr-4 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className={`text-gray-900 dark:text-white ${
            activity.type === 'notification' && !activity.is_read ? 'font-medium' : ''
          }`}>
            {activity.title}
          </p>
          {activity.subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {activity.subtitle}
            </p>
          )}
          <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            {formatTimeAgo(activity.date)}
          </div>
        </div>
        <div className="ml-2 flex items-center">
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </Link>
  );
};

export default ActivityCard;