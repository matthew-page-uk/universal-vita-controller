const EventEmitter = require('events');

const INPUT_TYPES = ['Line', 'Dynamic', 'Phantom'];
const ACTION_TYPES = ['Intelligent', 'Momentary', 'Latching', 'Cough', 'Always On', 'Always Off'];

class Vita extends EventEmitter {
    constructor(ipAddress, port, socket) {
        super();

        this.ipAddress = ipAddress;
        this.port = port;
        this.socket = socket;
        this.gotInitialState = false;

        this.data = {
            isManualEnabled: false,
            inputType: 0,
            headAmp: 0,
            programmeButtonAction: 0,
            isProgrammeMutesTB: false,
            talkbackButtonAction: 0,
            isTalkbackMutesProgramme: false,
            isProgrammeOn: false,
            isTalkbackOn: false,
            dbPeakLevel: -24
        }

        this.socket.on("message", (data, rinfo) => {
            if (rinfo.address.trim() == this.ipAddress) {
                if (this.parseData(data)) {
                    this.emit('state', this.data);
                    this.gotInitialState = true;
                }
            }
        });

        this.ping();
        let pingTimer = setInterval(() => {
            this.ping();
        }, 5000);
    }

    parseData(data) {
        let header = data.toString("utf-8", 0, 7).trim();
        if (header != 'GS Vita') return false;

        let command = data.readUInt8(10);   // not sure what these are, but it's 4 after a ping, and 1 when there's state data
        if (command != 1) return false;

        let inputData = data.readUInt8(16);
        this.data.isManualEnabled = !!(inputData & 4);
        this.data.inputType = (inputData & 3);

        this.data.headAmp = data.readUInt8(17);

        let buttons = data.readUInt8(18);
        let programmeButton = buttons >>> 4;
        let talkbackButton = buttons & 0x0F;

        this.data.programmeButtonAction = (programmeButton & 7);
        this.data.isProgrammeMutesTB = !!(programmeButton & 8);

        this.data.talkbackButtonAction = (talkbackButton & 7);
        this.data.isTalkbackMutesProgramme = !!(talkbackButton & 8);

        // this looks like 16bit levels, but not easy to use
        let audioLevels = data.readUInt16LE(20);

        let peakLevel = data.readUInt8(22);
        this.data.dbPeakLevel = Math.floor((20 * Math.log10(peakLevel / 128)) + 18);
        if (this.data.dbPeakLevel < -24) this.data.dbPeakLevel = -24;

        let buttonState = data.readUInt8(23);
        this.data.isProgrammeOn = !!(buttonState & 128);
        this.data.isTalkbackOn = !!(buttonState & 64);

        return this.data;
    }

    sendMessage(message) {
        this.socket.send(message, this.port, this.ipAddress);
    }

    ping() {
        let header = Buffer.alloc(8);
        header.write('GS Vita', 'ascii');
        let command = Buffer.from([0x10, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00]);
        let message = Buffer.concat([header, command]);
        this.sendMessage(message);
    }

    update(newValues) {
        let newData = {...this.data, ...newValues };
        let message = this.buildMessage(newData);
        if (this.gotInitialState) this.sendMessage(message);
    }

    buildMessage(data) {
        let header = Buffer.alloc(8);
        header.write('GS Vita', 'ascii');
        let command = Buffer.from([0x18, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00]);    // not sure what this does yet

        if (data.isManualEnabled) data.inputType = data.inputType |= 0b0100;
        let inputData = Buffer.from([data.inputType]);
        let headAmp = Buffer.from([data.headAmp]);

        if (data.isProgrammeMutesTB) data.programmeButtonAction = data.programmeButtonAction |= 0b1000;
        if (data.isTalkbackMutesProgramme) data.talkbackButtonAction = data.talkbackButtonAction |= 0b1000;
        let buttonByte = ((data.programmeButtonAction << 4) | (data.talkbackButtonAction & 0xF));
        let buttons = Buffer.from([buttonByte]);

        let padding = Buffer.alloc(4);

        let pressButton = Buffer.alloc(1);
        let buttonState = 0;
        //if (data.isProgrammeOn) buttonState = buttonState |= 0b10000000;       // send this state on if button pressed
        //if (data.isTalkbackOn) buttonState = buttonState |= 0b01000000;        // send this state on if button pressed
        pressButton.writeUInt8(buttonState);

        let message = Buffer.concat([
            header,
            command,
            inputData,
            headAmp,
            buttons,
            padding,
            pressButton
        ]);

        return message;
    }
}

module.exports = {
    Vita,
    INPUT_TYPES,
    ACTION_TYPES
};