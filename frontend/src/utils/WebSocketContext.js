import React, { createContext, useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { getToken } from 'helpers/api_helper';

const WebSocketContext = createContext(null);
export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children, channel, slug, uuid }) => {
    const token = getToken();
    const [socketUrl, setSocketUrl] = useState(null);

    useEffect(() => {
        const baseUrl = 'ws://127.0.0.1:8000/ws';
        if (channel === 'campaigns') {
            setSocketUrl(`${baseUrl}/${channel}/${slug}/?token=${token}`);

        } else if (channel === 'chat') {
            setSocketUrl(`${baseUrl}/${channel}/${uuid}/?token=${token}`);

        } else if (channel === 'global') {
            setSocketUrl(`${baseUrl}/${channel}/?token=${token}`);

        } else {
            // Default case if neither slug nor uuid is provided
            setSocketUrl(`${baseUrl}/${channel}/?token=${token}`);
        }
    }, [channel, slug, uuid, token]); // Add uuid to dependency array

    const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl, {
        shouldReconnect: () => false,
        onOpen: () => console.log("WebSocket Connected"),
        onClose: () => console.log("WebSocket Disconnected"),
        filter: () => socketUrl !== ''
    });

    return (
        <WebSocketContext.Provider value={{ sendMessage, lastMessage, readyState }}>
            {children}
        </WebSocketContext.Provider>
    );
};
