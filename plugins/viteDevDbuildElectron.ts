import type { ViteDevServer, HmrContext } from 'vite';
import * as esbuild from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { spawn } from 'node:child_process';
import electron from 'electron';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);
const projectRoot = path.join(__dirname, '..');
interface IOptions {
	mainPath?: string;
	preloadPath?: string;
	dirPath?: string;
}

const devBuildElectron = (options: IOptions) => {
	const mainPath = path.resolve(projectRoot, options.mainPath ?? './main/main.ts');
	const preloadPath = path.resolve(projectRoot, options.preloadPath ?? './preload/preload.ts');
	const outPath = path.resolve(projectRoot, options.dirPath ?? './dist');
	const originMain = path.basename(mainPath ?? '');
	const originPreload = path.basename(preloadPath ?? '');

	let electronProcess: any;
	let devUrl = '';

	const buildElectron = () => {
		// 分别构建main和preload，因为它们需要不同的配置
		const mainBuild = esbuild.build({
			entryPoints: [mainPath],
			outdir: path.join(outPath, 'main'),
			bundle: true,
			platform: 'node',
			target: 'node16',
			outExtension: { '.js': '.cjs' },
			external: ['electron', 'electron/*'],
		});

		const preloadBuild = esbuild.build({
			entryPoints: [preloadPath],
			outdir: path.join(outPath, 'preload'),
			bundle: true,
			// 使用es2015或更高版本以支持class语法
			target: 'es2015',
			outExtension: { '.js': '.cjs' },
			external: ['electron', 'electron/*'],
		});

		return Promise.all([mainBuild, preloadBuild]);
	};

	const startElectronServer = (devUrl: string) => {
		if (electronProcess) {
			electronProcess.kill();
		}
		electronProcess = spawn(
			electron.toString(),
			[
				// 当前参数
				path.join(outPath, '/main/main.cjs'),
				path.join(outPath, '/preload/preload.cjs'),
				devUrl,
			],
			{
				cwd: process.cwd(),
				env: process.env,
				stdio: 'inherit', // 👈 让 Electron 日志输出到终端
			}
		);
	};

	const onProcess = (server: ViteDevServer) => {
		electronProcess.on('error', (error: Error) => {
			console.log(error, '当前进程存在问题');
			electronProcess.kill();
			server.httpServer?.close();
		});
		server.httpServer?.on('close', () => {
			if (electronProcess) electronProcess.kill();
		});
	};

	return {
		name: 'vite-plugin-build-electron',

		options() {
			// console.log(__dirname, '当前绝对地址');
		},
		/**
		 * 配置开发服务器的钩子
		 */
		configureServer(server: ViteDevServer) {
			server = server;

			buildElectron().then(() => {
				// 热更新就会打包，当前需要判断什么时候更新的是
				server.httpServer?.once('listening', () => {
					const addressInfo = server.httpServer!.address() as any;
					let host = addressInfo.address;
					if (host === '::1' || host === '0.0.0.0') {
						host = 'localhost';
					}
					devUrl = `http://${host}:${addressInfo.port}`;
					console.log(host, '当前地址信息');

					startElectronServer(devUrl);
					onProcess(server);
				});
			});
		},

		handleHotUpdate(ctx: HmrContext) {
			if (originMain === path.basename(ctx.file) || originPreload === path.basename(ctx.file)) {
				// 重新打包当前文件，重新执行
				if (electronProcess) electronProcess.kill();
				buildElectron().then(() => {
					startElectronServer(devUrl);
				});
			}
		},
	};
};

export default devBuildElectron;
