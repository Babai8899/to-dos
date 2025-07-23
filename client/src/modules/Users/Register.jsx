import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../hooks/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Transitions from '../../components/Transitions';
import ToastContext from '../../hooks/ToastContext';
import axiosInstance from '../../api/axiosInstance'

function Register() {

    const { showToast } = useContext(ToastContext);
    const pageVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

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
            firstName: "",
            lastName: "",
            dob: "",
            phone: "",
            password: "",
            confirmPassword: "",
            anniversary: ""
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showToast("Password and Confirm Password are not same", "warning");
            return;
        }
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
        <div>
            <Transitions pageVariants={pageVariants}>
                <div className="container flex justify-center w-1/2 mx-auto my-0.5 h-max">
                    <div className="card lg:w-full w-96 bg-base-100 shadow-sm border-2 border-base-300 lg:h-full  mx-auto my-5 flex flex-col justify-center items-center gap-4 py-1 px-5">
                        <h1 className='text-2xl'>Register</h1>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
                            <div className='w-full max-w-xs'>
                                <label >Email ID</label>
                                <input type="text" placeholder="Enter your email id" className="input input-warning" name='emailId' value={emailId} onChange={handleChange} />
                            </div>
                            <div className='w-full max-w-xs'>
                                <label>First Name</label>
                                <input type="text" placeholder="Enter your first name" className="input input-warning" name='firstName' value={firstName} onChange={handleChange} />
                            </div>
                            <div className='w-full max-w-xs'>
                                <label >Last Name</label>
                                <input type="text" placeholder="Enter your last name" className="input input-warning" name='lastName' value={lastName} onChange={handleChange} />
                            </div>
                            <div className='w-full max-w-xs'>
                                <label>Date of Birth</label>
                                <input type="date" className="input input-warning" name='dob' value={dob} onChange={handleChange} />
                            </div>
                            <div className='w-full max-w-xs'>
                                <label>Phone</label>
                                <input type="text" placeholder="Enter your phone" className="input input-warning" name='phone' value={phone} onChange={handleChange} />
                            </div>
                            <div className='w-full max-w-xs'>
                                <label>Password</label>
                                <input type="password" placeholder="Password" className="input input-warning" name='password' value={password} onChange={handleChange} />
                            </div>

                            <div className='w-full max-w-xs'>
                                <label>Confirm Password</label>
                                <input type="password" placeholder="Confirm Password" className="input input-warning" name='confirmPassword' value={confirmPassword} onChange={handleChange} />
                            </div>

                            <div className='w-full max-w-xs'>
                                <label>Anniversory (Optional)</label>
                                <input type="date" className="input input-warning" name='anniversary' value={anniversary} onChange={handleChange} />
                            </div>

                        </div>
                        <div className="flex justify-center w-full mx-auto my-2 gap-5">
                            <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300" onClick={(e) => handleSubmit(e)}>Register</a>
                            <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300" onClick={(e) => onReset(e)}>Reset</a>
                        </div>
                    </div>
                </div>
            </Transitions>
        </div>
    )
}

export default Register
