import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/auth';
import bg from '../assets/auth-bg-blurred.jpg';

const Register = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/register', form);
            login(data.token);
            navigate('/');
        } catch {
            alert('Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center"
             style={{
                 backgroundImage: `url(${bg})`,
                 backgroundColor: '#00000088',
                 backgroundBlendMode: 'overlay'
             }}>
            <form
                onSubmit={handleSubmit}
                className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg max-w-sm w-full text-white text-center"
            >
                <h2 className="text-2xl font-bold mb-2">Join Reverb 🎶</h2>
                <p className="mb-6 text-sm text-purple-200">Create your account and collaborate musically!</p>
                <input
                    className="block w-full p-2 mb-4 rounded bg-gray-800 text-white"
                    placeholder="Username"
                    value={form.username}
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    required
                />
                <input
                    className="block w-full p-2 mb-4 rounded bg-gray-800 text-white"
                    placeholder="Email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                />
                <input
                    className="block w-full p-2 mb-4 rounded bg-gray-800 text-white"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                />
                <button
                    type="button"
                    className="text-sm text-cyan-300 mb-4"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? 'Hide' : 'Show'} Password
                </button>

                <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded w-full font-semibold">Register</button>
                <p className="mt-4 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-purple-400 hover:underline">Login here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
