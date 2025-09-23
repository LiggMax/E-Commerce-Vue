import qs from 'qs'
import { LOGIN } from '@/http/admin/api.ts'
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
