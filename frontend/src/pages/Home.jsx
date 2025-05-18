import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedLogo from '../components/AnimatedLogo';
import bg from '../assets/music-bg.jpg';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // ✅ Move this here

    return (
        <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
            <img src={bg} alt="music background" className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className="relative z-10 flex flex-col items-center justify-center h-[70vh] text-center px-4">
                <AnimatedLogo />
                <p className="mt-4 text-lg max-w-xl">
                    Welcome to <strong>Reverb</strong> — your collaborative music creation platform.<br />
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

            {/* Instruments Section */}
            <section className="relative z-10 mt-12 text-center px-6">
                <h2 className="text-3xl font-bold">Explore Musical Instruments</h2>
                <p className="mt-4">Dive into a variety of instruments including guitars, pianos, drums, and more. Each instrument offers unique sounds to enrich your music.</p>
                <div className="mt-6 flex justify-center space-x-6 flex-wrap">
                    <img src={require('../assets/guitar.jpg')} alt="Guitar" className="w-32 h-32 object-cover rounded-lg" />
                    <img src={require('../assets/piano.jpg')} alt="Piano" className="w-32 h-32 object-cover rounded-lg" />
                    <img src={require('../assets/drums.jpg')} alt="Drums" className="w-32 h-32 object-cover rounded-lg" />
                </div>
            </section>

            {/* Plugin Section */}
            <section className="relative z-10 mt-12 text-center px-6 pb-16">
                <h2 className="text-3xl font-bold">Plugin Features</h2>
                <p className="mt-4">Utilize plugins like Reverb, Chorus, and Equalizer to enhance and shape your sound — just like in FL Studio.</p>
                <div className="mt-6 flex justify-center space-x-6 flex-wrap">
                    <img src={require('../assets/reverb-plugin.jpg')} alt="Reverb Plugin" className="w-32 h-32 object-cover rounded-lg" />
                    <img src={require('../assets/chorus-plugin.jpg')} alt="Chorus Plugin" className="w-32 h-32 object-cover rounded-lg" />
                    <img src={require('../assets/equalizer-plugin.jpg')} alt="Equalizer Plugin" className="w-32 h-32 object-cover rounded-lg" />
                </div>
            </section>
        </div>
    );
};

export default Home;
