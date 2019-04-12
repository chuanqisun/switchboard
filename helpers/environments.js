const {BrowserWindow} = require('electron')
const environmentDataFileLocation = 'https://microsoft.sharepoint.com/teams/Live.Drive.Repeat2/Shared%20Documents/General/Environments/environments.txt';

async function getEnvironments() {
  return new Promise((resolve, reject) => {
    console.log('[environment] get environment: start');
    const tempWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
    });
    
    tempWindow.loadURL(environmentDataFileLocation);

    tempWindow.webContents.on('dom-ready', () => {
      tempWindow.webContents.executeJavaScript(`document.querySelector('pre').innerText`, undefined, result => {
        tempWindow.destroy();
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          console.error(e);
          reject();
        }
        console.log('[environment] get environment: json fetched');
      })
    });
  });
}

module.exports = {
  getEnvironments,
}
