import React from 'react'
import Transitions from '../../../components/Transitions'

function CreateList() {
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  return (
    <Transitions pageVariants={pageVariants}>
      <div className="w-full rounded-lg p-4">
        <div className="container flex justify-center mx-auto my-0.5">
          <div className="card w-96 bg-base-100 shadow-sm border-2 border-base-300 mx-auto my-5 flex flex-col justify-center items-center gap-2 py-1">
            <h1 className='text-2xl font-bold'>Create List</h1>
            <div className="form-control flex gap-2 w-full max-w-xs">
              <label className='text-2xl'>Title:</label>
              <input type="text" placeholder="provide list title" className="input input-warning" name='emailId' />
            </div>
            <div className="form-control flex gap-2 w-full max-w-xs">
              <label className='text-2xl'>Items:</label>
              <input type="password" placeholder="type item and add to list" className="input input-warning" name='password' />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>

            </div>
            <div className='w-full max-w-xs'>
              <h3 className=''>Added Items</h3>
              <div>
                <ul className="list-disc list-inside">
                  <li>Item 1</li>
                  <li>Item 2</li>
                  <li>Item 3</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-center w-full mx-auto my-10 gap-5">
              <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300" onClick={(e) => handleSubmit(e)}>save</a>
              <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300">Reset</a>
            </div>
          </div>
        </div>
      </div>
    </Transitions>
  )
}

export default CreateList
