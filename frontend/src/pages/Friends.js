import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Friends() {
    const [list, setList] = useState([]);
    const [email, setEmail] = useState('');

    const load = () => {
        API.get('/friends')
            .then(res => setList(res.data))
            .catch(() => setList([]));
    };

    useEffect(load, []);

    const handleAdd = async () => {
        try {
            await API.post('/friends/add', { email });
            setEmail('');
            load();
        } catch (err) {
            alert(err.response?.data?.msg || 'Could not add friend');
        }
    };

    const handleRemove = async id => {
        try {
            await API.delete(`/friends/${id}`);
            load();
        } catch {
            alert('Could not remove friend');
        }
    };

    return (
        <div>
            <h2>Your Friends</h2>
            <div>
                <input
                    type="email"
                    placeholder="Friend’s email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <button onClick={handleAdd}>Add Friend</button>
            </div>
            <ul>
                {list.map(f => (
                    <li key={f._id}>
                        {f.username} ({f.email})
                        <button onClick={() => handleRemove(f._id)} style={{ marginLeft: '1rem' }}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
