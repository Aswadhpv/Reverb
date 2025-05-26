import React, { useEffect, useState, useContext } from 'react';
import API from '../../api/auth';
import { SessionFileContext } from '../../context/SessionFileContext';

const SaveDownloadPanel = ({ sessionId }) => {
    const [files, setFiles] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const { refreshToken } = useContext(SessionFileContext);

    useEffect(() => {
        API.get(`/collaboration/files?sessionId=${sessionId}`)
            .then(res => {
                const validFiles = res.data.filter(f =>
                    f.filename.endsWith('.mp3') || f.filename.endsWith('.wav')
                );
                setFiles(validFiles);
                if (validFiles.length > 0) {
                    setSelectedId(validFiles[validFiles.length - 1]._id); // latest by default
                }
            })
            .catch(console.error);
    }, [sessionId, refreshToken]);

    const selectedFile = files.find(f => f._id === selectedId);

    const handleDownload = async () => {
        if (!selectedFile) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/collaboration/files/${selectedFile._id}/download`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = selectedFile.filename;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Download failed");
        }
    };

    const handleSave = () => {
        if (!selectedFile) return;

        API.post(`/collaboration/files/${selectedFile._id}/saveCopy`)
            .then(() => alert("File copied to your library!"))
            .catch(() => alert("Failed to save file"));
    };

    return (
        <div style={styles.panel}>
            <h3>🎼 Output Options</h3>

            {files.length === 0 ? (
                <p>No music files available.</p>
            ) : (
                <>
                    <label>Select File:</label>
                    <select
                        style={styles.select}
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                    >
                        {files.map(f => (
                            <option key={f._id} value={f._id}>
                                {f.filename}
                            </option>
                        ))}
                    </select>

                    <div style={{ marginTop: '10px' }}>
                        <button onClick={handleDownload} style={styles.buttonGreen}>⬇️ Download</button>
                        <button onClick={handleSave} style={styles.buttonBlue}>💾 Save to Library</button>
                    </div>
                </>
            )}
        </div>
    );
};

const styles = {
    panel: {
        background: 'rgba(0, 0, 0, 0.6)',
        padding: '15px',
        borderRadius: '10px',
        marginTop: '15px'
    },
    select: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#1e1e1e',
        color: 'white',
        border: '1px solid #555',
        borderRadius: '6px'
    },
    buttonGreen: {
        padding: '10px 16px',
        marginRight: '10px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    buttonBlue: {
        padding: '10px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
};

export default SaveDownloadPanel;
