import React, { useEffect, useState, useContext } from 'react';
import API from '../../api/auth';
import { SessionFileContext } from '../../context/SessionFileContext';

const PluginRack = ({ sessionId }) => {
    const [plugins, setPlugins] = useState([]);
    const [selectedFileId, setSelectedFileId] = useState('');
    const [availableFiles, setAvailableFiles] = useState([]);
    const [selectedPlugin, setSelectedPlugin] = useState('');
    const { refreshToken, triggerRefresh } = useContext(SessionFileContext);

    useEffect(() => {
        API.get('/collaboration/plugins')
            .then(res => setPlugins(res.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        API.get(`/collaboration/files?sessionId=${sessionId}`)
            .then(res => {
                const musicFiles = res.data.filter(f => f.filename.endsWith('.mp3') || f.filename.endsWith('.wav'));
                setAvailableFiles(musicFiles);
            })
            .catch(console.error);
    }, [sessionId, refreshToken]);

    const applyPlugin = () => {
        if (!selectedFileId || !selectedPlugin) {
            alert('Select both a file and plugin');
            return;
        }

        API.post('/collaboration/process', {
            fileId: selectedFileId,
            plugin: selectedPlugin
        })
            .then(() => {
                alert('Plugin applied successfully!');
                triggerRefresh();
            })
            .catch(err => {
                console.error('Plugin apply error:', err.response?.data || err.message);
                alert(err.response?.data?.msg || 'Failed to apply plugin.');
            });
    };

    return (
        <div style={styles.panel}>
            <h3>🎛️ Plugin Rack</h3>

            <div style={styles.formGroup}>
                <label>Select File:</label>
                <select
                    value={selectedFileId}
                    onChange={(e) => setSelectedFileId(e.target.value)}
                    style={styles.select}
                >
                    <option value="">-- Choose Audio File --</option>
                    {availableFiles.map(f => (
                        <option key={f._id} value={f._id}>{f.filename}</option>
                    ))}
                </select>
            </div>

            <div style={styles.formGroup}>
                <label>Select Plugin:</label>
                <select
                    value={selectedPlugin}
                    onChange={(e) => setSelectedPlugin(e.target.value)}
                    style={styles.select}
                >
                    <option value="">-- Choose Plugin --</option>
                    {plugins.map((p, idx) => (
                        <option key={idx} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            <button onClick={applyPlugin} style={styles.button}>
                Apply Plugin
            </button>
        </div>
    );
};

const styles = {
    panel: {
        background: 'rgba(0,0,0,0.6)',
        padding: '20px',
        borderRadius: '10px'
    },
    formGroup: {
        marginBottom: '15px'
    },
    select: {
        padding: '10px',
        width: '100%',
        borderRadius: '6px',
        backgroundColor: '#1e1e1e',
        color: 'white',
        border: '1px solid #444'
    },
    button: {
        marginTop: '10px',
        padding: '10px 16px',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer'
    }
};

export default PluginRack;
