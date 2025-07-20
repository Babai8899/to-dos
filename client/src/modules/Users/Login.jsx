import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import Transitions from '../../components/Transitions';


function Login() {

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
            await login(userData);
            navigate('/home'); // Redirect to home or another page after successful login
        } catch (error) {
            console.error("Login failed:", error);
        }

        console.log("Login data submitted:", userData);
        // Reset form after submission
        onReset();
    }

    return (
        <Transitions>
            <div className="container flex justify-center w-1/2 mx-auto my-0.5">
                <div className="card w-96 bg-base-100 shadow-sm border-2 border-base-300 mx-auto my-10 h-96 flex flex-col justify-center items-center gap-4 py-1">
                    <h1 className='text-2xl font-bold'>Login Page</h1>
                    <label>Email ID</label>
                    <input type="text" placeholder="Email ID" className="input input-warning" name='emailId' value={emailId} onChange={handleChange} />
                    <label>Password</label>
                    <input type="password" placeholder="Password" className="input input-warning" name='password' value={password} onChange={handleChange} />
                    <div className="flex justify-center w-full mx-auto my-10 gap-5">
                        <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300" onClick={(e) => handleSubmit(e)}>Login</a>
                        <a className="bg-base-300 rounded-box grid h-10 w-32 place-items-center cursor-pointer hover:bg-amber-100 ease-in-out transition-colors duration-300">Reset</a>
                    </div>
                </div>
            </div>
        </Transitions>
    )
}

export default Login
