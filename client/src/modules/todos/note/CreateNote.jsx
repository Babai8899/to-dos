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
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
  });

  const {
    title,
    description,
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
      <div className="container flex justify-center md:w-2/5 w-4/5 mx-auto my-0.5 h-max">
        <div className="card w-full bg-base-100 shadow-sm border-2 border-base-300 mx-auto my-5 flex flex-col justify-center items-center gap-4 py-1 px-2">
          <h1 className='text-2xl'>Create Task</h1>
          <div className='grid grid-cols-1 gap-0.5'>
            <div className='w-96 md:max-w-xs'>
              <input type="text" placeholder="Task title" className="md:max-w-xs input input-ghost w-96" name='title' value={title} onChange={handleChange} />
            </div>
            <div className='divider m-0 p-0'></div>
            <div className='w-96 md:max-w-xs'>
              <textarea className="w-96 md:max-w-xs textarea textarea-ghost h-96 md:h-44" placeholder="Description" name='description' value={description} onChange={handleChange}></textarea>
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

export default CreateNote
