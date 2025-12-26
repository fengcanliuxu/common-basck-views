<template>
	<div class="admin-container">
		<el-container style="height: 100vh">
			<el-header class="header w-full">
				<div>wyw工具箱</div>
				<div class="flex-1 h-full w-full can-drag"></div>
				<div class="flex items-center justify-between w-25 h-full">
					<el-button type="text" @click="sendTest">调</el-button>
					<div class="flex justify-center items-center header-icon h-full" @click="toMini">
						<el-icon><ElIconSemiSelect /></el-icon>
					</div>
					<div class="flex justify-center items-center header-icon h-full">
						<el-icon><ElIconFullScreen /></el-icon>
					</div>
					<div class="flex justify-center items-center header-icon h-full" @click="closeApp">
						<el-icon><ElIconCloseBold /></el-icon>
					</div>
				</div>
			</el-header>
			<el-container>
				<el-aside width="200px" style="background-color: #304156">
					<div class="logo" style="height: 60px; line-height: 60px; text-align: center; color: white; font-size: 18px">wyw工具箱</div>
					<el-menu
						:default-active="activeMenu"
						class="el-menu-vertical-demo"
						background-color="#304156"
						text-color="#fff"
						active-text-color="#ffd04b"
						@select="handleMenuSelect"
					>
						<el-menu-item v-for="route in routes" :key="route.path" :index="route.path">
							<el-icon :size="18"><component :is="route.meta?.icon" /></el-icon>
							<template #title>{{ route.meta?.title }}</template>
						</el-menu-item>
					</el-menu>
				</el-aside>

				<el-container>
					<el-header
						style="
							background-color: #fff;
							border-bottom: 1px solid #e6e6e6;
							display: flex;
							justify-content: space-between;
							align-items: center;
							padding: 0 20px;
						"
					>
						<div></div>
						<div style="display: flex; align-items: center; gap: 20px">
							<el-button link @click="toggleTheme" title="切换主题">
								<el-icon :size="20"><moon /></el-icon>
							</el-button>
							<el-dropdown>
								<span class="el-dropdown-link">
									<el-avatar :size="32" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
									<span style="margin-left: 10px">管理员</span>
									<el-icon :size="16" class="el-icon--right"><arrow-down /></el-icon>
								</span>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item>个人中心</el-dropdown-item>
										<el-dropdown-item>退出登录</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
					</el-header>

					<el-main>
						<!-- 面包屑 -->
						<div class="breadcrumb-container" style="margin-bottom: 20px">
							<el-breadcrumb separator="/">
								<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
								<el-breadcrumb-item v-if="route.matched.length > 1" :to="{ path: route.path }">
									{{ route.meta?.title }}
								</el-breadcrumb-item>
							</el-breadcrumb>
						</div>
						<router-view />
					</el-main>
				</el-container>
			</el-container>
		</el-container>
	</div>
</template>

<script setup lang="ts">
	import { computed, onMounted } from 'vue';
	import { useRoute, useRouter } from 'vue-router';
	import { useThemeStore } from '../stores/theme';
	import { Moon, ArrowDown } from '@element-plus/icons-vue';

	const toMini = () => {
		window.renderUtils.sendMsg('to-mini');
	};

	const closeApp = () => {
		window.renderUtils.sendMsg('close-window');
	};

	const route = useRoute();
	const router = useRouter();
	const themeStore = useThemeStore();

	const routes = computed(() => {
		return route.matched[0]?.children || [];
	});

	const activeMenu = computed(() => {
		return route.path;
	});

	const sendTest = () => {
		window.renderUtils.sendMsg('open-test');
	};

	const handleMenuSelect = (index: string) => {
		router.push(index);
	};

	const toggleTheme = () => {
		themeStore.toggleTheme();
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
		background-color: #fff;
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
