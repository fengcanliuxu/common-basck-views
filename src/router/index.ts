import { HomeFilled, Setting, User } from '@element-plus/icons-vue';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			redirect: '/dashboard',
			meta: { requiresAuth: true },
			children: [
				{
					path: 'dashboard',
					name: 'Dashboard',
					component: () => import('@/views/Dashboard.vue'),
					meta: { title: '首页', icon: HomeFilled, requiresAuth: true },
				},
				{
					path: 'user',
					name: 'User',
					component: () => import('@/views/User.vue'),
					meta: { title: '用户管理', icon: User, requiresAuth: true },
				},
				{
					path: 'setting',
					name: 'Setting',
					component: () => import('@/views/Setting.vue'),
					meta: { title: '设置', icon: Setting, requiresAuth: true },
				},
				{
					path: 'playVideo',
					name: 'playVideo',
					component: () => import('@/views/palyVideo/index.vue'),
					meta: { title: '视频播放', icon: Setting, requiresAuth: true },
				},
			],
		},
		{
			path: '/float',
			name: 'float',
			component: () => import('../views/float/index.vue'),
		},
	],
});

// 路由守卫
router.beforeEach((to, _from) => {
	// 使用 electron 创建新的窗口
	return true;
});

export default router;
