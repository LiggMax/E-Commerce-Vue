import { SYSTEM_INFO } from '@/http/admin/api.ts'
import request from './adminRequest.ts'

/**
 * 获取系统信息
 */
export async function getSystemInfoService () {
  return await request.get(SYSTEM_INFO)
}
