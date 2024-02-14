import mqtt from "mqtt";

let client ;

try {
    client = mqtt.connect("ws://test.mosquitto.org:8081");
}
catch ( err ) {
    console.log(err)
}

export default client
 


