const { BrowserWindow } = require('electron').remote;

export async function getJsonFromUrl(url) {
  return new Promise((resolve, reject) => {
    console.log('[json-from-url] get json: start');
    const tempWindow = new BrowserWindow({
      show: false,
    });

    tempWindow.loadURL(url);

    tempWindow.webContents.on('dom-ready', async () => {
      try {
        const result = await tempWindow.webContents.executeJavaScript(`document.querySelector('pre').innerText`);
        tempWindow.destroy();
        const resultObject = JSON.parse(result);
        resolve(resultObject);
      } catch (e) {
        console.error(e);
        resolve({});
      }
      console.log('[json-from-url] get json: json fetched');
    });
  });
}
