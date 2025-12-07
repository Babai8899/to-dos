import React, { useState } from 'react';
import dayjs from 'dayjs';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const years = Array.from({ length: 20 }, (_, i) => dayjs().year() + i);

const redLetterDays = {
  "01-26": "Republic Day",
  "08-15": "Independence Day",
  "10-02": "Gandhi Jayanti",
  "09-05": "Teacher's Day",
  "11-14": "Children's Day",
  "01-23": "Netaji Jayanti",
  "02-28": "National Science Day",
  "10-31": "National Unity Day",
  "12-07": "Armed Forces Flag Day"
};

function DatePicker({ selectedDate, onDateSelect, onClose }) {
  const today = dayjs().startOf('day');
  const [currentDate, setCurrentDate] = useState(selectedDate ? dayjs(selectedDate) : dayjs());
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

  const handleDateClick = (date) => {
    onDateSelect(date.format('YYYY-MM-DD'));
    if (onClose) onClose();
  };

  const weeks = [];
  let tempDate = startDate.clone();

  while (tempDate.isBefore(endDate)) {
    const days = [];

    for (let i = 0; i < 7; i++) {
      const thisDay = tempDate.clone();
      const isCurrentMonth = thisDay.month() === currentDate.month();
      const isTodayOrFuture = !thisDay.isBefore(today, 'day');
      const isSelected = selectedDate && thisDay.isSame(dayjs(selectedDate), 'day');

      if (!isCurrentMonth) {
        days.push(<div key={thisDay.format()}></div>);
      } else {
        let dayColor = '';
        let tooltip = '';
        const mmdd = thisDay.format('MM-DD');
        if (redLetterDays[mmdd]) {
          dayColor = !isTodayOrFuture ? 'text-red-300' : 'text-red-500';
          tooltip = redLetterDays[mmdd];
        } else if (thisDay.day() === 0) {
          dayColor = !isTodayOrFuture ? 'text-red-300' : 'text-red-500';
        } else if (thisDay.day() === 6) {
          dayColor = !isTodayOrFuture ? 'text-blue-300' : 'text-blue-500';
        } else {
          dayColor = !isTodayOrFuture ? 'text-gray-800/30 dark:text-gray-200/30' : 'text-gray-800 dark:text-gray-200';
        }
        
        days.push(
          <div
            key={thisDay.format('YYYY-MM-DD')}
            className={`relative group cursor-pointer p-2 text-center rounded-xl
              ${isSelected ? 'bg-yellow-100 dark:bg-cyan-900' : 'bg-yellow-50/50 dark:bg-cyan-900/10'}
              ${!isTodayOrFuture ? 'text-base-content/30 cursor-not-allowed' : 'hover:bg-yellow-100 dark:hover:bg-cyan-900'}
              ${dayColor}`}
            onClick={() => isTodayOrFuture && handleDateClick(thisDay)}
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

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-96 max-w-full rounded-xl shadow-2xl p-6 bg-yellow-50 dark:bg-cyan-900 border-2 border-yellow-300 dark:border-cyan-600 animate-slide-down">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 relative">
          <button className="btn btn-outline btn-sm text-gray-800 dark:text-gray-200" onClick={() => handleMonthChange(-1)}>❮ Prev</button>
          <div
            className="text-xl font-bold cursor-pointer text-gray-800 dark:text-gray-200 hover:text-primary"
            onClick={() => setShowSelector(!showSelector)}
          >
            {currentDate.format('MMMM YYYY')}
          </div>
          <button className="btn btn-outline btn-sm text-gray-800 dark:text-gray-200" onClick={() => handleMonthChange(1)}>Next ❯</button>
          
          {showSelector && (
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20 bg-yellow-50 dark:bg-cyan-900 border-2 border-yellow-300 dark:border-cyan-600 rounded-xl shadow-lg p-4 flex gap-4">
              <select
                className="select select-sm noscrollbar bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                value={currentDate.month()}
                onChange={(e) => handleSelectMonthYear(Number(e.target.value), currentDate.year())}
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx} disabled={dayjs().year() === currentDate.year() && idx < today.month()}>
                    {m}
                  </option>
                ))}
              </select>

              <select
                className="select select-sm noscrollbar bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                value={currentDate.year()}
                onChange={(e) => handleSelectMonthYear(currentDate.month(), Number(e.target.value))}
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
        <div className="grid grid-cols-7 gap-2 mb-2 text-center font-bold text-gray-800 dark:text-gray-200 text-sm">
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
        
        {/* Close button */}
        {onClose && (
          <div className="flex justify-center mt-4">
            <button 
              onClick={onClose}
              className="w-full px-4 py-2 bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300 font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DatePicker;
