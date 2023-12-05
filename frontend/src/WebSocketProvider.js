import React, { createContext, useContext, useCallback } from 'react';
import { useWebSocket } from 'hooks';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    // useWebSocket hook can be used here directly if it's intended to be the same for the whole app
    // const [socket, send] = useWebSocket('UmUXPn8A'); // Replace 'defaultType' with your default socket type
    const [socket, send] = useWebSocket('sorting', 'q8Elections');

    // If you need to create different socket connections based on type, consider creating a custom hook
    const createSocketConnection = useCallback((type) => {
        // Logic to create a new socket connection based on type
        // This could involve calling useWebSocket or other logic
    }, []);

    return (
        <WebSocketContext.Provider value={{ socket, send, createSocketConnection }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
