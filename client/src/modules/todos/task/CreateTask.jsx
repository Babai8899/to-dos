import React, { useContext, useState } from 'react'
import Transitions from '../../../components/Transitions'
import axiosInstance from '../../../api/axiosInstance';
import AuthContext from '../../../hooks/AuthContext';
import ToastContext from '../../../hooks/ToastContext';
import PushContext from '../../../hooks/PushContext';

function CreateTask() {
  const { sendNotification } = useContext(PushContext);
  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    date: "",
    time: ""
  });

  const {
    title,
    description,
    date,
    time
  } = taskData;

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value
    });
  };

  const onReset = () => {
    setTaskData({
      title: "",
      description: "",
      date: "",
      time: ""
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    //add user.email to taskData
    taskData.user = user.emailId;
    try {
      await axiosInstance.post('/tasks', taskData);
      showToast("Task created successfully", "success");
      sendNotification({
        title: 'Task Created',
        body: `Task "${title}" has been created successfully!`
      });
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
      <div className='my-1.5 md:w-1/3 w-screen md:h-[calc(100vh-8rem)] h-[calc(100vh-15rem)] rounded-lg flex flex-col gap-4 justify-center items-center mx-auto md:border-2 md:bg-yellow-50/50 md:dark:bg-cyan-900/50 md:shadow-sm md:border-yellow-300 md:dark:border-cyan-500'>
        <h1 className='text-3xl'>Create Task</h1>
        <div className='w-full max-w-xs'>
          <label className='text-gray-900 dark:text-gray-200'>Title</label>
          <input type="text" placeholder="Task title" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" name='title' value={title} onChange={handleChange} />
        </div>
        <div className='w-full max-w-xs'>
          <label className='text-gray-900 dark:text-gray-200'>Description</label>
          <textarea className="text-gray-800 dark:text-gray-200 textarea border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" placeholder="Description" name='description' value={description} onChange={handleChange}></textarea>
        </div>
        <div className='w-full max-w-xs'>
          <label className='text-gray-900 dark:text-gray-200'>Deadline</label>
          <div className='flex gap-2'>
            <input type="date" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600 w-1/2" name='date' value={date} onChange={handleChange} />
            <input type="time" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600 w-1/2" name='time' value={time} onChange={handleChange} />
          </div>
        </div>

        <div className="flex justify-center w-full mx-auto my-2 gap-5">
          <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300" onClick={(e) => handleSubmit(e)}>Create Task</a>
          <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300" onClick={() => onReset}>Cancel</a>
        </div>
      </div>

    </Transitions>
  )
}

export default CreateTask
