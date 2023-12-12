import React, { createContext, useState, useEffect } from 'react';

export const SocketContext = createContext(null);
const BASE_SOCKET_URL = "ws://127.0.0.1:8000/ws/"; // Base WebSocket URL

export const SocketProvider = ({ children, channel }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Construct WebSocket URL with the provided channel
    const socketUrl = `${BASE_SOCKET_URL}${channel}/`;

    // Initialize WebSocket
    const newSocket = new WebSocket(socketUrl);

    // Handle WebSocket open event
    newSocket.onopen = () => {
      console.log("WebSocket Connected to channel:", channel);
    };

    // Handle WebSocket close event
    newSocket.onclose = (event) => {
      console.log("WebSocket Disconnected from channel:", channel, event);
    };

    // Handle WebSocket errors
    newSocket.onerror = (error) => {
      console.error("WebSocket Error on channel:", channel, error);
    };

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [channel]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
