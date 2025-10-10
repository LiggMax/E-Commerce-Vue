import { LOGIN, REGISTER } from '@/http/client/api.ts'
import request from '@/http/request.ts'

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
