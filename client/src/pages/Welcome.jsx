import React from 'react'
import { useNavigate } from 'react-router-dom'
import Transitions from '../components/Transitions';


function Welcome() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <Transitions pageVariants={pageVariants}>
            <div className="fixed right-0 top-16 lg:w-[calc(100vw-5rem)] w-screen md:h-[calc(100vh-8rem)] px-6 py-4 noscrollbar overflow-y-scroll h-[calc(100vh-9rem)] pb-6">
                <div className="max-w-6xl w-full mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-linear-to-r from-yellow-500 via-amber-500 to-yellow-600 dark:from-cyan-400 dark:via-cyan-500 dark:to-cyan-600 bg-clip-text text-transparent">
                            ChronoMate
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-medium mb-2">
                            Your Personal Time Management Companion
                        </p>
                        <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Organize tasks, schedule events, create lists, and capture notes - all in one beautiful, intuitive platform
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {/* Tasks Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-yellow-50/50 dark:bg-cyan-900/50 p-4 border-2 border-yellow-300 dark:border-cyan-600 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-amber-400/20 to-yellow-500/20 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="p-2 bg-amber-500/20 dark:bg-amber-400/20 rounded-xl w-fit mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-amber-600 dark:text-amber-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Tasks</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Track your to-dos with priorities and deadlines</p>
                            </div>
                        </div>

                        {/* Events Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-yellow-50/50 dark:bg-cyan-900/50 p-4 border-2 border-yellow-300 dark:border-cyan-600 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-sky-400/20 to-blue-500/20 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="p-2 bg-sky-500/20 dark:bg-sky-400/20 rounded-xl w-fit mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-sky-600 dark:text-sky-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Events</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Plan and manage your important occasions</p>
                            </div>
                        </div>

                        {/* Lists Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-yellow-50/50 dark:bg-cyan-900/50 p-4 border-2 border-yellow-300 dark:border-cyan-600 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-pink-400/20 to-fuchsia-500/20 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="p-2 bg-pink-500/20 dark:bg-pink-400/20 rounded-xl w-fit mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-pink-600 dark:text-pink-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Lists</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Create checklists for any purpose</p>
                            </div>
                        </div>

                        {/* Notes Card */}
                        <div className="group relative overflow-hidden rounded-2xl bg-yellow-50/50 dark:bg-cyan-900/50 p-4 border-2 border-yellow-300 dark:border-cyan-600 hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="p-2 bg-emerald-500/20 dark:bg-emerald-400/20 rounded-xl w-fit mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-emerald-600 dark:text-emerald-400">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">Notes</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Capture your thoughts and ideas instantly</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex justify-center items-center">
                        <button 
                            className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs px-6 py-3 text-base font-semibold cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300 shadow-lg hover:shadow-xl" 
                            onClick={handleGetStarted}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </Transitions>
    )
}

export default Welcome
