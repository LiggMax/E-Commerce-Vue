import request from '@/http/admin/adminRequest.ts'
import { USERS } from '@/http/admin/api.ts'

/**
 * 获取用户列表
 */
export async function getUsers (pageNumber: number, pageSize: number) {
  return await request.get(USERS, {
    pageNumber,
    pageSize,
  })
}

/**
 * 根据ID获取用户信息
 */
export async function getUserById (id: string) {
  return await request.get(`${USERS}/${id}`)
}

/**
 * 添加用户
 */
export async function addUser (data: any) {
  return await request.post(USERS, data)
}

/**
 * 更新用户信息
 */
export async function updateUser (data: any) {
  return await request.put(USERS, data)
}

/**
 * 删除用户
 */
export async function deleteUserById (id: string) {
  return await request.delete(`${USERS}/${id}`)
}

/**
 * 启用/禁用用户
 */
export async function toggleUserStatus (id: string, status: boolean) {
  return await request.put(`${USERS}/${id}/status`, { status })
}
