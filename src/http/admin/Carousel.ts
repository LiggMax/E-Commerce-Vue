import { ADD_CAROUSEL } from '@/http/admin/api.ts'
import request from '@/http/request.ts'

/**
 * 添加轮播图
 */
export async function addCarousel (data: any) {
  return await request.post(ADD_CAROUSEL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
