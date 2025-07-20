import { faBars } from '@fortawesome/free-solid-svg-icons/faBars'
import React, { createContext, useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SidebarContext = createContext();

function Sidebar({ children }) {
    const [open, setOpen] = useState(false);

    const handleSidebar = () => {
        setOpen(!open);
    }

    return (
        <aside className='lg:h-screen lg:w-auto fixed sm:w-screen lg:bottom-auto bottom-0'>
            <nav className="lg:h-full sm:h-auto flex lg:flex-col sm:flex-row bg-base-100 border-r-2 border-r-base-200 shadow-xl">
                <div className="hidden lg:flex p-4 pb-2 justify-between items-center my-2" >
                    <div className={`text-2xl overflow-hidden transition-all ${open ? 'w-40' : 'w-0'
                        }`}>
                        CreateMenu
                    </div>
                    <button className="p-1 rounded-lg bg-base-200 hover:bg-base-300" onClick={() => handleSidebar()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>

                    </button>
                </div>
                <SidebarContext.Provider value={{ open }}>
                    <ul className="flex lg:flex-col sm:flex-row px-3 lg:w-auto w-screen lg:gap-0 gap-7">
                        {children}
                    </ul>
                </SidebarContext.Provider>
            </nav>
        </aside>
    )
}

export default Sidebar

export function SidebarItem({ icon, text, alert, active }) {
    const { open } = useContext(SidebarContext)
    return (
        <div>

            <li className={`relative flex items-center my-2 lg:my-0 py-2 px-2 font-medium rounded-md cursor-pointer ${active ? 'bg-base-200 text-primary' : 'bg-base-100 text-default'}
        transition-colors group hover:bg-base-200 text-default`}>
                <div className='mx-auto'>
                    {icon}
                </div>
                <span className={`overflow-hidden text-2xl transition-all ${open ? 'w-40 ml-3' : 'w-0'
                    }`}>{text}</span>
                {alert && (<div className={`absolute right-2 w-2 h-2 rounded bg-primary ${open ? "" : "top-1"}`} />)}
                {!open && <div className={
                    `absolute left-full rounded-md px-2 py-1 ml-6 bg-base-200 text-default invisible opacity-20
                -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`
                }>{text}</div>}

            </li>
            <div className='text-center lg:invisible'>{text}</div>
        </div>
    )
}