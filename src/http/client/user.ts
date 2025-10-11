import request from '@/http/admin/adminRequest.ts'
import { GET_USER_INFO, LOGIN, REGISTER } from '@/http/client/api.ts'

/**
 * 注册
 */
export async function registerService (account: any) {
  return await request.post(REGISTER, account)
}

/**
 * 登录
 */
export async function loginService (account: any) {
  return await request.post(LOGIN, account)
}

/**
 * 获取用户信息
 */
export async function getUserInfoService () {
  return await request.get(GET_USER_INFO)
}
