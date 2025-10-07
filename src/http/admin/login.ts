import qs from 'qs'
import { CLEAR_TOKEN, LOGIN } from '@/http/admin/api.ts'
import request from '@/http/request.ts'
/**
 * 登录
 */
export async function login (account: string, password: string) {
  return await request.post(LOGIN, qs.stringify({ account, password }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

/**
 * 清理Token
 */
export async function cleanToken () {
  return await request.post(CLEAR_TOKEN)
}
