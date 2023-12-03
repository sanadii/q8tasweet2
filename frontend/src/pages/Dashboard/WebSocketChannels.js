import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { Card, CardHeader, CardBody, Button, Input, FormGroup, Label, Col, Row } from 'reactstrap';

const SERVER_BASE_URL = 'ws://127.0.0.1:8000/ws';
const GLOBAL_CHANNEL = 'GlobalChannel';

const getChannelUrl = (channel, timeout = 2000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`${SERVER_BASE_URL}/${GLOBAL_CHANNEL}/${channel === 'global' ? '' : channel + '/'}`);
        }, timeout);
    });
};

const channels = [
    { channel: 'public' },
    { channel: 'private' },
    { channel: 'special' },
    { channel: 'global' },
];

const READY_STATE_OPEN = 1;

export const WebSocketChannels = () => {
    const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [inputtedMessage, setInputtedMessage] = useState('');
    const [selectedMessageChannel, setselectedMessageChannel] = useState(channels[0].channel); // default to the first channel channel

    const [messageChannel, setMessageChannel] = useState('global');

    const { sendMessage, lastMessage, readyState } = useWebSocket(currentSocketUrl, {
        share: true,
        shouldReconnect: () => false,
    });

    const handleSendMessage = () => {
        if (readyState === READY_STATE_OPEN && selectedMessageChannel) {
            sendMessage(JSON.stringify({ channel: selectedMessageChannel, message: inputtedMessage }));
        } else {
            console.error('WebSocket connection is not open or message channel is not set.');
        }
    };

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            setMessageHistory(prev => [...prev, { channel: data.channel, message: data.message }]);
        }
    }, [lastMessage]);


    // Function to determine the status of each channel
    const determineChannelStatus = (channelChannel) => {
        const isConnected = readyState === WebSocket.OPEN && messageChannel === channelChannel;
        let statusText, statusClass;

        if (readyState === WebSocket.CONNECTING) {
            statusText = 'Connecting';
            statusClass = "info";
        } else if (readyState === WebSocket.CLOSING) {
            statusText = 'Closing';
            statusClass = "warning";
        } else if (isConnected) {
            statusText = 'Connected';
            statusClass = "success"; // Change this to "warning" for a warning color
        } else {
            statusText = 'Connect';
            statusClass = "danger"; // Change this to "danger" for a danger color
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
