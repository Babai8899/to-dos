import React, { useState } from 'react';
import dayjs from 'dayjs';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 20 }, (_, i) => dayjs().year() + i);

const FullCalendar = () => {
  const today = dayjs().startOf('day');
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showSelector, setShowSelector] = useState(false);

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
          <button
            key={thisDay.format('YYYY-MM-DD')}
            onClick={() => isTodayOrFuture && setSelectedDate(thisDay)}
            disabled={!isTodayOrFuture}
            className={`p-2 w-full aspect-square rounded-xl text-center transition duration-200
              ${isSelected ? 'bg-primary text-primary-content font-bold' : 'bg-base-100'}
              ${!isTodayOrFuture ? 'text-base-content/30 cursor-not-allowed' : 'hover:bg-primary hover:text-primary-content'}`}
          >
            {thisDay.date()}
          </button>
        );
      }

      tempDate = tempDate.add(1, 'day');
    }

    weeks.push(
      <div key={tempDate.format()} className="grid grid-cols-7 gap-2">
        {days}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300 p-6 flex flex-col items-center justify-start">
      <div className="w-full max-w-5xl bg-base-100 rounded-xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 relative">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => handleMonthChange(-1)}
            disabled={currentDate.subtract(1, 'month').isBefore(today.startOf('month'))}
          >
            ❮ Prev
          </button>

          <div
            className="text-xl font-bold cursor-pointer hover:text-primary"
            onClick={() => setShowSelector(!showSelector)}
          >
            {currentDate.format('MMMM YYYY')}
          </div>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => handleMonthChange(1)}
          >
            Next ❯
          </button>

          {/* Month-Year Selector Dropdown */}
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

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold text-base-content/60">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">{weeks}</div>

        {/* Selected Date Output */}
        {selectedDate && (
          <div className="mt-6 text-center text-lg font-semibold">
            Selected Date: <span className="text-primary">{selectedDate.format('DD MMMM YYYY')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullCalendar;
