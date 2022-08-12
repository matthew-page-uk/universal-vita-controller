
const debug = require('debug')('VitaService');
const { EventEmitter } = require('events');
const socket = require('./UDPSocketService');
const { Vita, INPUT_TYPES, ACTION_TYPES } = require('./Vita');
const VitaDiscovery = require('./VitaDiscovery');

class VitaService extends EventEmitter {
    constructor() {
        super();

        this.deviceMap = new Map();
        this.discovery = new VitaDiscovery();

        this._start();
    }

    update(address, data) {
        debug('update', address, data);
        if (!address) return;
        let device = this.deviceMap.get(address);
        if (!device) return;
        device.vita.update(data);
    }

    _start() {
        this.discovery.start();

        this.discovery.on('add', (device) => {
          let vitaInstance = new Vita(device.address, 41161, socket);

          vitaInstance.on('state', (state) => {
            let newState = { address: device.address, name: device.name, ...state };
            this.emit('update', newState);
          });
        
          let deviceObj = {
            ...device,
            vita: vitaInstance
          }
        
          this.deviceMap.set(device.address, deviceObj);
          debug('add', deviceObj);
        });
        
        this.discovery.on('change', (device) => {
          let currentDevice = this.deviceMap.get(device.address);
          this.deviceMap.set(device.address, { ...currentDevice, ...device });
          debug('change', device);
        });
        
        this.discovery.on('remove', (device) => {
          this.deviceMap.delete(device.address);
          this.emit('remove', device);
          debug('remove', device);
        });
    }
}

module.exports = new VitaService();