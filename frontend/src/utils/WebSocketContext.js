import React, { createContext, useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { getToken } from 'helpers/api_helper';

const WebSocketContext = createContext(null);
export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children, channel }) => {
    const token = getToken();
    const [socketUrl, setSocketUrl] = useState(null);

    useEffect(() => {
        if (channel) {
            const baseUrl = 'ws://127.0.0.1:8000/ws';
            setSocketUrl(`${baseUrl}/${channel}/?token=${token}`);
        }
    }, [channel, token]);

    const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl, {
        shouldReconnect: () => false,
        onOpen: () => console.log("WebSocket Connected"),
        onClose: () => console.log("WebSocket Disconnected"),
        filter: () => socketUrl !== ''
    });

    useEffect(() => {
        if (lastMessage !== null) {
            console.log("Received a message from WebSocket:", lastMessage.data);
        }
    }, [lastMessage]);

    return (
        <WebSocketContext.Provider value={{ sendMessage, lastMessage, readyState }}>
            {children}
        </WebSocketContext.Provider>
    );
};
