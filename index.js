console.clear();

const HTTP=require("http");
const WEBSOCKET_SERVER=require("websocket").server;

const server=HTTP.createServer(function(requestObj,responder){
    console.log("server rquest in");
    let requestBody = "";
    requestObj.on("data", function (data) {
        requestBody += data;
        /*if (requestBody.length > 1e6) {
            requestObj.socket.destroy();
        }*/
    });
    requestObj.on("end", function () {
        console.log("forwarding to "+websocketServer.connections.length+" websocket connections");
        for(const connection of websocketServer.connections){
            connection.send(JSON.stringify({
                "method":requestObj.method,
                "url":requestObj.url,
                "headers":requestObj.headers,
                "body":requestBody,
            }));
        }
        responder.setHeader('Access-Control-Allow-Origin', '*');
        responder.end("OK");
    });
    
});

const websocketServer=new WEBSOCKET_SERVER({
    httpServer:server,
    autoAcceptConnections:false,
});


websocketServer.on("request",function(requestObj){
    const connection = requestObj.accept(null, requestObj.origin);
    console.log("ws connection opened");

    connection.on("close", function (reasonCode, description) {
        console.log("ws connection closed");
    });
    connection.on("error", function () {
        console.log("ws connection errored");
    });
});

server.listen(process.env.PORT||8000,function(){
    console.log("listening at "+server.address().port);
});