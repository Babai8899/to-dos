import React from 'react'
import SidebarContext from './SidebarContext'

function HomeNavProvider({ children }) {

  return (
    <SidebarContext.Provider>
      <nav className="w-full flex gap-50 justify-center items-center py-2 mb-6">
        <div className='text-2xl text-center'>
          My ToDos
        </div>
        <ul className="flex gap-10 border-b-2 border-b-base-200">
          {children}
        </ul>
      </nav>
    </SidebarContext.Provider>
  )
}

export default HomeNavProvider
