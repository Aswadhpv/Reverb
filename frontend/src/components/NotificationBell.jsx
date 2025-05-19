import React, { useEffect, useState } from 'react';
import { BellIcon, XMarkIcon }      from '@heroicons/react/24/solid';
import API                          from '../api/auth';

/* small red badge */
const Badge = ({ count }) =>
    count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500
                     text-[10px] px-1.5 rounded-full select-none">
      {count}
    </span>
    );

export default function NotificationBell() {
    const [open,       setOpen]       = useState(false);
    const [friendReq,  setFriendReq]  = useState([]);
    const [sessionInv, setSessionInv] = useState([]);

    /* load when pop-over opens */
    useEffect(() => {
        if (!open) return;
        (async () => {
            try {
                const [fr, si] = await Promise.all([
                    API.get('/friends/requests'),
                    API.get('/collaboration/invites')
                ]);
                setFriendReq(fr.data);
                setSessionInv(si.data);
            } catch (e) { console.error('Load requests failed', e); }
        })();
    }, [open]);

    /* actions */
    const acceptFriend  = id => API.post(`/friends/accept/${id}`)
        .then(() => setFriendReq(r => r.filter(f => f._id !== id)));
    const declineFriend = id => API.post(`/friends/decline/${id}`)
        .then(() => setFriendReq(r => r.filter(f => f._id !== id)));
    const acceptInvite  = id => API.post(`/collaboration/invites/${id}/accept`)
        .then(() => setSessionInv(r => r.filter(i => i._id !== id)));
    const rejectInvite  = id => API.post(`/collaboration/invites/${id}/reject`)
        .then(() => setSessionInv(r => r.filter(i => i._id !== id)));

    const count = friendReq.length + sessionInv.length;

    /* render */
    return (
        <div className="relative">
            <button onClick={() => setOpen(o => !o)} className="relative">
                <BellIcon className="w-6 h-6 text-purple-300 hover:text-purple-400" />
                <Badge count={count} />
            </button>

            {open && (
                <div
                    className="absolute right-0 mt-2 w-80 bg-[#111827]
                     text-white rounded-lg shadow-lg p-4 z-50 space-y-4">

                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Notifications</h3>
                        <XMarkIcon
                            className="w-5 h-5 cursor-pointer hover:text-gray-400"
                            onClick={() => setOpen(false)}
                        />
                    </div>

                    {/* Friend requests */}
                    <section>
                        <h4 className="text-sm text-purple-400 mb-1">Friend Requests</h4>
                        {friendReq.length === 0 && (
                            <p className="text-xs text-gray-400">None</p>
                        )}
                        {friendReq.map(r => (
                            <div key={r._id} className="flex justify-between items-center mb-2">
                                <span>{r.from.username}</span>
                                <div className="space-x-2 text-xs">
                                    <button onClick={() => acceptFriend(r._id)}
                                            className="text-green-400 hover:underline">Accept</button>
                                    <button onClick={() => declineFriend(r._id)}
                                            className="text-red-400 hover:underline">Decline</button>
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Session invites */}
                    <section>
                        <h4 className="text-sm text-purple-400 mb-1">Session Invites</h4>
                        {sessionInv.length === 0 && (
                            <p className="text-xs text-gray-400">None</p>
                        )}
                        {sessionInv.map(inv => (
                            <div key={inv._id} className="flex justify-between items-center mb-2">
                                <span>{inv.session.name}</span>
                                <div className="space-x-2 text-xs">
                                    <button onClick={() => acceptInvite(inv._id)}
                                            className="text-green-400 hover:underline">Join</button>
                                    <button onClick={() => rejectInvite(inv._id)}
                                            className="text-red-400 hover:underline">Reject</button>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            )}
        </div>
    );
}
