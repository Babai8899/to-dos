import React, { useEffect } from 'react'
import axiosInstance from '../api/axiosInstance';
import PushContext from './PushContext';

const PUBLIC_VAPID_KEY = "BIGMDHupR8z8IgOdtcbYsUoAznXT6N3tGUxA0jg0lbwbTZ67hw0LG_svNCCiNnkSyrn_gjQXTN4LYDXroH9HpqY"; // replace later

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

function PushProvider({children}) {

    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js");
        }
    }, []);

    const subscribe = async () => {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            alert("Please allow notifications!");
            return;
        }
        const reg = await navigator.serviceWorker.ready;
        const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
        });
        await axiosInstance.post("/subscribe", subscription);
        alert("Subscribed to push!");
    };

    const sendNotification = async (payload) => {
        await axiosInstance.post("/send", payload);
    };

  return (
    <PushContext.Provider value={{subscribe, sendNotification}}>
        {children}
    </PushContext.Provider>
  )
}

export default PushProvider
