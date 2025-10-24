import { GET_USER_INFO, LOGIN, RECHARGE, REGISTER, USER } from '@/http/client/api.ts'
import request from '@/http/client/clientRequest.ts'

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
