const { BrowserWindow, screen } = require('electron').remote;
import { urls } from '../constants.js';
import { getJsonFromUrl } from './get-json-from-url-v2.js';
export { rejectReasonInvalidJson, rejectReasonSignedOut } from './get-json-from-url.js';

export function getEnvironments({ exec }) {
  return getJsonFromUrl({ exec, url: urls.viewEnvironments });
}
