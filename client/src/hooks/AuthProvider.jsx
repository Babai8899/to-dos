import React, { useState, useEffect } from 'react';
import AuthContext from './AuthContext';
import axiosInstance from '../api/axiosInstance';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        try {
            await axiosInstance.post('/auth', credentials); // cookie set via backend
            await fetchUser();
        }
        catch (error) {
            console.error("Login failed:", error);
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