import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/auth';
import bg from '../assets/profile-bg.jpg';

const Profile = () => {
    const { user, login } = useContext(AuthContext);
    const [form, setForm] = useState({ username: user?.username || '', password: '' });
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState('');
    const fileInput = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('username', form.username);
        formData.append('password', form.password);
        if (fileInput.current.files[0]) {
            formData.append('profilePic', fileInput.current.files[0]);
        }

        try {
            await API.put('/profile', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            const { data } = await API.get('/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            login(token, data);
            setMessage('✅ Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile');
        }
    };

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            <img src={bg} alt="auth" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
                <form
                    onSubmit={updateProfile}
                    className="bg-black bg-opacity-70 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-lg"
                    encType="multipart/form-data"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center">🎤 Your Profile</h2>

                    <div className="flex flex-col items-center mb-6">
                        <img
                            src={
                                preview ||
                                (user?.profilePic ? `http://localhost:5000${user.profilePic}` : 'https://via.placeholder.com/120')
                            }
                            alt="Profile"
                            className="w-28 h-28 rounded-full object-cover border-2 border-purple-500"
                        />
                        <label className="mt-2 text-sm text-purple-300 cursor-pointer hover:underline">
                            Change Photo
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInput}
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    <label className="block mb-2">Username</label>
                    <input
                        className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                    />

                    <label className="block mb-2">New Password</label>
                    <input
                        className="w-full p-2 mb-6 bg-gray-800 text-white rounded"
                        type="password"
                        placeholder="Optional"
                        onChange={e => setForm({ ...form, password: e.target.value })}
                    />

                    <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded">
                        Save Changes
                    </button>

                    {message && (
                        <p className="mt-4 text-green-400 text-sm text-center">
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;
