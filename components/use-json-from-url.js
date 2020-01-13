import { useState, useEffect } from '../lib/haunted.js';
const { BrowserWindow } = require('electron').remote;

export function useJsonFromUrl(url) {
  const [resultObject, setResultObject] = useState(null);

  useEffect(async () => {
    const result = await getJsonFromUrl(url);
    setResultObject(result);
  }, []);

  return resultObject;
}

async function getJsonFromUrl(url) {
  return new Promise((resolve, reject) => {
    console.log('[json-from-url] get json: start');
    const tempWindow = new BrowserWindow({
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
      console.log('[json-from-url] get json: json fetched');
    });
  });
}
