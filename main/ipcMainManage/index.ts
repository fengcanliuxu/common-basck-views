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

	/**
	 * 将当前链行数据转换为对象类型
	 * @param arr
	 */
	transArrToTree(arr: string[]) {
		const res: { label: string; [key: string]: string | Record<string, unknown> } = {
			label: '',
		};
		let temp: { label: string; [key: string]: string | Record<string, unknown> } = {
			label: '',
		};
		if (arr.length === 1) {
			res.content = arr[0] as string;
		}
		arr.forEach((item: string, index: number) => {
			if (index === 0) {
				res.label = item;
				res[item] = temp;
			} else {
				if (index !== arr.length - 1) {
					temp[item] = {};
				}
				temp.label = item;
				temp = temp[item] as any;
			}
		});
		return res;
	}

	openFolder() {
		ipcMain.handle('open-folder', async () => {
			const res: {
				label?: string[];
				children?: Record<string, any>;
				[key: string]: any;
			} = {};
			const filePath = dialog.showOpenDialogSync(this.curWindow, {
				title: '请选择文件夹',
				properties: ['openFile', 'openDirectory'],
			});
			if (!filePath) {
				return '读取文件失败';
			} else if (Array.isArray(filePath) && filePath.length > 0) {
				const stats = await fs.statSync(filePath[0]!);

				if (stats.isDirectory()) {
					// 是文件夹 读取文件夹内容
					const fileContent = await fs.readdirSync(filePath[0]!, {
						recursive: true,
					});
					let splitS = '\\';
					const curSystem = process.platform;
					if (curSystem === 'linux') {
						splitS = '\\';
					}

					// 对当前文件结构进行解析
					fileContent.forEach((element: any) => {
						const pathArr = element.split(splitS);
						const itemRes = this.transArrToTree(pathArr) as any;

						if (itemRes) {
							if (!res[itemRes.label]) {
								res[itemRes.label] = {};
							}
							// 找到下一个
							let child = itemRes[itemRes.label];
							let temp = res[itemRes.label];

							while (child?.label) {
								temp.children = temp.children || {};
								if (!temp.children?.label) {
									temp.children.label = child.label;
								}
								temp.children[child.label] ? (temp = temp.children[child.label]) : (temp.children[child.label] = temp = {});
								child = child[child.label];
							}
						}
					});
				}
			}
			fs.writeFileSync('./test.json', JSON.stringify(res, null, 2), 'utf-8');
			console.log(res, 'file');
			// 获取文件夹中所有内容
			return res;
		});
	}
}
export default IpcMainManage;
