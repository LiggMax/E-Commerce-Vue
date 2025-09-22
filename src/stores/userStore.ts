interface UserInfo {
  [key: string]: any
  token: string
}

const userStore = defineStore('userInfo', () => {
  const userInfo = ref({})

  const setUserInfo = (newUserInfo: UserInfo) => {
    userInfo.value = newUserInfo
  }

  const removeUserInfo = () => {
    userInfo.value = {}
  }
  return { userInfo, setUserInfo, removeUserInfo }
}, { persist: true })
