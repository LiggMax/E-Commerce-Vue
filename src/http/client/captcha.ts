import { CAPTCHA } from '@/http/client/api.ts'
import request from '@/http/request.ts'

/**
 * 获取验证码
 */
export async function getCaptchaService () {
  return await request.get(CAPTCHA)
}
