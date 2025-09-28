import { CAROUSEL } from '@/http/admin/api.ts'
import request from '@/http/request.ts'

/**
 * 添加轮播图
 */
export async function addCarousel (data: any) {
  return await request.post(CAROUSEL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 编辑轮播图数据
 */
export async function updateCarousel (data: any) {
  return await request.put(CAROUSEL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 获取轮播图数据
 */
export async function getCarousel (pageNumber: number, pageSize: number) {
  return await request.get(CAROUSEL, {
    pageNumber,
    pageSize,
  })
}
