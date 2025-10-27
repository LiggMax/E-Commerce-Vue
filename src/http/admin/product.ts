import request from '@/http/admin/adminRequest.ts'
import { FEATURED } from '@/http/admin/api.ts'

/**
 * 添加商品
 */
export async function addProduct (data: any) {
  return await request.post(FEATURED, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 更新精选商品
 */
export async function updateProduct (data: any) {
  return await request.put(FEATURED, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 获取精选商品数据
 */
export async function getProduct (pageNumber: number, pageSize: number) {
  return await request.get(FEATURED, {
    pageNumber,
    pageSize,
  })
}

/**
 * 删除精选商品
 */
export async function deleteProductById (id: string) {
  return await request.delete(`${FEATURED}/${id}`)
}
