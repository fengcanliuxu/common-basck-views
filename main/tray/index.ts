import { nativeImage, Tray } from 'electron';
import path from 'node:path';
import { iconPath } from '../common';
const createTray = () => {
	let icon = nativeImage.createFromPath(iconPath);
	icon = icon.resize({ width: 24, height: 24 });
	let tray = new Tray(icon);
	tray.setToolTip('WYW工具箱');
};

// 初始化托盘
export default createTray;
