import React from 'react';
import { Link } from 'react-router-dom';

const BurgerMenu = ({ username, logout }) => {
    return (
        <div className="absolute right-0 mt-2 w-48 bg-black text-white rounded shadow-lg animate-slide-down z-50 border border-purple-600">
            <div className="px-4 py-2 text-purple-400 font-semibold border-b border-purple-500">
                Hi, {username}
            </div>
            <Link to="/profile" className="block px-4 py-2 hover:bg-purple-700">
                Profile
            </Link>
            <Link to="/library" className="block px-4 py-2 hover:bg-purple-700">
                My Library
            </Link>
            <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-red-600 text-red-400">
                Logout
            </button>
        </div>
    );
};

export default BurgerMenu;
