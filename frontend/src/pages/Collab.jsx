import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/auth';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import bg from '../assets/collab-bg.jpg';
import './Collab.css';

const Collab = () => {
    const nav = useNavigate();
    const [sessionName, setSessionName] = useState('');
    const [joinId, setJoinId] = useState('');
    const [sessions, setSessions] = useState([]);
    const [calendarDate, setCalendarDate] = useState(new Date());

    /* fetch sessions where user is owner or participant */
    useEffect(() => {
        API.get('/collaboration/mySessions')
            .then(r => setSessions(r.data))
            .catch(() => setSessions([]));
    }, []);

    /* create new session */
    const createSession = () => {
        if (!sessionName.trim()) return;
        API.post('/collaboration/session', { name: sessionName })
            .then(r => nav(`/collab/${r.data._id}`))
            .catch(() => alert('Failed to create session'));
    };

    /* join existing session */
    const joinSession = () => {
        if (!joinId.trim()) return;
        API.post('/collaboration/join', { sessionId: joinId })
            .then(() => nav(`/collab/${joinId}`))
            .catch(() => alert('Failed to join (check ID)'));
    };

    return (
        <div className="collab-page" style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            height: '100vh', display: 'flex', color: 'white'
        }}>
            <div className="collab-left">
                <h3>Active Sessions</h3>
                <ul className="session-list">
                    {sessions.length ? sessions.map(s => (
                        <li key={s._id} onClick={() => nav(`/collab/${s._id}`)} className="session-item">
                            {s.name}
                        </li>
                    )) : <p>No sessions yet.</p>}
                </ul>
            </div>

            <div className="collab-center">
                <h2 className="collab-heading">🎵 Let's Collaborate 🎶</h2>

                <div className="form-row">
                    <input
                        className="collab-input"
                        placeholder="Enter session name"
                        value={sessionName}
                        onChange={e => setSessionName(e.target.value)}
                    />
                    <button onClick={createSession} className="collab-button">Create</button>
                </div>

                <div className="form-row">
                    <input
                        className="collab-input"
                        placeholder="Enter session ID"
                        value={joinId}
                        onChange={e => setJoinId(e.target.value)}
                    />
                    <button onClick={joinSession} className="collab-button">Join</button>
                </div>
            </div>

            <div className="collab-right">
                <h3>Session Calendar</h3>
                <Calendar value={calendarDate} onChange={setCalendarDate} className="custom-calendar" />
            </div>
        </div>
    );
};

export default Collab;
