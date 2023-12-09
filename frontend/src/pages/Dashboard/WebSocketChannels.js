import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { Card, CardHeader, CardBody, Button, Col, Row } from 'reactstrap';

// Form validation imports
import { FormFields } from "components"
import * as Yup from "yup";
import { useFormik } from "formik";
import { Form } from "reactstrap";

import { UncontrolledAlert } from 'reactstrap';
import { socketStyles, socketChannels, socketDataTypes, socketGroups } from "constants";

const SERVER_BASE_URL = 'ws://127.0.0.1:8000/ws';

const getChannelUrl = (channel, token, timeout = 2000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const urlWithToken = token ? `${SERVER_BASE_URL}/${channel}/?token=${token}` : `${SERVER_BASE_URL}/${channel}/`;
            resolve(urlWithToken);
        }, timeout);
    });
};




const READY_STATE_OPEN = 1;

export const WebSocketChannels = () => {
    const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [messageChannel, setMessageChannel] = useState('global');

    // Retrieve token from localStorage or cookies
    const authUserData = localStorage.getItem('authUser');

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA1NzExNzUwLCJpYXQiOjE3MDIxMTE3NTAsImp0aSI6ImU1YWY4NzVjM2ZlOTRjYzA4NWIyMmFmOWY3MDgyYjNiIiwidXNlcl9pZCI6MX0._MeTeLQRexjQTTrmS5D2lpf1-1y-OM7kVAwytjVGsxI";

    console.log("Retrieved Token: ", token); // Check if the token is printed correctly





    console.log("messageHistory: ", messageHistory);

    const { sendMessage, lastMessage, readyState } = useWebSocket(currentSocketUrl, {
        share: true,
        shouldReconnect: () => false,
        credentials: 'include',
        // token: // Add your token here and send it and use it in the backend?
    });
    console.log("lastMessage: ", lastMessage);



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


    // validation
    const validation = useFormik({
        initialValues: {
            dataType: '',
            group: '',
            messageStyle: '',
            message: '',
        },
        validationSchema: Yup.object({
            dataType: Yup.string().required("Data type is required"),
            group: Yup.string().required("Group type is required"),
            messageStyle: Yup.string().required("Notification type is required"),
            message: Yup.string().required("Message is required"),
        }),
        onSubmit: (values) => {
            if (readyState === READY_STATE_OPEN && messageChannel) {
                sendMessage(JSON.stringify({
                    channel: messageChannel,
                    group: values.group,
                    dataType: values.dataType,
                    messageStyle: values.messageStyle,
                    message: values.message
                }));
            } else {
                console.error('WebSocket connection is not open or message channel is not set.');
            }
            // validation.resetForm();
        },
    });

    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            console.log("data:", data)

            const dataType = data.dataType || validation.values.dataType;
            if (socketDataTypes.includes(dataType)) {
                setMessageHistory(prev => ({
                    ...prev,
                    [dataType]: [...(prev[dataType] || []), {
                        channel: data.channel,
                        group: data.group,
                        messageStyle: data.messageStyle,
                        message: data.message
                    }]
                }));
            }
        }
    }, [lastMessage, validation.values.dataType, socketDataTypes]);

    const fields = [
        {
            id: "data-type",
            name: "dataType",
            label: "Data Type",
            type: "select",
            options: socketDataTypes.map(dataType => ({
                id: dataType,
                label: dataType,
                value: dataType,
            })),
        },
        {
            id: "socket-groups",
            name: "group",
            label: "socketGroups",
            type: "select",
            options: [
                { id: '', label: '- Choose Group - ', value: '' },
                ...socketGroups.map(group => ({
                    id: group.id,
                    label: group.label,
                    value: group.value,
                }))
            ],
            condition: validation.values.dataType === "notification",
        },

        {
            id: "notification-type",
            name: "messageStyle",
            label: "Notification Type",
            type: "select",
            options: [
                { id: '', label: '- Choose Type - ', value: '' },
                ...socketStyles.map(messageStyle => ({
                    id: messageStyle.type,
                    label: messageStyle.type,
                    value: messageStyle.type,
                }))
            ],
            condition: validation.values.dataType === "notification",
        },
        {
            id: "message",
            name: "message",
            label: "Message",
            type: "text",
        },
    ].filter(Boolean);



    const renderChannelButtons = (channel) => {
        return (
            <Col md={2} key={channel}>
                <Button
                    color={determineChannelStatus(channel).class}
                    onClick={async () => {
                        const url = await getChannelUrl(channel, token); // Check if token is being passed
                        console.log("WebSocket URL: ", url); // Log the constructed URL
                        setCurrentSocketUrl(url);
                        setMessageChannel(channel);
                    }}
                    disabled={currentSocketUrl === `${SERVER_BASE_URL}/${channel}/?token=${token}`} // Include the token in the check
                >
                    {`${channel.charAt(0).toUpperCase() + channel.slice(1)} Channel`}
                </Button>
            </Col>
        );
    };



    const getNotificationDetails = (type) => {
        return socketStyles.find(nt => nt.type === type) || {};
    };


    const renderDataTypeMessages = (dataTypeName) => {
        const messages = messageHistory[dataTypeName] || [];

        return (
            <Col md={3} key={dataTypeName}>
                <Card>
                    <CardHeader>
                        <h4>{`${dataTypeName.charAt(0).toUpperCase() + dataTypeName.slice(1)} Messages`}</h4>
                    </CardHeader>
                    <CardBody>
                        {
                            messages.map((msg, idx) => {
                                const notificationDetails = getNotificationDetails(msg.messageStyle);

                                return (
                                    <UncontrolledAlert
                                        key={idx}
                                        color={notificationDetails.color}
                                        className={`${notificationDetails.className} fade show`}>
                                        <i className={`${notificationDetails.iconClass} label-icon`}></i>
                                        <strong>{notificationDetails.label}</strong> - {msg.message}
                                    </UncontrolledAlert>
                                );
                            })
                        }
                    </CardBody>
                </Card>
            </Col>
        );
    };




    return (
        <React.Fragment>
            <Card>
                <CardHeader><h5>Global Channel</h5></CardHeader>
                <CardBody>
                    <Form onSubmit={validation.handleSubmit}>
                        <Row>
                            {
                                fields.map(field => {
                                    return (field.condition === undefined || field.condition) && (
                                        <FormFields
                                            key={field.id}
                                            field={field}
                                            validation={validation}
                                            inLineStyle={true}
                                        />
                                    );
                                })
                            }                        </Row>
                        <Row className="mt-2">
                            <Col>
                                <Button color="primary" type="submit">
                                    Send Message
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>


            <Card>
                <CardHeader>
                    <h4>Servers</h4>
                    <CardBody>
                        <Row>
                            {socketChannels.map((channelName) => renderChannelButtons(channelName))}
                        </Row>
                    </CardBody>
                </CardHeader>
            </Card>


            <Row>
                {socketDataTypes.map((dataTypeName) => renderDataTypeMessages(dataTypeName))}
            </Row>


        </React.Fragment >
    );
};

export default WebSocketChannels;