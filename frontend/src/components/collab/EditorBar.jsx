import React, { useEffect, useRef, useState, useContext } from 'react';
import WaveSurfer from 'wavesurfer.js';
import Sortable from 'sortablejs';
import API from '../../api/auth';
import { SessionFileContext } from '../../context/SessionFileContext';

const EditorBar = ({ sessionId }) => {
    const waveformRefs = useRef([]);
    const waveInstances = useRef([]);
    const { refreshToken } = useContext(SessionFileContext);
    const [tracks, setTracks] = useState([]);
    const [activeTrackId, setActiveTrackId] = useState(null);

    useEffect(() => {
        API.get(`/collaboration/files?sessionId=${sessionId}`)
            .then(res => {
                const musicFiles = res.data.filter(f =>
                    f.filename.endsWith('.mp3') || f.filename.endsWith('.wav')
                );
                setTracks(musicFiles.map(f => ({ ...f, effects: [] })));
            });
    }, [sessionId, refreshToken]);

    useEffect(() => {
        waveformRefs.current = waveformRefs.current.slice(0, tracks.length);
        waveInstances.current = waveInstances.current.slice(0, tracks.length);

        tracks.forEach((track, index) => {
            const container = waveformRefs.current[index];
            const fileUrl = `http://localhost:5000${track.path}`;

            if (container && fileUrl) {
                waveInstances.current[index]?.__abort?.abort();
                waveInstances.current[index]?.destroy();

                const wave = WaveSurfer.create({
                    container,
                    waveColor: '#888',
                    progressColor: '#4ade80',
                    height: 80,
                    responsive: true
                });

                const controller = new AbortController();
                const signal = controller.signal;

                fetch(fileUrl, { signal })
                    .then(res => res.blob())
                    .then(blob => wave.loadBlob(blob))
                    .catch(err => {
                        if (err.name === 'AbortError') {
                            console.warn('WaveSurfer fetch aborted for', fileUrl);
                        } else {
                            console.error('WaveSurfer fetch error:', err);
                        }
                    });

                wave.__abort = controller;
                waveInstances.current[index] = wave;
            }
        });

        return () => {
            waveInstances.current.forEach(w => {
                w?.__abort?.abort();
                w?.destroy();
            });
            waveInstances.current = [];
        };
    }, [tracks]);

    const togglePlay = (id, index) => {
        const wave = waveInstances.current[index];
        if (!wave) return;

        if (activeTrackId === id) {
            wave.pause();
            setActiveTrackId(null);
        } else {
            waveInstances.current.forEach(w => w?.pause());
            wave.play();
            setActiveTrackId(id);
        }
    };

    const removeTrack = async (id) => {
        if (!window.confirm("Are you sure you want to delete this audio from session?")) return;

        const idx = tracks.findIndex(t => t._id === id);
        if (idx === -1) return;

        try {
            waveInstances.current[idx]?.__abort?.abort();
            waveInstances.current[idx]?.destroy();
            waveInstances.current.splice(idx, 1);
            waveformRefs.current.splice(idx, 1);

            await API.delete(`/collaboration/files/${id}`);

            const updated = [...tracks];
            updated.splice(idx, 1);
            setTracks(updated);
        } catch (err) {
            alert("Failed to delete file from session");
            console.error(err);
        }
    };

    useEffect(() => {
        const el = document.getElementById("track-list");
        if (el) {
            Sortable.create(el, {
                animation: 150,
                onEnd: (e) => {
                    const reordered = [...tracks];
                    const [moved] = reordered.splice(e.oldIndex, 1);
                    reordered.splice(e.newIndex, 0, moved);
                    setTracks(reordered);
                }
            });
        }
    }, [tracks]);

    return (
        <div style={styles.container}>
            <h3>🎛️ Editor Bar</h3>
            <div id="track-list">
                {tracks.map((track, i) => (
                    <div key={track._id} style={styles.trackRow}>
                        <div style={styles.labelRow}>
                            <span>{track.filename}</span>
                            <div style={styles.controls}>
                                <button onClick={() => togglePlay(track._id, i)} style={styles.playBtn}>
                                    {activeTrackId === track._id ? '⏸️ Pause' : '▶️ Play'}
                                </button>
                                <button onClick={() => removeTrack(track._id)} style={styles.removeBtn}>
                                    ❌ Remove
                                </button>
                            </div>
                        </div>
                        <div ref={el => waveformRefs.current[i] = el} style={styles.wave}></div>
                        <div style={styles.effects}>
                            {track.effects.map((fx, j) => (
                                <span key={j} style={styles.effectTag}>{fx}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        background: 'rgba(0,0,0,0.6)',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '20px'
    },
    trackRow: {
        marginBottom: '20px',
        backgroundColor: '#1e1e1e',
        borderRadius: '10px',
        padding: '10px'
    },
    labelRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
        color: '#ccc',
        fontWeight: 'bold'
    },
    controls: {
        display: 'flex',
        gap: '8px'
    },
    playBtn: {
        background: '#4ade80',
        color: 'black',
        border: 'none',
        borderRadius: '6px',
        padding: '4px 10px',
        cursor: 'pointer'
    },
    removeBtn: {
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '4px 10px',
        cursor: 'pointer'
    },
    wave: {
        width: '100%',
        height: '80px',
        marginBottom: '8px'
    },
    effects: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
    },
    effectTag: {
        backgroundColor: '#9333ea',
        color: 'white',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px'
    }
};

export default EditorBar;
