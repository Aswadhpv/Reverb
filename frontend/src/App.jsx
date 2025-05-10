import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import AnimatedLogo from './components/AnimatedLogo';

const App = () => (
    <Router>
        <nav className="p-4 bg-black text-white flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
                <AnimatedLogo />
            </Link>
            <div className="flex space-x-4 text-lg font-medium">
                <Link to="/" className="hover:text-purple-400">Home</Link>
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
