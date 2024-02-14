const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const mqtt = require("./mqtt");
const Mastermind = require("./algo");

var SerialPort = require("serialport");
var xbee_api = require("xbee-api");
var C = xbee_api.constants;

app.use(cors());

require("dotenv").config();

function genererAleatoire() {
  var caracteres = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  var indiceAleatoire = Math.floor(Math.random() * caracteres.length);

  return caracteres[indiceAleatoire];
}

let solucePlayer1 = [];
let solucePlayer2 = [];

let player1Id = "";
let player2Id = "";

let counterplayer1 = 0;
let counterplayer2 = 0;

const SERIAL_PORT = process.env.SERIAL_PORT;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2,
});

let serialport = new SerialPort(
  SERIAL_PORT,
  {
    baudRate: parseInt(process.env.SERIAL_BAUDRATE) || 9600,
  },
  function (err) {
    if (err) {
      return console.log("Error: ", err.message);
    }
  }
);

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

xbeeAPI.parser.on("data", function (frame) {
  if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
    let dataReceived = String.fromCharCode.apply(null, frame.data);

    dataReceived = dataReceived.slice(0, 5).split("");

    if (player1Id === "") {
      player1Id = frame.remote64;
    } else if (player1Id !== "" && player2Id === "") {
      player2Id = frame.remote64;
    }

    if (frame.remote64 === player1Id) {
      counterplayer1++;
    } else {
      counterplayer2++;
    }

    const response = Mastermind.MastermindSolver(dataReceived, solucePlayer1);

    const res = {
      id: frame.remote64,
      counter: frame.remote64 === player1Id ? counterplayer1 : counterplayer2,
      input: response,
    };

    mqtt.sendMqtt(JSON.stringify(res));
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/send", (req, res) => {
  mqtt.sendMqtt("test");
  res.send("ok");
});

app.get("/start", (req, res) => {
  solucePlayer1 = [];
  solucePlayer2 = [];
  for (let i = 0; i < 5; i++) {
    solucePlayer1.push(genererAleatoire());
    solucePlayer2.push(genererAleatoire());
  }
  res.send({ player1: solucePlayer1, player2: solucePlayer2 });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
