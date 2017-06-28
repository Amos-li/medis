'use strict';

const co = require('co');
const {app, Menu, ipcMain} = require('electron');
const windowManager = require('./windowManager');
const menu = require('./menu');
const tools = require('./tools');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
// single instance
const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  var current = windowManager.pickOne;
  if(current) {
    current.show();
    if (current.isMinimized()) {
      current.restore();
    }
    current.focus();
  }
})

if (shouldQuit) {
  app.quit()
}

co(function*(){
  if(tools.shouldRelaunch()) {
    yield tools.delFavo();
    app.relaunch({args: tools.args()});
    app.exit(0);
  }

  ipcMain.on('create patternManager', function (event, arg) {
    windowManager.create('patternManager', arg);
  });

  ipcMain.on('dispatch', function (event, action, arg) {
    windowManager.dispatch(action, arg);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', function (e, hasVisibleWindows) {
    if (!hasVisibleWindows) {
      windowManager.create();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.on('ready', function () {
    Menu.setApplicationMenu(menu);
    windowManager.create();
  });
});