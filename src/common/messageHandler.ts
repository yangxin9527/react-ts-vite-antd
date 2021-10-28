import { message } from 'antd'
import { ReactNode } from 'react'
import { MESSAGE_MAP } from '@/constants'

type errorMessageInterface = Error | string
type contentType = ReactNode | string
type durationType = number | (() => void)
type onCloseType = () => void
type configInterface = [content: contentType, duration?: durationType, onClose?: onCloseType]

class MessageHandler {
  success(...args: configInterface) {
    message.success(...args)
  }
  warn(...args: configInterface) {
    message.warn(...args)
  }

  error(errorMessage?: errorMessageInterface, msg?: string) {
    let errorContent: string = ''
    if (msg) {
      errorContent = msg
    } else if (typeof errorMessage === 'string') {
      errorContent = errorMessage
    } else if (errorMessage instanceof Error) {
      const { message: errMessage } = errorMessage
      if (errMessage === 'Network Error') {
        errorContent = MESSAGE_MAP['802']
      } else if (errMessage.includes('timeout')) {
        errorContent = MESSAGE_MAP['803']
      } else if (errMessage.includes('Request failed with status code')) {
        const errorCode = errMessage.substr(errMessage.length - 3) as keyof typeof MESSAGE_MAP
        errorContent = MESSAGE_MAP[errorCode]
      } else if (errMessage.includes('Unexpected token s in JSON at position')) {
        errorContent = MESSAGE_MAP['801']
      }
    }
    message.error(errorContent || MESSAGE_MAP['888'])
  }
}

export const messageHandler = new MessageHandler()
