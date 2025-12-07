import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../hooks/AuthContext';
import NotificationContext from '../../../hooks/NotificationContext';
import axiosInstance from '../../../api/axiosInstance';
import Transitions from '../../../components/Transitions';

function ViewTasks() {
    const { user } = useContext(AuthContext);
    const { checkNotifications } = useContext(NotificationContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({}); // Track loading state per task
    const [filter, setFilter] = useState('all'); // all, pending, completed, overdue

    const loadTasks = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/tasks/user/${user.emailId}`);
            const tasksData = response.data.tasks || response.data;
            setTasks(Array.isArray(tasksData) ? tasksData : []);
        } catch (error) {
            console.error("Failed to load tasks:", error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadTasks();
        }
    }, [user]);

    const handleDelete = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                setActionLoading(prev => ({ ...prev, [`delete_${taskId}`]: true }));
                await axiosInstance.delete(`/tasks/${taskId}`);
                await loadTasks();
            } catch (error) {
                console.error("Failed to delete task:", error);
            } finally {
                setActionLoading(prev => ({ ...prev, [`delete_${taskId}`]: false }));
            }
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            setActionLoading(prev => ({ ...prev, [`complete_${task.taskId}`]: true }));
            await axiosInstance.put(`/tasks/${task.taskId}`, {
                ...task,
                status: task.status === 'completed' ? 'pending' : 'completed',
                user: user.emailId
            });
            await loadTasks();
            checkNotifications(); // Sync notifications
        } catch (error) {
            console.error("Failed to update task:", error);
        } finally {
            setActionLoading(prev => ({ ...prev, [`complete_${task.taskId}`]: false }));
        }
    };

    const getFilteredTasks = () => {
        if (!tasks || !Array.isArray(tasks)) return [];
        const now = new Date();
        switch (filter) {
            case 'pending':
                return tasks.filter(task => task.status === 'pending');
            case 'completed':
                return tasks.filter(task => task.status === 'completed');
            case 'overdue':
                return tasks.filter(task => 
                    task.status === 'pending' && new Date(task.date) < now
                );
            default:
                return tasks;
        }
    };

    const filteredTasks = getFilteredTasks();

    const getTaskStatusColor = (task) => {
        if (task.status === 'completed') return 'bg-yellow-50/50 dark:bg-cyan-900/50 border-yellow-300 dark:border-cyan-600';
        const now = new Date();
        if (new Date(task.date) < now) return 'bg-yellow-50/50 dark:bg-cyan-900/50 border-yellow-300 dark:border-cyan-600';
        return 'bg-yellow-50/50 dark:bg-cyan-900/50 border-yellow-300 dark:border-cyan-600';
    };

    return (
        <Transitions>
            <div className="fixed right-0 top-16 lg:w-[calc(100vw-5rem)] w-screen md:h-[calc(100vh-8rem)] px-6 py-4 noscrollbar overflow-y-scroll h-[calc(100vh-9rem)] pb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">My Tasks</h1>
                    <a href="/task" className="px-4 py-2 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300">
                        Create Task
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
                        All ({tasks ? tasks.length : 0})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'pending' 
                                ? 'bg-yellow-300 dark:bg-cyan-500 text-gray-800 dark:text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                        Pending ({tasks ? tasks.filter(t => t.status === 'pending').length : 0})
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'completed' 
                                ? 'bg-yellow-300 dark:bg-cyan-500 text-gray-800 dark:text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                        Completed ({tasks ? tasks.filter(t => t.status === 'completed').length : 0})
                    </button>
                    <button
                        onClick={() => setFilter('overdue')}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                            filter === 'overdue' 
                                ? 'bg-yellow-300 dark:bg-cyan-500 text-gray-800 dark:text-white' 
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                        Overdue ({tasks ? tasks.filter(t => t.status === 'pending' && new Date(t.date) < new Date()).length : 0})
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-2xl text-gray-600 dark:text-gray-400">Loading tasks...</div>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-2xl text-gray-600 dark:text-gray-400">No tasks found</p>
                        <a href="/task" className="mt-4 inline-block px-6 py-3 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300">
                            Create Your First Task
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredTasks.map((task) => (
                            <div
                                key={task.taskId}
                                className={`p-6 rounded-lg border-2 shadow-lg transition-all hover:shadow-xl flex flex-col ${getTaskStatusColor(task)}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex-1">
                                        {task.title}
                                    </h3>
                                    {task.status === 'completed' && (
                                        <div className="ml-2 bg-green-500 rounded-full p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="white" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                
                                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                                    {task.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Due: {new Date(task.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Priority: {task.priority}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    {task.status === 'pending' && (
                                        <button
                                            disabled={actionLoading[`complete_${task.taskId}`]}
                                            onClick={() => handleToggleComplete(task)}
                                            className="flex-1 px-4 py-2 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading[`complete_${task.taskId}`] ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                            )}
                                            Mark Done
                                        </button>
                                    )}
                                    <button
                                        disabled={actionLoading[`delete_${task.taskId}`]}
                                        onClick={() => handleDelete(task.taskId)}
                                        className="flex-1 px-4 py-2 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 text-white rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {actionLoading[`delete_${task.taskId}`] && <span className="loading loading-spinner loading-sm"></span>}
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

export default ViewTasks;
