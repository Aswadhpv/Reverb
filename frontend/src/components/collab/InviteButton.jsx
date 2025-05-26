import React, { useEffect, useState } from 'react';
import API from '../../api/auth';
import { useNavigate } from 'react-router-dom';

const InviteButton = ({ sessionId }) => {
    const [friends, setFriends] = useState([]);
    const [selectedFriendId, setSelectedFriendId] = useState('');
    const [showAddPrompt, setShowAddPrompt] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        API.get('/friends') // ✅ fixed endpoint
            .then(res => setFriends(res.data))
            .catch(err => {
                console.error('Failed to fetch friends', err);
                setFriends([]);
            });
    }, []);

    const handleInvite = () => {
        const friend = friends.find(f => f._id === selectedFriendId);
        if (!friend) {
            setShowAddPrompt(true);
            return;
        }

        API.post('/collaboration/invite', {
            sessionId,
            inviteeId: selectedFriendId
        })
            .then(() => alert('Invite sent!'))
            .catch(err => {
                console.error(err);
                alert('Failed to send invite');
            });
    };

    return (
        <div style={styles.panel}>
            <h3>📨 Invite Friend</h3>
            <select
                value={selectedFriendId}
                onChange={(e) => setSelectedFriendId(e.target.value)}
                style={styles.select}
            >
                <option value="">-- Select a Friend --</option>
                {friends.map(f => (
                    <option key={f._id} value={f._id}>{f.username}</option>
                ))}
            </select>
            <button onClick={handleInvite} style={styles.button}>
                Send Invite
            </button>

            {showAddPrompt && (
                <div style={styles.promptBox}>
                    <p>User is not in your friend list. Add now?</p>
                    <button onClick={() => navigate('/friends')} style={styles.promptBtn}>Yes</button>
                    <button onClick={() => setShowAddPrompt(false)} style={styles.promptBtn}>No</button>
                </div>
            )}
        </div>
    );
};

const styles = {
    panel: {
        marginBottom: '10px',
        background: 'rgba(0,0,0,0.6)',
        padding: '15px',
        borderRadius: '10px'
    },
    select: {
        padding: '10px',
        borderRadius: '6px',
        width: '100%',
        marginBottom: '10px',
        backgroundColor: '#1e1e1e',
        color: 'white',
        border: '1px solid #444'
    },
    button: {
        padding: '10px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    promptBox: {
        marginTop: '15px',
        backgroundColor: '#1e1e1e',
        padding: '10px',
        borderRadius: '6px'
    },
    promptBtn: {
        margin: '5px',
        padding: '6px 12px',
        backgroundColor: '#6366f1',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    }
};

export default InviteButton;
