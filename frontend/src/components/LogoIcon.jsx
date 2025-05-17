import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/reverb-logo.webp';

const LogoIcon = () => (
    <Link to="/" className="flex items-center space-x-2">
        <img src={logo} alt="Reverb Logo" className="h-10 w-auto hover:opacity-80 transition-opacity duration-300" />
    </Link>
);

export default LogoIcon;
