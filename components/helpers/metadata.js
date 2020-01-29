import { urls } from '../../urls.js';
import { getJsonFromUrl } from './get-json-from-url.js';

const cachedMetadataPromise = getJsonFromUrl(urls.getMetadataEndpoint).catch(e => {
  console.log('[metadata] get metadata failed. Error reason: ');
  console.dir(e);
});

export async function getMetadata() {
  return cachedMetadataPromise;
}
