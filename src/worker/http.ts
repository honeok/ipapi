// 预构建常用响应头, 避免在请求热路径中重复创建和合并
export const corsHeaders = {
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Max-Age': '86400',
}

export const textHeaders = {
  ...corsHeaders,
  'Content-Type': 'text/plain; charset=utf-8',
}

export const jsonHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json; charset=utf-8',
}

export const methodNotAllowedHeaders = {
  ...textHeaders,
  Allow: 'GET, HEAD, OPTIONS',
}

const textEncoder = new TextEncoder()

// 复用预构建响应头, 并确保 HEAD 请求不返回正文
export function createResponse(request: Request, body: string, headers: HeadersInit, status = 200): Response {
  if (request.method === 'HEAD') {
    const headHeaders = new Headers(headers)
    headHeaders.set('Content-Length', String(textEncoder.encode(body).byteLength))

    return new Response(null, { status, headers: headHeaders })
  }

  return new Response(body, { status, headers })
}
