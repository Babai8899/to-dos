import React, { useContext, useState } from 'react'
import Transitions from '../../../components/Transitions'
import axiosInstance from '../../../api/axiosInstance';
import AuthContext from '../../../hooks/AuthContext';
import ToastContext from '../../../hooks/ToastContext';

function CreateNote() {
  const {user} = useContext(AuthContext);
  const {showToast} = useContext(ToastContext);
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  const [noteData, setNoteData] = useState({
    title: "",
    description: "",
  });

  const {
    title,
    description,
  } = noteData;

  const handleChange = (e) => {
    setNoteData({
      ...noteData,
      [e.target.name]: e.target.value
    });
  };

  const onReset = () => {
    setNoteData({
      title: "",
      description: "",
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    //add user.email to noteData
    noteData.user = user.emailId;
    try {
      await axiosInstance.post('/notes', noteData);
      showToast("Note created successfully", "success");
    } catch (error) {
      console.error("Registration failed:", error.response.data.message);
      showToast(error.response.data.message, "error");
      throw error;
    }
    // Reset form after submission
    setTimeout(() => {
      onReset();
    }, 1000);

  }
  return (
    <Transitions pageVariants={pageVariants}>
      <div className="container flex justify-center md:w-1/2 w-screen mx-auto my-0.5 h-max">
        <div className="card md:w-96 w-full md:h-96 md:bg-yellow-50 md:dark:bg-cyan-800 md:shadow-sm md:border-2 md:border-yellow-300 md:dark:border-cyan-500 mx-auto md:my-10 h-[calc(100vh-10rem-10rem)] flex flex-col justify-center items-center gap-4 md:py-1 px-5">
          <h1 className='text-3xl'>Create Note</h1>
          <div className='grid grid-cols-1 gap-0.5 w-full'>
            <div className='w-full'>
              <input type="text" placeholder="Note title" className="placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:bg-transparent focus:outline-none input w-full input-ghost" name='title' value={title} onChange={handleChange} />
            </div>
            <div className='divider divider-warning dark:divider-neutral m-0 p-0 '></div>
            <div className='w-full'>
              <textarea className="placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:bg-transparent focus:outline-none textarea textarea-ghost md:h-44 h-48 w-full" placeholder="Description" name='description' value={description} onChange={handleChange}></textarea>
            </div>
          </div>
          <div className="flex justify-center w-full mx-auto my-2 gap-5">
            <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300" onClick={(e) => handleSubmit(e)}>Create Note</a>
            <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300" onClick={() => onReset}>Cancel</a>
          </div>
        </div>
      </div>
    </Transitions>
  )
}

export default CreateNote
