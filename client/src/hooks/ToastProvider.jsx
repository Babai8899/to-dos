import React, { useState, useEffect } from 'react';
import ToastContext from './ToastContext';

const ToastProvider = ({ children }) => {

    const [toast, setToast] = useState(null);


    const showToast = (message, type, duration = 5000) => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, duration);
    };


    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div className="toast top-20 right-5">
                    <div className={`alert alert-${toast.type} alert-soft`}>
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};

export default ToastProvider;