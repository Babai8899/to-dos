import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';
import Transitions from '../components/Transitions';


function Welcome() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    return (
        <Transitions>
        <div className="flex justify-center w-1/2 mx-auto my-10">
            <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300" onClick={handleGetStarted}>Get Started</a>
            <div className="divider divider-horizontal"></div>
            <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300">Watch Demo</a>
        </div>
        </Transitions>
    )
}

export default Welcome
