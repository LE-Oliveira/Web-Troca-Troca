require('dotenv').config();

const appWs = require('./app-ws')
const routes = require('./routes/routes')
const mongoString = process.env.DATABASE_URL;
const express = require('express');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const cors = require("cors");
const app = express();

app.use('/api', routes);
app.use('/img', express.static('static'));

mongoose.connect(mongoString);

const database = mongoose.connection;
database.on('error', (error) =>{console.log(error);})
database.once('connected', ()=>{console.log('Banco de Dados conectado');})

const wss = new WebSocket.Server(
    "localhost:8000",
    function () {console.log("Iniciando websocket na porta 8080");}
);
wss.on("connection", function connection(ws) {
    console.log("New connection");
    ws.on("message", async function incoming(message) {
      var msg = JSON.parse(message);
      switch (msg.type) {
        case "login":
          //console.log("Login");
          routes.login(ws);
        // WebSocketLoginController.login(ws, msg.data);
          //console.log(WebSocketLoginController.connections);
          break;
        // case "aceita_match":
        
        //   break;
      }
    });
  
    ws.send(JSON.stringify({msg:"Roi, client-kun"}));
  });
wss.broadcast = broadcast;

app.use(cors());
app.use(express.json());


const server = app.listen(process.env.PORT, () =>{console.log(`Server iniciado`);})

const wss = appWs(server);