import request from '@/http/admin/adminRequest.ts'
import { CAROUSEL } from '@/http/admin/api.ts'

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

/**
 * 更新轮播图状态
 */
export async function updateCarouselStatus (id: number, status: boolean) {
  return await request.patch(`${CAROUSEL}/status`, null, {
    params: {
      id,
      status,
    },
  })
}

/**
 * 更新轮播图排序
 */
export async function updateCarouselSort (id: number, sort: number) {
  return await request.patch(`{CAROUSEL}/sort`, { id, sort })
}

/**
 * 删除轮播图
 */
export async function deleteCarouselById (id: number) {
  return await request.delete(`${CAROUSEL}/${id}`)
}
