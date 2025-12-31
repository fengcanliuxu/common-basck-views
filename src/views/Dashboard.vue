<template>
	<div class="w-full h-full">
		<div class="grid main-container pl-10 pt-5 pb-5 pr-10 w-full h-full">
			<div class="flex flex-col fun-item items-center justify-center" @click="goToVideo">
				<img src="../../assets/SVG/video.svg" class="page-image"></img>
				<div>视频播放</div>
			</div>
			<div class="flex flex-col fun-item items-center justify-center" @click="geToPassword">
				<img src="../../assets/SVG/password.svg" class="page-image"></img>
				<div>密码管理</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">

const router = useRouter();



const goToVideo = () => {
	router.push('/playVideo');
}

const geToPassword = () => {
	router.push('/passwordManage');
}

onMounted(() => {
});
</script>

<style scoped lang="less">
	.main-container {
		font-size: 10px;
	  display: grid; /* ✅ 新增核心属性，开启grid布局，必加！ */
		grid-template-columns: repeat(7, 1fr);
		grid-template-rows: repeat(5, minmax(30px, 1fr));
		gap: 10px;
	
		.fun-item {
			border: 1px solid #eee;
			/* ✅ 删掉margin:10px，解决gap和margin的重复间距+溢出问题 */
			border-radius: 10px;
	
			&:hover {
				box-shadow: 2px 2px 8px #ccc;
			}
		}
	
		.page-image {
			width: 60px;
			height: auto;
		}
	}
	
	/* 响应式：小高度时调整布局 ✅ 全部修复完成 */
	@media (max-height: 700px) {
	  .main-container {
		grid-template-columns: repeat(5, 1fr);
	  }
	
	  .page-image {
		width: 30px;
		height: 30px;
	  }
	}
	</style>
