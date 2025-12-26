import { BrowserWindow, ipcMain, type IpcMainEvent, dialog } from 'electron';
import fs from 'node:fs';
import path from 'node:path';
class IpcMainManage {
	private curWindow: BrowserWindow;
	constructor(curWindow: BrowserWindow) {
		this.curWindow = curWindow;

		if (curWindow) {
			this.miniWindow();
			this.closeWindow();
			this.openTest();
			this.openFolder();
		}
	}
	miniWindow() {
		ipcMain.on('to-mini', (_e: IpcMainEvent) => {
			// 最小化窗口
			this.curWindow.minimize();
		});
	}
	closeWindow() {
		ipcMain.on('close-window', (_e: IpcMainEvent) => {
			this.curWindow.close();
		});
	}
	openTest() {
		ipcMain.on('open-test', (e: IpcMainEvent) => {
			e.sender.openDevTools();
		});
	}

	transArrToTree(arr){
		const res = {};
		arr.forEach((item:string) => {
	
		})
	}

	openFolder() {
		ipcMain.handle('open-folder', () => {
			const res = {};
			const path = dialog.showOpenDialogSync(this.curWindow, {
				title: '请选择文件夹',
				properties: ['openFile', 'openDirectory'],
			});
			if (!path) {
				return '读取文件失败';
			} else if (Array.isArray(path) && path.length > 0) {
				fs.stat(path[0], async (err, stats) => {
					if (stats.isDirectory()) {
						// 是文件夹 读取文件夹内容
						await fs.readdir(
							path[0],
							{
								recursive: true,
							},
							(_err, files) => {
								console.log(files, '当前所有文件');
								// 对当前文件结构进行解析
								files.forEach((element) => {
									// 转换为一个树状结构，当前可以看到对应的属性
									const temp = element.split('\\');
									for(let i = 0; i < temp.length; i  ++){
										if(i === 0){
											res[temp[i]].
										}
									}
								});
							}
						);
					}
				});
			}
			// 获取文件夹中所有内容

			return {
				folder: path,
			};
		});
	}
}
export default IpcMainManage;
