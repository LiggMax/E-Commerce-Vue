import { ADD_CAROUSEL, GET_CAROUSEL } from '@/http/admin/api.ts'
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

/**
 * 获取轮播图数据
 */
export async function getCarousel (pageNumber: number, pageSize: number) {
  return await request.get(GET_CAROUSEL, {
    pageNumber,
    pageSize,
  })
}
