// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    // 全局登录弹窗开关
    authDialog: false,
  }),
  actions: {
    openAuthDialog () {
      this.authDialog = true
    },
    closeAuthDialog () {
      this.authDialog = false
    },
    setAuthDialog (value: boolean) {
      this.authDialog = value
    },
  },
})
