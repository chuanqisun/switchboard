const { BrowserWindow } = require('electron');
const systemConfig = require('../system-config');

async function getEnvironments() {
  return new Promise((resolve, reject) => {
    console.log('[environment] get environment: start');
    const tempWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
    });

    tempWindow.loadURL(systemConfig.getEnvironmentsEndpoint);

    tempWindow.webContents.on('dom-ready', () => {
      tempWindow.webContents.executeJavaScript(`document.querySelector('pre').innerText`, undefined, result => {
        tempWindow.destroy();
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          console.error(e);
          resolve({});
        }
        console.log('[environment] get environment: json fetched');
      });
    });
  });
}

async function editEnvironments() {
  const { screen } = require('electron');
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.bounds;

  const tempWindow = new BrowserWindow({
    width: 800,
    height: height - 64,
    x: Math.max(16, width - 16 - 420 - 16 - 800),
    y: 16,
  });

  tempWindow.setMenu(null);
  tempWindow.loadURL(systemConfig.editEnvironmentsEndpoint);
}

module.exports = {
  getEnvironments,
  editEnvironments,
};
