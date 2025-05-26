import React, {
    useEffect, useState, useContext,
    useRef, useCallback
} from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/auth';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const BASE = 'http://localhost:5000';

export default function Library() {
    const { user } = useContext(AuthContext);
    const [files, setFiles] = useState([]);
    const [uploadPct, setUploadPct] = useState(0);
    const [renameId, setRenameId] = useState(null);
    const [newName, setNewName] = useState('');
    const [playingId, setPlayingId] = useState(null);

    const fetchFiles = useCallback(async () => {
        try {
            const { data } = await API.get('/collaboration/files');
            const personal = data.filter(f => !f.session || f.isFavorite); // ✅ includes saved session files
            setFiles(personal.reverse());
        } catch (e) {
            console.error('Load files fail', e);
        }
    }, []);

    useEffect(() => { if (user) fetchFiles(); }, [user, fetchFiles]);

    const fileInput = useRef(null);

    const upload = async (file) => {
        const fd = new FormData();
        fd.append('audio', file);

        try {
            await API.post('/collaboration/upload', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: e =>
                    setUploadPct(Math.round((e.loaded * 100) / e.total))
            });
            setUploadPct(0);
            fetchFiles();
        } catch (e) {
            console.error('Upload failed', e);
            alert('Upload failed');
            setUploadPct(0);
        }
    };

    const doRename = async (id) => {
        try {
            await API.put(`/collaboration/files/${id}/rename`, { newName });
            setRenameId(null);
            setNewName('');
            fetchFiles();
        } catch { alert('Rename failed'); }
    };

    const doDelete = async (id) => {
        if (!window.confirm('Delete this file forever?')) return;
        try {
            await API.delete(`/collaboration/files/${id}`);
            if (id === playingId) setPlayingId(null);
            fetchFiles();
        } catch { alert('Delete failed'); }
    };

    const doDownload = async (file) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE}/api/collaboration/files/${file._id}/download`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            const cd = response.headers.get('Content-Disposition');
            const filename = cd
                ? cd.split('filename=')[1].replace(/"/g, '')
                : file.filename;

            a.href = url; a.download = filename;
            document.body.appendChild(a); a.click(); a.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Download error:', e);
            alert('Download failed');
        }
    };

    const attachToSession = async (id) => {
        const sessionId = prompt("Enter session ID to copy this file to:");
        if (!sessionId) return;

        try {
            await API.post(`/collaboration/files/${id}/copyToSession?sessionId=${sessionId}`);
            alert('File copied to session!');
        } catch (e) {
            alert('Failed to copy file to session');
            console.error(e);
        }
    };

    return (
        <div
            className="min-h-screen p-8 text-white bg-gradient-to-br from-black via-gray-900 to-black"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
                e.preventDefault();
                if (e.dataTransfer.files[0]) upload(e.dataTransfer.files[0]);
            }}
        >
            <h2 className="text-3xl font-bold flex items-center gap-2 mb-6">🎧 My Library</h2>

            <div className="mb-6 space-x-4">
                <button
                    className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded"
                    onClick={() => fileInput.current.click()}
                >Upload Audio</button>
                {uploadPct > 0 && (
                    <span className="text-sm text-gray-400">{uploadPct}%</span>
                )}
                <input
                    ref={fileInput}
                    type="file"
                    className="hidden"
                    accept="audio/*"
                    onChange={e => e.target.files[0] && upload(e.target.files[0])}
                />
            </div>

            {files.length === 0 && <p className="text-gray-400">No tracks yet.</p>}

            <div className="space-y-5">
                {files.map(f => {
                    const isRenaming = renameId === f._id;

                    return (
                        <div key={f._id} className="bg-[#111827] p-4 rounded shadow space-y-3">
                            {isRenaming ? (
                                <div className="flex gap-2">
                                    <input
                                        className="flex-grow p-1 rounded bg-gray-800"
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                    />
                                    <button
                                        className="bg-blue-600 px-3 rounded hover:bg-blue-700"
                                        onClick={() => doRename(f._id)}
                                    >Save</button>
                                    <button
                                        className="bg-gray-600 px-3 rounded hover:bg-gray-700"
                                        onClick={() => { setRenameId(null); setNewName(''); }}
                                    >Cancel</button>
                                </div>
                            ) : (
                                <div
                                    className="cursor-pointer truncate"
                                    onClick={() =>
                                        setPlayingId(prev => prev === f._id ? null : f._id)
                                    }
                                >
                                    {f.filename}
                                    {f.isFavorite && <span className="text-yellow-400 text-xs ml-2">⭐ Favorite</span>}
                                    {f.session && <span className="text-purple-400 text-xs ml-2">(from session)</span>}
                                </div>
                            )}

                            {!isRenaming && (
                                <div className="flex gap-5 text-sm">
                                    <span
                                        className="text-blue-400 hover:underline cursor-pointer"
                                        onClick={() => {
                                            setRenameId(f._id);
                                            setNewName(f.filename.replace(/\.[^/.]+$/, ''));
                                        }}
                                    >Rename</span>

                                    <span
                                        className="text-green-400 hover:underline cursor-pointer"
                                        onClick={() => doDownload(f)}
                                    >Download</span>

                                    <span
                                        className="text-yellow-400 hover:underline cursor-pointer"
                                        onClick={() => attachToSession(f._id)}
                                    >Add to Session</span>

                                    <span
                                        className="text-red-400 hover:underline cursor-pointer"
                                        onClick={() => doDelete(f._id)}
                                    >Delete</span>
                                </div>
                            )}

                            {playingId === f._id && (
                                <AudioPlayer
                                    src={`${BASE}${f.path}`}
                                    onError={e => console.error('Playback error', e)}
                                    showJumpControls={false}
                                    customAdditionalControls={[]}
                                    customVolumeControls={[]}
                                    autoPlay
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
