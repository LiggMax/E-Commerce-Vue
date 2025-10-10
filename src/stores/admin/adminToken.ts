export const userTokenStore = defineStore('adminToken', () => {
  // 响应式变量
  const token = ref('')
  // 修改token的值
  const setToken = (newToken: string) => {
    token.value = newToken
  }
  // 移除token的值
  const removeToken = () => {
    token.value = ''
  }
  // 返回响应式变量
  return { token, setToken, removeToken }
}, {
  persist: true,
})
