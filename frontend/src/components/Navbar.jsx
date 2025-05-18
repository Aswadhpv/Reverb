import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import BurgerMenu from './BurgerMenu';
import LogoR from './LogoR';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [showMenu, setShowMenu] = useState(false);

    return (
        <nav className="p-4 bg-black text-white flex items-center justify-between relative z-50">
            {/* Left side */}
            <div className="flex items-center space-x-6">
                <Link to="/" className="flex items-center">
                    <LogoR />
                </Link>
                <Link to="/about" className="hover:text-purple-400 text-lg font-medium">About</Link>
            </div>

            {/* Right side */}
            <div className="relative">
                {!user ? (
                    <div className="space-x-4">
                        <Link to="/login" className="hover:text-purple-400">Login</Link>
                        <Link to="/register" className="hover:text-purple-400">Register</Link>
                    </div>
                ) : (
                    <>
                        <button onClick={() => setShowMenu(!showMenu)} className="hover:text-purple-400">
                            Hi, {user?.username || 'User'}
                        </button>
                        {showMenu && (
                            <BurgerMenu username={user.username} logout={logout} />
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
