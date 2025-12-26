<template>
	<div class="w-full h-full outer">
		<div ref="floatPool" class="float-pool" @mousedown="mouseDown">
			<div>{{ hasUsedMemory + '%' }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const floatPool = ref<HTMLElement | null>(null);
	const hasUsedMemory = ref<number>(0);

	let isDragging = false;
	let dragOffsetX = 0; // 鼠标按下时，相对于窗口左上角的 X 偏移
	let dragOffsetY = 0; // 同上 Y

	const mouseDown = (e: MouseEvent) => {
		if (!floatPool.value) return;
		e.preventDefault();

		isDragging = true;

		// 关键：获取当前窗口位置（异步，但只在按下时取一次）
		window.renderUtils.invokeMsg('get-window-position').then((pos: [number, number]) => {
			const [winX, winY] = pos;
			// 计算鼠标相对于窗口左上角的偏移（固定值！拖拽全程不变）
			dragOffsetX = e.screenX - winX;
			dragOffsetY = e.screenY - winY;
		});

		window.addEventListener('mousemove', mouseMove);
		window.addEventListener('mouseup', mouseUp);
	};

	const mouseMove = (e: MouseEvent) => {
		if (!isDragging) return;

		// 使用 screenX/Y（与 setPosition 坐标系一致）
		const newX = e.screenX - dragOffsetX;
		const newY = e.screenY - dragOffsetY;

		// 直接设置目标位置（不是 delta！）
		window.renderUtils.sendMsg('set-window-position', { x: Math.round(newX), y: Math.round(newY) });
	};

	const mouseUp = () => {
		isDragging = false;
		window.removeEventListener('mousemove', mouseMove);
		window.removeEventListener('mouseup', mouseUp);
	};
	let basicData = Date.now();
	const getCurSystemInfo = () => {
		if (Date.now() - basicData >= 200) {
			basicData = Date.now();
			window.renderUtils.invokeMsg('get-system-info').then((info: any) => {
				hasUsedMemory.value = Math.ceil(((info.memory - info.canUseMemory) / info.memory) * 100);
			});
		}

		requestAnimationFrame(getCurSystemInfo);
	};

	requestAnimationFrame(() => {
		getCurSystemInfo();
	});

	onMounted(() => {
		// 确保元素不可选中、无焦点干扰
		if (floatPool.value) {
			floatPool.value.setAttribute('draggable', 'false');
		}
	});
</script>
<style></style>
<style scoped lang="less">
	.outer {
		display: grid;
		place-items: center;
		justify-items: center;
		background: transparent;
		.float-pool {
			width: 98px;
			height: 98px;
			border-radius: 50px;
			color: white;
			user-select: none;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 30px;
			font-weight: bold;
			outline-offset: 2px;
			outline: 2px solid rgb(42, 153, 255);
			border: 5px solid rgb(42, 153, 255);
			border-left-color: transparent;
			border-right-color: transparent;
			position: relative;
			&::after {
				content: '';
				position: absolute;
				width: 98px;
				height: 98px;
				top: 0px;
				left: 0px;
				background: #fff;
				background: repeating-linear-gradient(
					to bottom,
					transparent 0,
					transparent 80px,
					rgba(42, 153, 255, 0.1) 80px,
					rgb(42, 153, 255) 130px
				);
				-webkit-mask: repeating-linear-gradient(to right, transparent 0px, transparent 80px, #000 80px, #000 82px);
				transform: rotateX(90deg);
				animation: line 2s linear infinite;
			}
		}
	}
</style>
