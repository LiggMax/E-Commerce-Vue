import { ADDRESS } from '@/http/client/api.ts'
import request from './clientRequest.ts'

/**
 * 添加收货地址
 */
export async function addAddressService (address: any) {
  return await request.post(ADDRESS, address)
}

/**
 *  获取收货地址
 */
export async function getAddressService () {
  return await request.get(ADDRESS)
}

/**
 * 删除收货地址
 */
export async function deleteAddressService (addressId: number) {
  return await request.delete(`${ADDRESS}/${addressId}`)
}

/**
 * 修改收货地址
 */
export async function updateAddressService (address: any) {
  return await request.put(ADDRESS, address)
}

/**
 * 设置默认地址
 */
export async function setDefaultAddressService (addressId: number) {
  return await request.patch(`${ADDRESS}/${addressId}`)
}
