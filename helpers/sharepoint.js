const { BrowserWindow } = require('electron');

async function getJsonFromSharepointUrl(url) {
  return new Promise((resolve, reject) => {
    console.log('[sharepoint] get json: start');
    const tempWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
    });

    tempWindow.loadURL(url);

    tempWindow.webContents.on('dom-ready', async () => {
      const result = await tempWindow.webContents.executeJavaScript(`document.querySelector('pre').innerText`);
      tempWindow.destroy();
      try {
        const resultObject = JSON.parse(result);
        resolve(resultObject);
      } catch (e) {
        console.error(e);
        resolve({});
      }
      console.log('[sharepoint] get json: json fetched');
    });
  });
}

module.exports = {
  getJsonFromSharepointUrl,
};
