const systemConfig = require('../system-config');
const { getJsonFromSharepointUrl } = require('./sharepoint');

async function getMetadata() {
  return getJsonFromSharepointUrl(systemConfig.getMetadataEndpoint);
}

module.exports = {
  getMetadata,
};
