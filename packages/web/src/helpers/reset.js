const remote = require('electron').remote;

import { reloadWindow } from './window.js';

export async function resetApp() {
	const win = remote.getCurrentWindow();
	const resetTasksAsync = [
		win.webContents.session.clearAuthCache(),
		win.webContents.session.clearCache(),
		win.webContents.session.clearHostResolverCache(),
		win.webContents.session.clearStorageData(),
	];

	await Promise.all(resetTasksAsync);
	reloadWindow();
}