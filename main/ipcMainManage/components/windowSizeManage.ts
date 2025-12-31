import { BrowserWindow, clipboard, ipcMain, type IpcMainEvent } from 'electron';

class WindowSizeManage {
	constructor() {
		this.miniWindow();
		this.maxWindow();
		this.closeWindow();
		this.openTest();
		this.handleClipBoard();
	}
	miniWindow() {
		ipcMain.on('to-mini', (e: IpcMainEvent) => {
			// 最小化窗口
			const window = BrowserWindow.fromWebContents(e.sender);
			if (window) window.minimize();
		});
	}
	maxWindow() {
		ipcMain.on('to-max', (e: IpcMainEvent) => {
			const window = BrowserWindow.fromWebContents(e.sender);
			if (window) {
				window.maximize();
			}
		});
	}
	closeWindow() {
		ipcMain.on('close-window', (e: IpcMainEvent) => {
			const window = BrowserWindow.fromWebContents(e.sender);
			if (window) {
				window.close();
			}
		});
	}
	openTest() {
		ipcMain.on('open-test', (e: IpcMainEvent) => {
			e.sender.openDevTools();
		});
	}
	handleClipBoard() {
		ipcMain.on('copy-to-clipboard', (_e: IpcMainEvent, data: string) => {
			clipboard.writeText(data);
		});
	}
}

export default WindowSizeManage;
