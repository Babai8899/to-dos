import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../hooks/AuthContext'
import NotificationContext from '../hooks/NotificationContext'
import { useNavigate } from 'react-router-dom';

function Navbar() {

    const { logout, user } = useContext(AuthContext);
    const { hasNotifications, notifications, checkNotifications } = useContext(NotificationContext);
    console.log(user);
    const navigate = useNavigate();

    const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light')
    const [showNotifications, setShowNotifications] = useState(false);
    const [taskLoading, setTaskLoading] = useState({});

    const toggleTheme = (e) => {
        console.log(e.target.checked);
        if (e.target.checked) {
            setTheme('dark');
        }
        else {
            setTheme('light');
        }
    }

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const localTheme = localStorage.getItem('theme');
        document.querySelector("html").setAttribute("data-theme", localTheme);
    });

    const handleClick = () => {
        logout();
        navigate('/');
    }
    // State for inner dropdown visibility
    const [showInnerDropdown, setShowInnerDropdown] = useState(false);
    const handleMyTodosClick = (e) => {
        e.preventDefault();
        setShowInnerDropdown((prev) => !prev);
    }
    const closeInnerDropdown = () => {
        setShowInnerDropdown(false);
    }

    const toggleNotifications = () => {
        console.log('Toggle notifications clicked, current state:', showNotifications);
        setShowNotifications((prev) => {
            console.log('New state will be:', !prev);
            return !prev;
        });
    }

    const markTaskAsCompleted = async (e, task) => {
        e.stopPropagation();
        try {
            setTaskLoading(prev => ({ ...prev, [task.taskId]: true }));
            await axiosInstance.put(`/tasks/${task.taskId}`, {
                ...task,
                status: 'completed',
                user: user.emailId
            });
            // Refresh notifications after marking as completed
            await checkNotifications();
        } catch (error) {
            console.error('Error marking task as completed:', error);
        } finally {
            setTaskLoading(prev => ({ ...prev, [task.taskId]: false }));
        }
    }

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotifications && !event.target.closest('.notification-dropdown-container') && !event.target.closest('.notification-panel')) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifications]);

    return (
        <>
            <div className="relative">
                <div className="navbar bg-gray-200 dark:bg-gray-800 shadow-sm">
                    <div className="flex my-auto text-4xl navbar-start gap-4">
                    <a className="rounded-box grid h-10 place-items-center cursor-pointer hover:text-yellow-400 dark:hover:text-cyan-700 font-bold ease-in-out transition-colors duration-300 text-shadow-xs text-yellow-500 dark:text-cyan-600 dark:text-shadow-gray-200 text-shadow-gray-800" href="/">ChronoMate</a>
                    <input type="text" placeholder="Search" className="input bg-gray-400 dark:bg-gray-600 dark:placeholder:text-gray-200 placeholder:text-gray-800 md:w-auto lg:visible invisible" />
                </div>
                <div className="flex gap-2 navbar-end">
                    <label className="swap swap-rotate p-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 ease-in-out transition-colors duration-300">
                        {/* this hidden checkbox controls the state */}
                        <input
                            type="checkbox"
                            className="theme-controller"
                            value="synthwave"
                            onChange={toggleTheme}
                            checked={theme === 'dark'}
                        />
                        {/* moon icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 swap-on stroke-gray-200">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                        </svg>


                        {/* sun icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 swap-off stroke-gray-800">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                        </svg>

                    </label>
                    <div className="notification-dropdown-container">
                        <div 
                            tabIndex={0} 
                            role="button" 
                            className="pt-2 px-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 ease-in-out transition-colors duration-300"
                            onClick={toggleNotifications}
                        >
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 stroke-gray-800 dark:stroke-gray-200">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                </svg>
                                {hasNotifications && <span className="badge badge-xs badge-error indicator-item"></span>}
                            </div>
                        </div>
                    </div>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="py-2 px-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 ease-in-out transition-colors duration-300" onClick={closeInnerDropdown}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 stroke-gray-800 dark:stroke-gray-200">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                        {user === null ?
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-yellow-300 text-gray-800 dark:text-gray-200 dark:bg-cyan-600 rounded-box z-100 mt-3 w-52 p-2 shadow">
                                <li><a href='/login'>Login</a></li>
                            </ul> :
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-yellow-300 text-gray-800 dark:text-gray-200 dark:bg-cyan-600 rounded-box z-100 mt-3 w-52 p-2 shadow">
                                <li>
                                    <a className="justify-between" href='/user/view' onClick={closeInnerDropdown}>
                                        Profile
                                        <span className="badge">New</span>
                                    </a>
                                </li>
                                <li><a onClick={closeInnerDropdown} className="cursor-pointer">Settings</a></li>
                                <li className="relative">
                                    <a onClick={handleMyTodosClick} className="cursor-pointer">My Todos</a>
                                    {showInnerDropdown && (
                                        <ul
                                            className="menu menu-sm bg-yellow-300 text-gray-800 dark:text-gray-200 dark:bg-cyan-600 rounded-box w-52 p-2 shadow absolute -left-52 top-0 z-101"
                                        >
                                            <li><a href="/tasks">Tasks</a></li>
                                            <li><a href="/notes">Notes</a></li>
                                            <li><a href="/lists">Lists</a></li>
                                            <li><a href="/events">Events</a></li>
                                        </ul>
                                    )}
                                </li>
                                <li><a onClick={() => { closeInnerDropdown(); handleClick(); }} className="cursor-pointer">Logout</a></li>
                            </ul>}
                    </div>
                </div>
            </div>
        </div>

            {/* Floating Notification Panel */}
            {showNotifications && (
                <div className="notification-panel fixed top-20 right-4 bg-yellow-50 dark:bg-cyan-900 border-2 border-yellow-300 dark:border-cyan-600 rounded-2xl z-9999 w-96 max-h-128 overflow-y-auto shadow-2xl animate-slide-down">
                    <div className="p-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-amber-600 dark:text-cyan-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>
                            Notifications
                        </h3>

                        {/* Overdue Tasks */}
                        {notifications.overdueTasks.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                    </svg>
                                    Overdue Tasks ({notifications.overdueTasks.length})
                                </h4>
                                <div className="space-y-2">
                                    {notifications.overdueTasks.map((task) => (
                                        <div key={task.taskId} className="p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-rose-300 dark:border-rose-600">
                                            <div className="flex justify-between items-start gap-2">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{task.title}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                                        </svg>
                                                        Was due: {new Date(task.date).toLocaleDateString()} at {task.time}
                                                    </p>
                                                </div>
                                                <button
                                                    disabled={taskLoading[task.taskId]}
                                                    onClick={(e) => markTaskAsCompleted(e, task)}
                                                    className="btn btn-xs bg-yellow-300 hover:bg-yellow-400 dark:bg-cyan-600 dark:hover:bg-cyan-700 border-none text-gray-800 dark:text-gray-200 rounded-tl-lg rounded-br-lg rounded-tr-xs rounded-bl-xs disabled:opacity-50 disabled:cursor-not-allowed min-h-0 h-6"
                                                    title="Mark as completed"
                                                >
                                                    {taskLoading[task.taskId] ? (
                                                        <span className="loading loading-spinner loading-xs"></span>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Today's Events */}
                        {notifications.todayEvents.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                    Today's Events ({notifications.todayEvents.length})
                                </h4>
                                <div className="space-y-2">
                                    {notifications.todayEvents.map((event) => (
                                        <div key={event.eventId} className="p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-sky-300 dark:border-sky-600">
                                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{event.title}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {event.time} at {event.location}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No notifications */}
                        {notifications.overdueTasks.length === 0 && notifications.todayEvents.length === 0 && (
                            <div className="text-center py-8">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-gray-600 dark:text-gray-400">No notifications at this time</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
