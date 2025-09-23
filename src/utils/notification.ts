import { reactive } from 'vue'

// 通知状态管理
const snackbar = reactive({
  show: false,
  text: '',
  color: 'error',
  timeout: 3000,
})

// 创建一个通知函数
export function useNotification () {
  // 显示错误通知
  const showError = (message: string) => {
    snackbar.show = true
    snackbar.text = message
    snackbar.color = 'error'
    snackbar.timeout = 3000
  }

  // 显示成功通知
  const showSuccess = (message: string) => {
    snackbar.show = true
    snackbar.text = message
    snackbar.color = 'success'
    snackbar.timeout = 3000
  }

  // 显示警告通知
  const showWarning = (message: string) => {
    snackbar.show = true
    snackbar.text = message
    snackbar.color = 'warning'
    snackbar.timeout = 3000
  }

  // 显示信息通知
  const showInfo = (message: string) => {
    snackbar.show = true
    snackbar.text = message
    snackbar.color = 'info'
    snackbar.timeout = 3000
  }

  return {
    snackbar,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  }
}

// 创建一个全局通知实例
const notification = useNotification()
export default notification
