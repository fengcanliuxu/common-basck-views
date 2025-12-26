import { createRouter, createWebHashHistory } from 'vue-router';
import Layout from '../components/Layout.vue';
import { HomeFilled, User, Setting } from '@element-plus/icons-vue';

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/login',
			name: 'Login',
			component: () => import('../views/Login.vue'),
			meta: { title: '登录', requiresAuth: false },
		},
		{
			path: '/',
			component: Layout,
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
	if (to.name === 'float') return true;
	// 检查路由是否需要认证
	const requiresAuth = to.matched.some((record) => record.meta.requiresAuth !== false);
	const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

	if (requiresAuth && !isLoggedIn) {
		// 未登录，重定向到登录页
		return { name: 'Login' };
	} else if (to.path === '/login' && isLoggedIn) {
		// 已登录，访问登录页时重定向到首页
		return { name: 'Dashboard' };
	}
	return true;
});

export default router;
