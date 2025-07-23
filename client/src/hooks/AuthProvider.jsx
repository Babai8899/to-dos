import React, { useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';
import axiosInstance from '../api/axiosInstance';
import ToastContext from './ToastContext';

const AuthProvider = ({ children }) => {
    const { showToast } = useContext(ToastContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        try {
            const data = await axiosInstance.post('/auth', credentials); // cookie set via backend
            if (data.status === 200) {
                showToast("Login successful", "success");
            }
            await fetchUser();
        }
        catch (error) {
            console.error("Login failed:", error.response.data.message);
            showToast(error.response.data.message, "error");
            throw error; // propagate error to the component
        }
    };

    const logout = async () => {
        await axiosInstance.post('/auth/logout');
        setUser(null);
    };

    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get('/auth');
            setUser(res.data);
        } catch (error) {
            setUser(null);
            console.error("Failed to fetch user data" + error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    console.log("AuthProvider user:", user);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;