import { handleRequest } from './handlers'
import { corsHeaders, createResponse, methodNotAllowedHeaders } from './http'

export default {
  fetch(request) {
    // 浏览器跨域预检不进入业务路由
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      })
    }

    // IP 查询接口仅接受只读方法, 其他方法明确返回 405
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return createResponse(request, 'Method Not Allowed', methodNotAllowedHeaders, 405)
    }

    return handleRequest(request)
  },
} satisfies ExportedHandler
