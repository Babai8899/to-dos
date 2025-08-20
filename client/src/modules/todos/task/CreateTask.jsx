import React, { useContext, useState } from 'react'
import Transitions from '../../../components/Transitions'
import axiosInstance from '../../../api/axiosInstance';
import AuthContext from '../../../hooks/AuthContext';
import ToastContext from '../../../hooks/ToastContext';

function CreateTask() {
  const {user} = useContext(AuthContext);
  const {showToast} = useContext(ToastContext);
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
      <div className="container flex justify-center w-1/2 mx-auto my-0.5 h-max">
        <div className="card w-96 bg-base-100 shadow-sm border-2 border-base-300 mx-auto my-5 flex flex-col justify-center items-center gap-4 py-1 px-5">
          <h1 className='text-2xl'>Create Task</h1>
          <div className='grid grid-cols-1 gap-0.5'>
            <div className='w-full max-w-xs'>
              <label>Title</label>
              <input type="text" placeholder="Task title" className="input input-accent" name='title' value={title} onChange={handleChange} />
            </div>
            <div className='w-full max-w-xs'>
              <label >Description</label>
              <textarea className="textarea textarea-accent" placeholder="Description" name='description' value={description} onChange={handleChange}></textarea>
            </div>
            <div className='w-full max-w-xs'>
              <label>Deadline</label>
              <div className='flex gap-2'>
                <input type="date" className="input input-accent w-1/2" name='date' value={date} onChange={handleChange} />
                <input type="time" className="input input-accent w-1/2" name='time' value={time} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full mx-auto my-2 gap-5">
            <a className="bg-accent text-base-200 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-accent/50 hover:text-accent ease-in-out transition-colors duration-300" onClick={(e) => handleSubmit(e)}>Create Task</a>
            <a className="bg-accent text-base-200 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-accent/50 hover:text-accent ease-in-out transition-colors duration-300" onClick={() => onReset}>Cancel</a>
          </div>
        </div>
      </div>
    </Transitions>
  )
}

export default CreateTask
