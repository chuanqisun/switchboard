const { app } = require('electron').remote;
const path = require('path');
const userDataPath = app.getPath('userData');

export const sessionDataDir = path.join(userDataPath, 'session');
