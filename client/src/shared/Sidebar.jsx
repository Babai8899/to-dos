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
        <aside className='h-screen w-auto fixed'>
            <nav className="h-full flex flex-col bg-base-100 border-r-2 border-r-base-200 shadow-xl">
                <div className="p-4 pb-2 flex justify-between items-center mt-4" >
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
                    <ul className="flex-1 px-3">
                        {children}
                    </ul>
                </SidebarContext.Provider>
            </nav>
        </aside>
    )
}

// function Sidebar({ children }) {
//     const [open, setOpen] = useState(false);

//     const handleSidebar = () => {
//         setOpen(!open);
//     }

//     return (
//         <aside
//             className={`
//                 fixed
//                 bottom-0 left-0 w-full z-50
//                 bg-base-100 border-t-2 border-t-base-200 shadow-xl
//                 flex md:top-0 md:left-0 md:w-auto md:h-screen md:flex-col md:border-t-0 md:border-r-2 md:border-r-base-200
//             `}
//         >
//             <nav className="w-full flex flex-row md:flex-col h-auto md:h-full">
//                 {/* Hide CreateMenu and toggle button on mobile */}
//                 <div className="hidden md:flex p-4 pb-2 justify-between items-center mt-4">
//                     <div className={`text-2xl overflow-hidden transition-all ${open ? 'w-40' : 'w-0'}`}>
//                         CreateMenu
//                     </div>
//                     <button className="p-1 rounded-lg bg-base-200 hover:bg-base-300" onClick={handleSidebar}>
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-9">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
//                         </svg>
//                     </button>
//                 </div>
//                 <SidebarContext.Provider value={{ open }}>
//                     <ul className="flex flex-row w-full md:flex-col md:w-auto flex-1 px-3">
//                         {children}
//                     </ul>
//                 </SidebarContext.Provider>
//             </nav>
//         </aside>
//     )
// }

export default Sidebar

export function SidebarItem({ icon, text, alert, active }) {
    const { open } = useContext(SidebarContext)
    return (
        <li className={`relative flex items-center my-16 lg:my-5 py-2 px-2 font-medium rounded-md cursor-pointer ${active ? 'bg-base-200 text-primary' : 'bg-base-100 text-default'}
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
    )
}