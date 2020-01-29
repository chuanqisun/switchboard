const { BrowserWindow } = require('electron').remote;
const signInBlockerUrlPrefix = 'https://login.microsoftonline.com';
const signInSuccessUrlPrefix = 'https://microsoft.sharepoint.com';
export const rejectReasonSignedOut = 'signed-out';
export const rejectReasonInvalidJson = 'invalid-json';

export async function getJsonFromUrl(url) {
  return new Promise((resolve, reject) => {
    console.log('[json-from-url] get environments: start');
    const tempWindow = new BrowserWindow({
      show: false,
    });

    tempWindow.loadURL(url);

    tempWindow.webContents.on('dom-ready', async () => {
      const url = tempWindow.webContents.getURL();
      if (url.indexOf(signInBlockerUrlPrefix) === 0) {
        tempWindow.destroy();
        reject(rejectReasonSignedOut);
      }

      if (url.indexOf(signInSuccessUrlPrefix) === 0) {
        console.log('[json-from-url] signed in');
        try {
          const result = await tempWindow.webContents.executeJavaScript(`document.querySelector('pre').innerText`);
          tempWindow.destroy();
          const resultObject = JSON.parse(result);
          resolve(resultObject);
          console.log('[json-from-url] json parsed');
        } catch (e) {
          console.log(e);
          reject(rejectReasonInvalidJson);
        }
      }
    });
  });
}
