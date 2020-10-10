import { urls } from '../constants.js';
import { getJsonFromUrl } from './get-json-from-url-v2.js';

let cachedMetadataPromise;

export async function getMetadata({ exec, onCookies }) {
  if (cachedMetadataPromise) {
    return cachedMetadataPromise;
  } else {
    const metadata = await getJsonFromUrl({ exec, url: urls.getMetadataEndpoint, onCookies });
    cachedMetadataPromise = metadata;
    return metadata;
  }
}
