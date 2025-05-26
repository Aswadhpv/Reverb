import React, { useEffect, useRef, useState } from 'react';
import API from '../../api/auth';

const AudioPlayer = ({ sessionId }) => {
    const audioRef = useRef(null);
    const [audioFile, setAudioFile] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        API.get(`/collaboration/files?sessionId=${sessionId}`)
            .then(res => {
                const files = res.data;
                const latestMusic = files
                    .filter(f => f.filename.endsWith('.mp3') || f.filename.endsWith('.wav'))
                    .slice(-1)[0];

                if (latestMusic?.path) {
                    setAudioFile(`http://localhost:5000${latestMusic.path}`);
                } else {
                    setAudioFile(null);
                }
            })
            .catch(err => {
                console.error(err);
                setAudioFile(null);
            });

        // Cleanup when leaving
        return () => {
            setAudioFile(null);
            setIsPlaying(false);
            setProgress(0);
        };
    }, [sessionId]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        if (!audioRef.current || !audioRef.current.duration) return;
        const newTime = (e.target.value / 100) * audioRef.current.duration;
        audioRef.current.currentTime = newTime;
        setProgress(Number(e.target.value));
    };

    const updateProgress = () => {
        if (!audioRef.current || !audioRef.current.duration) return;
        const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(Number(percent.toFixed(2)));
    };

    return (
        <div style={styles.playerContainer}>
            {audioFile ? (
                <>
                    <audio
                        ref={audioRef}
                        src={audioFile}
                        onTimeUpdate={updateProgress}
                        onEnded={() => setIsPlaying(false)}
                    />
                    <button onClick={togglePlay} style={styles.button}>
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={!isNaN(progress) ? progress : 0}
                        onChange={handleSeek}
                        style={styles.slider}
                    />
                </>
            ) : (
                <p>No audio loaded yet.</p>
            )}
        </div>
    );
};

const styles = {
    playerContainer: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: '15px',
        borderRadius: '10px',
        textAlign: 'center',
        marginTop: '10px',
    },
    button: {
        padding: '8px 16px',
        marginBottom: '10px',
        backgroundColor: '#4ade80',
        border: 'none',
        borderRadius: '6px',
        color: 'black',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    slider: {
        width: '80%',
    }
};

export default AudioPlayer;
