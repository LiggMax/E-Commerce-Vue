import type { Role } from '@/composables/enums/userRole.ts'
import request from '@/http/admin/adminRequest.ts'
import { USERS_MANAGEMENT } from '@/http/admin/api.ts'

/**
 * 获取当前登录账号信息
 */
export async function getCurrentUserInfo () {}

/**
 * 获取用户列表
 */
export async function getUsersService (pageNumber: number, pageSize: number, search?: string) {
  return await request.get(USERS_MANAGEMENT, {
    pageNumber,
    pageSize,
    search,
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
export async function addUser (data: FormData) {
  return await request.post(USERS_MANAGEMENT, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 更新用户信息
 */
export async function updateUser (data: FormData) {
  return await request.put(USERS_MANAGEMENT, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
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

/**
 * 设置用户角色
 */
export async function setUserRole (userId: string, role: Role) {
  return await request.patch(`${USERS_MANAGEMENT}/set_up_rolo`, { userId, role }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
