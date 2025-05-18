import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/auth';
import bg from '../assets/auth-bg-blurred.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/auth/login', { email, password });
            login(data.token);
            navigate('/');
        } catch {
            alert('Login failed');
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
                    <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back <span role="img" aria-label="headphone">🎧</span></h2>
                    <p className="text-sm text-center mb-6 text-purple-300">
                        Let’s collaborate and create something amazing together!
                    </p>
                    <input
                        className="block w-full p-3 mb-4 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="block w-full p-3 mb-6 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="text-sm text-cyan-300 mb-4"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? 'Hide' : 'Show'} Password
                    </button>

                    <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded text-white">Login</button>

                    <p className="mt-4 text-sm text-center">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-purple-400 hover:underline">
                            Register here
                        </Link>
                    </p>
                </form>
        </div>
    );
};

export default Login;

