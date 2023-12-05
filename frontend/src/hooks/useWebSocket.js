// Websocket is to be used for 

// General --
// Notifications [ /ws/notifications ]
// Chatting [ /ws/chat/uuid ]

// Election -- [ ws/election/<str:socketUrl>/ ]
// Sorting
// Chatting

// Campaigns -- [ ws/campaigns/<str:socketUrl> ]
// Sorting Votes
// Updating Guarantees/Attendees
// Chatting [ /ws/chat/campaignSlug ]

import { useState, useEffect, useCallback } from 'react';

const BASE_URL = 'ws://127.0.0.1:8000/ws';

const useWebSocket = (socketUrl = '', handleMessage) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fullPath = socketUrl ? `${BASE_URL}/${socketUrl}/` : BASE_URL;
        const newSocket = new WebSocket(fullPath);

        newSocket.onmessage = handleMessage;

        newSocket.onopen = () => {
            setSocket(newSocket);
        };

        // Handle other events (close, error) as needed

        return () => {
            newSocket.close();
        };
    }, [socketUrl, handleMessage]);

    const send = useCallback((data) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(data);
        }
    }, [socket]);

    return [socket, send];
};


export { useWebSocket };
