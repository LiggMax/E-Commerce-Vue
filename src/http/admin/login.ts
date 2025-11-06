import qs from 'qs'
import request from '@/http/admin/adminRequest.ts'
import { LOGIN, USER } from '@/http/admin/api.ts'

/**
 * 登录
 */
export async function loginService (account: string, password: string) {
  return await request.post(LOGIN, qs.stringify({ account, password }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

/**
 * 清理Token
 */
export async function cleanTokenService () {
  return await request.post(`${USER}/remove_token`)
}

/**
 * 获取当前账户信息
 */
export async function getUserInfoService () {
  return await request.get(`${USER}/info`)
}
