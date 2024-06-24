import { useState, useEffect, useCallback } from 'react';
const BASE_URL = 'ws://127.0.0.1:8000/ws';

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

const useWebSocket = (socketUrl = '', handleMessage) => {
    const [socket, setSocket] = useState(null);
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA1NzExNzUwLCJpYXQiOjE3MDIxMTE3NTAsImp0aSI6ImU1YWY4NzVjM2ZlOTRjYzA4NWIyMmFmOWY3MDgyYjNiIiwidXNlcl9pZCI6MX0._MeTeLQRexjQTTrmS5D2lpf1-1y-OM7kVAwytjVGsxI";

    useEffect(() => {
        const fullPath = socketUrl ? `${BASE_URL}/${socketUrl}/?token=${token}` : BASE_URL;
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
