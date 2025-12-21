import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../components/Layout.vue'
import { HomeFilled, User, Setting } from '@element-plus/icons-vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { title: '登录', requiresAuth: false }
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
          component: () => import('../views/Dashboard.vue'),
          meta: { title: '首页', icon: HomeFilled, requiresAuth: true }
        },
        {
          path: 'user',
          name: 'User',
          component: () => import('../views/User.vue'),
          meta: { title: '用户管理', icon: User, requiresAuth: true }
        },
        {
          path: 'setting',
          name: 'Setting',
          component: () => import('../views/Setting.vue'),
          meta: { title: '设置', icon: Setting, requiresAuth: true }
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 检查路由是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'

  if (requiresAuth && !isLoggedIn) {
    // 未登录，重定向到登录页
    next({ name: 'Login' })
  } else if (to.path === '/login' && isLoggedIn) {
    // 已登录，访问登录页时重定向到首页
    next({ name: 'Dashboard' })
  } else {
    // 正常访问
    next()
  }
})

export default router
