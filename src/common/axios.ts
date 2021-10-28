import axios from 'axios'
import { REQUEST_TIMEOUT, API_BASE } from '../constants'
import { messageHandler } from '../common/messageHandler'
// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
const service = axios.create({
  baseURL: API_BASE,
  timeout: REQUEST_TIMEOUT
})

service.interceptors.request.use(
  (config) => {
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?'
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName]
        const part = encodeURIComponent(propName) + '='
        if (typeof value !== 'undefined') {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              let params = propName + '[' + key + ']'
              const subPart = encodeURIComponent(params) + '='
              url += subPart + encodeURIComponent(value[key]) + '&'
            }
          } else {
            url += part + encodeURIComponent(value) + '&'
          }
        }
      }
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    // if (reduxStore && !TOKEN_WHITE_LIST.find((url) => config.url?.startsWith(url))) {
    //   config.headers.token = reduxStore.getState().global.token
    // }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  (res) => {
    if (res.data.code !== 200) {
      messageHandler.error(res.data.msg)
      return Promise.reject(res.data.msg)
    }
    return res.data
  },
  (error) => {
    messageHandler.error(error)
    return Promise.reject(error)
  }
)

export const { get, post } = service
