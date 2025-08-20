import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom';
import Transitions from '../../components/Transitions';
import ToastContext from '../../hooks/ToastContext';
import axiosInstance from '../../api/axiosInstance'

function Register() {

    const {showToast} = useContext(ToastContext);
    const pageVariants = {
        initial: {opacity: 0},
        animate: {opacity: 1},
        exit: {opacity: 0}
    };

    const [strength, setStrength] = useState({});
    const [matching, setMatching] = useState({});
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        emailId: "",
        firstName: "",
        lastName: "",
        dob: "",
        phone: "",
        password: "",
        anniversary: ""
    });

    const {
        emailId,
        firstName,
        lastName,
        dob,
        phone,
        password,
        anniversary
    } = userData;

    const getPasswordStrength = (password) => {
        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 1) return {label: 'Weak', color: 'red', width: '33%'};
        if (score === 2 || score === 3) return {label: 'Medium', color: 'orange', width: '66%'};
        return {label: 'Strong', color: 'green', width: '100%'};
    };

    const confirmPasswordChecking = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return {label: 'Not matching', color: 'red', width: '33%'};
        }
        return {label: 'Matching', color: 'green', width: '100%'};
    }


    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
        setStrength(getPasswordStrength(e.target.value));
        // setMatching(confirmPasswordChecking(password, e.target.value));
    };

    const onReset = () => {
        setUserData({
            emailId: "",
            firstName: "",
            lastName: "",
            dob: "",
            phone: "",
            password: "",
            // confirmPassword: "",
            anniversary: ""
        });
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
            <div className="container flex justify-center w-1/2 mx-auto my-0.5 h-max">
                <div
                    className="card lg:w-full w-96 bg-base-200 shadow-sm border-2 border-base-300 lg:h-full  mx-auto my-5 flex flex-col justify-center items-center gap-4 py-1 px-5">
                    <h1 className='text-2xl text-accent font-bold'>Register</h1>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-3'>
                        <div className='w-full max-w-xs'>
                            <label>Email ID</label>
                            <input type="text" placeholder="Enter your email id" className="input input-accent"
                                   name='emailId' value={emailId} onChange={handleChange}/>
                        </div>
                        <div className='w-full max-w-xs'>
                            <label>First Name</label>
                            <input type="text" placeholder="Enter your first name" className="input input-accent"
                                   name='firstName' value={firstName} onChange={handleChange}/>
                        </div>
                        <div className='w-full max-w-xs'>
                            <label>Last Name</label>
                            <input type="text" placeholder="Enter your last name" className="input input-accent"
                                   name='lastName' value={lastName} onChange={handleChange}/>
                        </div>
                        <div className='w-full max-w-xs'>
                            <label>Date of Birth</label>
                            <input type="date" className="input input-accent" name='dob' value={dob}
                                   onChange={handleChange}/>
                        </div>
                        <div className='w-full max-w-xs'>
                            <label>Phone</label>
                            <input type="text" placeholder="Enter your phone" className="input input-accent"
                                   name='phone' value={phone} onChange={handleChange}/>
                        </div>
                        <div className='w-full max-w-xs'>
                            <div className='flex justify-between'>
                                <label>Password</label> <span className="text-sm font-medium"
                                                              style={{color: strength.color}}>{strength.label}</span>
                            </div>
                            <input type="password" placeholder="Password" className="input input-accent" name='password'
                                   value={password} onChange={handleChange}/>
                        </div>

                        <div className='w-full max-w-xs'>
                            <div className='flex justify-between'>
                                <label>Confirm Password</label> <span className="text-sm font-medium"
                                                                      style={{color: matching.color}}>{matching.label}</span>
                            </div>
                            <input type="password" placeholder="Confirm Password" className="input input-accent"
                                   onChange={(e) => {
                                       setConfirmPassword(e.target.value);
                                       setMatching(confirmPasswordChecking(password, confirmPassword));
                                   }}/>
                        </div>

                        <div className='w-full max-w-xs'>
                            <label>Anniversary (Optional)</label>
                            <input type="date" className="input input-accent" name='anniversary' value={anniversary}
                                   onChange={handleChange}/>
                        </div>

                    </div>
                    <div className="flex justify-center w-full mx-auto my-2 gap-5">
                        <a className="bg-accent text-base-200 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-accent/50 hover:text-accent ease-in-out transition-colors duration-300"
                           onClick={(e) => handleSubmit(e)}>Register</a>
                        <a className="bg-accent text-base-200 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-accent/50 hover:text-accent ease-in-out transition-colors duration-300"
                           onClick={(e) => onReset(e)}>Reset</a>
                    </div>
                </div>
            </div>
        </Transitions>
    )
}

export default Register
