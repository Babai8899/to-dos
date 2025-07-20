import React from 'react'
import Transitions from '../../../components/Transitions'

function CreateNote() {
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  return (
    <Transitions pageVariants={pageVariants}>
      <div className="w-full rounded-lg p-4">
        <div className="container flex justify-center mx-auto my-0.5">
          <div className="card w-96 bg-base-100 shadow-sm border-2 border-base-300 mx-auto my-5 h-96 flex flex-col justify-center items-center gap-4 py-1">
            <h1 className='text-2xl font-bold'>Login Page</h1>
            <label>Email ID</label>
            <input type="text" placeholder="Email ID" className="input input-warning" name='emailId' />
            <label>Password</label>
            <input type="password" placeholder="Password" className="input input-warning" name='password' />
            <div className="flex justify-center w-full mx-auto my-10 gap-5">
              <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300" onClick={(e) => handleSubmit(e)}>Login</a>
              <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300">Reset</a>
            </div>
          </div>
        </div>
      </div>
    </Transitions>
  )
}

export default CreateNote
