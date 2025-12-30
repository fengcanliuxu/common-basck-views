<template>
	<div class="w-full h-full">
		<div class="grid main-container p-4 w-full h-full">
			<div class="flex flex-col fun-item items-center justify-center" @click="goToVideo">
				<img src="../../assets/SVG/video.svg"></img>
				<div>视频播放</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, onMounted } from 'vue';

	const router = useRouter();
	const currentTime = ref('');

	const updateTime = () => {
		const now = new Date();
		currentTime.value = now.toLocaleString('zh-CN');
	};

	const goToVideo = () => {
		router.push('/playVideo');
	}

	onMounted(() => {
		updateTime();
		setInterval(updateTime, 1000);
	});
</script>

<style scoped lang="less">
	.main-container {
		font-size: 20px;
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(7, 1fr);
		gap: 10px;
		.fun-item{
			border: 1px solid #eee;
			border-radius: 10px;
			&:hover{
				box-shadow: 2px 2px 8px #ccc;
			}
			
		}
	}
</style>
