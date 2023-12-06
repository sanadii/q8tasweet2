import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, Button, Input, FormGroup, Label, Col, Row } from 'reactstrap';

const SERVER_BASE_URL = 'ws://127.0.0.1:8000/ws/GlobalChannel';

const channels = [
    { channel: 'public' },
    { channel: 'private' },
    { channel: 'UmUXPn8A' },
    { channel: 'global' },
];

export const WebSocketChannels = () => {
    const [sockets, setSockets] = useState({});
    const [messageHistory, setMessageHistory] = useState([]);
    const [inputtedMessage, setInputtedMessage] = useState('');
    const [selectedChannel, setSelectedChannel] = useState(channels[0].channel);

    // Connect to a new channel
    const connectToChannel = (channel) => {
        const channelUrl = `${SERVER_BASE_URL}/${channel}/`;
        if (!sockets[channel]) {
            const newSocket = new WebSocket(channelUrl);
            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessageHistory(prev => [...prev, { channel: data.channel, message: data.message }]);
            };
            setSockets(prev => ({ ...prev, [channel]: newSocket }));
        }
    };

    // Handle sending a message
    const handleSendMessage = () => {
        const socket = sockets[selectedChannel];
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ channel: selectedChannel, message: inputtedMessage }));
        } else {
            console.error('WebSocket connection is not open.');
        }
    };

    // UI for each channel
    const renderChannel = (channel) => {
        const isConnected = sockets[channel] && sockets[channel].readyState === WebSocket.OPEN;
        return (
            <Col md={3} key={channel}>
                <Card>
                    <CardHeader>
                        <h4>{`${channel.charAt(0).toUpperCase() + channel.slice(1)} Channel`}</h4>
                        <Button
                            color={isConnected ? "success" : "secondary"}
                            onClick={() => connectToChannel(channel)}
                        >
                            {isConnected ? 'Connected' : 'Connect'}
                        </Button>
                    </CardHeader>
                    <CardBody>
                        <h6>{`${channel.charAt(0).toUpperCase() + channel.slice(1)} Messages`}</h6>
                        <ul>
                            {messageHistory.filter(msg => msg.channel === channel).map((msg, idx) => (
                                <li key={idx}>{msg.message}</li>
                            ))}
                        </ul>
                    </CardBody>
                </Card>
            </Col>
        );
    };

    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <h5>Send Message</h5>
                </CardHeader>
                <CardBody>
                    <FormGroup>
                        <Label>Message:</Label>
                        <div className="input-group">
                            <Input
                                type="text"
                                placeholder="Enter your message"
                                value={inputtedMessage}
                                onChange={(e) => setInputtedMessage(e.target.value)}
                                className="me-2"
                            />
                            <Input
                                type="select"
                                value={selectedChannel}
                                onChange={(e) => setSelectedChannel(e.target.value)}
                                className="me-2"
                            >
                                {channels.map((ch, index) => (
                                    <option key={index} value={ch.channel}>
                                        {ch.channel.charAt(0).toUpperCase() + ch.channel.slice(1)}
                                    </option>
                                ))}
                            </Input>
                            <Button color="primary" onClick={handleSendMessage}>
                                Send Message
                            </Button>
                        </div>
                    </FormGroup>
                </CardBody>
            </Card>

            <Row>
                {channels.map(({ channel }) => renderChannel(channel))}
            </Row>
        </React.Fragment>
    );
};

export default WebSocketChannels;
