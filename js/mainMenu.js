// const remote = require('electron').remote;
// const main = remote.require("./main.js");
// const url = require('url');
// const path = require('path');
// const BrowserWindow = remote.BrowserWindow;
const ipc = require('electron').ipcRenderer;

const cdu = document.getElementById('cdu')
const evaporator = document.getElementById('evaporator')
const cduAndEvaporator = document.getElementById('cduAndEvaporator')


cdu.addEventListener('click', () => {
    ipc.send('cduOpenWindow')
})
// evaporator.addEventListener('click', () => {
//     ipc.send('togle-prefs') Test001
// })
evaporator.addEventListener('click', () => {
    ipc.send('evaOpenWindow')
})
cduAndEvaporator.addEventListener('click', () => {
    ipc.send('cduAndEvaWindow')
})
