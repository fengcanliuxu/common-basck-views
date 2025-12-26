<template>
	<div class="login-container">
		<div class="login-box">
			<el-card class="login-card" shadow="hover">
				<template #header>
					<div class="card-header">
						<h2 style="margin: 0">wyw工具箱</h2>
						<p style="margin: 5px 0 0 0; color: #909399; font-size: 14px">请登录您的账号</p>
					</div>
				</template>
				<el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px" class="login-form">
					<el-form-item label="用户名" prop="username">
						<el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user" autocomplete="off" />
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input
							v-model="loginForm.password"
							type="password"
							placeholder="请输入密码"
							prefix-icon="el-icon-lock"
							show-password
							autocomplete="off"
						/>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" class="login-button" :loading="loading" @click="handleLogin"> 登录 </el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useRouter } from 'vue-router';
	import { ElMessage } from 'element-plus';
	import type { FormInstance } from 'element-plus';

	const router = useRouter();
	const loginFormRef = ref<FormInstance>();
	const loading = ref(false);

	const loginForm = ref({
		username: '',
		password: '',
	});

	const loginRules = {
		username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
		password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
	};

	const handleLogin = async () => {
		if (!loginFormRef.value) return;

		loginFormRef.value.validate((valid) => {
			if (valid) {
				loading.value = true;

				// 模拟登录请求
				setTimeout(() => {
					// 验证用户名和密码
					if (loginForm.value.username === 'wyw' && loginForm.value.password === '1') {
						// 登录成功，保存登录状态
						localStorage.setItem('isLoggedIn', 'true');

						// 发送事件通知 Electron 窗口最大化
						if (window.renderUtils) {
							window.renderUtils.sendMsg('login-success', '登录成功');
						}

						ElMessage.success('登录成功');
						router.push('/');
					} else {
						ElMessage.error('用户名或密码错误');
					}
					loading.value = false;
				}, 500);
			}
		});
	};
</script>

<style scoped>
	.login-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.login-box {
		width: 400px;
		max-width: 90%;
	}

	.login-card {
		background-color: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
	}

	.card-header {
		text-align: center;
	}

	.login-form {
		margin-top: 20px;
	}

	.login-button {
		width: 100%;
		height: 40px;
		font-size: 16px;
	}
</style>
