import React, { createContext, useState, useEffect } from 'react';
export const SocketContext = createContext(null);
const SOCKET_URL = "ws://127.0.0.1:8000/ws/"; // Replace with your WebSocket URL

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize WebSocket
    const newSocket = new WebSocket(SOCKET_URL);

    // Handle WebSocket open event
    newSocket.onopen = () => {
      console.log("WebSocket Connected");
    };

    // Handle WebSocket close event
    newSocket.onclose = (event) => {
      console.log("WebSocket Disconnected", event);
    };

    // Handle WebSocket errors
    newSocket.onerror = (error) => {
      console.error("WebSocket Error", error);
    };

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
