// createFloatWindow.ts
import { BrowserWindow, app, ipcMain } from 'electron';
import path from 'node:path';
import os from 'node:os';

export const createFloatWindow = () => {
	const floatWin = new BrowserWindow({
		width: 100,
		height: 100,
		resizable: false,
		frame: false,
		show: false,
		transparent: true,
		alwaysOnTop: true,
		skipTaskbar: true,
		webPreferences: {
			preload: path.join(__dirname, '../preload/preload.cjs'),
			contextIsolation: true,
		},
	});

	if (app.isPackaged) {
		floatWin.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: '/float' });
	} else {
		floatWin.webContents.loadURL('http://localhost:5173/#/float');
	}

	floatWin.once('ready-to-show', () => {
		floatWin.show();
		floatWin.webContents.openDevTools();

		// 获取窗口当前位置
		ipcMain.handle('get-window-position', (event) => {
			const win = BrowserWindow.fromWebContents(event.sender);
			return win ? win.getPosition() : [0, 0];
		});

		ipcMain.handle('get-system-info', () => {
			return {
				cpu: os.cpus(),
				memory: os.totalmem(),
				canUseMemory: os.freemem(),
			};
		});

		// 设置窗口位置（注意：这里不做节流，因为 move 频率可控）
		ipcMain.on('set-window-position', (event, { x, y }) => {
			const win = BrowserWindow.fromWebContents(event.sender);
			if (win) {
				win.setPosition(x, y);
			}
		});
	});
};
