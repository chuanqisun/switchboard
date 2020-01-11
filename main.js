const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  const { screen } = require('electron');
  const display = screen.getPrimaryDisplay();
  const width = display.bounds.width;
  mainWindow = new BrowserWindow({
    width: 420,
    height: 800,
    x: width - 436,
    y: 16,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function() {
  if (mainWindow === null) createWindow();
});

// Custom logic
app.on('ready', () => {
  globalShortcut.register('CommandOrControl+R', () => mainWindow.isFocused() && signOut());
  globalShortcut.register('CommandOrControl+E', () => mainWindow.isFocused() && editEnvironments());
  globalShortcut.register('CommandOrControl+H', () => mainWindow.isFocused() && showAbout());
});

ipcMain.on('getSignInStatus', async event => {
  const { checkSignInStatus } = require('./helpers/account');
  const isSignedIn = await checkSignInStatus();
  event.sender.send('onSignInStatusUpdate', isSignedIn);
});

ipcMain.on('tryMinimize', event => {
  mainWindow.minimize();
});

ipcMain.on('tryClose', event => {
  mainWindow.close();
});

ipcMain.on('trySignIn', async event => {
  const { signIn } = require('./helpers/account');
  await signIn(mainWindow);
  mainWindow.reload();
});

ipcMain.on('trySignOut', signOut);

ipcMain.on('getEnvironments', async event => {
  const { ensureUserSettings } = require('./helpers/user-settings');
  const { getEnvironments } = require('./helpers/environments');
  const [userSettings, environments] = await Promise.all([ensureUserSettings(), getEnvironments()]);

  event.sender.send('onEnvironmentsAvailable', { environments, userSettings });
});

ipcMain.on('downloadUpdate', () => {
  const { downloadUpdate } = require('./helpers/dialogs');
  downloadUpdate();
});

ipcMain.on('addFavorite', async (event, { appId }) => {
  const { addFavorite, saveUserSettings } = require('./helpers/user-settings');
  const userSettings = addFavorite(appId);
  event.sender.send('onFavoritesChange', { userSettings });
  saveUserSettings(userSettings);
});

ipcMain.on('removeFavorite', async (event, { appId }) => {
  const { removeFavorite, saveUserSettings } = require('./helpers/user-settings');
  const userSettings = removeFavorite(appId);
  event.sender.send('onFavoritesChange', { userSettings });
  saveUserSettings(userSettings);
});

ipcMain.on('download-chromium', async (event, { revision }) => {
  const download = require('download-chromium');
  const os = require('os');
  const path = require('path');
  const userDataPath = app.getPath('userData');
  console.log(userDataPath);
  console.log('will download ' + revision);

  download({
    revision,
    installPath: path.join(userDataPath, '/local-chromium'),
    onProgress: ({ percent }) => {
      console.log(percent);
      event.sender.send('onDownloadProgress', { percent });
    },
  }).then(exec => {
    console.log(exec);
    event.sender.send('onDownloadComplete', { exec });
  });
});

async function signOut() {
  const { signOut } = require('./helpers/account');
  await signOut();
  mainWindow.reload();
}

function editEnvironments() {
  const { editEnvironments } = require('./helpers/environments');
  editEnvironments();
}

function showAbout() {
  const { showAbout } = require('./helpers/dialogs');
  showAbout();
}
