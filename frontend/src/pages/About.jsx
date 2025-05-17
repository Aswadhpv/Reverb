import React from 'react';
import AnimatedLogo from '../components/AnimatedLogo';
import bg from '../assets/about-bg.jpg';

const About = () => (
    <div className="relative min-h-screen text-white">
        {/* Background image + dark overlay */}
        <img src={bg} alt="About Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>

        <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
            <AnimatedLogo />
            <div className="max-w-2xl mt-6">
                <p className="text-lg">
                    <strong>Reverb</strong> empowers musicians and producers to collaborate online in real-time.
                </p>
                <p className="mt-4">
                    Built for seamless music editing, plugin application, and interactive audio sessions.
                    Whether you’re a solo artist or part of a virtual band, Reverb brings your sound to life.
                </p>
            </div>
        </div>

        {/* Feature section */}
        <section className="relative z-10 mt-16 px-6">
            <h2 className="text-3xl font-bold text-center">🎵 Website Features</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-white/10 rounded-lg backdrop-blur-md shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-300">Live Collaboration</h3>
                    <p className="mt-2 text-sm">Real-time sessions with friends, chat, and shared audio editing.</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg backdrop-blur-md shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-300">Plugin Integration</h3>
                    <p className="mt-2 text-sm">Apply effects like Reverb and Chorus just like FL Studio.</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg backdrop-blur-md shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-300">Audio Sharing</h3>
                    <p className="mt-2 text-sm">Upload and edit your music files across sessions.</p>
                </div>
            </div>
        </section>

        {/* Tech Stack */}
        <section className="relative z-10 mt-16 text-center px-6">
            <h2 className="text-3xl font-bold mb-6">🧪 Technologies Used</h2>
            <div className="flex justify-center flex-wrap gap-6">
                <img src={require('../assets/react-logo.png')} alt="React" className="w-16 h-16" />
                <img src={require('../assets/nodejs-logo.png')} alt="Node.js" className="w-16 h-16" />
                <img src={require('../assets/mongodb-logo.png')} alt="MongoDB" className="w-16 h-16" />
                <img src={require('../assets/socketio-logo.png')} alt="Socket.io" className="w-16 h-16" />
                <img src={require('../assets/tailwind-logo.png')} alt="Tailwind CSS" className="w-16 h-16" />
            </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 mt-16 text-center pb-8">
            <p className="text-lg">Created by <strong>Aswadh Puthen Veede</strong></p>
        </footer>
    </div>
);

export default About;
