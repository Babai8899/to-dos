import React, { useState } from 'react';

function TimePicker({ selectedTime, onTimeSelect, onClose }) {
  const [hours, setHours] = useState(selectedTime ? parseInt(selectedTime.split(':')[0]) : 12);
  const [minutes, setMinutes] = useState(selectedTime ? parseInt(selectedTime.split(':')[1]) : 0);
  const [period, setPeriod] = useState(selectedTime && parseInt(selectedTime.split(':')[0]) >= 12 ? 'PM' : 'AM');

  const handleHourClick = (hour) => {
    setHours(hour);
  };

  const handleMinuteClick = (minute) => {
    setMinutes(minute);
  };

  const handlePeriodToggle = () => {
    setPeriod(period === 'AM' ? 'PM' : 'AM');
  };

  const handleSetTime = () => {
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }
    const formattedTime = `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onTimeSelect(formattedTime);
    if (onClose) onClose();
  };

  const hourButtons = Array.from({ length: 12 }, (_, i) => i + 1);
  const minuteButtons = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-80 max-w-full rounded-xl shadow-2xl p-4 bg-yellow-50 dark:bg-cyan-900 border-2 border-yellow-300 dark:border-cyan-600 animate-slide-down">
        {/* Header */}
        <div className="text-center mb-3">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Select Time</h3>
        </div>

        {/* Time Display */}
        <div className="flex justify-center items-center gap-2 mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
          <span className="bg-yellow-100 dark:bg-cyan-800 px-3 py-1 rounded-lg min-w-[60px] text-center">
            {hours.toString().padStart(2, '0')}
          </span>
          <span className="text-xl">:</span>
          <span className="bg-yellow-100 dark:bg-cyan-800 px-3 py-1 rounded-lg min-w-[60px] text-center">
            {minutes.toString().padStart(2, '0')}
          </span>
          <button
            onClick={handlePeriodToggle}
            className="bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 px-3 py-1 rounded-lg text-lg font-bold transition-colors duration-300"
          >
            {period}
          </button>
        </div>

        {/* Hours Section */}
        <div className="mb-3">
          <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5 text-center">Hours</h4>
          <div className="grid grid-cols-6 gap-1.5">
            {hourButtons.map((hour) => (
              <button
                key={hour}
                onClick={() => handleHourClick(hour)}
                className={`p-1.5 text-sm text-center rounded-lg transition-colors duration-200 ${
                  hours === hour
                    ? 'bg-yellow-300 dark:bg-cyan-500 text-gray-800 dark:text-gray-200 font-bold'
                    : 'bg-yellow-50/50 dark:bg-cyan-900/10 text-gray-800 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-cyan-900'
                }`}
              >
                {hour}
              </button>
            ))}
          </div>
        </div>

        {/* Minutes Section */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1.5 text-center">Minutes</h4>
          <div className="grid grid-cols-6 gap-1.5">
            {minuteButtons.map((minute) => (
              <button
                key={minute}
                onClick={() => handleMinuteClick(minute)}
                className={`p-1.5 text-sm text-center rounded-lg transition-colors duration-200 ${
                  minutes === minute
                    ? 'bg-yellow-300 dark:bg-cyan-500 text-gray-800 dark:text-gray-200 font-bold'
                    : 'bg-yellow-50/50 dark:bg-cyan-900/10 text-gray-800 dark:text-gray-200 hover:bg-yellow-100 dark:hover:bg-cyan-900'
                }`}
              >
                {minute.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSetTime}
            className="flex-1 px-3 py-1.5 text-sm bg-yellow-300 dark:bg-cyan-500 hover:bg-yellow-400 dark:hover:bg-cyan-400 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300 font-medium"
          >
            Set Time
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 px-3 py-1.5 text-sm bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs transition-colors duration-300 font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimePicker;
