import React, { createContext, useEffect, useState } from 'react';
import API from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            API.get('/profile', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setUser(res.data);
            }).catch(() => {
                localStorage.removeItem('token');
                setUser(null);
            });
        }
    }, []);

    const login = (token, userData = null) => {
        localStorage.setItem('token', token);

        if (userData) {
            setUser(userData); // use provided data
        } else {
            API.get('/profile', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setUser(res.data));
        }
    };

    const logout = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            await API.post('/auth/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            }).catch(() => {});
        }
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
