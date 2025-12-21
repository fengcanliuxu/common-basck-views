<template>
  <div class="admin-container">
    <el-container style="height: 100vh">
      <el-aside width="200px" style="background-color: #304156;">
        <div class="logo" style="height: 60px; line-height: 60px; text-align: center; color: white; font-size: 18px;">
          后台管理系统
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#ffd04b"
          @select="handleMenuSelect"
        >
          <el-menu-item
            v-for="route in routes"
            :key="route.path"
            :index="route.path"
          >
            <el-icon :size="18"><component :is="route.meta?.icon" /></el-icon>
            <template #title>{{ route.meta?.title }}</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="background-color: #fff; border-bottom: 1px solid #e6e6e6; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
          <div></div>
          <div style="display: flex; align-items: center; gap: 20px;">
            <el-button link @click="toggleTheme" title="切换主题">
              <el-icon :size="20"><moon /></el-icon>
            </el-button>
            <el-dropdown>
              <span class="el-dropdown-link">
                <el-avatar :size="32" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"></el-avatar>
                <span style="margin-left: 10px;">管理员</span>
                <el-icon :size="16" class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main>
          <!-- 面包屑 -->
          <div class="breadcrumb-container" style="margin-bottom: 20px;">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="route.matched.length > 1" :to="{ path: route.path }">
                {{ route.meta?.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { Moon, ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const themeStore = useThemeStore()

const routes = computed(() => {
  return route.matched[0]?.children || []
})

const activeMenu = computed(() => {
  return route.path
})

const handleMenuSelect = (index: string) => {
  router.push(index)
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

onMounted(() => {
  themeStore.initTheme()
})
</script>

<style scoped>
.admin-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.el-menu {
  border-right: none;
}
</style>

<style>
/* 深色主题样式 */
.dark {
  background-color: #1a1a1a;
  color: #ffffff;
}

.dark .el-header {
  background-color: #2a2a2a !important;
  border-bottom-color: #404040 !important;
}

.dark .el-breadcrumb__item:last-child .el-breadcrumb__inner,
.dark .el-breadcrumb__item:last-child .el-breadcrumb__inner a,
.dark .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
.dark .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  color: #ffffff;
}

.dark .el-breadcrumb__inner,
.dark .el-breadcrumb__inner a,
.dark .el-breadcrumb__inner a:hover {
  color: #a0a0a0;
}

.dark .el-breadcrumb__separator {
  color: #505050;
}

.dark .el-card {
  background-color: #2a2a2a;
  border-color: #404040;
}

.dark .el-card__header {
  background-color: #2d2d2d;
  border-bottom-color: #404040;
  color: #ffffff;
}

.dark .el-input__wrapper {
  background-color: #333333;
  border-color: #505050;
}

.dark .el-input__input {
  color: #ffffff;
}

.dark .el-input__wrapper.is-focus {
  box-shadow: 0 0 0 1px #409eff inset;
}

.dark .el-table {
  background-color: #2a2a2a;
  color: #ffffff;
  border-color: #404040;
}

.dark .el-table__header-wrapper {
  background-color: #2d2d2d;
}

.dark .el-table__header-wrapper th {
  background-color: #2d2d2d;
  color: #ffffff;
  border-bottom-color: #404040;
  font-weight: 500;
}

.dark .el-table__body-wrapper td {
  border-bottom-color: #404040;
}

.dark .el-table__body tr {
  background-color: #2a2a2a;
}

.dark .el-table__body tr:hover > td {
  background-color: #333333 !important;
}

.dark .el-table__body tr.current-row > td {
  background-color: #365f9c !important;
}

.dark .el-table__body tr.hover-row > td {
  background-color: #333333 !important;
}

.dark .el-table__empty-text {
  color: #808080;
}

.dark .el-table__fixed {
  background-color: #2a2a2a;
  border-color: #404040;
}

.dark .el-table__fixed-right {
  background-color: #2a2a2a;
  border-color: #404040;
}

.dark .el-dialog {
  background-color: #2a2a2a;
  color: #ffffff;
  border-color: #404040;
}

.dark .el-dialog__header {
  background-color: #2d2d2d;
  border-bottom-color: #404040;
}

.dark .el-dialog__title {
  color: #ffffff;
}

.dark .el-tabs__header {
  border-bottom-color: #404040;
}

.dark .el-tabs__item {
  color: #cccccc;
}

.dark .el-tabs__item.is-active {
  color: #409eff;
}

.dark .el-tabs__active-bar {
  background-color: #409eff;
}

.dark .el-dropdown-menu {
  background-color: #2a2a2a;
  border-color: #404040;
}

.dark .el-dropdown-menu__item {
  color: #ffffff;
}

.dark .el-dropdown-menu__item:hover {
  background-color: #333333;
}

.dark .el-button--link {
  color: #409eff;
}

.dark .el-button--link:hover {
  color: #66b1ff;
}

.dark .el-select__wrapper {
  background-color: #333333;
  border-color: #505050;
}

.dark .el-select__placeholder {
  color: #a0a0a0;
}

.dark .el-select__input {
  color: #ffffff;
}

.dark .el-select-dropdown {
  background-color: #2a2a2a;
  border-color: #404040;
}

.dark .el-select-dropdown__item {
  color: #ffffff;
}

.dark .el-select-dropdown__item:hover {
  background-color: #333333;
}

.dark .el-select-dropdown__item.selected {
  background-color: #365f9c;
  color: #ffffff;
}
</style>
