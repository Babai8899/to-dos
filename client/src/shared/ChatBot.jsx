import React, { useState } from 'react'
import Transitions from '../components/Transitions';

function ChatBot() {
    const [visible, setVisible] = useState(false);

    const toggleChat = () => {
        setVisible(!visible);
    }

    const pageVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },

    };

    return (
        <div>
            <div className="container flex">
                <div className="w-1/4 fixed top-20 right-5 px-2 ">
                    {visible &&
                    <Transitions pageVariants={pageVariants}>
                        <div className='card gap-2 grid bg-blue-50 shadow-2xl p-2'>
                            <div className="card bg-amber-50 h-80 shadow-lg p-2 text-sm">
                                <div className="chat chat-start">
                                    <div className="chat-image avatar">
                                        <div className="w-10 rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="chat-bubble">
                                        I have the high ground.
                                    </div>
                                </div>
                                <div className="chat chat-end">
                                    <div className="chat-image avatar">
                                        <div className="w-10 rounded-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            </svg>

                                        </div>
                                    </div>
                                    <div className="chat-bubble">You underestimate my power!</div>
                                </div>
                            </div>
                            <div className='flex justify-between items-center gap-1'>
                                <input type="text" placeholder="Type here" className="input w-5/6" />
                                <button className="btn w-1/6 rounded"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>
                                </button>
                            </div>
                        </div>
                        </Transitions>}
                    <div onClick={toggleChat} className="fixed bottom-5 right-5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 fixed bottom-16 right-5 cursor-pointer rounded-full p-2 bg-amber-200">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatBot
