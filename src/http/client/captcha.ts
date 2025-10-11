import { CAPTCHA } from '@/http/client/api.ts'
import request from '@/http/client/clientRequest.ts'

/**
 * 获取验证码
 */
export async function getCaptchaService (lastTimeUid?: string) {
  return await request.get(CAPTCHA, { lastTimeUid })
}
