import React, { useState, useRef, useEffect } from 'react';
import TimePicker from './TimePicker';

function TimeInput({ value, onChange, name, className, placeholder = "Select time" }) {
  const [showPicker, setShowPicker] = useState(false);
  const containerRef = useRef(null);

  const handleTimeSelect = (time) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          name: name,
          value: time
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

  const displayValue = value || '';

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
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {showPicker && (
        <TimePicker
          selectedTime={value}
          onTimeSelect={handleTimeSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

export default TimeInput;
