import { app, BrowserWindow, ipcMain, IpcMainEvent, Tray, Menu, nativeImage } from 'electron';
import path from 'path';

let tray: Tray | null = null;
let mainWindow: BrowserWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 500, // 登录窗口宽度
		height: 400, // 登录窗口高度
		resizable: false, // 登录窗口不可调整大小
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
		mainWindow!.webContents.openDevTools();
	});
	return mainWindow;
};

app.whenReady().then(() => {
	createWindow();

	// 创建托盘图标
	const createTray = () => {
		// 获取图标路径
		const iconPath = path.join(process.cwd(), 'assets', 'person.png');
		console.log('Tray icon path:', iconPath);

		// 创建原生图片并调整大小
		let icon = nativeImage.createFromPath(iconPath);
		// 调整图标大小，根据系统托盘建议尺寸调整
		icon = icon.resize({ width: 24, height: 24 });

		// 创建托盘
		tray = new Tray(icon);

		// 创建上下文菜单
		const contextMenu = Menu.buildFromTemplate([
			{
				label: '显示窗口',
				click: () => {
					if (mainWindow) {
						mainWindow.show();
					}
				},
			},
			{
				label: '隐藏窗口',
				click: () => {
					if (mainWindow) {
						mainWindow.hide();
					}
				},
			},
			{
				type: 'separator',
			},
			{
				label: '退出',
				click: () => {
					app.quit();
				},
			},
		]);

		// 设置托盘图标和工具提示
		tray.setToolTip('后台管理系统');
		tray.setContextMenu(contextMenu);

		// 点击托盘图标显示/隐藏窗口
		tray.on('click', () => {
			if (mainWindow) {
				if (mainWindow.isVisible()) {
					mainWindow.hide();
				} else {
					mainWindow.show();
				}
			}
		});
	};

	// 初始化托盘
	createTray();

	ipcMain.on('test', (e: IpcMainEvent, data: any) => {
		// 打印当前事件对象
		console.log(data, '当前获取到的数据');
	});
	// 监听登录成功事件，最大化窗口
	ipcMain.on('login-success', (e: IpcMainEvent, data: any) => {
		console.log(data, '登录成功，窗口将最大化');
		// 设置窗口可调整大小
		mainWindow.setResizable(true);
		// 最大化窗口
		mainWindow.maximize();
	});
	// 监听检查登录状态事件
	ipcMain.on('check-login-status', (e: IpcMainEvent, data: any) => {
		console.log(data, '检查登录状态');
		if (data.isLoggedIn) {
			// 如果已登录，设置窗口可调整大小并最大化
			mainWindow.setResizable(true);
			mainWindow.maximize();
		}
	});
});
