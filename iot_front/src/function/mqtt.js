import mqtt from "mqtt";

let client ;

try {
    client = mqtt.connect("ws://test.mosquitto.org:8081");
}
catch ( err ) {
    console.log(err)
}
 
client.on("connect", function () {
    client.subscribe("mastermind/player/input", function (err) {
        if (!err) {
            console.log("connecté")
        }
    });
});

client.on("message", function(topic, msg) {
    console.log(msg.toString())
})