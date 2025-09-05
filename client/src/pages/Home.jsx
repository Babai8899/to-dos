import React, { useEffect, useState, useContext } from 'react';
import PushContext from '../hooks/PushContext';
import AuthContext from '../hooks/AuthContext';
import axiosInstance from '../api/axiosInstance';


function Home() {
    const { subscribe } = useContext(PushContext);
    const { user } = useContext(AuthContext);
    const emailId = user.emailId;
    const [lists, setLists] = useState([]);
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [notes, setNotes] = useState([]);

    const loadLists = async () => {
        try {
            const response = await axiosInstance.get(`/lists/user/${emailId}`);
            console.log(response);
            setLists(response.data);
        } catch (error) {
            console.error("List loading failed:", error.response.data.message);
            throw error;
        }
    }

    const loadNotes = async () => {
        try {
            const response = await axiosInstance.get(`/notes/user/${emailId}`);
            console.log(response);
            setNotes(response.data);
        } catch (error) {
            console.error("Notes loading failed:", error.response.data.message);
            throw error;
        }
    }

    const loadEvents = async () => {
        try {
            const response = await axiosInstance.get(`/events/user/${emailId}`);
            console.log(response);
            setEvents(response.data);
        } catch (error) {
            console.error("Events loading failed:", error.response.data.message);
            throw error;
        }
    }

    const loadTasks = async () => {
        try {
            const response = await axiosInstance.get(`/tasks/user/${emailId}`);
            console.log(response);
            setTasks(response.data);
        }
        catch (error) {
            console.error("Tasks loading failed:", error.response.data.message);
            throw error;
        }
    }

    useEffect(() => {
        loadLists();
        loadNotes();
        loadEvents();
        loadTasks();
    }, []);

    useEffect(() => {
        const notificationConfirmed = localStorage.getItem('notificationConfirmed');
        if (!notificationConfirmed) {
            const result = window.confirm('Do you want to allow notifications?');
            if (result) {
                subscribe(user.emailId);
                localStorage.setItem('notificationConfirmed', 'true');
            } else {
                localStorage.setItem('notificationConfirmed', 'false');
            }
        }
    }, [subscribe]);

    return (
        <div className='fixed -right-0 top-16 lg:w-[calc(100vw-5rem)] w-screen md:h-[calc(100vh-8rem)] px-5 grid md:grid-cols-2 gap-y-4 gap-x-3 noscrollbar my-1 overflow-y-scroll h-[calc(100vh-15rem)] rounded-lg mx-auto'>


            {/* <div className="w-screen lg:w-[calc(100vw-5rem)] grid gap-y-4 fixed -right-0 h-[calc(100vh-4rem-4rem)] "> */}
            <div className="p-2 card rounded-box h-96 w-full mx-auto place-items-center border-2">
                <h2>Deadline knocking</h2>
            </div>
            <div className="p-2 card rounded-box h-96 w-full mx-auto place-items-center border-2">
                <h2>Over due Tasks</h2>
            </div>
            <div className="p-2 card rounded-box h-96 w-full mx-auto place-items-center border-2">
                <h2>Upcoming Events</h2>
            </div>
            <div className="p-2 card rounded-box h-96 w-full mx-auto place-items-center border-2">
                <h2>Recent Event</h2>
            </div>
            <div className="p-2 card rounded-box h-96 w-full mx-auto place-items-center border-2">
                <h2>Last created Note</h2>
            </div>
            <div className="p-2 card rounded-box h-96 w-full mx-auto place-items-center border-2">
                <h2>Last created List</h2>
            </div>

        </div>
    );
}

export default Home;
