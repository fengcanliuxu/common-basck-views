import { app, BrowserWindow, ipcMain, Menu, type IpcMainEvent } from 'electron';
import path from 'path';
// import { createFloatWindow } from './float/float.ts';
import createTray from './tray';
import IpcMainManage from './ipcMainManage';

let mainWindow: BrowserWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 500, // 登录窗口宽度
		height: 400, // 登录窗口高度
		resizable: false, // 登录窗口不可调整大小
		show: false,
		frame: false,
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

app.whenReady().then(() => {
	Menu.setApplicationMenu(null); // null值取消顶部菜单栏
	// 创建当前窗口的IPC事件管理实例
	createWindow();

	// createFloatWindow();
	createTray();

	// 监听登录成功事件，最大化窗口
	ipcMain.on('login-success', (_e: IpcMainEvent) => {
		// 设置窗口可调整大小
		mainWindow.setResizable(true);
		// 最大化窗口
		mainWindow.maximize();
	});
	// 监听检查登录状态事件
	ipcMain.on('check-login-status', (_e: IpcMainEvent, data: any) => {
		if (data.isLoggedIn) {
			// 如果已登录，设置窗口可调整大小并最大化
			mainWindow.setResizable(true);
			mainWindow.maximize();
		}
	});
});
