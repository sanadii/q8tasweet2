import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { Card, CardHeader, CardBody } from "reactstrap";

const SERVER_BASE_URL = 'ws://127.0.0.1:8000/ws';
const PUBLIC_CHANNEL_URL = `${SERVER_BASE_URL}/GlobalChannel/public/`;
const PRIVATE_CHANNEL_URL = `${SERVER_BASE_URL}/GlobalChannel/private/`;

const READY_STATE_OPEN = 1;

const MessageType = {
    PUBLIC: 'public',
    PRIVATE: 'private',
};

const generateAsyncUrlGetter = (url, timeout = 2000) => () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(url);
        }, timeout);
    });
};

export const WebSocketChannels = () => {
    const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [inputtedMessage, setInputtedMessage] = useState('');
    const [messageType, setMessageType] = useState(null); // Store the message type

    const { sendMessage, lastMessage, readyState } = useWebSocket(
        currentSocketUrl,
        {
            share: true,
            shouldReconnect: () => false,
        }
    );

    const handleSendMessage = () => {
        if (readyState === READY_STATE_OPEN) {
            if (messageType) {
                const message = JSON.stringify({ type: messageType, message: inputtedMessage });
                sendMessage(message);
            } else {
                console.error('Message type is not set.');
            }
        } else {
            console.error('WebSocket connection is not open.');
        }
    };

    useEffect(() => {
        if (lastMessage !== null) {
            try {
                const data = JSON.parse(lastMessage.data);
                setMessageHistory(prev => [...prev, { type: data.type, message: data.message }]);
                console.log("lastMessage.data : ", lastMessage.data);
                console.log("lastMessage: ", lastMessage);
            } catch (e) {
                console.error("Error parsing message:", e);
            }
        }
    }, [lastMessage]);

    // Filter messages based on message type
    const allMessages = messageHistory;
    const privateMessages = messageHistory.filter((msg) => msg.type === MessageType.PRIVATE);
    const publicMessages = messageHistory.filter((msg) => msg.type === MessageType.PUBLIC);

    const connectionStatus = () => {
        switch (readyState) {
            case WebSocket.CONNECTING:
                return "Connecting...";
            case WebSocket.OPEN:
                return "Connected";
            case WebSocket.CLOSING:
                return "Disconnecting...";
            case WebSocket.CLOSED:
                return "Disconnected";
            default:
                return "Unknown State";
        }
    };

    return (
        <Card>
            <CardHeader>
                <h5>WebSocket</h5>
            </CardHeader>
            <CardBody>
                <div>
                    Whatever you send will be echoed from the Server
                    <div>
                        <input
                            type={'text'}
                            value={inputtedMessage}
                            onChange={(e) => setInputtedMessage(e.target.value)}
                        />
                        <button onClick={handleSendMessage} disabled={readyState !== READY_STATE_OPEN}>
                            Send
                        </button>
                    </div>
                    Select Socket Server:
                    <br />
                    <button
                        onClick={() => {
                            setCurrentSocketUrl(generateAsyncUrlGetter(PUBLIC_CHANNEL_URL));
                            setMessageType(MessageType.PUBLIC); // Set message type to public
                        }}
                        disabled={currentSocketUrl === PUBLIC_CHANNEL_URL}
                    >
                        PUBLIC CHANNEL
                    </button>
                    <button
                        onClick={() => {
                            setCurrentSocketUrl(generateAsyncUrlGetter(PRIVATE_CHANNEL_URL));
                            setMessageType(MessageType.PRIVATE); // Set message type to private
                        }}
                        disabled={currentSocketUrl === PRIVATE_CHANNEL_URL}
                    >
                        PRIVATE CHANNEL
                    </button>

                    <p>WebSocket Status: {connectionStatus()}</p>
                </div>
            </CardBody>
            {/* Display private, public, and all messages in separate columns */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                    <h6>Private Messages</h6>
                    <ul>
                        {privateMessages.map((msg, index) => (
                            <li key={index}>{msg.message}</li>
                        ))}
                    </ul>
                </div>
                <div style={{ flex: 1 }}>
                    <h6>Public Messages</h6>
                    <ul>
                        {publicMessages.map((msg, index) => (
                            <li key={index}>{msg.message}</li>
                        ))}
                    </ul>
                </div>
                <div style={{ flex: 1 }}>
                    <h6>All Messages</h6>
                    <ul>
                        {allMessages.map((msg, index) => (
                            <li key={index}>{msg.message}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </Card>
    );
};

export default WebSocketChannels;
