import React, { useEffect, useState, useContext } from 'react';
import PushContext from '../hooks/PushContext';
import AuthContext from '../hooks/AuthContext';
import axiosInstance from '../api/axiosInstance';

function Home() {
    const { subscribe } = useContext(PushContext);
    const { user } = useContext(AuthContext);
    const emailId = user.emailId;
    const [lists, setLists] = useState([]);
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(false);
    const [editedNote, setEditedNote] = useState({ title: '', description: '' });
    const [editingList, setEditingList] = useState(false);
    const [editedList, setEditedList] = useState({ title: '', items: [] });
    const [newItemInput, setNewItemInput] = useState('');

    const handleEditList = () => {
        if (lastList) {
            setEditedList({
                title: lastList.title,
                items: [...lastList.items]
            });
            setEditingList(true);
        }
    };

    const handleUpdateList = async () => {
        try {
            // If there's a pending input, add it to items before submit
            let newItems = [...editedList.items];
            if (newItemInput.trim() !== "") {
                newItems.push({ itemName: newItemInput.trim(), completed: false });
            }

            await axiosInstance.put(`/lists/${lastList.listId}`, {
                ...editedList,
                items: newItems,
                user: emailId
            });
            await loadLists(); // Reload lists after update
            setEditingList(false);
            setNewItemInput('');
        } catch (error) {
            console.error("List update failed:", error?.response?.data?.message);
        }
    };

    const handleCancelListEdit = () => {
        setEditingList(false);
        setEditedList({ title: '', items: [] });
        setNewItemInput('');
    };

    const handleAddListItem = (e) => {
        if (e.key === "Enter" && newItemInput.trim() !== "") {
            setEditedList(prev => ({
                ...prev,
                items: [...prev.items, { itemName: newItemInput, completed: false }]
            }));
            setNewItemInput('');
        }
    };

    const handleToggleItem = (idx) => {
        setEditedList(prev => ({
            ...prev,
            items: prev.items.map((item, i) =>
                i === idx ? { ...item, completed: !item.completed } : item
            )
        }));
    };

    const handleDeleteItem = (idx) => {
        setEditedList(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== idx)
        }));
    };

    const handleEditNote = () => {
        if (lastNote) {
            setEditedNote({
                title: lastNote.title,
                description: lastNote.description
            });
            setEditingNote(true);
        }
    };

    const handleUpdateNote = async () => {
        try {
            await axiosInstance.put(`/notes/${lastNote.noteId}`, {
                ...editedNote,
                user: emailId
            });
            await loadNotes(); // Reload notes after update
            setEditingNote(false);
        } catch (error) {
            console.error("Note update failed:", error?.response?.data?.message);
        }
    };

    const handleCancelEdit = () => {
        setEditingNote(false);
        setEditedNote({ title: '', description: '' });
    };

    // Always set state as array, even if response is not
    const loadLists = async () => {
        try {
            const response = await axiosInstance.get(`/lists/user/${emailId}`);
            let data = response.data;
            if (Array.isArray(data)) setLists(data);
            else if (data && Array.isArray(data.lists)) setLists(data.lists);
            else setLists([]);
        } catch (error) {
            console.error("List loading failed:", error?.response?.data?.message);
            setLists([]);
        }
    }

    const loadNotes = async () => {
        try {
            const response = await axiosInstance.get(`/notes/user/${emailId}`);
            let data = response.data;
            if (Array.isArray(data)) setNotes(data);
            else if (data && Array.isArray(data.notes)) setNotes(data.notes);
            else setNotes([]);
        } catch (error) {
            console.error("Notes loading failed:", error?.response?.data?.message);
            setNotes([]);
        }
    }

    const loadEvents = async () => {
        try {
            const response = await axiosInstance.get(`/events/user/${emailId}`);
            let data = response.data;
            if (Array.isArray(data)) setEvents(data);
            else if (data && Array.isArray(data.events)) setEvents(data.events);
            else setEvents([]);
        } catch (error) {
            console.error("Events loading failed:", error?.response?.data?.message);
            setEvents([]);
        }
    }

    const loadTasks = async () => {
        try {
            const response = await axiosInstance.get(`/tasks/user/${emailId}`);
            let data = response.data;
            if (Array.isArray(data)) setTasks(data);
            else if (data && Array.isArray(data.tasks)) setTasks(data.tasks);
            else setTasks([]);
        }
        catch (error) {
            console.error("Tasks loading failed:", error?.response?.data?.message);
            setTasks([]);
        }
    }

    useEffect(() => {
        loadLists();
        loadNotes();
        loadEvents();
        loadTasks();
    }, []);

    useEffect(() => {
        const notificationConfirmed = localStorage.getItem('notificationConfirmed');
        if (!notificationConfirmed) {
            const result = window.confirm('Do you want to allow notifications?');
            if (result) {
                subscribe(user.emailId);
                localStorage.setItem('notificationConfirmed', 'true');
            } else {
                localStorage.setItem('notificationConfirmed', 'false');
            }
        }
    }, [subscribe]);

    // Helper functions for UI
    const today = new Date();
    const getDeadlineTasks = () => {
        return tasks.filter(task => {
            const taskDate = new Date(task.date);
            return (taskDate - today) / (1000 * 60 * 60 * 24) <= 2 && (taskDate - today) > 0;
        });
    };

    const getOverdueTasks = () => {
        return tasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate < today;
        });
    };

    const getUpcomingEvents = () => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate >= today;
        });
    };

    const recentEvent = events.length > 0 ? events[events.length - 1] : null;
    const lastNote = notes.length > 0 ? notes[notes.length - 1] : null;
    const lastList = lists.length > 0 ? lists[lists.length - 1] : null;

    // Generate cards and sort them based on content
    const generateSortedCards = () => {
        const deadlineKnockingTasks = getDeadlineTasks();
        const overdueTasks = getOverdueTasks();
        const upcomingEvents = getUpcomingEvents();

        const cards = [
            {
                id: 'deadline',
                hasContent: deadlineKnockingTasks.length > 0,
                render: (
                    <div key="deadline" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50/50 via-orange-50/50 to-red-50/50 dark:from-amber-900/50 dark:via-orange-900/50 dark:to-red-900/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-200/50 dark:border-amber-700/50 h-96 flex flex-col backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-amber-500/20 dark:bg-amber-400/20 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-amber-600 dark:text-amber-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">Deadline Knocking</h2>
                        </div>
                        <div className="relative z-10 flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-amber-300 dark:scrollbar-thumb-amber-700 scrollbar-track-transparent">
                            {deadlineKnockingTasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-2 opacity-50">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-medium">No upcoming deadlines!</p>
                                </div>
                            ) : (
                                deadlineKnockingTasks.map(task => (
                                    <div key={task.taskId} className="group/item bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-amber-200/30 dark:border-amber-700/30">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">{task.title}</h3>
                                            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs rounded-full font-medium">Urgent</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{task.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                            </svg>
                                            <span>Due: {task.date} at {task.time}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )
            },
            {
                id: 'overdue',
                hasContent: overdueTasks.length > 0,
                render: (
                    <div key="overdue" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50/50 via-pink-50/50 to-red-50/50 dark:from-rose-900/50 dark:via-pink-900/50 dark:to-red-900/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-rose-200/50 dark:border-rose-700/50 h-96 flex flex-col backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-red-500/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-rose-500/20 dark:bg-rose-400/20 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-rose-600 dark:text-rose-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-red-600 dark:from-rose-400 dark:to-red-400 bg-clip-text text-transparent">Overdue Tasks</h2>
                        </div>
                        <div className="relative z-10 flex-grow overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-rose-300 dark:scrollbar-thumb-rose-700 scrollbar-track-transparent">
                            {overdueTasks.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-2 opacity-50">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-medium">No overdue tasks!</p>
                                </div>
                            ) : (
                                overdueTasks.map(task => (
                                    <div key={task.taskId} className="group/item bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-rose-200/30 dark:border-rose-700/30">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">{task.title}</h3>
                                            <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs rounded-full font-medium">Overdue</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{task.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                            </svg>
                                            <span>Was due: {task.date} at {task.time}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )
            },
            {
                id: 'upcoming',
                hasContent: upcomingEvents.length > 0,
                render: (
                    <div key="upcoming" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50/50 via-blue-50/50 to-indigo-50/50 dark:from-sky-900/50 dark:via-blue-900/50 dark:to-indigo-900/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-sky-200/50 dark:border-sky-700/50 h-96 flex flex-col backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-400/20 to-blue-500/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-sky-500/20 dark:bg-sky-400/20 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-sky-600 dark:text-sky-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-400 dark:to-blue-400 bg-clip-text text-transparent">Upcoming Events</h2>
                        </div>
                        <div className="relative z-10 grow overflow-hidden">
                            {upcomingEvents.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-2 opacity-50">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                    <p className="text-sm font-medium">No upcoming events!</p>
                                </div>
                            ) : (
                                <div className="flex flex-nowrap gap-4 overflow-x-auto pb-4 h-full snap-x snap-mandatory scrollbar-thin scrollbar-thumb-sky-300 dark:scrollbar-thumb-sky-700 scrollbar-track-transparent">
                                    {upcomingEvents.map(event => (
                                        <div key={event.eventId} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-sky-200/30 dark:border-sky-700/30 min-w-[280px] shrink-0 snap-start flex flex-col">
                                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base mb-3 truncate">{event.title}</h3>
                                            <div className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 mb-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                </svg>
                                                <span className="text-xs font-medium">{event.date} at {event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-sky-600 dark:text-sky-400 mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                </svg>
                                                <span className="text-xs font-medium truncate">{event.location}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{event.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )
            },
            {
                id: 'recentEvent',
                hasContent: recentEvent !== null,
                render: (
                    <div key="recentEvent" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-50/50 via-purple-50/50 to-fuchsia-50/50 dark:from-violet-900/50 dark:via-purple-900/50 dark:to-fuchsia-900/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-violet-200/50 dark:border-violet-700/50 h-96 flex flex-col backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-500/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-violet-500/20 dark:bg-violet-400/20 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-violet-600 dark:text-violet-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">Recent Event</h2>
                        </div>
                        {recentEvent ? (
                            <div className="relative z-10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 border border-violet-200/30 dark:border-violet-700/30 flex flex-col">
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg mb-3 truncate">{recentEvent.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                    <span className="text-xs font-medium">{recentEvent.date} at {recentEvent.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                    <span className="text-xs font-medium truncate">{recentEvent.location}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4">{recentEvent.description}</p>
                            </div>
                        ) : (
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-2 opacity-50">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                <p className="text-sm font-medium">No recent event!</p>
                            </div>
                        )}
                    </div>
                )
            },
            {
                id: 'lastNote',
                hasContent: lastNote !== null,
                render: (
                    <div key="lastNote" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50/50 via-teal-50/50 to-cyan-50/50 dark:from-emerald-900/50 dark:via-teal-900/50 dark:to-cyan-900/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-200/50 dark:border-emerald-700/50 h-96 flex flex-col backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-emerald-600 dark:text-emerald-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Last Created Note</h2>
                        </div>
                        {lastNote ? (
                            <div className="relative z-10 grow flex flex-col">
                                {editingNote ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedNote.title}
                                            onChange={(e) => setEditedNote({...editedNote, title: e.target.value})}
                                            className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b-2 border-emerald-300 dark:border-emerald-600 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 px-3 py-2 rounded-t-lg transition-colors"
                                            placeholder="Note title"
                                        />
                                        <div className="grow flex flex-col">
                                            <textarea
                                                value={editedNote.description}
                                                onChange={(e) => setEditedNote({...editedNote, description: e.target.value})}
                                                className="grow text-sm text-gray-800 dark:text-gray-100 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-emerald-300 dark:border-emerald-600 rounded-lg p-3 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 resize-none transition-colors"
                                            />
                                            <div className="flex justify-end gap-2 mt-3">
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-emerald-300 dark:border-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleUpdateNote}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:from-emerald-600 hover:to-teal-600 shadow-md transition-all"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div 
                                        className="grow flex flex-col cursor-pointer bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-emerald-200/30 dark:border-emerald-700/30 group/note"
                                        onClick={handleEditNote}
                                    >
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover/note:text-emerald-600 dark:group-hover/note:text-emerald-400 transition-colors">{lastNote.title}</h3>
                                        <div className="flex gap-3 mb-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                            <span>Created: {lastNote.createdOn || 'Unknown'}</span>
                                            {lastNote.lastEditedOn && lastNote.lastEditedOn !== lastNote.createdOn && (
                                                <span>• Edited: {lastNote.lastEditedOn}</span>
                                            )}
                                        </div>
                                        <div className="grow overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 dark:scrollbar-thumb-emerald-700 scrollbar-track-transparent pr-2">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{lastNote.description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="relative z-10 flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-2 opacity-50">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                <p className="text-sm font-medium">No notes found!</p>
                            </div>
                        )}
                    </div>
                )
            },
            {
                id: 'lastList',
                hasContent: lastList !== null,
                render: (
                    <div key="lastList" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50/50 via-rose-50/50 to-fuchsia-50/50 dark:from-pink-900/50 dark:via-rose-900/50 dark:to-fuchsia-900/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-200/50 dark:border-pink-700/50 h-96 flex flex-col backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-fuchsia-500/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 flex items-center gap-3 mb-4">
                            <div className="p-2.5 bg-pink-500/20 dark:bg-pink-400/20 rounded-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-pink-600 dark:text-pink-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-fuchsia-600 dark:from-pink-400 dark:to-fuchsia-400 bg-clip-text text-transparent">Last Created List</h2>
                        </div>
                        {lastList ? (
                            <div className="relative z-10 grow flex flex-col">
                                {editingList ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedList.title}
                                            onChange={(e) => setEditedList({...editedList, title: e.target.value})}
                                            className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b-2 border-pink-300 dark:border-pink-600 focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 px-3 py-2 rounded-t-lg transition-colors"
                                            placeholder="List title"
                                        />
                                        <div className="grow flex flex-col">
                                            <div className="overflow-y-auto grow scrollbar-thin scrollbar-thumb-pink-300 dark:scrollbar-thumb-pink-700 scrollbar-track-transparent pr-2" style={{ maxHeight: 'calc(100% - 90px)' }}>
                                                {editedList.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 mb-2 group/item bg-white/40 dark:bg-gray-800/40 rounded-lg p-2 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.completed}
                                                            onChange={() => handleToggleItem(idx)}
                                                            className="checkbox checkbox-sm border-pink-400 [--chkbg:theme(colors.pink.500)] [--chkfg:white] checked:border-pink-500"
                                                        />
                                                        <span className={`text-sm grow ${item.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                                            {item.itemName}
                                                        </span>
                                                        <button
                                                            onClick={() => handleDeleteItem(idx)}
                                                            className="text-rose-500 opacity-0 group-hover/item:opacity-100 transition-opacity hover:text-rose-700"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                value={newItemInput}
                                                onChange={(e) => setNewItemInput(e.target.value)}
                                                onKeyDown={handleAddListItem}
                                                placeholder="Add new item (press Enter)"
                                                className="mt-2 p-2 text-sm text-gray-800 dark:text-gray-100 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-pink-300 dark:border-pink-600 rounded-lg focus:outline-none focus:border-pink-500 dark:focus:border-pink-400 transition-colors"
                                            />
                                            <div className="flex justify-end gap-2 mt-3">
                                                <button
                                                    onClick={handleCancelListEdit}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-pink-300 dark:border-pink-600 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/40 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleUpdateList}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 rounded-lg hover:from-pink-600 hover:to-fuchsia-600 shadow-md transition-all"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div 
                                        className="grow flex flex-col cursor-pointer bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 hover:shadow-md transition-all duration-200 border border-pink-200/30 dark:border-pink-700/30 group/list"
                                        onClick={handleEditList}
                                    >
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 group-hover/list:text-pink-600 dark:group-hover/list:text-pink-400 transition-colors">{lastList.title}</h3>
                                        <div className="flex gap-3 mb-3 text-xs text-pink-600 dark:text-pink-400 font-medium">
                                            <span>Created: {lastList.createdOn || 'Unknown'}</span>
                                            {lastList.lastEditedOn && lastList.lastEditedOn !== lastList.createdOn && (
                                                <span>• Edited: {lastList.lastEditedOn}</span>
                                            )}
                                        </div>
                                        <div className="grow overflow-y-auto scrollbar-thin scrollbar-thumb-pink-300 dark:scrollbar-thumb-pink-700 scrollbar-track-transparent pr-2">
                                            {lastList.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2 mb-2 bg-white/40 dark:bg-gray-800/40 rounded-lg p-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.completed}
                                                        readOnly
                                                        className="checkbox checkbox-sm border-pink-400 [--chkbg:theme(colors.pink.500)] [--chkfg:white] checked:border-pink-500"
                                                    />
                                                    <span className={`text-sm ${item.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                                        {item.itemName}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : <span className="text-gray-500">No lists found!</span>}
                    </div>
                )
            }
        ];

        // Sort cards: cards with content first, empty cards last
        return cards.sort((a, b) => {
            if (a.hasContent && !b.hasContent) return -1;
            if (!a.hasContent && b.hasContent) return 1;
            return 0;
        });
    };

    return (
        <div className="fixed right-0 top-16 lg:w-[calc(100vw-5rem)] w-screen md:h-[calc(100vh-8rem)] px-6 py-4 grid md:grid-cols-2 gap-5 noscrollbar overflow-y-scroll h-[calc(100vh-15rem)]">
            {generateSortedCards().map(card => card.render)}
        </div>
    );
}

export default Home;
