import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/auth';
import { AuthContext } from '../../context/AuthContext';

const SessionInfo = () => {
    const { id: sessionId } = useParams(); // ✅ uses route param correctly
    const { user } = useContext(AuthContext);
    const [sess, setSess]   = useState(null);
    const nav               = useNavigate();

    useEffect(() => {
        if (!sessionId) return;
        API.get(`/collaboration/mySessions`)
            .then(res => {
                const s = res.data.find(x => x._id === sessionId);
                if (s) setSess(s);
            })
            .catch(console.error);
    }, [sessionId]);

    const copyId   = () => navigator.clipboard.writeText(sessionId);
    const isOwner  = sess?.owner?._id === user?._id;

    const leave    = () =>
        API.post(`/collaboration/session/${sessionId}/leave`).then(() => nav('/collab'));

    const close    = () =>
        API.delete(`/collaboration/session/${sessionId}`).then(() => nav('/collab'));

    if (!sessionId) return <p>Error: Missing session ID</p>;

    return (
        <div style={styles.wrap}>
            <h3>🎼 Session&nbsp;Info</h3>

            <p><strong>Name:</strong> {sess?.name || '—'}</p>

            <p>
                <strong>ID:</strong> {sessionId}
                <button onClick={copyId} style={styles.copy}>📋 Copy</button>
            </p>

            <p><strong>Owner:</strong> {sess?.owner?.username || sess?.owner?.email || '—'}</p>

            {isOwner ? (
                <button onClick={close} style={styles.close}>❌ Close&nbsp;Session</button>
            ) : (
                <button onClick={leave} style={styles.leave}>🚪 Leave&nbsp;Session</button>
            )}
        </div>
    );
};

const styles = {
    wrap : { background:'rgba(0,0,0,.6)', padding:20, borderRadius:10, color:'#fff', marginBottom:10 },
    copy : { marginLeft:10, padding:'4px 8px', fontSize:12, border:'none', borderRadius:4,
        background:'#3b82f6', color:'#fff', cursor:'pointer' },
    leave: { background:'#ef4444', color:'#fff', padding:'8px 16px', border:'none',
        borderRadius:6, marginTop:10, cursor:'pointer' },
    close: { background:'#9333ea', color:'#fff', padding:'8px 16px', border:'none',
        borderRadius:6, marginTop:10, cursor:'pointer' }
};

export default SessionInfo;
