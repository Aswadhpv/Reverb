import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket'],
});

const ChatPanel = ({ sessionId }) => {
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState('');
    const chatEndRef = useRef();

    useEffect(() => {
        socket.emit('joinSession', { sessionId, username: 'Anonymous' });

        socket.on('chatMessage', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.emit('leaveSession');
            socket.off('chatMessage');
        };
    }, [sessionId]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (msg.trim()) {
            socket.emit('chatMessage', {
                sessionId,
                msg,
                username: 'You'
            });
            setMsg('');
        }
    };

    return (
        <div style={styles.panel}>
            <h3>💬 Chat</h3>
            <div style={styles.chatBox}>
                {messages.map((m, i) => (
                    <div key={i} style={styles.message}><strong>{m.username}:</strong> {m.msg}</div>
                ))}
                <div ref={chatEndRef}></div>
            </div>
            <div style={styles.inputRow}>
                <input
                    type="text"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Type your message..."
                    style={styles.input}
                />
                <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
            </div>
        </div>
    );
};

const styles = {
    panel: {
        background: 'rgba(0,0,0,0.6)',
        padding: '15px',
        borderRadius: '10px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    chatBox: {
        flex: 1,
        overflowY: 'auto',
        marginBottom: '10px',
        backgroundColor: '#1e1e1e',
        padding: '10px',
        borderRadius: '6px'
    },
    message: {
        padding: '6px',
        backgroundColor: '#333',
        marginBottom: '5px',
        borderRadius: '6px',
        fontSize: '14px'
    },
    inputRow: {
        display: 'flex'
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '6px 0 0 6px',
        border: 'none',
        backgroundColor: '#2d2d2d',
        color: 'white'
    },
    sendBtn: {
        padding: '10px 16px',
        backgroundColor: '#6366f1',
        color: 'white',
        border: 'none',
        borderRadius: '0 6px 6px 0',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
};

export default ChatPanel;
