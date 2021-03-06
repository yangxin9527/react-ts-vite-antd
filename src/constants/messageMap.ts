/**
 * 消息
 */

export const MESSAGE_MAP = {
  '500': '服务器内部错误',
  '502': '错误网关',
  '503': '服务目前无法使用',
  '504': '网关超时',
  '505': '服务器不支持请求',
  '400': '错误请求',
  '401': '身份未授权',
  '403': '禁止访问',
  '404': '请求不存在',

  //自定义
  '801': '格式转换失败',
  '802': '后端接口连接异常',
  '803': '系统接口请求超时',
  '888': '系统错误'
} as const
