import { getFlag, getFlagUnicode, getOffset, getWarp } from './geo'
import { createResponse, jsonHeaders, textHeaders } from './http'

export function handleRequest(request: Request<unknown, IncomingRequestCfProperties>): Response {
  const pathname = new URL(request.url).pathname

  // 提取通用变量
  const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1'

  const cf = request.cf

  // 根路径仅返回 IP
  if (pathname === '/') {
    return createResponse(request, clientIp + '\n', textHeaders)
  }

  // JSON 返回详细信息
  if (pathname === '/json') {
    const responseData = {
      ip: clientIp,
      asn: cf?.asn,
      org: cf?.asOrganization,
      continent: cf?.continent,
      country: cf?.country,
      region: cf?.region,
      regionCode: cf?.regionCode,
      city: cf?.city,
      emoji: getFlag(cf?.country),
      emoji_unicode: getFlagUnicode(cf?.country),
      postalCode: cf?.postalCode,
      metroCode: cf?.metroCode,
      latitude: cf?.latitude,
      longitude: cf?.longitude,
      offset: getOffset(cf?.timezone),
      timezone: cf?.timezone,
      colo: cf?.colo,
      warp: getWarp(cf?.asn),
    }

    return createResponse(request, JSON.stringify(responseData, null, 2), jsonHeaders)
  }

  // 避免异常路径穿透
  return createResponse(request, 'Not Found', textHeaders, 404)
}
