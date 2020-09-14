import { urls } from '../constants.js';
import { getJsonFromUrl } from './get-json-from-url.js';
export { rejectReasonInvalidJson, rejectReasonSignedOut } from './get-json-from-url.js';

export function getEnvironments() {
  return getJsonFromUrl(urls.viewEnvironments);
}
