import React, { useState } from 'react'
import dayjs from 'dayjs';
import Transitions from '../../../components/Transitions'
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 20 }, (_, i) => dayjs().year() + i);

function CreateEvent() {
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
        days.push(
          <div
            key={thisDay.format('YYYY-MM-DD')}
            className={`p-2 text-center rounded-xl
              ${isSelected ? 'bg-primary text-primary-content font-bold' : 'bg-base-100'}
              ${!isTodayOrFuture ? 'text-base-content/30 cursor-not-allowed' : 'hover:bg-primary hover:text-primary-content'}`}
            disabled={!isTodayOrFuture}
            onClick={() => { handleCreateEventWindow(thisDay); isTodayOrFuture && setSelectedDate(thisDay); }}
          >
            {thisDay.date()}
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
    eventTitle: "",
    description: "",
    deadline: ""
  });

  const {
    eventTitle,
    description,
    deadline
  } = eventData;

  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    });
  };

  const onReset = () => {
    setEventData({
      eventTitle: "",
      description: "",
      deadline: ""
    });
  }

  const handleCreateEventWindow = (thisDay) => {
    setCreateEventWindow(!createEventWindow);
    setEventData({
      ...eventData,
      deadline: thisDay.format('YYYY-MM-DD')
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/event', eventData);
    } catch (error) {
      console.error("Registration failed:", error.response.data.message);
      showToast(error.response.data.message, "error");
      throw error;
    }
    // Reset form after submission
    onReset();
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
                    className="select select-bordered"
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
                    className="select select-bordered"
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
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day}>{day}</div>
              ))}
            </div>

            {/* Days */}
            <div className="space-y-2">{weeks}</div>
          </div>
        </div> :
        <div className="container flex justify-center w-1/2 mx-auto my-0.5 h-max">
          <div className="card w-96 bg-base-100 shadow-sm border-2 border-base-300 h-96 mx-auto my-5 flex flex-col justify-center items-center gap-4 py-1 px-5">
            <h1 className='text-2xl'>Create Event</h1>
            <div className='grid grid-cols-1 gap-1'>
              <div className='w-full max-w-xs'>
                <label>Ttle</label>
                <input type="text" placeholder="Enter your first name" className="input input-warning" name='eventTitle' value={eventTitle} onChange={handleChange} />
              </div>
              <div className='w-full max-w-xs'>
                <label >Description</label>
                <textarea className="textarea textarea-warning" placeholder="Description" name='description' value={description} onChange={handleChange}></textarea>
                {/* <input type="text" placeholder="Enter your last name" className="input input-warning" name='lastName' value={lastName}  /> */}
              </div>
              <div className='w-full max-w-xs'>
                <label>Deadline</label>
                <input type="date" className="input input-warning" name='deadline' value={deadline} onChange={handleChange} />
              </div>
            </div>
            <div className="flex justify-center w-full mx-auto my-2 gap-5">
              <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300" onClick={(e) => handleSubmit(e)}>Create Event</a>
              <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300" onClick={() => {onReset; handleCreateEventWindow()}}>Cancel</a>
            </div>
          </div>
        </div>
      }
    </Transitions>
    // <FullCalendar/>
  )
}

export default CreateEvent
