import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { Card, CardHeader, CardBody, Button, Input, FormGroup, Label, Col, Row } from 'reactstrap';

const SERVER_BASE_URL = 'ws://127.0.0.1:8000/ws/GlobalChannel';
const CHANNEL = 'GlobalChannel';

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

            newSocket.onopen = () => {
                setSockets(prev => ({ ...prev, [channel]: newSocket }));
            };

            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessageHistory(prev => [...prev, { channel: data.channel, message: data.message }]);
            };

            newSocket.onclose = () => {
                setSockets(prev => {
                    const prevSockets = { ...prev };
                    delete prevSockets[channel];
                    return prevSockets;
                });
            };
        }
    };

    const handleSendMessage = () => {
        const socket = sockets[selectedChannel];
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ channel: selectedChannel, message: inputtedMessage }));
            setInputtedMessage(''); // Clear the input after sending
        } else {
            console.error('WebSocket connection is not open.');
        }
    };

    // Function to determine the status of each channel
    const determineChannelStatus = (channel) => {
        const socket = sockets[channel];
        let statusText, statusClass;

        if (socket) {
            switch (socket.readyState) {
                case WebSocket.CONNECTING:
                    statusText = 'Connecting';
                    statusClass = "info";
                    break;
                case WebSocket.OPEN:
                    statusText = 'Connected';
                    statusClass = "success";
                    break;
                case WebSocket.CLOSING:
                    statusText = 'Closing';
                    statusClass = "warning";
                    break;
                case WebSocket.CLOSED:
                    statusText = 'Disconnected';
                    statusClass = "danger";
                    break;
                default:
                    statusText = 'Unknown';
                    statusClass = "secondary";
                    break;
            }
        } else {
            statusText = 'Connect';
            statusClass = "secondary"; // No connection attempt yet
        }

        return {
            text: statusText,
            class: statusClass,
        };
    };

    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <h5>Global Channel</h5>
                </CardHeader>
                <CardBody>
                    <FormGroup>
                        <Label>Message:</Label>
                        <div className="input-group">
                            <Input
                                channel="text"
                                placeholder="Enter your message"
                                value={inputtedMessage}
                                onChange={(e) => setInputtedMessage(e.target.value)}
                                className="me-2"
                            />
                            <Input
                                type="select"
                                value={selectedMessageChannel}
                                onChange={(e) => setselectedMessageChannel(e.target.value)}
                                className="me-2"
                            >
                                {channels.map((channel, index) => (
                                    <option key={index} value={channel.channel}>
                                        {channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1)}
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
                {channels.map((channel) => (
                    <Col md={3} key={channel.channel}>
                        <Card>
                            <CardHeader>
                                <h4>
                                    {`${channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1)} Channel`}
                                </h4>
                                <Button
                                    color={determineChannelStatus(channel.channel).class}
                                    onClick={async () => {
                                        const url = await getChannelUrl(channel.channel);
                                        setCurrentSocketUrl(url);
                                        setMessageChannel(channel.channel);
                                    }}
                                    disabled={currentSocketUrl === `${SERVER_BASE_URL}/${GLOBAL_CHANNEL}/${channel.channel === 'global' ? '' : channel.channel + '/'}`}
                                >
                                    {determineChannelStatus(channel.channel).text}
                                </Button>
                            </CardHeader>
                            <CardBody>
                                <h6>{channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1)} Messages</h6>
                                <ul>
                                    {messageHistory.filter(msg => msg.channel === channel.channel).map((msg, idx) => (
                                        <li key={idx}>{msg.message}</li>
                                    ))}
                                </ul>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </React.Fragment >
    );
};

export default WebSocketChannels;
