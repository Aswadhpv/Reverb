import React from 'react';
import AnimatedLogo from '../components/AnimatedLogo';
import bg from '../assets/music-bg.jpg'; // Add a nice image inside /src/assets

const Home = () => (
    <div className="relative h-screen w-full bg-black text-white overflow-hidden">
        <img src={bg} alt="music background" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <AnimatedLogo />
            <p className="mt-4 text-lg max-w-xl">
                Welcome to <strong>Reverb</strong> — your collaborative music creation platform.<br />
                Connect, edit, jam, and produce music with friends in real-time.
            </p>
            <div className="mt-8 space-x-4">
                <button className="px-6 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white">Get Started</button>
                <button className="px-6 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white">Learn More</button>
            </div>
        </div>
    </div>
);

export default Home;
