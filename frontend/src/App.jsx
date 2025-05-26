import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Friends  from './pages/Friends';
import Library from './pages/Library';
import Collab from './pages/Collab';
import CollabSession from './pages/CollabSession';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

const App = () => (
    <AuthProvider>
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/library" element={<Library />} />
                <Route path="/collab" element={<Collab />} />
                <Route path="/collab/:id" element={<CollabSession />} />
            </Routes>
        </Router>
    </AuthProvider>
);

export default App;
