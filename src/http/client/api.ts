/**
 * 获取轮播图数据
 */
export const GET_CAROUSEL = '/api/client/carousel'

/**
 * 商品
 */
export const FEATURED = '/api/client/product'

/**
 * 商品详情
 */
export const PRODUCT_DETAIL = `${FEATURED}/detail`

/**
 * 搜索
 */
export const SEARCH = '/api/client/search'

/**
 * 订阅
 */
export const SUBSCRIBE = '/api/email'

/**
 * 验证码
 */
export const CAPTCHA = '/api/client/captcha'

/**
 * 注册
 */
export const REGISTER = '/api/client/auth/register'

/**
 * 登录
 */
export const LOGIN = '/api/client/auth/login'

export const USER = '/api/client/user'

/**
 * 获取用户信息
 */
export const GET_USER_INFO = `${USER}/info`

/**
 * 订单
 */
export const ORDER = `${USER}/order`

/**
 * 收货地址
 */
export const ADDRESS = `${USER}/address`

/**
 * 账户充值
 */
export const RECHARGE = `${USER}/recharge`
