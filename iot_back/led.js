var xbee_api = require("xbee-api");
var C = xbee_api.constants;

exports.LedLighter = (
  ledArray,
  correctLength,
  misplacedLength,
  xbee_api,
  playerMac
) => {
  const n = correctLength; // number of correct numbers
  const m = misplacedLength; // number of misplaced numbers
  let frame_obj;
  for (let i = 0; i < 5; i++) {
    if (n > i) {
      // turn the green LED on
      frame_obj = {
        // AT Request to be sent
        type: 0x17,
        destination64: playerMac,
        command: ledArray[i].blue,
        commandParameter: [0x04],
      };
      console.log(frame_obj);
      xbee_api.builder.write(frame_obj);
      frame_obj = {
        // AT Request to be sent
        type: 0x17,
        destination64: playerMac,
        command: ledArray[i].green,
        commandParameter: [0x00],
      };
      xbee_api.builder.write(frame_obj);
    } else if (m > i - n) {
      // turn the blue LED on
      frame_obj = {
        // AT Request to be sent
        type: 0x17,
        destination64: playerMac,
        command: ledArray[i].green,
        commandParameter: [0x04],
      };
      console.log(frame_obj);

      xbee_api.builder.write(frame_obj);
      frame_obj = {
        // AT Request to be sent
        type: 0x17,
        destination64: playerMac,
        command: ledArray[i].blue,
        commandParameter: [0x00],
      };
      xbee_api.builder.write(frame_obj);
    } else {
      // turn both LEDs off
      frame_obj = {
        // AT Request to be sent
        type: 0x17,
        destination64: playerMac,
        command: ledArray[i].blue,
        commandParameter: [0x00],
      };

      let res = xbee_api.builder.write(frame_obj);
      frame_obj = {
        // AT Request to be sent
        type: 0x17,
        destination64: playerMac,
        command: ledArray[i].green,
        commandParameter: [0x00],
      };
      xbee_api.builder.write(frame_obj);
    }
  }
};

exports.ledDie = (ledArray, ledMac, xbee_api) => {
  ledArray.forEach((led) => {
    let frame_obj = {
      // AT Request to be sent
      type: 0x17,
      destination64: ledMac,
      command: led.blue,
      commandParameter: [0x00],
    };
    xbee_api.builder.write(frame_obj);
    frame_obj = {
      // AT Request to be sent
      type: 0x17,
      destination64: ledMac,
      command: led.green,
      commandParameter: [0x00],
    };
    xbee_api.builder.write(frame_obj);
  });
};
