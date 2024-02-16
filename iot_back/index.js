const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const mqtt = require("./mqtt");
const Mastermind = require("./algo");
const led = require("./led");

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

const ledArrayp1 = [
  { blue: "P2", green: "P1" },
  { blue: "D7", green: "D4" },
  { blue: "D5", green: "D9" },
  { blue: "D2", green: "D3" },
  { blue: "D0", green: "D1" },
];
const ledArrayp2 = [
  { green: "D0", blue: "D1" },
  { green: "D2", blue: "D3" },
  { green: "D9", blue: "D5" },
  { green: "D4", blue: "D7" },
  { green: "P1", blue: "P2" },
];

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
    console.log(dataReceived);
    dataReceived = dataReceived.slice(0, 5).split("");

    if (frame.remote64 === player1Id) {
      counterplayer1++;
    } else {
      counterplayer2++;
    }

    const response =
      frame.remote64 === player1Id
        ? Mastermind.masterMindSolver(dataReceived, solucePlayer1)
        : Mastermind.masterMindSolver(dataReceived, solucePlayer2);

    const res = {
      id: frame.remote64 === player1Id ? "player1" : "player2",
      counter: frame.remote64 === player1Id ? counterplayer1 : counterplayer2,
      input: response,
    };
    if (frame.remote64 === player1Id) {
      led.ledLighter(
        ledArrayp1,
        response.filter((e) => e.status === "correct").length,
        response.filter((e) => e.status === "misplaced").length,
        xbeeAPI,
        "0013A20041A713B4"
      );
    } else {
      led.ledLighter(
        ledArrayp2,
        response.filter((e) => e.status === "correct").length,
        response.filter((e) => e.status === "misplaced").length,
        xbeeAPI,
        "0013A20041FB6072"
      );
    }
    if (response.filter((e) => e.status === "correct").length === 5) {
      console.log("ouverture");
      const frame_obj = {
        type: 0x17,
        destination64: "0013A20041582FC1",
        command: "D0",
        commandParameter: [0x05],
      };
      xbeeAPI.builder.write(frame_obj);
    }
    mqtt.sendMqtt(JSON.stringify(res));
  } else if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
    console.log(frame.nodeIdentifier);
    if (frame.nodeIdentifier === "Player 1") {
      player1Id = frame.sender64;
    } else if (frame.nodeIdentifier === "Player 2") {
      player2Id = frame.sender64;
    }
  } else if (frame.type === 151) {
    let dataReceived = String.fromCharCode.apply(null, frame.commandData);
    if (dataReceived === "Player 1") {
      player1Id = frame.remote64;
    } else if (dataReceived === "Player 2") {
      player2Id = frame.remote64;
    }
  }
});

function startGame() {
  solucePlayer1 = [];
  solucePlayer2 = [];
  for (let i = 0; i < 5; i++) {
    solucePlayer1.push(genererAleatoire());
    solucePlayer2.push(genererAleatoire());
  }
  console.log(solucePlayer1);
  console.log(solucePlayer2);

  let frame_obj = {
    type: 0x17,
    destination64: "0013A20041582FC1",
    command: "D0",
    commandParameter: [0x04],
  };
  xbeeAPI.builder.write(frame_obj);

  frame_obj = {
    type: 0x17,
    destination64: "FFFFFFFFFFFFFFFF",
    command: "NI",
    commandParameter: [],
  };
  xbeeAPI.builder.write(frame_obj);

  led.ledDie(ledArrayp1, "0013A20041A713B4", xbeeAPI);
  led.ledDie(ledArrayp2, "0013A20041FB6072", xbeeAPI);
}

mqttClient = mqtt.retrieveClient();

mqttClient.on("message", function (topic, msg) {
  const res = JSON.parse(msg.toString());
  console.log(topic);
  if (topic === "mastermind/start") {
    startGame();
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
