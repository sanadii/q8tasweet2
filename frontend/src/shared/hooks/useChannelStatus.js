// useChannelStatuses.js
import { useEffect, useState } from 'react';

export const useChannelStatuses = (channels, readyState, messageChannel) => {
    const [channelStatuses, setChannelStatuses] = useState({});

    useEffect(() => {
        const newStatuses = {};
        channels.forEach(channel => {
            newStatuses[channel] = determineChannelStatus(channel, readyState, messageChannel);
        });
        setChannelStatuses(newStatuses);
    }, [channels, readyState, messageChannel]);

    return channelStatuses;
};

const determineChannelStatus = (channel, readyState, messageChannel) => {
    const isConnected = readyState === WebSocket.OPEN && messageChannel === channel;
    let statusText, statusClass;

    if (readyState === WebSocket.CONNECTING) {
        statusText = 'Connecting';
        statusClass = "info";
    } else if (readyState === WebSocket.CLOSING) {
        statusText = 'Closing';
        statusClass = "warning";
    } else if (isConnected) {
        statusText = 'Connected';
        statusClass = "success";
    } else {
        statusText = 'Connect';
        statusClass = "danger";
    }

    return { text: statusText, class: statusClass };
};

export default useChannelStatuses;
