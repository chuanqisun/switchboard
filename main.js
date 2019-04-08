const {app, BrowserWindow, ipcMain} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  const {screen} = require('electron');
  let display = screen.getPrimaryDisplay();
  let width = display.bounds.width;
  mainWindow = new BrowserWindow({
    width: 360,
    height: 800,
    x: width - 376,
    y: 16,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('index.html')

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})

// Custom logic
ipcMain.on('getSignInStatus', async (event) => {
  const { checkSignInStatus } = require('./helpers/account');
  const isSignedIn = await checkSignInStatus();
  event.sender.send('onSignInStatusUpdate', isSignedIn);
});

ipcMain.on('tryMinimize', (event) => {
  mainWindow.minimize();
});

ipcMain.on('tryClose', (event) => {
  mainWindow.close();
});

ipcMain.on('trySignIn', async (event) => {
  const { signIn } = require('./helpers/account');
  await signIn(mainWindow);
  mainWindow.reload();
});

ipcMain.on('trySignOut', async (event) => {
  const { signOut } = require('./helpers/account');
  await signOut();
  mainWindow.reload();
});

ipcMain.on('getEnvironments', async (event) => {
  const { getEnvironments } = require('./helpers/environments');
  const environments = await getEnvironments();
  event.sender.send('onEnvironmentsAvailable', environments);
});

