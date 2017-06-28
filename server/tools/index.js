'use strict';

const {app} = require('electron');
const path = require('path');
const del = require('del');

module.exports.label = {
  label: 'Tools',
  submenu: [{
    label: 'Clear Favorites (Windows only)',
    click() {
      if('win32' === process.platform) {
        app.relaunch({args: process.argv.slice(1).concat(['--clear-favorites'])});
        app.exit(0);
      }
    }
  }]
};

exports.delFavo = function* () {
  var localStorage = path.join(`${app.getPath('appData')}`, 'Medis', 'Local Storage');
  yield del([`${localStorage}`], {force: true});
}

exports.shouldRelaunch = function () {
  if(process.argv.indexOf('--clear-favorites') !== -1) {
    return true;
  }
  return false;
}

exports.args = function () {
  var args = process.argv.slice(1).filter(item => {
    return item !== '--clear-favorites';
  });
  return args;
}