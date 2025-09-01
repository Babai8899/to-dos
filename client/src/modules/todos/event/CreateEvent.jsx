import React, { useContext, useState } from 'react'
import dayjs from 'dayjs';
import Transitions from '../../../components/Transitions'
import axiosInstance from "../../../api/axiosInstance.js";
import AuthContext from "../../../hooks/AuthContext.jsx";
import ToastContext from "../../../hooks/ToastContext.jsx";
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 20 }, (_, i) => dayjs().year() + i);

function CreateEvent() {

  const redLetterDays = {
    "01-26": "Republic Day",
    "08-15": "Independence Day",
    "10-02": "Gandhi Jayanti",
    "09-05": "Teacher’s Day",
    "11-14": "Children’s Day",
    "01-23": "Netaji Jayanti",
    "02-28": "National Science Day",
    "10-31": "National Unity Day",
    "12-07": "Armed Forces Flag Day"
  };

  const { user } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const today = dayjs().startOf('day');
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSelector, setShowSelector] = useState(false);

  const [createEventWindow, setCreateEventWindow] = useState(false);

  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startDate = startOfMonth.startOf('week');
  const endDate = endOfMonth.endOf('week');

  const handleMonthChange = (offset) => {
    const newDate = currentDate.add(offset, 'month');
    if (newDate.isBefore(today.startOf('month'))) return;
    setCurrentDate(newDate);
  };

  const handleSelectMonthYear = (month, year) => {
    const newDate = dayjs().year(year).month(month).startOf('month');
    if (newDate.isBefore(today.startOf('month'))) return;
    setCurrentDate(newDate);
    setShowSelector(false);
  };

  const weeks = [];
  let tempDate = startDate.clone();

  while (tempDate.isBefore(endDate)) {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const thisDay = tempDate.clone();
      const isCurrentMonth = thisDay.month() === currentDate.month();
      const isTodayOrFuture = !thisDay.isBefore(today, 'day');
      const isSelected = selectedDate && thisDay.isSame(selectedDate, 'day');

      if (!isCurrentMonth) {
        // Hide previous/next month days completely
        days.push(<div key={thisDay.format()}></div>);
      } else {
        // Determine color for Sunday, Saturday, and red letter days
        let dayColor = '';
        let tooltip = '';
        const mmdd = thisDay.format('MM-DD');
        if (redLetterDays[mmdd]) {
          dayColor = !isTodayOrFuture ? 'text-red-300' : 'text-red-500';
          tooltip = redLetterDays[mmdd];
        } else if (thisDay.day() === 0) {
          dayColor = !isTodayOrFuture ? 'text-red-300' : 'text-red-500'; // Sunday
        } else if (thisDay.day() === 6) {
          dayColor = !isTodayOrFuture ? 'text-blue-300' : 'text-blue-500'; // Saturday
        }
        days.push(
          <div
            key={thisDay.format('YYYY-MM-DD')}
            className={`relative group cursor-pointer p-2 text-center rounded-xl
              ${isSelected ? 'bg-yellow-100 dark:bg-cyan-900' : 'bg-base-100'}
              ${!isTodayOrFuture ? 'text-base-content/30 cursor-not-allowed' : 'hover:bg-yellow-100 dark:hover:bg-cyan-900'}
              ${dayColor}`}
            disabled={!isTodayOrFuture}
            onClick={() => { handleCreateEventWindow(thisDay); isTodayOrFuture && setSelectedDate(thisDay); }}
          >
            {thisDay.date()}
            {tooltip && (
              <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-10 hidden group-hover:block bg-yellow-300 text-gray-900 text-xs rounded-lg px-3 py-1 shadow-lg border border-yellow-400 whitespace-nowrap">
                {tooltip}
              </span>
            )}
          </div>
        );
      }
      tempDate = tempDate.add(1, 'day');
    }
    weeks.push(
      <div key={tempDate.format('YYYY-MM-DD')} className="grid grid-cols-7 gap-2">
        {days}
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  };

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: ""
  });

  const {
    title,
    description,
    location,
    date,
    time
  } = eventData;

  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    });
  };

  const onReset = () => {
    setEventData({
      title: "",
      description: "",
      location: "",
      date: "",
      time: ""
    });
  }

  const handleCreateEventWindow = (thisDay) => {
    setCreateEventWindow(!createEventWindow);
    setEventData({
      ...eventData,
      date: thisDay.format('YYYY-MM-DD')
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    //add user.email to eventData
    eventData.user = user.emailId;
    try {
      await axiosInstance.post('/events', eventData);
      showToast("Event created successfully", "success");
    } catch (error) {
      console.error("Registration failed:", error.response.data.message);
      showToast(error.response.data.message, "error");
      throw error;
    }
    // Reset form after submission
    setTimeout(() => {
      onReset();
      handleCreateEventWindow();
    }, 1000);

  }


  return (
    <Transitions pageVariants={pageVariants}>
      {!createEventWindow ?
        <div className="p-6 flex flex-col items-center justify-start">
          <div className="lg:w-1/2 w-96 max-w-5xl bg-base-100 rounded-xl shadow-xl p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <button className="btn btn-outline btn-sm" onClick={() => handleMonthChange(-1)}>❮ Prev</button>
              <div
                className="text-xl font-bold cursor-pointer hover:text-primary"
                onClick={() => setShowSelector(!showSelector)}
              >
                {currentDate.format('MMMM YYYY')}
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => handleMonthChange(1)}>Next ❯</button>
              {showSelector && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20 bg-base-100 border rounded-xl shadow-lg p-4 flex gap-4">
                  <select
                    className="select noscrollbar"
                    value={currentDate.month()}
                    onChange={(e) =>
                      handleSelectMonthYear(Number(e.target.value), currentDate.year())
                    }
                  >
                    {months.map((m, idx) => (
                      <option key={m} value={idx} disabled={dayjs().year() === currentDate.year() && idx < today.month()}>
                        {m}
                      </option>
                    ))}
                  </select>

                  <select
                    className="select noscrollbar"
                    value={currentDate.year()}
                    onChange={(e) =>
                      handleSelectMonthYear(currentDate.month(), Number(e.target.value))
                    }
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>

                </div>
              )}
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold text-base-content/60">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                <div
                  key={day}
                  className={
                    idx === 0
                      ? 'text-red-500 font-bold'
                      : idx === 6
                        ? 'text-blue-500 font-bold'
                        : ''
                  }
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="space-y-2">{weeks}</div>
          </div>
        </div> :
        <div className="container flex justify-center w-1/2 mx-auto my-0.5 h-max">
          <div className="card w-96 bg-base-100 shadow-sm border-2 border-base-300 mx-auto my-5 flex flex-col justify-center items-center gap-4 py-1 px-5">
            <h1 className='text-2xl'>Create Event</h1>
            <div className='grid grid-cols-1 gap-0.5'>
              <div className='w-full max-w-xs'>
                <label className='text-gray-900 dark:text-gray-200'>Title</label>
                <input type="text" placeholder="Event title" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" name='title' value={title} onChange={handleChange} />
              </div>
              <div className='w-full max-w-xs'>
                <label className='text-gray-900 dark:text-gray-200'>Description</label>
                <textarea className="text-gray-800 dark:text-gray-200 textarea border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" placeholder="Description" name='description' value={description} onChange={handleChange}></textarea>
              </div>
              <div className='w-full max-w-xs'>
                <label className='text-gray-900 dark:text-gray-200'>Location</label>
                <input type="text" placeholder="Event location" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" name='location' value={location} onChange={handleChange} />
              </div>
              <div className='w-full max-w-xs'>
                <label className='text-gray-900 dark:text-gray-200'>Date & Time</label>
                <div className='flex gap-2'>
                  <input type="date" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" name='date' value={date} onChange={handleChange} />
                  <input type="time" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" name='time' value={time} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="flex justify-center w-full mx-auto my-2 gap-5">
              <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300" onClick={(e) => handleSubmit(e)}>Create Event</a>
              <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300" onClick={() => { onReset; handleCreateEventWindow() }}>Cancel</a>
            </div>
          </div>
        </div>
      }
    </Transitions>
    // <FullCalendar/>
  )
}

export default CreateEvent
