const { BrowserWindow, screen } = require('electron').remote;
import { urls } from '../constants.js';
import { getJsonFromUrl } from './get-json-from-url-v2.js';
export { rejectReasonInvalidJson, rejectReasonSignedOut } from './get-json-from-url.js';

export function getEnvironments({ exec }) {
  return getJsonFromUrl({ exec, url: urls.viewEnvironments });
}

export async function editEnvironments() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.bounds;

  const tempWindow = new BrowserWindow({
    width: 800,
    height: height - 64,
    x: Math.max(16, width - 16 - 420 - 16 - 800),
    y: 16,
  });

  tempWindow.setMenu(null);
  tempWindow.loadURL(urls.editEnvironmentsEndpoint);
}
