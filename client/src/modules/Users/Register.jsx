import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Transitions from '../../components/Transitions';
import ToastContext from '../../hooks/ToastContext';
import axiosInstance from '../../api/axiosInstance'

function Register() {

    const { showToast } = useContext(ToastContext);
    const pageVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const [strength, setStrength] = useState({});
    const [matching, setMatching] = useState({});
    // const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        emailId: "",
        firstName: "",
        lastName: "",
        dob: "",
        phone: "",
        password: "",
        confirmPassword: "",
        anniversary: ""
    });

    const {
        emailId,
        firstName,
        lastName,
        dob,
        phone,
        password,
        confirmPassword,
        anniversary
    } = userData;

    const getPasswordStrength = (password) => {
        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 1) return { label: 'Weak', color: 'red', width: '33%' };
        if (score === 2 || score === 3) return { label: 'Medium', color: 'orange', width: '66%' };
        return { label: 'Strong', color: 'green', width: '100%' };
    };

    const confirmPasswordChecking = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return { label: 'Not matching', color: 'red', width: '33%' };
        }
        return { label: 'Matching', color: 'green', width: '100%' };
    }


    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
        setStrength(getPasswordStrength(e.target.value));
        setMatching(confirmPasswordChecking(password, e.target.value));
    };

    const onReset = () => {
        setUserData({
            emailId: "",
            firstName: "",
            lastName: "",
            dob: "",
            phone: "",
            password: "",
            confirmPassword: "",
            anniversary: ""
        });
        setStrength({});
        setMatching({});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/auth/register', userData);
            navigate('/login');
        } catch (error) {
            console.error("Registration failed:", error.response.data.message);
            showToast(error.response.data.message, "error");
            throw error;
        }
        // Reset form after submission
        onReset();
    }
    return (
        <Transitions pageVariants={pageVariants}>
            <div className="container flex justify-center md:w-1/2 w-screen mx-auto my-0.5">
                <div
                    className="card w-full md:bg-yellow-50 md:dark:bg-cyan-800 md:shadow-sm md:border-2 md:h-auto h-[calc(100vh-10rem-10rem)] md:border-yellow-300 md:dark:border-cyan-500 mx-auto my-5 flex flex-col justify-center items-center gap-4 md:py-1 px-5">
                    <h1 className='text-4xl text-yellow-600 dark:text-cyan-500 font-bold'>Register</h1>
                    <div className='grid w-full grid-cols-1 lg:grid-cols-2 gap-3 h-[calc(100vh-9rem-9rem)] overflow-y-auto noscrollbar px-1'>
                        <div className='w-full max-w-xs mx-auto'>
                            <label className='text-gray-900 dark:text-gray-200'>Email ID</label>
                            <input type="text" placeholder="Enter your email id" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600"
                                name='emailId' value={emailId} onChange={handleChange} />
                        </div>
                        <div className='w-full max-w-xs mx-auto'>
                            <label className='text-gray-900 dark:text-gray-200'>First Name</label>
                            <input type="text" placeholder="Enter your first name" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600"
                                name='firstName' value={firstName} onChange={handleChange} />
                        </div>
                        <div className='w-full max-w-xs mx-auto'>
                            <label className='text-gray-900 dark:text-gray-200'>Last Name</label>
                            <input type="text" placeholder="Enter your last name" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600"
                                name='lastName' value={lastName} onChange={handleChange} />
                        </div>
                        <div className='w-full max-w-xs mx-auto'>
                            <label className='text-gray-900 dark:text-gray-200'>Date of Birth</label>
                            <input type="date" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" name='dob' value={dob}
                                onChange={handleChange} />
                        </div>
                        <div className='w-full max-w-xs mx-auto'>
                            <label className='text-gray-900 dark:text-gray-200'>Phone</label>
                            <input type="text" placeholder="Enter your phone" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600"
                                name='phone' value={phone} onChange={handleChange} />
                        </div>
                        <div className='w-full max-w-xs mx-auto'>
                            <div className='flex justify-between'>
                                <label className='text-gray-900 dark:text-gray-200'>Password</label> <span className="text-sm font-medium"
                                    style={{ color: strength.color }}>{strength.label}</span>
                            </div>
                            <input type="password" placeholder="Password" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" name='password'
                                value={password} onChange={handleChange} />
                        </div>
                        <div className='w-full max-w-xs mx-auto'>
                            <div className='flex justify-between'>
                                <label className='text-gray-900 dark:text-gray-200'>Confirm Password</label> <span className="text-sm font-medium"
                                    style={{ color: matching.color }}>{matching.label}</span>
                            </div>
                            <input type="password" placeholder="Confirm Password" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600"
                                value={confirmPassword} onChange={handleChange} name='confirmPassword' />
                        </div>
                        <div className='w-full max-w-xs mx-auto'>
                            <label className='text-gray-900 dark:text-gray-200'>Anniversary (Optional)</label>
                            <input type="date" className="text-gray-800 dark:text-gray-200 input border-yellow-300 dark:border-cyan-500 focus:outline-yellow-300 dark:focus:outline-cyan-500 bg-gray-50 dark:bg-gray-500 dark:placeholder:text-gray-200 placeholder:text-gray-600" name='anniversary' value={anniversary}
                                onChange={handleChange} />
                        </div>
                    </div>
                    <div className="flex justify-center w-full mx-auto my-2 gap-5">
                        <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300"
                            onClick={(e) => handleSubmit(e)}>Register</a>
                        <a className="bg-yellow-300 dark:bg-cyan-500 dark:text-gray-200 text-gray-800 rounded-tl-xl rounded-br-xl rounded-tr-xs rounded-bl-xs grid h-10 w-32 place-items-center cursor-pointer dark:hover:bg-cyan-400 hover:bg-yellow-400 ease-in-out transition-colors duration-300"
                            onClick={(e) => onReset(e)}>Reset</a>
                    </div>
                </div>
            </div>
        </Transitions>
    )
}

export default Register
