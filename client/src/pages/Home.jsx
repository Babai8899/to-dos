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
                    <div key="deadline" className="p-4 card rounded-box h-96 w-full mx-auto bg-yellow-50/50 dark:bg-cyan-900/50 shadow-sm border-2 border-yellow-300 dark:border-cyan-500 flex flex-col">
                        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Deadline Knocking</h2>
                        <ul className="overflow-y-auto">
                            {deadlineKnockingTasks.length === 0 ? <li className="text-gray-500">No upcoming deadlines!</li> :
                                deadlineKnockingTasks.map(task => (
                                    <li key={task.taskId} className="mb-2 p-2 rounded bg-yellow-50/50 dark:bg-cyan-900/50 flex flex-col">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{task.title}</span>
                                        <span className="text-xs text-gray-800 dark:text-gray-200">Due: {task.date} {task.time}</span>
                                        <span className="text-xs text-gray-800 dark:text-gray-200">{task.description}</span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                )
            },
            {
                id: 'overdue',
                hasContent: overdueTasks.length > 0,
                render: (
                    <div key="overdue" className="p-4 card rounded-box h-96 w-full mx-auto bg-yellow-50/50 dark:bg-cyan-900/50 shadow-sm border-2 border-yellow-300 dark:border-cyan-500 flex flex-col">
                        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Overdue Tasks</h2>
                        <ul className="overflow-y-auto">
                            {overdueTasks.length === 0 ? <li className="text-gray-500">No overdue tasks!</li> :
                                overdueTasks.map(task => (
                                    <li key={task.taskId} className="mb-2 p-2 rounded bg-yellow-50/50 dark:bg-cyan-900/50 flex flex-col">
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{task.title}</span>
                                        <span className="text-xs text-gray-800 dark:text-gray-200">Was due: {task.date} {task.time}</span>
                                        <span className="text-xs text-gray-800 dark:text-gray-200">{task.description}</span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                )
            },
            {
                id: 'upcoming',
                hasContent: upcomingEvents.length > 0,
                render: (
                    <div key="upcoming" className="p-4 card rounded-box h-96 w-full mx-auto bg-yellow-50/50 dark:bg-cyan-900/50 shadow-sm border-2 border-yellow-300 dark:border-cyan-500 flex flex-col relative">
                        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Upcoming Events</h2>
                        <div className="absolute left-0 right-0 bottom-0 top-[3.5rem] overflow-hidden mx-4 px-4">
                            {upcomingEvents.length === 0 ? <p className="text-gray-500 px-4">No upcoming events!</p> :
                                <div className="flex flex-nowrap gap-3 overflow-x-auto pb-4 px-4 -mx-4 snap-x snap-mandatory">
                                    {upcomingEvents.map(event => (
                                        <div key={event.eventId} className="p-3 rounded bg-yellow-50/50 dark:bg-cyan-900/50 flex flex-col min-w-[260px] w-[calc(100vw-4rem)] md:w-72 shrink-0 snap-start">
                                            <span className="font-semibold text-gray-800 dark:text-gray-200 truncate mb-2">{event.title}</span>
                                            <div className="flex items-center gap-1 mb-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-800 dark:text-gray-200">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                </svg>
                                                <span className="text-xs text-gray-800 dark:text-gray-200">{event.date} {event.time}</span>
                                            </div>
                                            <div className="flex items-center gap-1 mb-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-800 dark:text-gray-200">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                </svg>
                                                <span className="text-xs text-gray-800 dark:text-gray-200 truncate">{event.location}</span>
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-xs text-gray-800 dark:text-gray-200 line-clamp-3">{event.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }</div>
                    </div>
                )
            },
            {
                id: 'recentEvent',
                hasContent: recentEvent !== null,
                render: (
                    <div key="recentEvent" className="p-4 card rounded-box h-96 w-full mx-auto bg-yellow-50/50 dark:bg-cyan-900/50 shadow-sm border-2 border-yellow-300 dark:border-cyan-500 flex flex-col">
                        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Recent Event</h2>
                        {recentEvent ? (
                            <div className="p-3 rounded bg-yellow-50/50 dark:bg-cyan-900/50 flex flex-col w-[calc(100%-2rem)] md:w-72 mx-auto">
                                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate mb-2">{recentEvent.title}</span>
                                <div className="flex items-center gap-1 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-800 dark:text-gray-200">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                    <span className="text-xs text-gray-800 dark:text-gray-200">{recentEvent.date} {recentEvent.time}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-800 dark:text-gray-200">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                    <span className="text-xs text-gray-800 dark:text-gray-200 truncate">{recentEvent.location}</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="text-xs text-gray-800 dark:text-gray-200 line-clamp-3">{recentEvent.description}</p>
                                </div>
                            </div>
                        ) : <span className="text-gray-500">No recent event!</span>}
                    </div>
                )
            },
            {
                id: 'lastNote',
                hasContent: lastNote !== null,
                render: (
                    <div key="lastNote" className="p-4 card rounded-box h-96 w-full mx-auto bg-yellow-50/50 dark:bg-cyan-900/50 shadow-sm border-2 border-yellow-300 dark:border-cyan-500 flex flex-col">
                        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Last Created Note</h2>
                        {lastNote ? (
                            <div className="flex flex-col flex-grow">
                                {editingNote ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedNote.title}
                                            onChange={(e) => setEditedNote({...editedNote, title: e.target.value})}
                                            className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2 bg-transparent border-b border-yellow-300 dark:border-cyan-500 focus:outline-none focus:border-yellow-400 dark:focus:border-cyan-400"
                                            placeholder="Note title"
                                        />
                                        <div className="flex-grow flex flex-col">
                                            <textarea
                                                value={editedNote.description}
                                                onChange={(e) => setEditedNote({...editedNote, description: e.target.value})}
                                                className="flex-grow text-sm text-gray-800 dark:text-gray-200 bg-transparent border border-yellow-300 dark:border-cyan-500 rounded p-2 focus:outline-none focus:border-yellow-400 dark:focus:border-cyan-400 resize-none"
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-3 py-1 text-sm text-gray-800 dark:text-gray-200 border border-yellow-300 dark:border-cyan-500 rounded hover:bg-yellow-100 dark:hover:bg-cyan-900"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleUpdateNote}
                                                    className="px-3 py-1 text-sm text-gray-800 dark:text-gray-200 bg-yellow-300 dark:bg-cyan-500 rounded hover:bg-yellow-400 dark:hover:bg-cyan-600"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div 
                                        className="flex flex-col flex-grow cursor-pointer hover:bg-yellow-100/50 dark:hover:bg-cyan-800/50 rounded p-2 transition-colors duration-200"
                                        onClick={handleEditNote}
                                    >
                                        <span className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{lastNote.title}</span>
                                        <div className="flex gap-2 mb-3 text-xs text-gray-800 dark:text-gray-200">
                                            <span>Created: {lastNote.createdOn || 'Unknown'}</span>
                                            {lastNote.lastEditedOn && lastNote.lastEditedOn !== lastNote.createdOn && (
                                                <span>• Last edited: {lastNote.lastEditedOn}</span>
                                            )}
                                        </div>
                                        <div className="flex-grow overflow-y-auto">
                                            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{lastNote.description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : <span className="text-gray-500">No notes found!</span>}
                    </div>
                )
            },
            {
                id: 'lastList',
                hasContent: lastList !== null,
                render: (
                    <div key="lastList" className="p-4 card rounded-box h-96 w-full mx-auto bg-yellow-50/50 dark:bg-cyan-900/50 shadow-sm border-2 border-yellow-300 dark:border-cyan-500 flex flex-col">
                        <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Last Created List</h2>
                        {lastList ? (
                            <div className="flex flex-col flex-grow">
                                {editingList ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editedList.title}
                                            onChange={(e) => setEditedList({...editedList, title: e.target.value})}
                                            className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2 bg-transparent border-b border-yellow-300 dark:border-cyan-500 focus:outline-none focus:border-yellow-400 dark:focus:border-cyan-400"
                                            placeholder="List title"
                                        />
                                        <div className="flex-grow flex flex-col">
                                            <div className="overflow-y-auto flex-grow" style={{ maxHeight: 'calc(100% - 40px)' }}>
                                                {editedList.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 mb-2 group">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.completed}
                                                            onChange={() => handleToggleItem(idx)}
                                                            className="checkbox checkbox-warning dark:checkbox-primary"
                                                        />
                                                        <span className={`text-sm flex-grow ${item.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                                            {item.itemName}
                                                        </span>
                                                        <button
                                                            onClick={() => handleDeleteItem(idx)}
                                                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                                className="mt-2 p-2 text-sm text-gray-800 dark:text-gray-200 bg-transparent border border-yellow-300 dark:border-cyan-500 rounded focus:outline-none focus:border-yellow-400 dark:focus:border-cyan-400"
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    onClick={handleCancelListEdit}
                                                    className="px-3 py-1 text-sm text-gray-800 dark:text-gray-200 border border-yellow-300 dark:border-cyan-500 rounded hover:bg-yellow-100 dark:hover:bg-cyan-900"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleUpdateList}
                                                    className="px-3 py-1 text-sm text-gray-800 dark:text-gray-200 bg-yellow-300 dark:bg-cyan-500 rounded hover:bg-yellow-400 dark:hover:bg-cyan-600"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div 
                                        className="flex flex-col flex-grow cursor-pointer hover:bg-yellow-100/50 dark:hover:bg-cyan-800/50 rounded p-2 transition-colors duration-200"
                                        onClick={handleEditList}
                                    >
                                        <span className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{lastList.title}</span>
                                        <div className="flex gap-2 mb-3 text-xs text-gray-800 dark:text-gray-200">
                                            <span>Created: {lastList.createdOn || 'Unknown'}</span>
                                            {lastList.lastEditedOn && lastList.lastEditedOn !== lastList.createdOn && (
                                                <span>• Last edited: {lastList.lastEditedOn}</span>
                                            )}
                                        </div>
                                        <div className="flex-grow overflow-y-auto">
                                            {lastList.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2 mb-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.completed}
                                                        readOnly
                                                        className="checkbox checkbox-warning dark:checkbox-primary"
                                                    />
                                                    <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
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
        <div className="fixed -right-0 top-16 lg:w-[calc(100vw-5rem)] w-screen md:h-[calc(100vh-8rem)] px-5 grid md:grid-cols-2 gap-y-4 gap-x-3 noscrollbar my-1 overflow-y-scroll h-[calc(100vh-15rem)] rounded-lg mx-auto">
            {generateSortedCards().map(card => card.render)}
        </div>
    );
}

export default Home;
