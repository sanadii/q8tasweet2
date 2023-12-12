import React, { createContext, useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useParams } from "react-router-dom";
import { getToken } from 'helpers/api_helper';
const WebSocketContext = createContext(null);

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const { slug } = useParams();

    // WebSocket URL
    const [socketUrl, setSocketUrl] = useState(null);
    const token = getToken();


    useEffect(() => {
        if (slug) {
            setSocketUrl(`ws://127.0.0.1:8000/ws/campaigns/${slug}/?token=${token}`);
        }
    }, [slug]);

    const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl, {
        shouldReconnect: (closeEvent) => true, // Automatically reconnect
        onOpen: () => console.log("WebSocket Connected"),
        onClose: () => console.log("WebSocket Disconnected"),
        filter: () => socketUrl !== '' // Only connect when socketUrl is not empty
    });

    useEffect(() => {
        if (lastMessage !== null) {
            // Process the message received
            console.log("Received a message from WebSocket:", lastMessage.data);
        }
    }, [lastMessage]);


    return (
        <WebSocketContext.Provider value={{ sendMessage, lastMessage, readyState }}>
            {children}
        </WebSocketContext.Provider>
    );
};
