import { AUTH, RECHARGE, USER } from '@/http/client/api.ts'
import request from '@/http/client/clientRequest.ts'

/**
 * 注册
 */
export async function registerService (account: any) {
  return await request.post(`${AUTH}/register`, account)
}

/**
 * 注册邮箱验证码校验
 */
export async function verifyEmailService (params: { email: string, emailCode: string, type: boolean }) {
  return await request.post(`${AUTH}/verify`, null, { params })
}

/**
 * 登录
 */
export async function loginService (account: any) {
  return await request.post(`${AUTH}/login`, account)
}

/**
 * 找回密码
 */
export async function forgetPasswordService (params: { email: string, password: string, code: string, uuid: string }) {
  return await request.put(`${AUTH}/forget`, null, { params })
}

/**
 * 获取用户信息
 */
export async function getUserInfoService () {
  return await request.get(`${USER}/info`)
}

/**
 * 更新用户信息
 */
export async function updateUserInfoService (userData: FormData) {
  return await request.put(USER, userData)
}

/**
 * 充值
 */
export async function rechargeService (recharge: any) {
  return await request.patch(RECHARGE, recharge)
}

/**
 * 发布评论
 */
export async function publishCommentService (comment: any) {
  return await request.post(`${USER}/comment`, comment)
}
