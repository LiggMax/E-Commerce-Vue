import axios from 'axios'
import { BACKEND } from '@/http/admin/api.ts'
import notification from '@/utils/notification'

const instance = axios.create({
  baseURL: BACKEND,
  timeout: 30_000,
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // TODO 后续添加认证token等

    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 可以根据后端约定统一处理响应数据
    return response.data
  },
  error => {
    // 统一处理错误
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401: {
          // 未授权，可能需要重新登录
          notification.showError('未授权，请重新登录')
          break
        }
        case 403: {
          notification.showError('拒绝访问')
          break
        }
        case 404: {
          notification.showError('请求资源不存在')
          break
        }
        case 500: {
          notification.showError('服务器内部错误')
          break
        }
        default: {
          notification.showError(`错误:${error.response.status}`)
        }
      }
    } else if (error.request) {
      // 网络错误
      notification.showError('网络错误，请检查网络连接')
    } else {
      // 其他错误
      notification.showError(`发生错误: ${error.message}`)
    }
    return Promise.reject(error)
  },
)

// 封装请求方法
export default {
  /**
   * GET 请求
   * @param url 请求地址
   * @param params 请求参数
   * @returns Promise
   */
  get<T = any>(url: string, params?: any): Promise<T> {
    return instance.get(url, { params })
  },

  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @returns Promise
   */
  post<T = any>(url: string, data?: any): Promise<T> {
    return instance.post(url, data)
  },

  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @returns Promise
   */
  put<T = any>(url: string, data?: any): Promise<T> {
    return instance.put(url, data)
  },

  /**
   * DELETE 请求
   * @param url 请求地址
   * @returns Promise
   */
  delete<T = any>(url: string): Promise<T> {
    return instance.delete(url)
  },

  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @returns Promise
   */
  patch<T = any>(url: string, data?: any): Promise<T> {
    return instance.patch(url, data)
  },
}
