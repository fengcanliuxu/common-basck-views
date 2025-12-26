import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import devBuildElectron from './plugins/viteDevDbuildElectron';
import viteProBuildElectron from './plugins/viteProBuildElectron';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import UnoCSS from 'unocss/vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
// https://vite.dev/config/
export default defineConfig({
	base: './',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'), // ✅ 推荐使用 path.resolve
		},
	},
	plugins: [
		vue(),
		devBuildElectron({}),
		viteProBuildElectron({}),
		AutoImport({
			resolvers: [
				ElementPlusResolver({
					importStyle: 'css',
				}),
				IconsResolver({
					prefix: 'Icon',
				}),
			],
			imports: ['vue', 'vue-router', 'pinia'],
			dts: 'types/auto-imports.d.ts',
		}),
		Components({
			resolvers: [
				ElementPlusResolver({
					importStyle: 'css',
				}),
				IconsResolver({
					enabledCollections: ['ep'], // 启用 Element Plus 图标集
					prefix: 'ElIcon',
				}),
			],
			dts: 'types/components.d.ts',
		}),
		Icons({
			compiler: 'vue3',
			autoInstall: true,
		}),
		UnoCSS(),
	],
	build: {
		outDir: 'dist/renderer',
		rollupOptions: {},
	},
});
