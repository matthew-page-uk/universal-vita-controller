
import { BrowserWindow, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import * as path from 'path';

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {

            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.webContents.on('dom-ready', () => {
        // setInterval(() => {
        //     win.webContents.send('fromMain', Date.now().toString())
        // }, 1000);

        const vitaService = require('./VitaService');

        vitaService.on('update', (data) => {
            win.webContents.send('deviceState', data);
        });

        ipcMain.on('changeDevice', (event, message) => {
            let {address, data} = message;
            console.log('change', message);
            vitaService.update(address, data);
        });

        ipcMain.on('toMain', (event, message) => {
            console.log('here: ' + message);

            win.webContents.send('fromMain', 'message from the background');
        });
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }

    return win;
}

export { createWindow }