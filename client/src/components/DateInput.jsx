import React, { useState, useRef, useEffect } from 'react';
import DatePicker from './DatePicker';
import dayjs from 'dayjs';

function DateInput({ value, onChange, name, className, placeholder = "Select date" }) {
  const [showPicker, setShowPicker] = useState(false);
  const containerRef = useRef(null);

  const handleDateSelect = (date) => {
    if (onChange) {
      // Create a synthetic event object similar to regular input onChange
      const syntheticEvent = {
        target: {
          name: name,
          value: date
        }
      };
      onChange(syntheticEvent);
    }
    setShowPicker(false);
  };

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPicker]);

  const displayValue = value ? dayjs(value).format('DD MMM YYYY') : '';

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative w-full">
        <input
          type="text"
          name={name}
          value={displayValue}
          placeholder={placeholder}
          onClick={() => setShowPicker(!showPicker)}
          readOnly
          className={`w-full cursor-pointer pr-10 ${className || 'text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600'}`}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 dark:text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
      </div>

      {showPicker && (
        <DatePicker
          selectedDate={value}
          onDateSelect={handleDateSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

export default DateInput;
