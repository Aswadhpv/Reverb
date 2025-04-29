import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Home() {
    const [home, setHome] = useState({ welcome: '', features: [] });

    useEffect(() => {
        API.get('/home')
            .then(res => setHome(res.data))
            .catch(() => setHome({ welcome: 'Welcome!', features: [] }));
    }, []);

    return (
        <div>
            <h1>{home.welcome}</h1>
            <h3>Features</h3>
            <ul>
                {home.features.map((f, i) => (
                    <li key={i}>{f}</li>
                ))}
            </ul>
        </div>
    );
}
