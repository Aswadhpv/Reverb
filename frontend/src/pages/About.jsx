import React from 'react';
import AnimatedLogo from '../components/AnimatedLogo';

const About = () => (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <AnimatedLogo />
        <div className="max-w-2xl text-center mt-6">
            <p className="text-lg">
                <strong>Reverb</strong> empowers musicians and producers to collaborate online in real-time.
            </p>
            <p className="mt-4">
                Built for seamless music editing, plugin application, and interactive audio sessions.
                Whether you’re a solo artist or part of a virtual band, Reverb brings your sound to life.
            </p>
        </div>
    </div>
);

export default About;
