import path from 'node:path';
import esbuild from 'esbuild';
import fs from 'node:fs';
const projectRoot = process.cwd();
import electronBuilder from 'electron-builder';

interface IOptions {
	mainPath?: string;
	preloadPath?: string;
	dirPath?: string;
}
type target = 'build';
const viteProBuildElectron = (options: IOptions) => {
	const mainPath = path.resolve(projectRoot, options.mainPath ?? './main/main.ts');
	const preloadPath = path.resolve(projectRoot, options.preloadPath ?? './preload/preload.ts');
	const outPath = path.resolve(projectRoot, options.dirPath ?? './dist');

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

	return {
		name: 'vite-plugin-build-electron-production',
		apply: 'build' as target,
		options() {
			// console.log(__dirname, '当前绝对地址');
			console.log(options);
			console.log(process.cwd(), '当前目录');
		},

		closeBundle() {
			buildElectron().then(() => {
				const json = JSON.parse(
					fs.readFileSync('package.json', {
						encoding: 'utf-8',
					})
				);
				json.main = 'main/main.cjs';
				fs.writeFileSync('dist/package.json', JSON.stringify(json, null, 4));
				fs.writeFileSync('dist/node_module', '');
				electronBuilder
					.build({
						config: {
							appId: 'wyw-back-views',
							productName: 'wyw-back-views',
							directories: {
								output: 'release', // 避免与 dist 冲突
								app: 'dist', // electron-builder 会从这里读取资源
							},
							win: { target: 'nsis' },
						},
					})
					.then(
						() => {},
						(error) => {
							console.log('构建失败', error);
							process.exit(1);
						}
					);
			});
		},
	};
};

export default viteProBuildElectron;
