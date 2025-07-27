import React, { useState, useEffect } from 'react';
import ToastContext from './ToastContext';
import Transitions from '../components/Transitions';

const ToastProvider = ({ children }) => {

    const pageVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const [toast, setToast] = useState(null);


    const showToast = (message, type, duration = 3000) => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, duration);
    };


    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <Transitions pageVariants={pageVariants}>
                    <div className="toast top-20 right-5">
                        <div className={`alert ${toast.type === 'success' ? 'bg-green-200 text-green-600' : toast.type === 'error' ? 'bg-red-200 text-red-600' : 'bg-yellow-200 text-yellow-600' }`} >
                            <span>{toast.message}</span>
                        </div>
                    </div>
                </Transitions>
            )}
        </ToastContext.Provider>
    );
};

export default ToastProvider;