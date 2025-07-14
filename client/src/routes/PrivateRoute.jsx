import React, { useContext } from 'react'
import AuthContext from '../hooks/AuthContext';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const { user } = useContext(AuthContext);
    console.log("PrivateRoute user:", user);
    return user ? children : <Navigate to="/unauthorized" replace/>
}

export default PrivateRoute