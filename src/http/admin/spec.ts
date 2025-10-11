import request from '@/http/admin/adminRequest.ts'
import { SPECIFICATION } from '@/http/admin/api.ts'

/**
 * 添加商品规格
 */
export async function addSpecification (data: any) {
  return await request.post(SPECIFICATION, data)
}
