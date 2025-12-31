<template>
	<div class="w-full h-full p-2">
		<el-container class="h-full">
			<el-aside class="aside">
				<div class="w-full h-full">
					<el-tree-v2 :data="treeData" :highlight-current="true" @node-click="handleNodeClick"> </el-tree-v2>
				</div> </el-aside
			><el-main>
				<el-container class="h-full">
					<el-header>
						<div class="flex items-center w-full h-full edit-header">
							<el-icon class="ml-4 edit-icon"><ElIconCirclePlus @click="handleAdd" /></el-icon>
							<el-icon class="ml-4 edit-icon" @click="isEdit = false"><ElIconEdit /></el-icon>
						</div>
					</el-header>
					<el-container class="h-full">
						<el-main class="mt-4 h-full">
							<div class="w-full h-full p-10 flex justify-center items-center flex-col">
								<el-form
									label-width="80"
									:model="formData"
									ref="addFormRef"
									class="w-full"
									style="max-width: 600px"
									:disabled="isEdit"
								>
									<el-form-item label="分组" prop="team">
										<el-input v-model="formData.team" clearable></el-input>
									</el-form-item>
									<el-form-item label="标识" prop="title" :rules="[{ required: true, message: '标识不不可为空' }]">
										<el-input v-model="formData.title" clearable placeholder="请输入账号标识"></el-input>
									</el-form-item>
									<el-form-item label="名称" prop="label" :rules="[{ required: true, message: '名称不可为空' }]">
										<el-input v-model="formData.label" clearable placeholder="请输入账号名称"></el-input>
									</el-form-item>
									<el-form-item label="密码">
										<el-col :span="22">
											<el-form-item prop="password" :rules="[{ required: true, message: '密码不可为空' }]">
												<el-input
													v-model="formData.password"
													clearable
													type="password"
													:show-password="!isEdit"
													placeholder="请输入密码"
												>
												</el-input>
											</el-form-item>
										</el-col>
										<el-col :span="2" class="h-full">
											<el-button :disabled="false" @click="copyPassword(formData.password)" class="copy-icon">
												<el-icon><ElIconCopyDocument /></el-icon>
											</el-button>
										</el-col>
									</el-form-item>
									<el-form-item label="更新时间" v-if="formData.updateTime">
										{{ formData.updateTime }}
									</el-form-item>
									<el-form-item label="创建时间" v-if="formData.createTime">
										{{ formData.createTime }}
									</el-form-item>

									<el-form-item>
										<el-button @click="savePassword">保存</el-button>
										<el-button @click="isEdit = true">取消</el-button>
									</el-form-item>
								</el-form>
							</div>
						</el-main>
					</el-container>
				</el-container>
			</el-main>
		</el-container>
	</div>
</template>

<script setup lang="ts">
	import dayjs from 'dayjs';

	const storePassword = 'wyw-password-store';
	const addFormRef = useTemplateRef('addFormRef');
	const treeData = ref([]);
	const isEdit = ref(true);
	const formData = reactive<Record<string, any>>({
		team: '',
		label: '',
		title: '',
		password: '',
		updateTime: '',
		createTime: '',
	});
	/**
	 * 保存密码
	 */
	const savePassword = () => {
		console.log(addFormRef.value, '当前表单');
		const initData = JSON.parse(localStorage.getItem(storePassword) || '{}');

		addFormRef.value?.validate((valid) => {
			if (valid) {
				const curInfo = {
					label: formData.label,
					title: formData.title,

					password: formData.password,
					createTime: Date.now(),
					updateTime: Date.now(),
					id: formData.label + '/' + formData.password + '/' + Date.now(),
				};
				if (formData.team) {
					let temp;
					let hasStore = initData[`password-team-${formData.team}`] ?? {};
					if (Object.keys(hasStore).length > 0) {
						temp = hasStore.children || [];
						temp.push(curInfo);
						hasStore.children = temp;
					} else {
						hasStore = {
							label: formData.team,
							id: formData.team,
							children: [curInfo],
						};
					}
					initData[`password-team-${formData.team}`] = hasStore;
				} else {
					// 生成唯一标识
					initData[`password/${formData.label}/${Date.now()}`] = curInfo;
				}
			}
			localStorage.setItem(storePassword, JSON.stringify(initData));
			treeData.value = Object.values(initData);
		});
	};

	const handleAdd = () => {
		isEdit.value = false;
		Object.keys(formData).forEach((key: string) => {
			formData[key] = '';
		});
	};

	const handleNodeClick = (_data: any, node: any) => {
		const nodeData = node.data;
		if (Array.isArray(nodeData.children) && nodeData.children.length > 0) {
			// 如果是分组节点，则不进行任何操作
			return;
		}
		formData.team = nodeData.team || '';
		formData.title = nodeData.title || '';
		formData.label = nodeData.label || '';
		formData.password = nodeData.password || '';
		formData.createTime = dayjs(nodeData.createTime).format('YYYY-MM-DD HH:mm:ss') || '';
		formData.updateTime = dayjs(nodeData.updateTime).format('YYYY-MM-DD HH:mm:ss') || '';
		console.log(formData, '当前表单信息');
		nextTick(() => {
			addFormRef.value?.clearValidate(['password', 'label', 'title']);
		});
	};

	const copyPassword = (data: string) => {
		renderUtils.sendMsg('copy-to-clipboard', data);
	};

	onMounted(() => {
		const hasStore = JSON.parse(localStorage.getItem(storePassword) || '{}');
		treeData.value = Object.values(hasStore);
	});
</script>

<style lang="less" scoped>
	.aside {
		border-right: 1px solid var(--el-border-color);
	}
	:deep(.el-header) {
		height: 30px;
	}
	.edit-header {
		border-bottom: 1px solid var(--el-border-color);
		.edit-icon {
			font-size: 25px;
		}
	}
	.copy-icon {
		border: 1px solid var(--el-border-color);
		border-radius: 5px;
		margin-top: 1px;
	}
</style>
