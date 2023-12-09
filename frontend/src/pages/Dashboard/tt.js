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
    'Global',
    'Elections',
    'Campaign',
    'Candidate',
    'Chat',
];

const dataTypes = [
    'notification',
    'electionSort',
    'campaignUpdate',
    'Chat',
];


const READY_STATE_OPEN = 1;

export const WebSocketChannels = () => {
    const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [inputtedMessage, setInputtedMessage] = useState('');
    const [selectedChannel, setSelectedChannel] = useState(channels[0].channel); // default to the first channel channel
    const [selectedDataType, setSelectedDataType] = useState(dataTypes[0]);

    const [messageChannel, setMessageChannel] = useState('global');

    const { sendMessage, lastMessage, readyState } = useWebSocket(currentSocketUrl, {
        share: true,
        shouldReconnect: () => false,
    });

    const handleSendMessage = () => {
        if (readyState === READY_STATE_OPEN && selectedChannel) {
            sendMessage(JSON.stringify({
                channel: selectedChannel,
                dataType: selectedDataType,
                message: inputtedMessage
            }));
        } else {
            console.error('WebSocket connection is not open or message channel is not set.');
        }
    };

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            const dataType = data.dataType || selectedDataType; // Fallback to selectedDataType if not provided

            setMessageHistory(prev => {
                const newState = { ...prev };

                if (!newState[dataType]) {
                    newState[dataType] = [];
                }

                newState[dataType].push({
                    channel: data.channel,
                    message: data.message
                });

                return newState;
            });
        }
    }, [lastMessage, selectedDataType]);

    console.log("messageHistory: ", messageHistory);


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


    const renderChannel = (channel) => {
        return (
            <Col md={2} key={channel}>
                <Button
                    color={determineChannelStatus(channel).class}
                    onClick={async () => {
                        const url = await getChannelUrl(channel);
                        setCurrentSocketUrl(url);
                        setMessageChannel(channel);
                        setSelectedChannel(channel); // Update the selected channel
                    }}
                    disabled={currentSocketUrl === `${SERVER_BASE_URL}/${GLOBAL_CHANNEL}/${channel === 'global' ? '' : channel + '/'}`}
                >
                    {`${channel.charAt(0).toUpperCase() + channel.slice(1)} Channel`}
                </Button>
            </Col>
        );
    };


    const renderDataType = (dataTypeName) => {
        const messages = messageHistory[dataTypeName] || []; // Fallback to empty array if no messages

        return (
            <Col md={3} key={dataTypeName}>
                <Card>
                    <CardHeader>
                        <h4>{`${dataTypeName.charAt(0).toUpperCase() + dataTypeName.slice(1)} Messages`}</h4>
                    </CardHeader>
                    <CardBody>
                        <ul>
                            {messages.map((msg, idx) => (
                                <li key={idx}>
                                    <strong>{msg.channel}</strong> {msg.message}
                                </li>
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
                            <Col md={3}>

                                <Label>Message:</Label>
                                <Input
                                    channel="text"
                                    placeholder="Enter your message"
                                    value={inputtedMessage}
                                    onChange={(e) => setInputtedMessage(e.target.value)}
                                    className="me-2"
                                />
                            </Col>
                            <Col md={3}>
                                <Label>Data Type:</Label>
                                <Input
                                    type="select"
                                    value={selectedDataType}
                                    onChange={(e) => setSelectedDataType(e.target.value)}
                                >
                                    {dataTypes.map((dataType, index) => (
                                        <option key={index} value={dataType}>{dataType}</option>
                                    ))}
                                </Input>
                            </Col>
                        </Row>
                        <Row>
                            <Button color="primary" onClick={handleSendMessage}>
                                Send Message
                            </Button>
                        </Row>
                    </FormGroup>
                </CardBody>
            </Card>

            <Card>
                <CardHeader>
                    <h4>Servers</h4>
                    <CardBody>
                        <Row>
                            {channels.map((channelName) => renderChannel(channelName))}
                        </Row>
                    </CardBody>
                </CardHeader>
            </Card>


            <Row>
                {dataTypes.map((dataTypeName) => renderDataType(dataTypeName))}
            </Row>


        </React.Fragment >
    );
};

export default WebSocketChannels;