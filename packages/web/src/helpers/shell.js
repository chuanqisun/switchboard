import { urls } from '../constants.js';

export function downloadUpdate() {
  const { shell } = require('electron').remote;
  shell.openExternal(urls.latestRelease);
}

export function getHelp() {
  const { shell } = require('electron').remote;
  shell.openExternal(urls.help);
}

export function openDocumentation() {
  const { shell } = require('electron').remote;
  shell.openExternal(urls.documentation);
}

export function viewAllReleases() {
  const { shell } = require('electron').remote;
  shell.openExternal(urls.release);
}
