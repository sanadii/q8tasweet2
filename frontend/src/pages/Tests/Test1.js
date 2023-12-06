import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Card, Container, CardHeader, CardBody, Button, Row, Col } from "reactstrap";

const SOCKET_URL_ONE = 'wss://echo.websocket.events';
const SOCKET_URL_TWO = 'wss://demos.kaazing.com/echo';
const READY_STATE_OPEN = 1;

const generateAsyncUrlGetter =
    (url, timeout = 2000) =>
        () => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(url);
                }, timeout);
            });
        };

const Test1 = () => {
    const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
    const [messageHistory, setMessageHistory] = useState([]);
    const [inputtedMessage, setInputtedMessage] = useState('');
    const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
        currentSocketUrl,
        {
            share: true,
            shouldReconnect: () => false,
        }
    );

    useEffect(() => {
        lastMessage && setMessageHistory((prev) => prev.concat(lastMessage.data));
    }, [lastMessage]);

    const readyStateString = {
        0: 'CONNECTING',
        1: 'OPEN',
        2: 'CLOSING',
        3: 'CLOSED',
    }[readyState];

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card>

                                <CardHeader>
                                    <h4>WebSocket</h4>
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
                                            <button
                                                onClick={() => sendMessage(inputtedMessage)}
                                                disabled={readyState !== READY_STATE_OPEN}
                                            >
                                                Send
                                            </button>
                                        </div>
                                        Select Socket Server:
                                        <br />
                                        <button
                                            onClick={() =>
                                                setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_ONE))
                                            }
                                            disabled={currentSocketUrl === SOCKET_URL_ONE}
                                        >
                                            {SOCKET_URL_ONE}
                                        </button>
                                        <button
                                            onClick={() =>
                                                setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_TWO))
                                            }
                                            disabled={currentSocketUrl === SOCKET_URL_TWO}
                                        >
                                            {SOCKET_URL_TWO}
                                        </button>
                                        <br />
                                        ReadyState: {readyStateString}
                                        <br />
                                        MessageHistory: {messageHistory.join(', ')}
                                    </div>                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Test1;