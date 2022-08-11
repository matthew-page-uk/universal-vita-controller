
const GLENSOUND_MULTICAST_ADDRESS = '239.254.50.123';
const VITA_MULTICAST_PORT = 6111;

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

socket.bind(VITA_MULTICAST_PORT, () => {
  socket.addMembership(GLENSOUND_MULTICAST_ADDRESS);
});

module.exports = socket;