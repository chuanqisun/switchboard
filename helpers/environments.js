const { BrowserWindow } = require('electron');
const urls = require('../urls');
const { getJsonFromSharepointUrl } = require('./sharepoint');

async function getEnvironments() {
  return getJsonFromSharepointUrl(urls.getEnvironmentsEndpoint);
}

async function editEnvironments() {
  const { screen } = require('electron');
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

module.exports = {
  getEnvironments,
  editEnvironments,
};
