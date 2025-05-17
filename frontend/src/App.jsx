import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import LogoR from './components/LogoR';

const App = () => (
    <Router>
        <nav className="p-4 bg-black text-white flex items-center space-x-6">
            <Link to="/" className="flex items-center">
                <LogoR /> {/* 👈 use stylish R instead of full Reverb */}
            </Link>
            <div className="flex space-x-4 text-lg font-medium ml-4">
                <Link to="/about" className="hover:text-purple-400">About</Link>
            </div>
        </nav>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
        </Routes>
    </Router>
);

export default App;
