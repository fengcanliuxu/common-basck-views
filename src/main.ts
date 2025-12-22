import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(ElementPlus);

// 检查登录状态并通知主进程
if (window.renderUtils) {
	const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
	window.renderUtils.sendMsg('check-login-status', { isLoggedIn });
}
app.mount('#app');
