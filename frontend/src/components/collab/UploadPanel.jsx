import React, { useState, useEffect, useContext } from 'react';
import API from '../../api/auth';
import { SessionFileContext } from '../../context/SessionFileContext';

const UploadPanel = ({ sessionId }) => {
    const [mode, setMode] = useState('music'); // 'music' or 'plugin'
    const [dragOver, setDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showLibrary, setShowLibrary] = useState(false);
    const [libraryFiles, setLibraryFiles] = useState([]);

    const { triggerRefresh } = useContext(SessionFileContext);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
    };

    const handleBrowse = (e) => {
        const file = e.target.files[0];
        if (file) uploadFile(file);
    };

    const uploadFile = async (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('audio', file);
        formData.append('type', mode);

        try {
            await API.post(`/collaboration/upload?sessionId=${sessionId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Upload successful.');
            triggerRefresh(); // ✅ update file list in other components
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const fetchLibrary = async () => {
        try {
            const { data } = await API.get('/collaboration/files');
            const personal = data.filter(f => !f.session && (f.filename.endsWith('.mp3') || f.filename.endsWith('.wav')));
            setLibraryFiles(personal);
        } catch (e) {
            console.error('Failed to load personal files', e);
        }
    };

    const attachFileToSession = async (id) => {
        try {
            await API.post(`/collaboration/files/${id}/copyToSession?sessionId=${sessionId}`);
            alert('File copied to session!');
            setShowLibrary(false);
            triggerRefresh();
        } catch (e) {
            alert('Failed to copy file to session');
            console.error(e);
        }
    };

    useEffect(() => {
        if (showLibrary) fetchLibrary();
    }, [showLibrary]);

    return (
        <div style={styles.panel}>
            <div style={styles.header}>
                <select value={mode} onChange={(e) => setMode(e.target.value)} style={styles.select}>
                    <option value="music">🎵 Upload Music</option>
                    <option value="plugin">🎚️ Upload Plugin</option>
                </select>
            </div>

            <div
                style={{
                    ...styles.dropzone,
                    borderColor: dragOver ? '#9333ea' : '#888',
                    backgroundColor: dragOver ? 'rgba(147, 51, 234, 0.2)' : 'transparent'
                }}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                <p>Drag & drop your {mode} file here, or</p>
                <label style={styles.browseBtn}>
                    Browse
                    <input
                        type="file"
                        accept={mode === 'music' ? '.mp3,.wav' : '.zip,.vst'}
                        style={{ display: 'none' }}
                        onChange={handleBrowse}
                    />
                </label>
                {uploading && <p>Uploading...</p>}
            </div>

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <button onClick={() => setShowLibrary(true)} style={styles.attachBtn}>
                    📁 Add from Library
                </button>
            </div>

            {showLibrary && (
                <div style={styles.libraryModal}>
                    <div style={styles.libraryContent}>
                        <h3>Select file from your Library</h3>
                        <ul style={styles.list}>
                            {libraryFiles.map(f => (
                                <li key={f._id} style={styles.item}>
                                    <span>{f.filename}</span>
                                    <button
                                        onClick={() => attachFileToSession(f._id)}
                                        style={styles.attachBtnSmall}
                                    >
                                        ➕ Add
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setShowLibrary(false)} style={styles.closeBtn}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    panel: {
        background: 'rgba(0, 0, 0, 0.6)',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px'
    },
    header: {
        marginBottom: '10px'
    },
    select: {
        padding: '8px',
        borderRadius: '6px',
        backgroundColor: '#1e1e1e',
        color: 'white',
        border: '1px solid #666'
    },
    dropzone: {
        border: '2px dashed #888',
        borderRadius: '10px',
        padding: '30px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    browseBtn: {
        display: 'inline-block',
        marginTop: '10px',
        padding: '10px 16px',
        backgroundColor: '#8b5cf6',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    attachBtn: {
        padding: '10px 16px',
        backgroundColor: '#22c55e',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    libraryModal: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    libraryContent: {
        background: '#1e1e1e',
        padding: '20px',
        borderRadius: '10px',
        color: 'white',
        width: '400px',
        maxHeight: '80vh',
        overflowY: 'auto'
    },
    list: {
        listStyle: 'none',
        padding: 0,
        marginTop: '10px'
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#2d2d2d',
        padding: '10px',
        marginBottom: '8px',
        borderRadius: '6px'
    },
    attachBtnSmall: {
        padding: '6px 10px',
        fontSize: '12px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    closeBtn: {
        marginTop: '15px',
        padding: '8px 14px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
};

export default UploadPanel;
