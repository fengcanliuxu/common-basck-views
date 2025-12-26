<template>
	<div class="setting-container">
		<el-card shadow="hover">
			<template #header>
				<div class="card-header">
					<span>系统设置</span>
				</div>
			</template>

			<el-tabs v-model="activeTab" type="border-card">
				<el-tab-pane label="基本设置" name="basic">
					<el-form :model="settings" label-width="120px">
						<el-form-item label="系统名称">
							<el-input v-model="settings.systemName" placeholder="请输入系统名称" />
						</el-form-item>
						<el-form-item label="系统版本">
							<el-input v-model="settings.systemVersion" placeholder="请输入系统版本" disabled />
						</el-form-item>
						<el-form-item label="主题颜色">
							<el-select v-model="settings.themeColor" placeholder="请选择主题颜色">
								<el-option label="蓝色" value="blue" />
								<el-option label="绿色" value="green" />
								<el-option label="橙色" value="orange" />
								<el-option label="红色" value="red" />
							</el-select>
						</el-form-item>
						<el-form-item label="是否开启缓存">
							<el-switch v-model="settings.enableCache" />
						</el-form-item>
					</el-form>
				</el-tab-pane>

				<el-tab-pane label="安全设置" name="security">
					<el-form :model="securitySettings" label-width="120px">
						<el-form-item label="登录验证码">
							<el-switch v-model="securitySettings.enableCaptcha" />
						</el-form-item>
						<el-form-item label="密码复杂度">
							<el-select v-model="securitySettings.passwordComplexity" placeholder="请选择密码复杂度">
								<el-option label="简单" value="simple" />
								<el-option label="中等" value="medium" />
								<el-option label="复杂" value="complex" />
							</el-select>
						</el-form-item>
						<el-form-item label="密码过期时间">
							<el-input-number v-model="securitySettings.passwordExpireDays" :min="0" :max="365" placeholder="0表示永不过期" />
							<span style="margin-left: 10px">天</span>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>

			<div style="margin-top: 20px; display: flex; justify-content: flex-end">
				<el-button @click="handleReset">重置</el-button>
				<el-button type="primary" @click="handleSave">保存设置</el-button>
			</div>
		</el-card>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { ElMessage } from 'element-plus';

	const activeTab = ref('basic');

	const settings = ref({
		systemName: 'wyw工具箱',
		systemVersion: '1.0.0',
		themeColor: 'blue',
		enableCache: true,
	});

	const securitySettings = ref({
		enableCaptcha: true,
		passwordComplexity: 'medium',
		passwordExpireDays: 90,
	});

	const handleSave = () => {
		ElMessage.success('保存成功');
	};

	const handleReset = () => {
		settings.value = {
			systemName: 'wyw工具箱',
			systemVersion: '1.0.0',
			themeColor: 'blue',
			enableCache: true,
		};
		securitySettings.value = {
			enableCaptcha: true,
			passwordComplexity: 'medium',
			passwordExpireDays: 90,
		};
		ElMessage.info('已重置为默认设置');
	};
</script>

<style scoped>
	.setting-container {
		padding: 20px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
