import { nativeImage, Tray } from 'electron';
import path from 'node:path';
const createTray = () => {
	const iconPath = path.join(process.cwd(), 'assets', 'person.png');
	let icon = nativeImage.createFromPath(iconPath);
	icon = icon.resize({ width: 24, height: 24 });
	let tray = new Tray(icon);
	tray.setToolTip('wyw工具箱');
};

// 初始化托盘
export default createTray;
