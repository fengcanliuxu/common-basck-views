import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false
  }),
  getters: {
    getTheme: (state) => state.isDark ? 'dark' : 'light'
  },
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      this.updateDocumentTheme()
    },
    updateDocumentTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    initTheme() {
      // 从 localStorage 读取主题设置
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        this.isDark = savedTheme === 'dark'
      } else {
        // 检测系统主题
        this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      this.updateDocumentTheme()
    }
  }
})
