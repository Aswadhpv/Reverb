import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API             from '../api/auth';
import defaultPic      from '../assets/default-avatar.png';
import bg              from '../assets/friends-bg.jpg';

export default function Friends() {
    const { user }          = useContext(AuthContext);

    const [friends, setFriends] = useState([]);
    const [email,   setEmail]   = useState('');

    /* load list ----------------------------------------------------------- */
    const loadFriends = () =>
        API.get('/friends')
            .then(r => setFriends(r.data))
            .catch(e => console.error('Load friends', e));

    useEffect(() => { if (user) loadFriends(); }, [user]);

    /* add friend ---------------------------------------------------------- */
    const sendRequest = () => {
        if (!email.trim()) return;
        API.post('/friends/request', { email })
            .then(() => {
                alert('Request sent');
                setEmail('');
            })
            .catch(() => alert('Failed'));
    };

    /* remove -------------------------------------------------------------- */
    const removeFriend = (id) => {
        if (!window.confirm('Remove this friend?')) return;
        API.delete(`/friends/${id}`)
            .then(() => loadFriends())
            .catch(() => alert('Failed to remove'));
    };

    /* render -------------------------------------------------------------- */
    return (
        <div
            className="min-h-screen text-white p-8"
            style={{
                backgroundImage    : `url(${bg})`,
                backgroundSize     : 'cover',
                backgroundPosition : 'center',
                backgroundColor    : '#0009',
                backgroundBlendMode: 'overlay'
            }}
        >
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <span role="img" aria-label="friends">👥</span> Friends
            </h2>

            {/* add friend */}
            <div className="flex gap-3 mb-10 max-w-md">
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Friend email"
                    className="flex-grow p-2 rounded bg-gray-800"
                />
                <button
                    onClick={sendRequest}
                    className="bg-purple-700 hover:bg-purple-800 px-4 rounded"
                >Add</button>
            </div>

            {/* list ------------------------------------------------------------ */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {friends.map(f => (
                    <div
                        key={f._id}
                        className="bg-[#111827]/80 rounded-lg p-4 flex items-center
                       hover:bg-[#1f2937] transition-colors group"
                    >
                        <img
                            src={f.profilePic ? `http://localhost:5000${f.profilePic}` : defaultPic}
                            alt=""
                            className="w-14 h-14 rounded-full object-cover mr-4
                         group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-grow">
                            <p className="font-semibold">{f.username}</p>
                            <p className="text-sm text-gray-400">{f.email}</p>
                            {f.phone && (
                                <p className="text-xs text-gray-500 mt-1">📞 {f.phone}</p>
                            )}
                        </div>

                        {/* remove */}
                        <button
                            onClick={() => removeFriend(f._id)}
                            className="text-red-400 hover:text-red-500 text-sm ml-2"
                            title="Remove friend"
                        >❌</button>
                    </div>
                ))}

                {friends.length === 0 && (
                    <p className="text-gray-400 col-span-full">No friends yet.</p>
                )}
            </div>
        </div>
    );
}
