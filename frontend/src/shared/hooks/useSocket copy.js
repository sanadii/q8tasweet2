import { useState, useEffect, useCallback } from 'react';

const BASE_URL = 'ws://127.0.0.1:8000/ws';

const useWebSocket = (type = '', slug = '', handleMessage) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const fullPath = type && slug ? `${BASE_URL}/${type}/${slug}/` : BASE_URL;
        const newSocket = new WebSocket(fullPath);

        newSocket.onmessage = handleMessage;

        newSocket.onopen = () => {
            setSocket(newSocket);
        };

        // Handle other events (close, error) as needed

        return () => {
            newSocket.close();
        };
    }, [type, slug, handleMessage]);

    const send = useCallback((data) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(data);
        }
    }, [socket]);

    return [socket, send];
};


export { useWebSocket };
