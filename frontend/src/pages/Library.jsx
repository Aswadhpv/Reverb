import React, { useEffect, useState, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/auth';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const Library = () => {
    const { user } = useContext(AuthContext);
    const [files, setFiles] = useState([]);
    const [renameId, setRenameId] = useState(null);
    const [newName, setNewName] = useState('');

    const fetchFiles = useCallback(async () => {
        try {
            const { data } = await API.get(`/collaboration/files?ownerId=${user._id}`);
            setFiles(data);
        } catch {
            alert('Failed to load library');
        }
    }, [user]);

    useEffect(() => {
        if (user?._id) fetchFiles();
    }, [user, fetchFiles]);

    const handleRename = async (fileId) => {
        try {
            await API.put(`/collaboration/files/${fileId}/rename`, { newName });
            setRenameId(null);
            setNewName('');
            fetchFiles();
        } catch {
            alert('Rename failed');
        }
    };

    return (
        <div className="p-8 text-white min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <span role="img" aria-label="library">🎧</span> My Library
            </h2>

            {files.length === 0 ? (
                <p className="text-gray-400">No audio files uploaded yet.</p>
            ) : (
                <div className="space-y-6">
                    {files.map(f => (
                        <div key={f._id} className="bg-[#111827] rounded p-4 shadow-md space-y-4">
                            {renameId === f._id ? (
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        className="p-2 rounded bg-gray-800 text-white flex-grow"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        placeholder="New filename"
                                    />
                                    <button
                                        onClick={() => handleRename(f._id)}
                                        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Rename
                                    </button>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <span>{f.filename}</span>
                                    <button
                                        onClick={() => {
                                            setRenameId(f._id);
                                            setNewName(f.filename.replace(/\.[^/.]+$/, '')); // exclude extension
                                        }}
                                        className="text-sm text-blue-400 hover:underline"
                                    >
                                        Rename
                                    </button>
                                </div>
                            )}

                            <AudioPlayer
                                src={`http://localhost:5000/${f.path.replace(/\\/g, '/')}`}
                                onError={(e) => console.error('Playback error:', e)}
                                showJumpControls={false}
                                customAdditionalControls={[]}
                                customVolumeControls={[]}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Library;
