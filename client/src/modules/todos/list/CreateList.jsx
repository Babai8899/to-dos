  import React, { useContext, useEffect, useState } from 'react'
import Transitions from '../../../components/Transitions'
import axiosInstance from '../../../api/axiosInstance';
import AuthContext from '../../../hooks/AuthContext';
import ToastContext from '../../../hooks/ToastContext';

function CreateList() {
  const {user} = useContext(AuthContext);
  const {showToast} = useContext(ToastContext);
  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };
  const [listData, setListData] = useState({
    title: "",
    items: [],
  });
  const [elementInput, setElementInput] = useState("");

  const {
    title,
    items,
  } = listData;

  const checklistRef = React.useRef(null);

  useEffect(() => {
    if (checklistRef.current) {
      checklistRef.current.scrollTop = checklistRef.current.scrollHeight;
    }
  }, [items.length]);

  const handleChange = (e) => {
    setListData({
      ...listData,
      [e.target.name]: e.target.value
    });
  };

  // Delete checklist item
  const handleDeleteItem = (idx) => {
    setListData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx),
    }));
  };

  // Handle input for checklist element
  const handleItemInputChange = (e) => {
    setElementInput(e.target.value);
  };

  // Add element to checklist on Enter
  const handleItemInputKeyDown = (e) => {
    if (e.key === "Enter" && elementInput.trim() !== "") {
      setListData((prev) => ({
        ...prev,
        items: [...prev.items, { itemName: elementInput, completed: false }],
      }));
      setElementInput("");
    }
  };

  // Toggle checklist item checked state
  const handleCheckToggle = (idx) => {
    setListData((prev) => ({
      ...prev,
      items: prev.items.map((el, i) =>
        i === idx ? { ...el, completed: !el.completed } : el
      ),
    }));
  };

  const onReset = () => {
    setListData({
      title: "",
      items: [],
    });
    setElementInput("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there's a pending input, add it to items before submit
    let newItems = [...items];
    if (elementInput.trim() !== "") {
      newItems.push({ itemName: elementInput.trim(), completed: false });
    }

    const payload = {
      ...listData,
      items: newItems,
      user: user.emailId,
    };
    try {
      await axiosInstance.post('/lists', payload);
      showToast("List created successfully", "success");
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      showToast(error.response?.data?.message || error.message, "error");
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
          <h1 className='text-3xl'>Create List</h1>
          <div className='grid grid-cols-1 gap-0.5 h-full w-full'>
            <div className='w-full'>
              <input type="text" placeholder="List title" className="placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:bg-transparent focus:outline-none input w-full input-ghost" name='title' value={title} onChange={handleChange} />
            </div>
            <div className='divider divider-warning dark:divider-neutral m-0 p-0 '></div>
            {/* Checklist items */}
            <div className='w-full px-2 md:max-h-44 md:h-44 h-96 max-h-96'>
              {items.length > 0 && (
                  <ul ref={checklistRef} className="md:h-36 h-80 overflow-y-auto noscrollbar">
                  {items.map((el, idx) => (
                    <li key={el.itemName + idx} className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        checked={el.completed}
                        onChange={() => handleCheckToggle(idx)}
                        className="checkbox"
                      />
                      <span className={el.completed ? "line-through" : ""}>{el.itemName}</span>
                      <button
                        type="button"
                        className="ml-2 text-red-500 hover:text-red-700 px-2 py-0.5 rounded"
                        onClick={() => handleDeleteItem(idx)}
                        aria-label="Delete item"
                      >
                        &#10005;
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {/* Input for adding checklist items */}
              <input
                className="placeholder:text-gray-800 dark:placeholder:text-gray-200 focus:bg-transparent focus:outline-none input input-ghost w-full"
                placeholder="Add item and press Enter"
                value={elementInput}
                onChange={handleItemInputChange}
                onKeyDown={handleItemInputKeyDown}
              />
            </div>
          </div>
          <div className="flex justify-center w-full mx-auto my-2 gap-5">
            <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300" onClick={(e) => handleSubmit(e)}>Create List</a>
            <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300" onClick={onReset}>Cancel</a>
          </div>
        </div>
      </div>
    </Transitions>
  )
}

export default CreateList
