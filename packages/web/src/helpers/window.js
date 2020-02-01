export function reloadWindow() {
  const { getCurrentWindow } = require('electron').remote;

  const currentWindow = getCurrentWindow();
  currentWindow.reload();
}
