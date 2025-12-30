<template>
	<div class="w-full outer-video" @drop="handleDrag" @dragenter.prevent @dragover.prevent>
		<el-splitter>
			<el-splitter-panel :size="leftPart" class="animation" :min="400">
				<div class="w-full h-full">
					<video class="video w-full" :src="videoPath" autoplay controls ref="videoPlay"></video>
					<div class="footer-control flex items-center justify-between">
						<div class="flex">
							<div class="icon" @click.prevent="videoStart">
								<el-icon><ElIconVideoPlay /></el-icon>
							</div>
							<div class="icon ml-1">
								<el-icon><ElIconCaretLeft /></el-icon>
							</div>
							<div class="icon ml-1">
								<el-icon><ElIconCaretRight /></el-icon>
							</div>
						</div>

						<div class="icon" @click="handleListVisible">
							<el-icon v-if="isShowVisible"><ElIconExpand /></el-icon>
							<el-icon v-else="!isShowVisible"><ElIconFold /></el-icon>
						</div>
					</div>
				</div>
			</el-splitter-panel>
			<el-splitter-panel :min="200" :size="rightPart">
				<div ref="rightPartRef" class="h-full">
					<div v-if="fileList.length === 0" class="w-full h-full" @click="openFolder">
						文件列表
						<el-empty description="请拖入视频或者点击打开文件夹" />
					</div>
					<div v-else class="h-full">
						<el-button @click="openFile">打开文件</el-button>
						<el-button @click="openFolder">打开文件夹</el-button>
						<el-tree-v2
							:height="playTreeHeight"
							:data="fileList"
							:highlight-current="true"
							:props="{
								value: 'key',
							}"
							@node-click="nodeClick"
						>
							<template #default="{ node }">
								{{ node.type }}
								<el-icon v-if="node.label.endsWith('.mp4')"><ElIconVideoPlay /></el-icon>
								<el-icon v-else><ElIconFolderOpened /></el-icon>

								<span>{{ node.label }} {{ node.type }}</span>
							</template>
						</el-tree-v2>
					</div>
				</div>
			</el-splitter-panel>
		</el-splitter>
	</div>
</template>

<script lang="ts">
	export default {
		name: 'index',
	};
</script>
<script setup lang="ts">
	interface IVideo {
		name: string;
		path: string;
	}
	const videoPlay = useTemplateRef('videoPlay');
	const videoPath = ref('');
	const isShowVisible = ref(true);
	const videoList = ref<IVideo[]>([]);
	const fileList = ref<File[]>([]);
	const playTreeHeight = ref(200);
	const rightPartEl = useTemplateRef<Element>('rightPartRef');
	const selectNode = ref('');
	const leftPart = computed(() => {
		return isShowVisible.value ? '70%' : '100%';
	});

	const rightPart = computed(() => {
		return isShowVisible.value ? '30%' : '0';
	});

	const handleListVisible = () => {
		isShowVisible.value = !isShowVisible.value;
	};

	const openFile = async () => {
		const allFile = await renderUtils.invokeMsg('open-file');
		console.log(allFile, '当前所有路径');
	};

	const openFolder = async () => {
		const folder = await renderUtils.invokeMsg('open-folder');
		// 将当前结构转换为树型数组
		if (Array.isArray(folder.tree)) {
			fileList.value = folder.tree;
			console.log(fileList.value, '但其概念树型结构');
		}
	};

	const handleDrag = (e: DragEvent) => {
		e.preventDefault();
		if (e.dataTransfer) {
			for (const file of e.dataTransfer.files as any) {
				console.log(file);
				if (file.type.startsWith('video')) {
					// 可以获取得到当前的文件信息
					const handledFile = window.renderUtils.handleFile(file);
					const allPath = handledFile.split('\\');
					videoList.value.push({
						name: allPath[allPath.length - 1],
						path: handledFile,
					});
					fileList.value.push(file);
				}
			}
		}
	};
	const playVideo = (index: number) => {
		videoPath.value = URL.createObjectURL(fileList.value[index] as File);
	};

	const videoStart = () => {
		if (videoPlay.value) {
			videoPlay.value.play();
		}
	};

	const nodeClick = async (data, node) => {
		const { key, type } = node.data;
		if (type === 'video') {
			const formatPath = key.replace(/\\/g, '/'); // 把所有反斜杠\ 替换成 正斜杠/
			videoPath.value = `atom://${formatPath}`;
			console.log(`atom://${formatPath}`, '当前地址');
		}
	};

	onMounted(() => {
		const resizeObserver = new ResizeObserver((e: ResizeObserverEntry[]) => {
			if (Array.isArray(e) && e.length > 0 && e[0]?.contentRect) {
				playTreeHeight.value = e[0]?.contentRect.height - 50;
			}
		});
		if (rightPartEl.value) {
			resizeObserver.observe(rightPartEl.value);
		}
	});
</script>

<style lang="less" scoped>
	.test {
		border: 1px solid red;
	}
	.animation {
		animation: 2s ease 1s width-trans;
	}

	@keyframes width-trans {
		form {
			width: 70%;
		}
		to {
			width: 100%;
		}
	}
	.video {
		height: calc(100% - 35px);
	}
	.outer-video {
		height: calc(100% - 35px);
		.footer-control {
			height: 35px;
		}
		.icon {
			height: 35px;
			font-size: 25px;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 35px;
			background-color: #eee;
			&:hover {
				color: gold;
			}
		}
	}

	.video-name {
		word-break: break-all;
	}
</style>
