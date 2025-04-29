import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import API, { listPlugins, processAudio } from '../api';

export default function Collaboration() {
    const [sessionId, setSessionId] = useState('');
    const [joined,    setJoined]    = useState(false);
    const [plugins,   setPlugins]   = useState([]);
    const [recorder,  setRecorder]  = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const socketRef  = useRef();

    // 1️⃣ Fetch available audio plugins
    useEffect(() => {
        listPlugins().then(res => setPlugins(res.data));
    }, []);

    // 2️⃣ Initialize MediaRecorder for mic input
    useEffect(() => {
        if (!navigator.mediaDevices) return;
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const mr = new MediaRecorder(stream);
                let chunks = [];
                mr.ondataavailable = e => chunks.push(e.data);
                mr.onstop = () => {
                    const blob = new Blob(chunks, { type: 'audio/wav' });
                    chunks = [];
                    setAudioBlob(blob);
                };
                setRecorder(mr);
            })
            .catch(console.error);
    }, []);

    // 3️⃣ When joined → connect sockets
    useEffect(() => {
        if (!joined) return;
        const socket = io('http://localhost:5000', { transports: ['websocket'] });
        socket.emit('joinSession', { sessionId });
        socket.on('audioData', buffer => {
            // receive processed audio from others → play it
            const blob = new Blob([buffer], { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            new Audio(url).play();
        });
        socket.on('chatMessage', msg => {
            // TODO: append to chat UI
            console.log('Chat:', msg);
        });
        socketRef.current = socket;
        return () => socket.disconnect();
    }, [joined, sessionId]);

    // 4️⃣ Create or join session
    const createSession = async () => {
        const { data } = await API.post('/collaboration/session', { name: 'New Session' });
        setSessionId(data._id);
        setJoined(true);
    };
    const joinSession = async () => {
        await API.post('/collaboration/join', { sessionId });
        setJoined(true);
    };

    // 5️⃣ Recording controls
    const startRecording = () => {
        if (recorder) recorder.start();
    };
    const stopRecording = () => {
        if (recorder) recorder.stop();
    };

    // 6️⃣ Apply plugin: send to Python service, play & broadcast
    const applyPlugin = async plugin => {
        if (!audioBlob) {
            alert('Record some audio first!');
            return;
        }
        // a) get raw audio ArrayBuffer
        const arrayBuffer = await audioBlob.arrayBuffer();

        // b) encode as base64 latin1
        const binary = String.fromCharCode(...new Uint8Array(arrayBuffer));
        const rawAudioBase64 = btoa(binary);

        // c) call backend → audio-service
        const response = await processAudio(rawAudioBase64, plugin);

        // d) play locally
        const outBlob = new Blob([response], { type: 'audio/wav' });
        const url = URL.createObjectURL(outBlob);
        new Audio(url).play();

        // e) broadcast to other clients
        socketRef.current.emit('audioData', { sessionId, buffer: response });
    };

    if (!joined) {
        return (
            <div>
                <h2>Real-Time Collaboration</h2>
                <button onClick={createSession}>Create New Session</button>
                <div style={{ marginTop: 12 }}>
                    <input
                        type="text"
                        placeholder="Session ID"
                        value={sessionId}
                        onChange={e => setSessionId(e.target.value)}
                    />
                    <button onClick={joinSession} style={{ marginLeft: 8 }}>
                        Join Session
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3>Session: {sessionId}</h3>

            {/* Recording Controls */}
            <div>
                <button onClick={startRecording}>🎤 Start Recording</button>
                <button onClick={stopRecording} style={{ marginLeft: 8 }}>⏹ Stop</button>
            </div>

            {/* Plugin Selector */}
            <div style={{ marginTop: 16 }}>
                <label>Apply Plugin: </label>
                <select onChange={e => applyPlugin(e.target.value)}>
                    <option value="">-- choose --</option>
                    {plugins.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            {/* TODO: add your Web Audio editor canvas, chat UI, video iframe, etc. */}
        </div>
    );
}
