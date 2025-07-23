import React, { useState } from 'react';
import dayjs from 'dayjs';

const FullCalendar = () => {
    const [currentDate, setCurrentDate] = useState(dayjs());

    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');

    const weeks = [];
    let date = startDate;

    while (date.isBefore(endDate)) {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const isCurrentMonth = date.month() === currentDate.month();
            days.push(
                <div
                    key={date.format('YYYY-MM-DD')}
                    className={`p-2 text-center rounded-xl ${isCurrentMonth ? 'bg-base-100' : 'bg-base-200 text-base-content/40'
                        } hover:bg-primary hover:text-primary-content transition duration-200`}
                >
                    {date.date()}
                </div>
            );
            date = date.add(1, 'day');
        }
        weeks.push(<div key={date} className="grid grid-cols-7 gap-2">{days}</div>);
    }

    const handleMonthChange = (offset) => {
        setCurrentDate(currentDate.add(offset, 'month'));
    };

    return (
        <div className="p-6 flex flex-col items-center justify-start">
            <div className="lg:w-1/2 w-96 max-w-5xl bg-base-100 rounded-xl shadow-xl p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <button className="btn btn-outline btn-sm" onClick={() => handleMonthChange(-1)}>❮ Prev</button>
                    <h2 className="text-xl font-bold">
                        {currentDate.format('MMMM YYYY')}
                    </h2>
                    <button className="btn btn-outline btn-sm" onClick={() => handleMonthChange(1)}>Next ❯</button>
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
        </div>
    );
};

export default FullCalendar;
