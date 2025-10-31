import request from '@/http/admin/adminRequest.ts'
import { USERS_MANAGEMENT } from '@/http/admin/api.ts'

/**
 * 获取用户列表
 */
export async function getUsers (pageNumber: number, pageSize: number) {
  return await request.get(USERS_MANAGEMENT, {
    pageNumber,
    pageSize,
  })
}

/**
 * 根据ID获取用户信息
 */
export async function getUserById (id: string) {
  return await request.get(`${USERS_MANAGEMENT}/${id}`)
}

/**
 * 添加用户
 */
export async function addUser (data: any) {
  return await request.post(USERS_MANAGEMENT, data)
}

/**
 * 更新用户信息
 */
export async function updateUser (data: any) {
  return await request.put(USERS_MANAGEMENT, data)
}

/**
 * 删除用户
 */
export async function deleteUserById (id: string) {
  return await request.delete(`${USERS_MANAGEMENT}/${id}`)
}

/**
 * 启用/禁用用户
 */
export async function toggleUserStatus (userId: string, isStatus: boolean) {
  return await request.patch(`${USERS_MANAGEMENT}/status`, { userId, isStatus }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
