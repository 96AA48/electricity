// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu, nativeImage, globalShortcut } from 'electron';
import { devMenuTemplate } from './menu/dev_menu_template';
import { editMenuTemplate } from './menu/edit_menu_template';
import createWindow from './helpers/window';

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from './env';

var mainWindow;

var setApplicationMenu = function () {
    var menus = [editMenuTemplate];
    if (env.name !== 'production') {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== 'production') {
    var userDataPath = app.getPath('userData');
    app.setPath('userData', userDataPath + ' (' + env.name + ')');
}

app.on('ready', function () {
    // setApplicationMenu();

    var mainWindow = createWindow('main', {
        width: 1000,
        height: 600
    });

    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL('file://' + __dirname + '/app.html');
    var icon = nativeImage.createFromPath(__dirname + '/icon.png');
    mainWindow.setIcon(icon);

    if (env.name === 'development') {
        mainWindow.openDevTools();
    }

    var registered = globalShortcut.register('MediaNextTrack', function () {
        console.log('MediaNextTrack pressed');
    });

    if (!registered) {
        console.log('MediaNextTrack registration failed');
    } else {
        console.log('MediaNextTrack registration bound!');
    }

    var registered = globalShortcut.register('MediaPlayPause', function () {
        console.log('MediaPlayPause pressed');
    });

    if (!registered) {
        console.log('MediaPlayPause registration failed');
    } else {
        console.log('MediaPlayPause registration bound!');
    }

    var registered = globalShortcut.register('MediaPreviousTrack', function () {
        console.log('MediaPreviousTrack pressed');
    });

    if (!registered) {
        console.log('MediaPreviousTrack registration failed');
    } else {
        console.log('MediaPreviousTrack registration bound!');
    }

    var registered = globalShortcut.register('MediaStop', function () {
        console.log('MediaStop pressed');
    });

    if (!registered) {
        console.log('MediaStop registration failed');
    } else {
        console.log('MediaStop registration bound!');
    }
});

app.on('window-all-closed', function () {
    app.quit();
});
