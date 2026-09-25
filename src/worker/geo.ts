// ASCII 大写字母加此偏移量得到对应的国旗区域指示符码点
const regionalIndicatorOffset = 127397
const countryCodePattern = /^[A-Z]{2}$/
// 仅缓存时区格式化器, 偏移量仍实时计算避免夏令时切换后使用旧值
const timezoneFormatters = new Map<string, Intl.DateTimeFormat>()

// 国旗转换
export function getFlag(countryCode: string | undefined): string | undefined {
  if (!countryCode || !countryCodePattern.test(countryCode)) return undefined

  return String.fromCodePoint(
    regionalIndicatorOffset + countryCode.charCodeAt(0),
    regionalIndicatorOffset + countryCode.charCodeAt(1),
  )
}

// 获取 Flag 的 Unicode 字符串
export function getFlagUnicode(countryCode: string | undefined): string | undefined {
  if (!countryCode || !countryCodePattern.test(countryCode)) return undefined

  const hex1 = (regionalIndicatorOffset + countryCode.charCodeAt(0)).toString(16).toUpperCase()
  const hex2 = (regionalIndicatorOffset + countryCode.charCodeAt(1)).toString(16).toUpperCase()
  return `U+${hex1} U+${hex2}`
}

// 获取 WARP 状态
export function getWarp(asn: number | string | undefined): 'on' | 'off' {
  const numericAsn = Number(asn)
  return numericAsn === 13335 || numericAsn === 209242 ? 'on' : 'off'
}

// 获取时区偏移量
export function getOffset(timezone: string | undefined): number | undefined {
  if (!timezone) return undefined

  try {
    let formatter = timezoneFormatters.get(timezone)
    if (!formatter) {
      formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      })

      if (timezoneFormatters.size < 500) {
        timezoneFormatters.set(timezone, formatter)
      }
    }

    const now = new Date()
    now.setMilliseconds(0)

    let year: number | undefined
    let month: number | undefined
    let day: number | undefined
    let hour: number | undefined
    let minute: number | undefined
    let second: number | undefined

    for (const { type, value } of formatter.formatToParts(now)) {
      switch (type) {
        case 'year':
          year = Number(value)
          break
        case 'month':
          month = Number(value)
          break
        case 'day':
          day = Number(value)
          break
        case 'hour':
          hour = Number(value)
          break
        case 'minute':
          minute = Number(value)
          break
        case 'second':
          second = Number(value)
          break
      }
    }

    if (
      year === undefined ||
      month === undefined ||
      day === undefined ||
      hour === undefined ||
      minute === undefined ||
      second === undefined
    ) {
      return undefined
    }

    // 将目标时区的本地时间视为 UTC, 与当前时间比较得到偏移秒数
    const localTimeAsUtc = Date.UTC(year, month - 1, day, hour, minute, second)
    return Math.round((localTimeAsUtc - now.getTime()) / 1000)
  } catch {
    return undefined
  }
}
