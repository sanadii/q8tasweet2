import React, { createContext, useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { getToken } from 'helpers/api_helper';

const WebSocketContext = createContext(null);

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children, channel, slug, uuid }) => {
    const token = getToken();
    const [socketUrl, setSocketUrl] = useState(null);
    const [notificationHistory, setNotificationHistory] = useState([]);

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
    }, [channel, slug, uuid, token]);

    const { lastMessage, readyState, sendMessage } = useWebSocket(socketUrl, {
        shouldReconnect: () => false,
        onOpen: () => console.log("WebSocket Connected"),
        onClose: () => console.log("WebSocket Disconnected"),
        filter: () => socketUrl !== ''
    });

    // Handle incoming WebSocket messages
    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            console.log("data:", data)
            console.log("notificationHistory: ", notificationHistory)

            // Check if the message was sent by you to avoid processing it again
            const dataType = data.dataType
            setNotificationHistory(prev => ({
                ...prev,
                [dataType]: [...(prev[dataType] || []), {
                    notificationGroup: data.notificationGroup,
                    messageType: data.messageType,
                    campaign: data.campaign,
                    message: data.message
                }]
            }));

        }
    }, [lastMessage]);

    const contextValue = {
        sendMessage,
        lastMessage,
        readyState,
        notificationHistory,
        setNotificationHistory
    };

    return (
        <WebSocketContext.Provider value={contextValue}>
            {children}
        </WebSocketContext.Provider>
    );
};
