<template>
	<div class="dashboard-container">
		<el-card class="welcome-card" shadow="hover">
			<template #header>
				<div class="card-header">
					<span>欢迎使用wyw工具箱</span>
				</div>
			</template>
			<div class="welcome-content">
				<el-descriptions :column="2" border>
					<el-descriptions-item label="系统版本">1.0.0</el-descriptions-item>
					<el-descriptions-item label="登录时间">{{ currentTime }}</el-descriptions-item>
					<el-descriptions-item label="上次登录">2025-12-20 14:30:00</el-descriptions-item>
					<el-descriptions-item label="在线时长">2小时30分钟</el-descriptions-item>
				</el-descriptions>
			</div>
		</el-card>

		<div class="stats-container">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-card class="stat-card" shadow="hover">
						<div class="stat-content">
							<div class="stat-number">1,234</div>
							<div class="stat-label">总用户数</div>
							<div class="stat-trend">
								<el-icon :size="16"><arrow-up /></el-icon>
								<span class="stat-trend-text">12.5%</span>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :span="8">
					<el-card class="stat-card" shadow="hover">
						<div class="stat-content">
							<div class="stat-number">567</div>
							<div class="stat-label">今日活跃</div>
							<div class="stat-trend">
								<el-icon :size="16"><arrow-down /></el-icon>
								<span class="stat-trend-text negative">2.3%</span>
							</div>
						</div>
					</el-card>
				</el-col>
				<el-col :span="8">
					<el-card class="stat-card" shadow="hover">
						<div class="stat-content">
							<div class="stat-number">89</div>
							<div class="stat-label">今日新增</div>
							<div class="stat-trend">
								<el-icon><arrow-up /></el-icon>
								<span class="stat-trend-text">8.9%</span>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';
	import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';

	const currentTime = ref('');

	const updateTime = () => {
		const now = new Date();
		currentTime.value = now.toLocaleString('zh-CN');
	};

	onMounted(() => {
		updateTime();
		setInterval(updateTime, 1000);
	});
</script>

<style scoped>
	.dashboard-container {
		padding: 20px;
	}

	.welcome-card {
		margin-bottom: 20px;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.welcome-content {
		padding: 20px 0;
	}

	.stats-container {
		margin-top: 20px;
	}

	.stat-card {
		height: 150px;
	}

	.stat-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
	}

	.stat-number {
		font-size: 36px;
		font-weight: bold;
		color: #409eff;
		margin-bottom: 10px;
	}

	.stat-label {
		font-size: 16px;
		color: #606266;
		margin-bottom: 10px;
	}

	.stat-trend {
		display: flex;
		align-items: center;
	}

	.stat-trend-text {
		margin-left: 5px;
		font-size: 14px;
		color: #67c23a;
	}

	.stat-trend-text.negative {
		color: #f56c6c;
	}
</style>
