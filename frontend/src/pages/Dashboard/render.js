import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { Card, CardHeader, CardBody, Button, Input, FormGroup, Label, Col, Row } from 'reactstrap';

const SERVER_BASE_URL = 'ws://127.0.0.1:8000/ws/GlobalChannel';
const CHANNEL = 'GlobalChannel';

const channels = ['Elections', 'Campaign', 'Candidate', 'Global'];
// const dataTypes = ['votting', 'updatting', 'notifications'];
const dataTypes = ['info', 'success', 'warning', 'danger'];

export const WebSocketChannels = () => {
    const [sockets, setSockets] = useState({});
    const [messageHistory, setMessageHistory] = useState([]);
    const [inputtedMessage, setInputtedMessage] = useState('');
    const [selectedChannelServer, setSelectedChannelServer] = useState(channels[0]);
    const [selectedChannelReceiver, setSelectedChannelReceiver] = useState(channels[0]);
    const [selectedDataType, setSelectedDataType] = useState(dataTypes[0]);


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
                    prevSockets[channel] = null;
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
                const channel = data.channel;
                const dataType = data.dataType;
                const message = data.message;

                setMessageHistory(prev => {
                    // Clone the previous state
                    const newState = { ...prev };

                    // Initialize the channel if not already done
                    if (!newState[channel]) {
                        newState[channel] = {};
                    }

                    // Initialize the dataType array if not already done
                    if (!newState[channel][dataType]) {
                        newState[channel][dataType] = [];
                    }

                    // Append the new message
                    newState[channel][dataType].push({ message });

                    return newState;
                });
            };



            // newSocket.onmessage = (event) => {
            //     const data = JSON.parse(event.data);
            //     const receivingChannel = extractChannelName(event.currentTarget.url);

            //     // const socket = JSON.parse(event.currentTarget);
            //     console.log("event: ", event)
            //     console.log("321. currentTarget: ", event.currentTarget)
            //     console.log("321. url: ", event.currentTarget.url)
            //     console.log("data: ", data)
            //     // console.log("socket: ", socket)

            //     setMessageHistory(prev => [...prev, {
            //         // socket: socket,
            //         // channelSending
            //         // channelReceiving
            //         // channelReceiver(s)

            //         // to be removed later
            //         channel: data.channel, // the channelServer
            //         receivingChannel: receivingChannel, // just to do filtering in my testing

            //         // Routes: To whom the msg to be sent
            //         rout: data.rout,


            //         channelReceiver: selectedChannelReceiver,
            //         dataType: selectedDataType,
            //         dataType: data.dataType, // Use dataType from the message
            //         message: data.message,
            //     }]);
            // };
        }
    };

    const extractChannelName = (url) => {
        const parts = url.split('/');
        // Assuming the channel name is always the last part of the path in the URL
        return parts[parts.length - 2]; // -2 because the URL ends with '/', so the last element is an empty string
    };



    const handleSendMessage = () => {
        const socket = sockets[selectedChannelServer];
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                channel: selectedChannelServer,
                channelReceiver: selectedChannelReceiver,
                dataType: selectedDataType,
                message: inputtedMessage
            }));
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
    console.log("messageHistory: ", messageHistory)

    const renderChannel = (channelName) => {
        const isConnected = sockets[channelName] && sockets[channelName].readyState === WebSocket.OPEN;
    
        return (
            <Col md={3} key={channelName}>
                <Card>
                    <CardHeader>
                        <h4>{`${channelName.charAt(0).toUpperCase() + channelName.slice(1)} Channel`}</h4>
                        <Button
                            color={determineChannelStatus(channelName).class}
                            onClick={() => connectToChannel(channelName)}
                        >
                            {determineChannelStatus(channelName).text}
                        </Button>
                    </CardHeader>
                    <CardBody>
                        <h6>{channelName.charAt(0).toUpperCase() + channelName.slice(1)} Messages</h6>
                        <ul>
                            {messageHistory[channelName] && Object.entries(messageHistory[channelName]).map(([dataType, messages]) => (
                                <React.Fragment key={dataType}>
                                    {messages.map((msg, idx) => (
                                        <li className="mb-2" key={idx}>
                                            <strong className={`bg-${dataType} p-2`}>[{channelName}]</strong> {msg.message}
                                        </li>
                                    ))}
                                </React.Fragment>
                            ))}
                        </ul>
                    </CardBody>
                </Card>
            </Col>
        );
    };
    
    


    console.log("messageHistory: ", messageHistory)

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
                                    type="text"
                                    placeholder="Enter your message"
                                    value={inputtedMessage}
                                    onChange={(e) => setInputtedMessage(e.target.value)}
                                />
                            </Col>

                            <Col md={3}>
                                <Label>Type:</Label>
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
                            <Col md={3}>
                                <Label>Channel Server:</Label>
                                <Input
                                    type="select"
                                    value={selectedChannelServer}
                                    onChange={(e) => setSelectedChannelServer(e.target.value)}
                                    className="me-2"

                                >
                                    {channels.filter(channel => sockets[channel] && sockets[channel].readyState === WebSocket.OPEN)
                                        .map((channel, index) => (
                                            <option key={index} value={channel}>{channel}</option>
                                        ))}
                                </Input>
                            </Col>
                            <Col md={3}>
                                <Label>Send To:</Label>
                                <Input
                                    type="select"
                                    value={selectedChannelReceiver}
                                    onChange={(e) => setSelectedChannelReceiver(e.target.value)}
                                    className="me-2"

                                >
                                    {channels.map((channel, index) => (
                                        <option key={index} value={channel}>{channel}</option>
                                    ))}
                                </Input>
                            </Col>

                        </Row>
                        <Button color="primary" onClick={handleSendMessage}>
                            Send Message
                        </Button>
                    </FormGroup>
                </CardBody>
            </Card>


            <Row>
                {channels.map((channelName) => renderChannel(channelName))}

            </Row>
        </React.Fragment >
    );
};

export default WebSocketChannels;
