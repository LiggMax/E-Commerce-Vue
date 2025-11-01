export enum OrderStatus {
  UNPAID = 'UNPAID', // 待支付
  PAID = 'PAID', // 已支付
  DELIVERED = 'DELIVERED', // 已发货
  COMPLETED = 'COMPLETED', // 已收货
  CANCELED = 'CANCELED', // 已取消
  REFUNDING = 'REFUNDING', // 退款中
  REFUNDED = 'REFUNDED', // 已退款
}
