const express = require("express");
const app = express();
const port = 3000;

const mqtt = require("./mqtt");
var SerialPort = require("serialport");
var xbee_api = require("xbee-api");
var C = xbee_api.constants;
//var storage = require("./storage")
require("dotenv").config();

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

// All frames parsed by the XBee will be emitted here

// storage.listSensors().then((sensors) => sensors.forEach((sensor) => console.log(sensor.data())))

xbeeAPI.parser.on("data", function (frame) {
  //   //on new device is joined, register it

  //on packet received, dispatch event
  //let dataReceived = String.fromCharCode.apply(null, frame.data);
  if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
    console.log("C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET");
    let dataReceived = String.fromCharCode.apply(null, frame.data);
    console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);
  }

  //   if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
  //     // let dataReceived = String.fromCharCode.apply(null, frame.nodeIdentifier);
  //     console.log("NODE_IDENTIFICATION");
  //     //storage.registerSensor(frame.remote64)
  //   } else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
  //     console.log("ZIGBEE_IO_DATA_SAMPLE_RX");
  //     console.log(frame.analogSamples.AD0);
  //     //storage.registerSample(frame.remote64,frame.analogSamples.AD0 )
  //   } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {
  //     console.log("REMOTE_COMMAND_RESPONSE", frame);
  //     let dataReceived = String.fromCharCode.apply(null, frame.commandData);
  //     console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);
  //   } else {
  //     console.debug(frame);
  //     let dataReceived = String.fromCharCode.apply(null, frame.commandData);
  //     console.log(dataReceived);
  //   }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/send", (req, res) => {
  // var frame_obj = {
  //   // AT Request to be sent
  //   type: C.FRAME_TYPE.AT_COMMAND,
  //   command: "D0",
  //   commandParameter: ["01"],
  // };

  // xbeeAPI.builder.write(frame_obj);

  // xbeeAPI.parser.on("data", function (frame) {
  //   console.debug(frame);
  //   let dataReceived = String.fromCharCode.apply(null, frame.commandData);
  //   console.log(dataReceived);
  //   frame.commandData = dataReceived;
  //   res.send(frame);
  // });
  mqtt.sendMqtt("test");
  res.send("ok");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
