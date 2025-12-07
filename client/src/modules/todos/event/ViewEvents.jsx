import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../hooks/AuthContext';
import axiosInstance from '../../../api/axiosInstance';
import Transitions from '../../../components/Transitions';

function ViewEvents() {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [filter, setFilter] = useState('all'); // all, upcoming, past

    const loadEvents = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/events/user/${user.emailId}`);
            const eventsData = response.data.events || response.data;
            setEvents(Array.isArray(eventsData) ? eventsData : []);
        } catch (error) {
            console.error("Failed to load events:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadEvents();
        }
    }, [user]);

    const handleDelete = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                setActionLoading(prev => ({ ...prev, [`delete_${eventId}`]: true }));
                await axiosInstance.delete(`/events/${eventId}`);
                await loadEvents();
            } catch (error) {
                console.error("Failed to delete event:", error);
            } finally {
                setActionLoading(prev => ({ ...prev, [`delete_${eventId}`]: false }));
            }
        }
    };

    const getFilteredEvents = () => {
        if (!events || !Array.isArray(events)) return [];
        const now = new Date();
        switch (filter) {
            case 'upcoming':
                return events.filter(event => new Date(event.date) >= now);
            case 'past':
                return events.filter(event => new Date(event.date) < now);
            default:
                return events;
        }
    };

    const filteredEvents = getFilteredEvents();

    const getEventStatusColor = (event) => {
        return 'bg-yellow-50/50 dark:bg-cyan-900/50 border-yellow-300 dark:border-cyan-600';
    };

    return (
        <Transitions>
            <div className="fixed right-0 top-16 lg:w-[calc(100vw-5rem)] w-screen md:h-[calc(100vh-8rem)] px-6 py-4 noscrollbar overflow-y-scroll h-[calc(100vh-9rem)] pb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">My Events</h1>
                    <a href="/event" className="px-4 py-2 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300">
                        Create Event
                    </a>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'all' 
                                ? 'bg-yellow-300 dark:bg-cyan-500 text-gray-800 dark:text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                        All ({events ? events.length : 0})
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'upcoming' 
                                ? 'bg-yellow-300 dark:bg-cyan-500 text-gray-800 dark:text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                        Upcoming ({events ? events.filter(e => new Date(e.date) >= new Date()).length : 0})
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'past' 
                                ? 'bg-yellow-300 dark:bg-cyan-500 text-gray-800 dark:text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                        Past ({events ? events.filter(e => new Date(e.date) < new Date()).length : 0})
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading events...</div>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-2xl text-gray-600 dark:text-gray-400">No events found</p>
                        <a href="/event" className="mt-4 inline-block px-6 py-3 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300">
                            Create Your First Event
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event) => (
                            <div
                                key={event.eventId}
                                className={`p-6 rounded-lg border-2 shadow-lg transition-all hover:shadow-xl flex flex-col ${getEventStatusColor(event)}`}
                            >
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                                    {event.title}
                                </h3>
                                
                                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                                    {event.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {new Date(event.date).toLocaleDateString()} at {event.time}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {event.location}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <button
                                        disabled={actionLoading[`delete_${event.eventId}`]}
                                        onClick={() => handleDelete(event.eventId)}
                                        className="flex-1 px-4 py-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 text-white rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {actionLoading[`delete_${event.eventId}`] && <span className="loading loading-spinner loading-sm"></span>}
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Transitions>
    );
}

export default ViewEvents;
