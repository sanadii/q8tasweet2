import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { Card, CardHeader, CardBody, Button, Input, FormGroup, Label, Col, Row } from 'reactstrap';

const SERVER_BASE_URL = 'ws://127.0.0.1:8000/ws/GlobalChannel';
const CHANNEL = 'GlobalChannel';

const getChannelUrl = (channel, timeout = 2000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`${SERVER_BASE_URL}/${CHANNEL}/${channel === 'global' ? '' : channel + '/'}`);
        }, timeout);
    });
};

const channels = [
    { channel: 'public' },
    { channel: 'private' },
    { channel: 'UmUXPn8A' },
    { channel: 'global' },


];

const READY_STATE_OPEN = 1;

export const WebSocketChannels = () => {
    const [sockets, setSockets] = useState({});

    const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [inputtedMessage, setInputtedMessage] = useState('');
    const [selectedChannel, setSelectedChannel] = useState(channels[0].channel);
    const [selectedType, setSelectedType] = useState('')


    // Connect to a new channel
    const connectToChannel = (channel) => {
        const channelUrl = `${SERVER_BASE_URL}/${channel}/`;
        if (!sockets[channel]) {
            const newSocket = new WebSocket(channelUrl);

            // Listen to WebSocket open event
            newSocket.onopen = () => {
                setSockets(prev => ({ ...prev, [channel]: newSocket }));
            };

            // Listen to WebSocket close event
            newSocket.onclose = () => {
                setSockets(prev => {
                    const prevSockets = { ...prev };
                    prevSockets[channel] = null; // or handle it as you see fit
                    return prevSockets;
                });
            };

            // Listen to WebSocket error event
            newSocket.onerror = (error) => {
                console.error(`WebSocket error on channel ${channel}:`, error);
                setSockets(prev => {
                    const prevSockets = { ...prev };
                    prevSockets[channel] = null; // or handle it as you see fit
                    return prevSockets;
                });
            };

            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessageHistory(prev => [...prev, { channel: data.channel, type: data.type, message: data.message }]);
            };
        }
    };



    const { sendMessage, lastMessage, readyState } = useWebSocket(currentSocketUrl, {
        share: true,
        shouldReconnect: () => false,
    });

    const handleSendMessage = () => {
        const socket = sockets[selectedChannel];
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ channel: selectedChannel, type: selectedType, message: inputtedMessage }));
        } else {
            console.error('WebSocket connection is not open.');
        }
    };


    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            setMessageHistory(prev => [...prev, { channel: data.channel, message: data.message }]);
        }
    }, [lastMessage]);


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


    const renderChannel = (channel) => {
        const isConnected = sockets[channel] && sockets[channel].readyState === WebSocket.OPEN;
        return (
            <Col md={3} key={channel}>
                <Card>
                    <CardHeader>
                        <h4>
                            {`${channel.charAt(0).toUpperCase() + channel.slice(1)} Channel`}
                        </h4>
                        <Button
                            color={determineChannelStatus(channel).class}
                            onClick={() => connectToChannel(channel)}

                        // onClick={async () => {
                        //     const url = await getChannelUrl(channel.channel);
                        //     setCurrentSocketUrl(url);
                        //     setMessageChannel(channel.channel);
                        // }}
                        // disabled={currentSocketUrl === `${SERVER_BASE_URL}/${CHANNEL}/${channel.channel === 'global' ? '' : channel.channel + '/'}`}
                        >
                            {determineChannelStatus(channel).text}
                        </Button>
                    </CardHeader>
                    <CardBody>
                        <h6>{channel.charAt(0).toUpperCase() + channel.slice(1)} Messages</h6>
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
                    <h5>Global Channel</h5>
                </CardHeader>
                <CardBody>
                    <FormGroup>
                        <Row>
                            <Col xxl={3} md={6}>
                                <Label>Message:</Label>
                                <Input
                                    channel="text"
                                    placeholder="Enter your message"
                                    value={inputtedMessage}
                                    onChange={(e) => setInputtedMessage(e.target.value)}
                                    className="me-2"
                                />
                            </Col>

                            <Col xxl={3} md={6}>
                                <Label>Type:</Label>
                                <Input
                                    type="select"
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="me-2"
                                >
                                    {channels.map((channel, index) => (
                                        <option key={index} value={channel.channel}>
                                            {channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1)}
                                        </option>
                                    ))}
                                </Input>
                            </Col>

                            <Col xxl={3} md={6}>
                                <Label>Channel:</Label>
                                <Input
                                    type="select"
                                    value={selectedChannel}
                                    onChange={(e) => setSelectedChannel(e.target.value)}
                                    className="me-2"
                                >
                                    {channels.filter(ch => sockets[ch.channel] && sockets[ch.channel].readyState === WebSocket.OPEN)
                                        .map((channel, index) => (
                                            <option key={index} value={channel.channel}>
                                                {channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1)}
                                            </option>
                                        ))}
                                </Input>
                            </Col>
                        </Row>
                        <div>
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
        </React.Fragment >
    );
};

export default WebSocketChannels;
