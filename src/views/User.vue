<template>
  <div class="user-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAddUser">
            <el-icon :size="16"><plus /></el-icon>
            新增用户
          </el-button>
        </div>
      </template>

      <el-table :data="userList" style="width: 100%" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEditUser(scope.row)">
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteUser(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增/编辑用户对话框 -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="500px"
      >
        <el-form :model="form" label-width="80px">
          <el-form-item label="姓名" required>
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="邮箱" required>
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="角色" required>
            <el-select v-model="form.role" placeholder="请选择角色">
              <el-option label="管理员" value="管理员" />
              <el-option label="普通用户" value="普通用户" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useUserStore, type User } from '../stores/user'

const userStore = useUserStore()
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const editingId = ref<number | null>(null)

const userList = computed(() => userStore.getUserList)

const form = ref({
  name: '',
  email: '',
  role: '普通用户'
})

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    role: '普通用户'
  }
  editingId.value = null
}

const handleAddUser = () => {
  dialogTitle.value = '新增用户'
  resetForm()
  dialogVisible.value = true
}

const handleEditUser = (user: User) => {
  dialogTitle.value = '编辑用户'
  editingId.value = user.id
  form.value = {
    name: user.name,
    email: user.email,
    role: user.role
  }
  dialogVisible.value = true
}

const handleDeleteUser = (id: number) => {
  userStore.deleteUser(id)
  ElMessage.success('删除成功')
}

const handleSubmit = () => {
  if (!form.value.name || !form.value.email) {
    ElMessage.error('请填写必填项')
    return
  }

  if (editingId.value) {
    userStore.updateUser(editingId.value, form.value)
    ElMessage.success('更新成功')
  } else {
    userStore.addUser(form.value)
    ElMessage.success('新增成功')
  }

  dialogVisible.value = false
}
</script>

<style scoped>
.user-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
