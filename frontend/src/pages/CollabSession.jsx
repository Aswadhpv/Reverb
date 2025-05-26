import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import SessionInfo from '../components/collab/SessionInfo';
import UploadPanel from '../components/collab/UploadPanel';
import EditorBar from '../components/collab/EditorBar';
import PluginRack from '../components/collab/PluginRack';
import ChatPanel from '../components/collab/ChatPanel';
import InviteButton from '../components/collab/InviteButton';
import SaveDownloadPanel from '../components/collab/SaveDownloadPanel';
import bgImage from '../assets/session-bg.jpg';
import { SessionFileContext } from '../context/SessionFileContext';

const CollabSession = () => {
    const { id } = useParams();
    const [refreshToken, setRefreshToken] = useState(0);
    const triggerRefresh = () => setRefreshToken(prev => prev + 1);

    return (
        <SessionFileContext.Provider value={{ refreshToken, triggerRefresh }}>
            <div
                className="session-room"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    minHeight: '100vh',
                    padding: '20px',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}
            >
                <SessionInfo />
                <InviteButton sessionId={id} />
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <UploadPanel sessionId={id} />
                        <PluginRack sessionId={id} />
                    </div>
                    <div style={{ flex: 2 }}>
                        <EditorBar sessionId={id} />
                        <SaveDownloadPanel sessionId={id} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <ChatPanel sessionId={id} />
                    </div>
                </div>
            </div>
        </SessionFileContext.Provider>
    );
};

export default CollabSession;
