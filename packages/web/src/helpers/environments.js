import { urls } from '../constants.js';
import { getJsonFromUrl } from './get-json-from-url-v2.js';

export function getEnvironments({ exec }) {
  return getJsonFromUrl({ exec, url: urls.viewEnvironments });
}
