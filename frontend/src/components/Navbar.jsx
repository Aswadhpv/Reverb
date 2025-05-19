import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoR          from './LogoR';
import NotificationBell from './NotificationBell';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="p-4 bg-black text-white flex items-center justify-between">
            {/* left */}
            <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center"><LogoR /></Link>
                <Link to="/about"   className="hover:text-purple-400">About</Link>
                {user && <Link  to="/library" className="hover:text-purple-400">Library</Link>}
                {user && <Link  to="/friends" className="hover:text-purple-400">Friends</Link>}
            </div>

            {/* right */}
            <div className="flex items-center gap-6">
                {user && <NotificationBell />}
                {!user ? (
                    <>
                        <Link to="/login"    className="hover:text-purple-400">Login</Link>
                        <Link to="/register" className="hover:text-purple-400">Register</Link>
                    </>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/profile" className="hover:text-purple-400">
                            Hi, {user.username}
                        </Link>
                        <button onClick={logout} className="hover:text-red-400">Logout</button>
                    </div>
                )}
            </div>
        </nav>
    );
}
