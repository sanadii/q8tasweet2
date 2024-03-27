import React, { createContext, useContext, useState, useEffect } from 'react';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Define the WebSocket URL
        const socketUrl = `ws://127.0.0.1:8000/ws/sorting/UmUXPn8A/`;

        // Create a new WebSocket connection
        const newSocket = new WebSocket(socketUrl);
        newSocket.onopen = () => setSocket(newSocket);
        newSocket.onclose = () => setSocket(null);
        // Add additional event handlers (message, error, etc.) as needed

        // Cleanup function
        return () => {
            newSocket.close();
        };
    }, []); // Empty dependency array to run only once

    const send = (data) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(data);
        }
    };

    return (
        <WebSocketContext.Provider value={{ socket, send }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => useContext(WebSocketContext);
