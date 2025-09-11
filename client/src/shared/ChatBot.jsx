import React, { useContext, useEffect, useRef, useState } from 'react'
import Transitions from '../components/Transitions';
import AuthContext from '../hooks/AuthContext';
import axiosInstance from '../api/axiosInstance';

function ChatBot() {

    const [visible, setVisible] = useState(false);
    const { user } = useContext(AuthContext);
    const [questionVisible, setQuestionVisible] = useState(false);
    const [answerVisible, setAnswerVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleChat = () => {
        setVisible(!visible);
    }

    const pageVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },

    };

    const [chatReq, setChatReq] = useState({
        question: "",
        emailId: user?.emailId
    });

    const [answer, setAnser] = useState("");
    const [prompt, setPrompt] = useState("");

    const [chatHistory, setChatHistory] = useState([]);

    const loadHistory = async () => {
        try {
            const response = await axiosInstance.get(`/chat/history/${user?.emailId}`);
            // Remove the last item from the response
            setChatHistory(response.data);
            console.log(response.data);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (visible && user) {
            loadHistory();
        }
    }, [visible, user]);

    const {
        question,
    } = chatReq;

    const handleChange = (e) => {
        setChatReq({
            ...chatReq,
            [e.target.name]: e.target.value
        });
        console.log(chatReq);
    }

    const handleSubmit = async () => {
        try {
            setPrompt(question);
            setQuestionVisible(true);
            setLoading(true);
            console.log(chatReq)
            const response = await axiosInstance.post('/chat', chatReq);
            setAnser(response.data.answer);
            setLoading(false);
            setAnswerVisible(true);
            console.log(response.data.answer);
            setChatReq({
                question: "",
                emailId: user?.emailId
            });
            loadHistory();
        } catch (error) {
            console.log(error);
        }

    }

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (visible && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [visible, chatHistory]);

    return (
        <div>
            <div className="container flex">
                <div className="md:w-2/7 w-full fixed md:top-20 md:right-1 md:px-2 z-2">
                    {visible ?
                        <Transitions pageVariants={pageVariants}>
                            <div className='card gap-2 grid md:border md:w-auto w-screen md:border-gray-300 dark:border-gray-600 p-1 rounded-lg md:shadow-lg'>
                                <div className="card bg-yellow-50 dark:bg-cyan-700 md:h-96 h-[calc(100vh-7rem-7rem)] rounded-md shadow-lg text-sm">
                                    <div className='bg-yellow-500 dark:bg-cyan-900 p-2 rounded-t-sm justify-between flex items-center  text-gray-800 dark:text-gray-200'>
                                        <span className='text-2xl'>Chromomate</span>
                                        <button className="text-gray-800 cursor-pointer dark:text-gray-200 text-2xl bg-white/20 ease-in-out transition-colors duration-300 hover:bg-white/50 dark:bg-black/20 dark:hover:bg-black/50 rounded-full font-bold p-1" onClick={toggleChat}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    {user === null ?
                                        <div className='px-3 text-gray-800 dark:text-gray-200 grid items-center h-full'>
                                            <div className='space-y-6'>
                                                <p className='w-full text-center text-xl'>
                                                    Hello I'm Chronomate. Kindly Login to access the chat feature.
                                                </p>
                                                <button className='mx-auto bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-box grid h-10 w-28 place-items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ease-in-out transition-colors duration-300'><a href="/login" className='text-2xl'>Login</a></button>
                                            </div>
                                        </div> :
                                        <div className='px-1 h-full noscrollbar overflow-y-auto' ref={chatContainerRef}>
                                            <div className='flex flex-col'>
                                                {chatHistory.map((chat, index) => (
                                                    <div key={index}>
                                                        <div className="chat chat-end">
                                                            <div className="chat-image avatar">
                                                                <div className="w-10 rounded-full">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 fill-gray-300 dark:fill-gray-600 stroke-gray-800 dark:stroke-gray-200">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="chat-bubble bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                                                                {chat.question}
                                                            </div>
                                                        </div>
                                                        <div className="chat chat-start">
                                                            <div className="chat-image avatar">
                                                                <div className="w-10 rounded-full">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 fill-yellow-500 dark:fill-cyan-600 stroke-yellow-800 dark:stroke-cyan-200">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="chat-bubble bg-yellow-500 dark:bg-cyan-900 text-gray-800 dark:text-gray-200">
                                                                {chat.response}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {questionVisible ?
                                                <div className="chat chat-end">
                                                    <div className="chat-image avatar">
                                                        <div className="w-10 rounded-full">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 fill-gray-300 dark:fill-gray-600 stroke-gray-800 dark:stroke-gray-200">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="chat-bubble bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                                                        {prompt}
                                                    </div>
                                                </div> :
                                                null}
                                            {answerVisible ?
                                                <div className="chat chat-start">
                                                    <div className="chat-image avatar">
                                                        <div className="w-10 rounded-full">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 fill-yellow-500 dark:fill-cyan-600 stroke-yellow-800 dark:stroke-cyan-200">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="chat-bubble bg-yellow-500 dark:bg-cyan-900 text-gray-800 dark:text-gray-200">
                                                        {answer}
                                                    </div>
                                                </div>
                                                : null}
                                        </div>}
                                </div>
                                <div className='flex justify-between items-center gap-1'>
                                    <input type="text" placeholder="Type here" className="focus:outline-yellow-500 dark:focus:outline-cyan-800 input w-5/6 dark:border-cyan-800 border-yellow-500 bg-yellow-50 dark:bg-gray-800 placeholder:text-gray-800 dark:placeholder:text-gray-200" name='question' value={question} onChange={handleChange} />
                                    <button className="ease-in-out transition-colors duration-300 p-1 cursor-pointer bg-yellow-500 hover:bg-yellow-400 dark:bg-cyan-800 dark:hover:bg-cyan-600 w-1/6 rounded"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 mx-auto stroke-gray-800 dark:stroke-gray-200" onClick={handleSubmit}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                    </svg>
                                    </button>
                                </div>
                            </div>
                        </Transitions> :
                        <div onClick={toggleChat}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="stroke-gray-800 dark:stroke-gray-200 size-12 fixed md:bottom-16 bottom-28 right-5 cursor-pointer rounded-full p-2 bg-amber-200 dark:bg-cyan-600 hover:bg-amber-300 dark:hover:bg-cyan-700 ease-in-out transition-colors duration-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                            </svg>
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default ChatBot
