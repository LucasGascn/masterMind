const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");

let isConnected = false;
client.on("connect", function () {
  client.subscribe("mastermind/player/input", function (err) {
    if (!err) {
      isConnected = true;
    }
  });
});

function sendMqtt(msg) {
  client.publish("mastermind/player/input", msg);
}
