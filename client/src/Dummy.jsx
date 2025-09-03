import React from 'react'
import { Link } from 'react-router-dom'

function Dummy() {
    return (
        <div className=' my-1.5 md:w-1/2 w-screen md:h-[calc(100vh-8rem)] h-[calc(100vh-15rem)] rounded-lg flex flex-col gap-4 justify-center items-center mx-auto md:bg-yellow-50/50 md:dark:bg-cyan-900/50 md:shadow-sm md:border-2 md:border-yellow-300 md:dark:border-cyan-500'>
            <h1 className='text-4xl text-yellow-600 dark:text-cyan-500 font-bold'>Login</h1>
            <div className='w-full max-w-xs'>
                <label className='text-gray-900 dark:text-gray-200'>Title</label>
                <input type="text" placeholder="Email ID" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" />
            </div>
            <div className='w-full max-w-xs'>
                <label className='text-gray-900 dark:text-gray-200'>Password</label>
                <input type="password" placeholder="Password" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" />
            </div>
            <div className='w-full max-w-xs'>
                <label className='text-gray-900 dark:text-gray-200'>Deadline</label>
                <div className='flex gap-2'>
                    <input type="date" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600 w-1/2" />
                    <input type="time" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600 w-1/2" />
                </div>
            </div>
            <div className="flex justify-center w-full mx-auto my-2 gap-5">
                <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300">Login</a>
                <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300">Reset</a>
            </div>

        </div>
    )
}

export default Dummy
