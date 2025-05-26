import { createContext } from 'react';

export const SessionFileContext = createContext({
    refreshToken: 0,
    triggerRefresh: () => {}
});
