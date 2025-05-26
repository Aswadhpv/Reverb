import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedLogo from '../components/AnimatedLogo';
import bg from '../assets/music-bg.jpg';
import { AuthContext } from '../context/AuthContext';
import API from '../api/auth';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [features, setFeatures] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            API.get('/home/features', {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => {
                setFeatures(res.data.features || []);
            }).catch(console.error);
        }
    }, []);

    return (
        <div className="relative min-h-screen w-full bg-black text-white overflow-x-hidden overflow-y-auto">
            {/* Background */}
            <img src={bg} alt="music background" className="absolute inset-0 w-full h-full object-cover opacity-20" />

            {/* Hero section */}
            <div className="relative z-10 flex flex-col items-center justify-center h-[70vh] text-center px-4">
                <AnimatedLogo />
                <p className="mt-4 text-lg max-w-xl">
                    Welcome to <strong>Reverb</strong> — your collaborative music creation platform.
                    <br />
                    Connect, edit, jam, and produce music with friends in real-time.
                </p>
                <div className="mt-8 space-x-4">
                    {!user && (
                        <button
                            onClick={() => navigate('/register')}
                            className="px-6 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            Get Started
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/about')}
                        className="px-6 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                        Learn More
                    </button>
                </div>
            </div>

            {/* Feature cards from backend */}
            {features.length > 0 && (
                <section className="relative z-10 mt-16 px-6 text-center">
                    <h2 className="text-3xl font-bold mb-8">🎛 Platform Features</h2>
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((f, idx) => (
                            <div key={idx} className="bg-gray-800 bg-opacity-60 rounded-lg p-6 shadow hover:shadow-lg transition">
                                <img src={f.image} alt={f.title} className="w-16 h-16 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                                <p className="text-sm text-gray-300">{f.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Instruments carousel */}
            <section className="relative z-10 mt-20 px-6 text-center">
                <h2 className="text-3xl font-bold mb-6">🎸 Instruments We Love</h2>
                <div className="flex justify-center gap-4 overflow-x-auto pb-4">
                    {['guitar', 'piano', 'drums'].map(name => (
                        <img
                            key={name}
                            src={require(`../assets/${name}.jpg`)}
                            alt={name}
                            className="w-48 h-48 object-cover rounded-lg shadow-lg transition-transform hover:scale-105"
                        />
                    ))}
                </div>
            </section>

            {/* Plugins carousel */}
            <section className="relative z-10 mt-20 px-6 text-center">
                <h2 className="text-3xl font-bold mb-6">🎚 Plugin Tools</h2>
                <div className="flex justify-center gap-4 overflow-x-auto pb-4">
                    {['reverb-plugin', 'chorus-plugin', 'equalizer-plugin'].map(name => (
                        <img
                            key={name}
                            src={require(`../assets/${name}.jpg`)}
                            alt={name}
                            className="w-48 h-48 object-cover rounded-lg shadow-lg transition-transform hover:scale-105"
                        />
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="relative z-10 mt-24 px-6 text-center">
                <h2 className="text-3xl font-bold mb-6">🌟 What Our Users Say</h2>
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            quote: "Reverb changed how our band collaborates remotely. It’s like a virtual studio!",
                            author: "🎤 Ava Rose"
                        },
                        {
                            quote: "The real-time plugin tools feel like FL Studio, but multiplayer!",
                            author: "🎧 DJ Mixtron"
                        },
                        {
                            quote: "As a solo artist, I love the library and audio processing features.",
                            author: "🎸 Leo Harmon"
                        }
                    ].map((t, idx) => (
                        <div key={idx} className="bg-gray-800 p-6 rounded-lg shadow-md">
                            <p className="italic text-gray-300 mb-4">"{t.quote}"</p>
                            <p className="text-right text-sm font-semibold text-purple-400">{t.author}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team section */}
            <section className="relative z-10 mt-24 px-6 text-center pb-24">
                <h2 className="text-3xl font-bold mb-6">👥 Meet The Team</h2>
                <div className="flex justify-center flex-wrap gap-8">
                    {[
                        { name: "Aswadh Puthen Veede", role: "Founder & Developer" }
                    ].map((member, i) => (
                        <div key={i} className="bg-gray-900 p-6 rounded-lg w-64 shadow">
                            <div className="w-20 h-20 rounded-full mx-auto bg-purple-600 mb-4"></div>
                            <h4 className="text-lg font-bold">{member.name}</h4>
                            <p className="text-sm text-gray-400">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
