const urls = require('../urls');
const { getJsonFromSharepointUrl } = require('./sharepoint');

async function getMetadata() {
  return getJsonFromSharepointUrl(urls.getMetadataEndpoint);
}

module.exports = {
  getMetadata,
};
