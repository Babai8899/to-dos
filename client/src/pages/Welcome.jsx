import React from 'react'
import { useNavigate } from 'react-router-dom'
import Transitions from '../components/Transitions';


function Welcome() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    const pageVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 2 },
        exit: { opacity: 0 },
    };

    return (
        <Transitions pageVariants={pageVariants}>
            <div className="flex justify-center w-full mx-auto my-10">
                <a className="bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded-box grid h-10 md:w-32 w-40 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300" onClick={handleGetStarted}>Get Started</a>
                <div className="divider divider-horizontal"></div>
                <a className="bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-200 rounded-box grid h-10 md:w-32 w-40 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300">Watch Demo</a>
            </div>
        </Transitions>
    )
}

export default Welcome
