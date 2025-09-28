import { useTheme } from 'vuetify'

const THEME_STORAGE_KEY = 'shopvue-theme'

export function useThemeToggle () {
  const theme = useTheme()
  const isDark = ref(false)

  // 从本地存储加载主题设置
  const loadTheme = () => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
      isDark.value = savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.global.name.value = isDark.value ? 'dark' : 'light'
    } catch (error) {
      console.warn('无法加载主题设置:', error)
    }
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    theme.global.name.value = isDark.value ? 'dark' : 'light'
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark.value ? 'dark' : 'light')
    } catch (error) {
      console.warn('无法保存主题设置:', error)
    }
  }

  // 监听主题变化
  watch(isDark, newValue => {
    theme.global.name.value = newValue ? 'dark' : 'light'
  })

  return {
    isDark,
    toggleTheme,
    loadTheme,
  }
}
