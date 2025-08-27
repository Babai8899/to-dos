import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../hooks/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Transitions from '../../components/Transitions';
import ToastContext from '../../hooks/ToastContext';


function Login() {

    const { showToast } = useContext(ToastContext);

    const pageVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [userData, setUserData] = useState({
        emailId: "",
        password: ""
    });

    const {
        emailId,
        password
    } = userData;

    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
        console.log("User data changed:", userData);
    };

    const onReset = () => {
        setUserData({
            emailId: "",
            password: ""
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here
        try {
            if (!emailId || !password) {
                showToast("Please fill in all fields", "warning");
                return;
            }
            await login(userData);
            navigate('/home'); // Redirect to home or another page after successful login
        } catch (error) {
            console.error("Login failed:", error.response.data.message);
        }

        console.log("Login data submitted:", userData);
        // Reset form after submission
        onReset();
    }

    return (
        <Transitions pageVariants={pageVariants}>
            <div className="container flex justify-center md:w-1/2 w-screen mx-auto my-0.5">
                <div className="card md:w-96 w-full md:bg-yellow-50 md:dark:bg-cyan-800 md:shadow-sm md:border-2 md:border-yellow-300 md:dark:border-cyan-500 mx-auto md:my-10 h-[calc(100vh-10rem-10rem)] md:h-96 flex flex-col justify-center items-center gap-4 md:py-1 px-5">
                    <h1 className='text-4xl text-yellow-600 dark:text-cyan-500 font-bold'>Login</h1>
                    <div className='gap-2 w-full max-w-xs'>
                        <label className='text-gray-900 dark:text-gray-200'>Email ID</label>
                        <input type="text" placeholder="Email ID" className="input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" name='emailId' value={emailId} onChange={handleChange} />
                    </div>
                    <div className='gap-2 w-full max-w-xs'>
                        <label className='text-gray-900 dark:text-gray-200'>Password</label>
                        <input type="password" placeholder="Password" className="input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" name='password' value={password} onChange={handleChange} />
                    </div>
                    <div className='text-sm flex flex-row gap-12'>
                        <span>
                            <Link to={'/register'} className='text-cyan-600 dark:text-yellow-400 dark:hover:text-yellow-600 cursor-pointer hover:text-cyan-400 ease-in-out transition-colors duration-300'>Forgot Password?</Link>
                        </span>
                        <span>
                            New user? <Link to={'/register'} className='text-cyan-600 dark:text-yellow-400 dark:hover:text-yellow-600 cursor-pointer hover:text-cyan-400 ease-in-out transition-colors duration-300'>Register now</Link>
                        </span>
                    </div>
                    <div className='flex gap-2 w-full max-w-xs'>
                        <input type="checkbox" defaultChecked className="checkbox border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500" />
                        <label className='text-gray-800 dark:text-gray-200'>Remember me</label>
                    </div>
                    <div className="flex justify-center w-full mx-auto my-2 gap-5">
                        <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300" onClick={(e) => handleSubmit(e)}>Login</a>
                        <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300">Reset</a>
                    </div>
                    
                </div>
            </div>
        </Transitions>
    )
}

export default Login