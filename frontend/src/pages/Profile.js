import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const [user, setUser] = useState({ username: '', email: '' });
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        API.get('/profile')
            .then(res => setUser(res.data))
            .catch(() => navigate('/login'));
    }, [navigate]);

    const handleSave = async () => {
        try {
            await API.put('/profile', { username: user.username, password });
            alert('Profile updated');
        } catch (err) {
            alert(err.response?.data?.msg || 'Update failed');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div>
            <h2>Your Profile</h2>
            <div>
                <label>Username</label><br/>
                <input
                    type="text"
                    value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value })}
                />
            </div>
            <div>
                <label>New Password</label><br/>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    minLength={6}
                />
            </div>
            <button onClick={handleSave}>Save Changes</button>
            <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>
                Logout
            </button>
        </div>
    );
}
