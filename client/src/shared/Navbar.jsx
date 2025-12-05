import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../hooks/AuthContext'
import { useNavigate } from 'react-router-dom';

function Navbar() {

    const { logout, user } = useContext(AuthContext);
    console.log(user);
    const navigate = useNavigate();

    const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light')

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

    return (
        <div>
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
                    <div className="pt-2 px-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900 ease-in-out transition-colors duration-300">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 stroke-gray-800 dark:stroke-gray-200">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                            </svg>

                            <span className="badge badge-xs badge-error indicator-item"></span>
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
                                className="menu menu-sm dropdown-content bg-yellow-300 text-gray-800 dark:text-gray-200 dark:bg-cyan-600 rounded-box z-[100] mt-3 w-52 p-2 shadow">
                                <li><a href='/login'>Login</a></li>
                            </ul> :
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-yellow-300 text-gray-800 dark:text-gray-200 dark:bg-cyan-600 rounded-box z-[100] mt-3 w-52 p-2 shadow">
                                <li>
                                    <a className="justify-between" href='/user/view' onClick={closeInnerDropdown}>
                                        Profile
                                        <span className="badge">New</span>
                                    </a>
                                </li>
                                <li><a onClick={closeInnerDropdown}>Settings</a></li>
                                <li className="relative">
                                    <a onClick={handleMyTodosClick} className="cursor-pointer">My Todos</a>
                                    {showInnerDropdown && (
                                        <ul
                                            className="menu menu-sm bg-yellow-300 text-gray-800 dark:text-gray-200 dark:bg-cyan-600 rounded-box w-52 p-2 shadow absolute left-[-13rem] top-0 z-[101]"
                                        >
                                            <li><a href="/tasks">Tasks</a></li>
                                            <li><a href="/notes">Notes</a></li>
                                            <li><a href="/lists">Lists</a></li>
                                            <li><a href="/events">Events</a></li>
                                        </ul>
                                    )}
                                </li>
                                <li><a onClick={() => { closeInnerDropdown(); handleClick(); }}>Logout</a></li>
                            </ul>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
