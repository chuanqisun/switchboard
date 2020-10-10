import { urls } from '../constants.js';

export function openLatestRelease() {
  const { shell } = require('electron').remote;
  shell.openExternal(urls.latestRelease);
}

export function openHelp() {
  const { shell } = require('electron').remote;
  shell.openExternal(urls.help);
}

export function openDocumentation() {
  const { shell } = require('electron').remote;
  shell.openExternal(urls.documentation);
}

export function openAllReleases() {
  const { shell } = require('electron').remote;
  shell.openExternal(urls.release);
}

export function openCustomerDigitalExperience() {
  const { shell } = require('electron').remote;
  shell.openExternal(urls.cdxDemos);
}

export function openEnvironmentsFile() {
  const { shell } = require('electron').remote;
  shell.openExternal(urls.editEnvironmentsEndpoint);
}
