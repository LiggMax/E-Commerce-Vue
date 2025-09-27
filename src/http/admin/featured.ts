import { FEATURED } from '@/http/admin/api.ts'
import request from '@/http/request.ts'

/**
 * 添加精选商品
 */
export async function addFeatured (data: any) {
  return await request.post(FEATURED, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 获取精选商品数据
 */
export async function getFeatured (pageNumber: number, pageSize: number) {
  return await request.get(FEATURED, {
    pageNumber,
    pageSize,
  })
}

/**
 * 删除精选商品
 */
export async function deleteFeaturedById (id: string) {
  return await request.delete(`${FEATURED}/${id}`)
}
