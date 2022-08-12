const { EventEmitter } = require('events');
const mdns = require('multicast-dns')();

const QUERY_SERVICE = '_netaudio-cmc._udp.local';
const GLENSOUND_SERVICE = 'Glensoun._sub._netaudio-cmc._udp.local';

class VitaDiscovery extends EventEmitter {
    constructor() {
        super();
        this.devices = new Map();
        this.pollTimer;
    }

    start() {
        mdns.on('response', this.parseResonse.bind(this));
        this.poll();
    }

    stop() {
        mdns.off('response', this.parseResonse.bind(this));
        clearTimeout(this.pollTimer);
    }

    parseResonse(response) {
        let { answers, additionals } = response;

        let device = answers.find((answer) => {
            let { name } = answer;
            return name.includes(GLENSOUND_SERVICE);
        });
    
        if (device) {
            let aRecord = additionals.find((record) => {
                let { type } = record;
                return type == 'A';
            });
    
            if (aRecord) {
                let { data } = device;

                let deviceDetails = {
                    id: aRecord.name,
                    name: data.replace('.' + QUERY_SERVICE, ''),
                    address: aRecord.data,
                    lastSeen: Date.now()
                }

                if (!this.devices.has(aRecord.name)) {
                    this.emit('add', deviceDetails)
                }
                else {
                    let currentDetails = this.devices.get(aRecord.name);
                    let { name, address } = currentDetails;
                    if ((deviceDetails.name != name) || (deviceDetails.address != address)) {
                        this.emit('change', deviceDetails);
                    }
                }
    
                this.devices.set(aRecord.name, deviceDetails);

            }
        }
    }

    poll() {
        mdns.query(QUERY_SERVICE, 'PTR');   // mdns query for devices
        this.purgeOldDevices();
        this.pollTimer = setTimeout(this.poll.bind(this), 3000);
    }
    
    purgeOldDevices() {
        for (let [key, value] of this.devices) {
            let { lastSeen } = value;
            if ((lastSeen + 10000) < Date.now()) {
                // console.log('*** deleting ***', value.name);
                this.devices.delete(key);
                this.emit('remove', value);
            }
        }
    }
}

module.exports = VitaDiscovery;

// const discover = new VitaDiscovery();
// discover.start();
// discover.on('devices', (devices) => console.log(devices));
