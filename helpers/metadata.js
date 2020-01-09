const { BrowserWindow } = require('electron');
const systemConfig = require('../system-config');

async function getMetadata() {
  return new Promise((resolve, reject) => {
    console.log('[metadata] get metadata: start');
    const tempWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
    });

    tempWindow.loadURL(systemConfig.getMetadataEndpoint);

    tempWindow.webContents.on('dom-ready', () => {
      tempWindow.webContents.executeJavaScript(`document.querySelector('pre').innerText`, undefined, result => {
        tempWindow.destroy();
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          console.error(e);
          resolve({});
        }
        console.log('[metadata] get metadata: json fetched');
      });
    });
  });
}

module.exports = {
  getMetadata,
};
