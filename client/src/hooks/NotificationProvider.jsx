import React, { useState, useEffect, useContext } from 'react';
import NotificationContext from './NotificationContext';
import AuthContext from './AuthContext';
import axiosInstance from '../api/axiosInstance';

const NotificationProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [hasNotifications, setHasNotifications] = useState(false);
    const [notifications, setNotifications] = useState({ overdueTasks: [], todayEvents: [] });

    const checkNotifications = async () => {
        if (!user) return;

        try {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            
            // Fetch tasks
            const tasksResponse = await axiosInstance.get(`/tasks/user/${user.emailId}`);
            const tasksData = tasksResponse.data.tasks || tasksResponse.data;
            const tasks = Array.isArray(tasksData) ? tasksData : [];
            
            // Check for overdue tasks
            const overdueTasks = tasks.filter(task => 
                task.status === 'pending' && new Date(task.date) < now
            );

            // Fetch events
            const eventsResponse = await axiosInstance.get(`/events/user/${user.emailId}`);
            const eventsData = eventsResponse.data.events || eventsResponse.data;
            const events = Array.isArray(eventsData) ? eventsData : [];
            
            // Check for today's events
            const todayEvents = events.filter(event => event.date === today);

            // Store notifications data
            setNotifications({ overdueTasks, todayEvents });
            
            // Set notification indicator if there are overdue tasks or today's events
            setHasNotifications(overdueTasks.length > 0 || todayEvents.length > 0);
        } catch (error) {
            console.error("Failed to check notifications:", error);
        }
    };

    useEffect(() => {
        checkNotifications();
        // Check notifications every 5 minutes
        const interval = setInterval(checkNotifications, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <NotificationContext.Provider value={{ hasNotifications, notifications, checkNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationProvider;
