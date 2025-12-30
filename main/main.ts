import { app, BrowserWindow, Menu } from 'electron';
import path from 'path';
import IpcMainManage from './ipcMainManage';
import ProtocolManage from './protocolManage';
import createTray from './tray';
import { iconPath } from './common';
let mainWindow: BrowserWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		show: false,
		frame: false,
		icon: iconPath,
		webPreferences: {
			preload: path.join(__dirname, '../preload/preload.cjs'),
		},
	});
	if (process.argv[3]) {
		mainWindow.loadURL(process.argv[3]);
	} else {
		mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
	}

	mainWindow.once('ready-to-show', () => {
		mainWindow!.show();
		new IpcMainManage(mainWindow);
	});
	return mainWindow;
};

const protoMange = new ProtocolManage();

app.whenReady().then(() => {
	protoMange.handleVideo();
	Menu.setApplicationMenu(null); // null值取消顶部菜单栏
	createWindow();
	createTray();
});
