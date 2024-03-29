const mqtt = require("mqtt");
const client = mqtt.connect("ws://test.mosquitto.org:8080");

let isConnected = false;
client.on("connect", function () {
  client.subscribe("mastermind/player/input", function (err) {
    if (!err) {
      console.log("connecté");
    }
  });
  client.subscribe("mastermind/start");
});

exports.sendMqtt = (msg) => {
  client.publish("mastermind/player/input", msg);
};

exports.retrieveClient = () => {
  return client;
};
