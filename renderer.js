const {ipcRenderer} = require('electron')

// DOM elements
const signInButton = document.querySelector('#sign-in');
const signOutButton = document.querySelector('#sign-out');
const environmentList = document.querySelector('#environments');

// Handle DOM events
signInButton.onclick = () => ipcRenderer.send('trySignIn');
signOutButton.onclick = () => ipcRenderer.send('trySignOut');
environmentList.onclick = (event) => handleEnvironmentActions(event);


// Handle IPC events
ipcRenderer.once('onSignInStatusUpdate', (event, isSignedIn) => {
  if (isSignedIn) {
    signOutButton.hidden = false;
    ipcRenderer.send('getEnvironments');
  } else {
    signInButton.hidden = false;
  }
});

ipcRenderer.once('onEnvironmentsAvailable', (event, environments) => {
  environmentList.innerHTML = renderEnvironments(environments);
});

// Init
ipcRenderer.send('getSignInStatus');

// Render functions
function renderEnvironments(environments) {
  return `${environments.map(app => `
  <div>
    <h1>${app.appName}</h1>
    ${app.instances.map(instance => `
    <button
      data-url="${instance.url}"
      data-username="${instance.username}"
      data-password="${instance.password}"
    ><div>1</div>${instance.description}</button>
    `.trim()).join('')}
  </div>
  `.trim()).join('')}`;
}

// Event handler functions
function handleEnvironmentActions(event) {
  const targetButton = event.target.closest('button');
  if (!targetButton) return;
  console.log(targetButton.dataset.url);
  console.log(targetButton.dataset.username);
  console.log(targetButton.dataset.password);
}