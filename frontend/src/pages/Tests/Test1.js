const Test1 = () => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/Test/");
    
    socket.onopen = function (e) {
        console.log("[open] Connection established");
    };

    socket.onmessage = function (event) {
        console.log(`[message] Data received: ${event.data}`);
    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.error('[close] Connection died');
        }
    };

    socket.onerror = function (error) {
        console.error(`[error] ${error.message}`);
    };
};

export default Test1;
