import React, { useState } from 'react'
import HomeNavProvider from '../hooks/HomeNavProvider';

function Home() {
  const options = ['task', 'event', 'list', 'note'];
  const [activeNav, setActiveNav] = useState('task');

  return (
    <div className="w-screen lg:w-[calc(100vw-5rem)] grid gap-y-4 fixed -right-0 h-[calc(100vh-4rem-4rem)] noscrollbar my-3 overflow-y-scroll">
      <div className="card rounded-box h-96 w-11/12 mx-auto place-items-center shadow-lg">
        <HomeNavProvider value={{ activeNav, setActiveNav }}>
          {options.map((option, index) => (
            <li
              key={index}
              className={`md:text-lg text-sm text-center font-semibold cursor-pointer md:w-20 w-15 transition-colors duration-300
                ${activeNav === option
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'hover:border-b-2 hover:text-blue-200 hover:border-blue-200'}
              `}
              onClick={() => setActiveNav(option)}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </li>
          ))}
        </HomeNavProvider>
      </div>
      <div className="card rounded-box h-96 w-11/12 mx-auto place-items-center border-2">

      </div>
      <div className="card rounded-box h-96 w-11/12 mx-auto place-items-center border-2">

      </div>
    </div>
  )
}

export default Home