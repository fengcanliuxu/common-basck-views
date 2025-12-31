<template>
	<div class="admin-container">
		<el-container class="w-full h-full">
			<el-header class="header w-full">
				<div>WYW工具箱</div>
				<div class="flex-1 h-full w-full can-drag"></div>
				<div class="flex items-center justify-between w-25 h-full">
					<el-button type="text" @click="sendTest">调</el-button>
					<div class="flex justify-center items-center header-icon h-full" @click="toMini">
						<el-icon><ElIconSemiSelect /></el-icon>
					</div>
					<div class="flex justify-center items-center header-icon h-full" @click="toMax">
						<el-icon><ElIconFullScreen /></el-icon>
					</div>
					<div class="flex justify-center items-center header-icon h-full" @click="closeApp">
						<el-icon><ElIconCloseBold /></el-icon>
					</div>
				</div>
			</el-header>
			<el-main>
				<el-container class="w-full h-full">
					<el-header class="header w-full">
						<div class="flex items-center w-full justify-between">
							<span>欢迎使用WYW工具箱 {{ route.fullPath }}</span>
							<div @click="changeTheme">
								<el-switch v-model="curTheme"></el-switch>
							</div>
						</div>
					</el-header>
					<router-view class="w-full h-full"></router-view>
				</el-container>
			</el-main>
			<el-footer>
				<Footer></Footer>
			</el-footer>
		</el-container>
	</div>
</template>

<script setup lang="ts">
	import { onMounted } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import { useThemeStore } from '../stores/theme';
	import Footer from './components/footer.vue';
	import { el } from 'element-plus/es/locales.mjs';

	const curTheme = ref(false);
	const isDark = useDark();
	const toggleDark = useToggle(isDark);

	const toMini = () => {
		window.renderUtils.sendMsg('to-mini');
	};

	const toMax = () => {
		window.renderUtils.sendMsg('to-max');
	};

	const closeApp = () => {
		window.renderUtils.sendMsg('close-window');
	};

	const route = useRoute();
	const router = useRouter();
	const themeStore = useThemeStore();

	const changeTheme = () => {
		console.log('点击了主题切换');

		toggleDark();
	};

	const sendTest = () => {
		window.renderUtils.sendMsg('open-test');
	};

	onMounted(() => {
		themeStore.initTheme();
	});
</script>

<style scoped>
	.admin-container {
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	.el-menu {
		border-right: none;
	}
</style>

<style>
	/* 深色主题样式 */
	.header {
		border-bottom: 1px solid rgb(217, 236, 255);
		height: 32px !important;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.can-drag {
			app-region: drag;
		}
		.header-icon {
			width: 32px;
			&:hover {
				background-color: #eee;
			}
		}
	}
</style>
