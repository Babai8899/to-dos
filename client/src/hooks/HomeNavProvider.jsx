import React from 'react'
import SidebarContext from './SidebarContext'

function HomeNavProvider({ children }) {

  return (
    <SidebarContext.Provider>
      <nav className="w-full flex md:gap-50 gap-5 justify-center items-center py-2 mb-6">
        <div className='text-xl text-center font-bold'>
          My ToDos
        </div>
        <ul className="flex md:gap-10 gap-3 border-b-2 border-b-base-200">
          {children}
        </ul>
      </nav>
    </SidebarContext.Provider>
  )
}

export default HomeNavProvider
