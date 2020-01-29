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
  globalShortcut.register('CommandOrControl+E', () => mainWindow.isFocused() && editEnvironments());
  globalShortcut.register('CommandOrControl+H', () => mainWindow.isFocused() && showAbout());
});

ipcMain.on('downloadUpdate', () => {
  const { downloadUpdate } = require('./helpers/dialogs');
  downloadUpdate();
});

function editEnvironments() {
  const { editEnvironments } = require('./helpers/environments');
  editEnvironments();
}

function showAbout() {
  const { showAbout } = require('./helpers/dialogs');
  showAbout();
}
