const express = require('express');
const app = express();
const server = require('http').createServer(app) ;
const path = require('path');
const {ExpressPeerServer} = require('peer')

const peerServer = ExpressPeerServer(server, {
    debug:true,
    proxied:true,
    ssl : {},
    path:'/myapp'

})

app.use(peerServer);
app.use(express.static(__dirname));

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html");

});

server.listen(3000, ()=> {
    console.log("Listening on port http://localhost:3000")
})