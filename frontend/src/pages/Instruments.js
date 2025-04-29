import React from 'react';

export default function Instruments() {
    // you can also fetch this list from an API if you want
    const instruments = ['Piano', 'Drum Kit', 'Synth', 'Bass', 'Guitar'];

    return (
        <div>
            <h2>Available Instruments & Plugins</h2>
            <ul>
                {instruments.map((inst, i) => (
                    <li key={i}>{inst}</li>
                ))}
            </ul>
        </div>
    );
}
