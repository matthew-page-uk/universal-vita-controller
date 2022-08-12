const { defineConfig } = require('@vue/cli-service');
const fs = require('fs');
const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;

process.env.VUE_APP_VERSION = version;

module.exports = defineConfig({
    transpileDependencies: true,
    pluginOptions: {
        electronBuilder: {
            preload: 'src/preload.js',
        }
    },
});
