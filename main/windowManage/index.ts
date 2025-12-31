import { BrowserWindow } from 'electron';
import { iconPath } from '../common';
import path from 'path';

export class WindowManage {
	public stashWindowArr: BrowserWindow[] = [];
	constructor() {
		// 默认创建 5 个窗口池备用
		for (let i = 0; i < 5; i++) {
			const win = this.createWindow();
			this.stashWindowArr.push(win);
		}
	}

	/**
	 * 获取窗口
	 * @returns
	 */
	public getWindow() {
		const firstWin = this.stashWindowArr.shift();
		this.stashWindowArr.push(this.createWindow());
		return firstWin!;
	}

	/**
	 * 创建窗口
	 * @returns
	 */
	public createWindow() {
		const win = new BrowserWindow({
			show: false,
			frame: false,
			minWidth: 800,
			minHeight: 600,
			icon: iconPath,
			webPreferences: {
				preload: path.join(__dirname, '../preload/preload.cjs'),
			},
		});
		return win;
	}
}
export let windowManage: WindowManage;
export const initWindowManage = () => {
	if (windowManage) return windowManage;
	windowManage = new WindowManage();
	return windowManage;
};
