<template>
	<div class="page-footer w-full h-full flex p-2">
		<div>
			<div>当前内存占用：{{ memoryPer }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	let curDate = Date.now();
	const memoryPer = ref('');
	const getCurSystemInfo = async () => {
		let aniDate = Date.now();
		if (aniDate - curDate >= 100) {
			const { canUseMemory, memory } = await renderUtils.invokeMsg('get-system-info');
			curDate = aniDate;
			memoryPer.value = Math.ceil(((memory - canUseMemory) / memory) * 100) + '%';
		}
		requestAnimationFrame(getCurSystemInfo);
	};
	requestAnimationFrame(getCurSystemInfo);
	onMounted(() => {});
</script>

<style lang="less" scoped>
	.page-footer {
		background-color: #effcfd;
	}
</style>
