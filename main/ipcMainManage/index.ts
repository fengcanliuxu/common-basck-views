import { BrowserWindow, ipcMain, type IpcMainEvent, dialog, app } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { transArrToTree } from '../utils';
import os from 'node:os';
import { windowManage } from '../windowManage';
import WindowSizeManage from './components/windowSizeManage.ts';
class IpcMainManage extends WindowSizeManage {
	private hasCreatePath = new Map<String, BrowserWindow>();
	constructor() {
		super();
		this.openFolder();
		this.openFile();
		this.handleFilePath();
		this.getSystemInfo();
		this.openNewWindow();
	}

	getSystemInfo() {
		ipcMain.handle('get-system-info', () => {
			return {
				cpu: os.cpus(),
				memory: os.totalmem(),
				canUseMemory: os.freemem(),
			};
		});
	}

	openFolder() {
		ipcMain.handle('open-folder', async (e) => {
			const curWindow = BrowserWindow.fromWebContents(e.sender);
			if (!curWindow) return '读取文件失败';
			const res: {
				label?: string[];
				children?: Record<string, any>;
				[key: string]: any;
			}[] = [];
			const filePath = dialog.showOpenDialogSync(curWindow, {
				title: '请选择文件夹',
				properties: ['openDirectory'],
			});
			if (!filePath) {
				return '读取文件失败';
			} else if (Array.isArray(filePath) && filePath.length > 0) {
				const fileContent = await fs.readdirSync(filePath[0]!, {
					recursive: true,
				});

				// 对当前文件结构进行解析
				fileContent.forEach((element: any) => {
					const pathArr = element.split(path.sep);
					let itemRes = transArrToTree(pathArr) as any;
					let temp: any;
					let key = filePath[0];
					while (itemRes?.label) {
						key += path.sep + itemRes.label;

						if (!temp) {
							let hasStore = res.find((item) => item.label === itemRes.label);
							if (!hasStore) {
								res.push(
									(temp = {
										label: itemRes.label,
										key: key,
										type: itemRes.type,
										children: [],
									})
								);
							} else {
								temp = hasStore;
							}
							itemRes = itemRes[itemRes.label];
						} else {
							let hasSet = temp.children.find((item: any) => item.label === itemRes.label);
							if (!hasSet) {
								temp.children.push(
									(hasSet = {
										label: itemRes.label,
										key: key,
										type: itemRes.type,
										children: [],
									})
								);
							}
							temp = hasSet;
							itemRes = itemRes[itemRes.label];
						}
					}
				});
			}
			// 获取文件夹中所有内容
			return {
				tree: res,
				originFile: filePath[0],
			};
		});
	}

	openFile() {
		ipcMain.handle('open-file', (e) => {
			const curWindow = BrowserWindow.fromWebContents(e.sender);
			if (!curWindow) return [];
			const filePath = dialog.showOpenDialogSync(curWindow, {
				title: '请选择文件',
				properties: ['openFile', 'multiSelections'],
			});
			if (Array.isArray(filePath) && filePath.length > 0) {
				return filePath.map((item) => {
					return item.split(path.sep).join('/');
				});
			}
			return [];
		});
	}

	handleFilePath() {
		ipcMain.handle('handle-file-path', (_event, filePath) => {
			return pathToFileURL(filePath).href;
		});
	}

	openNewWindow() {
		ipcMain.on('open-new-window', (_e: IpcMainEvent, url: string) => {
			if (this.hasCreatePath.has(url)) {
				this.hasCreatePath.get(url)?.show();
				return;
			}
			const newWin = windowManage.getWindow();
			newWin.show();
			newWin.on('closed', () => {
				this.hasCreatePath.delete(url);
			});
			this.hasCreatePath.set(url, newWin);
			if (app.isPackaged) {
				newWin.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: '/url' });
			} else {
				newWin.webContents.loadURL(`http://localhost:5173/#${url}`);
			}
		});
	}
}
export default IpcMainManage;
