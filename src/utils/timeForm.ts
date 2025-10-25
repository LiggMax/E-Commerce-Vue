/**
 * 时间格式化工具类
 */
export const TimeFormatter = {
  /**
   * 格式化为相对时间（如：2小时前，3天前）
   * @param date 日期字符串或时间戳
   * @returns 相对时间字符串
   */
  formatRelativeTime (date: string | number | Date): string {
    const now = Date.now()
    const targetDate = new Date(date).getTime()
    const diff = now - targetDate

    // 计算差异的秒数
    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) {
      return '刚刚'
    }

    // 计算差异的分钟数
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) {
      return `${minutes}分钟前`
    }

    // 计算差异的小时数
    const hours = Math.floor(minutes / 60)
    if (hours < 24) {
      return `${hours}小时前`
    }

    // 计算差异的天数
    const days = Math.floor(hours / 24)
    if (days < 30) {
      return `${days}天前`
    }

    // 计算差异的月数
    const months = Math.floor(days / 30)
    if (months < 12) {
      return `${months}个月前`
    }

    // 计算差异的年数
    const years = Math.floor(months / 12)
    return `${years}年前`
  },

  /**
   * 格式化为标准日期时间格式
   * @param date 日期字符串或时间戳
   * @param format 格式字符串，默认为 'YYYY-MM-DD HH:mm:ss'
   * @returns 格式化后的时间字符串
   */
  formatDateTime (date: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    const seconds = String(d.getSeconds()).padStart(2, '0')

    return format
      .replace('YYYY', year.toString())
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  },

  /**
   * 格式化为日期格式
   * @param date 日期字符串或时间戳
   * @param format 格式字符串，默认为 'YYYY-MM-DD'
   * @returns 格式化后的日期字符串
   */
  formatDate (date: string | number | Date, format = 'YYYY-MM-DD'): string {
    return this.formatDateTime(date, format)
  },

  /**
   * 格式化为时间格式
   * @param date 日期字符串或时间戳
   * @param format 格式字符串，默认为 'HH:mm:ss'
   * @returns 格式化后的时间字符串
   */
  formatTime (date: string | number | Date, format = 'HH:mm:ss'): string {
    return this.formatDateTime(date, format)
  },

  /**
   * 判断是否为今天
   * @param date 日期字符串或时间戳
   * @returns 是否为今天
   */
  isToday (date: string | number | Date): boolean {
    const today = new Date()
    const targetDate = new Date(date)
    return (
      targetDate.getFullYear() === today.getFullYear()
      && targetDate.getMonth() === today.getMonth()
      && targetDate.getDate() === today.getDate()
    )
  },

  /**
   * 判断是否为昨天
   * @param date 日期字符串或时间戳
   * @returns 是否为昨天
   */
  isYesterday (date: string | number | Date): boolean {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const targetDate = new Date(date)
    return (
      targetDate.getFullYear() === yesterday.getFullYear()
      && targetDate.getMonth() === yesterday.getMonth()
      && targetDate.getDate() === yesterday.getDate()
    )
  },
}
