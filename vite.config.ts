import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import devBuildElectron from './plugins//viteDevDbuildElectron';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		devBuildElectron({}),
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
	],
});
