import { RemindDate, TodoData } from 'src/typing/todo'
import moment, { Moment } from 'moment'
import { FileData, FileFormat, FileType, FileTypeMap } from 'src/typing/file'
import { DefaultElement } from 'only-brain-editor'
import { FILE_FORMAT_MAP } from 'src/constants'
import { core } from 'only-brain-editor'

const { PreviewHelper } = core

const SIZE_KB = 1024
const SIZE_MB = SIZE_KB * 1024
const SIZE_GB = SIZE_MB * 1024

export const todo = {
  setTodoItemType: (item: TodoData): TodoData => {
    const todoItem: TodoData = {
      ...item,
    }
    if (!item.remindDate.time) {
      todoItem.type = 'incomplete'
      return todoItem
    }
    if (
      item.remindDate.repeatMode !== 'noRepeat' ||
      (todoItem.type === 'expired' && moment.unix(item.remindDate.time).isAfter(moment.now(), 'm'))
    ) {
      todoItem.type = 'todo'
    }
    if (item.remindDate.repeatMode === 'noRepeat' && moment.unix(item.remindDate.time).isBefore(moment.now(), 'm')) {
      todoItem.type = 'expired'
    }
    return todoItem
  },
  sortTodoList: (todoList: TodoData[], filterOption: 'createTime' | 'updateTime'): TodoData[] => {
    const topList = todoList.filter((item) => item.isTop)
    const sub = (a: TodoData, b: TodoData) => {
      if (filterOption === 'createTime') {
        return a.createdAt > b.createdAt ? -1 : a.createdAt === b.createdAt ? 0 : 1
      }
      if (filterOption === 'updateTime') {
        return a.updatedAt > b.updatedAt ? -1 : a.updatedAt === b.updatedAt ? 0 : 1
      }
      return 0
    }
    todoList = todoList.filter((item) => !item.isTop)
    topList.sort(sub)
    todoList.sort(sub)
    return [...topList, ...todoList]
  },
  getRelativeDateStr: (todoDate: Moment) => {
    const days = ['日', '一', '二', '三', '四', '五', '六']
    const diffHours = todoDate.diff(moment(), 'hours')
    const isThisYear = todoDate.year() === moment().year()
    let str = ''
    if (Math.abs(diffHours) <= 48) {
      const targetDate = todoDate.date()
      // 这里时因为用diff判断的不准
      if (targetDate === moment().date()) {
        str = '今天'
      } else if (targetDate === moment().add(1, 'days').date()) {
        str = '明天'
      } else if (targetDate === moment().add(2, 'days').date()) {
        str = '后天'
      } else if (targetDate === moment().add(-1, 'days').date()) {
        str = '昨天'
      } else if (targetDate === moment().add(-2, 'days').date()) {
        str = '前天'
      }
    } else if (diffHours > 0 && diffHours < 168) {
      str = '周' + days[todoDate.day()]
    } else if (isThisYear) {
      str = todoDate.format('M月D日')
    } else {
      str = todoDate.format('YYYY年M月D日')
    }
    return str
  },
  getTodoItemDateStr: (remindDate: RemindDate) => {
    const { time, repeatMode } = remindDate
    if (!time) {
      return '无日期'
    }
    const tarTime = moment.unix(time)
    if (repeatMode === 'noRepeat') {
      var day = todo.getRelativeDateStr(moment.unix(remindDate.time))
      return day + ` ${tarTime.format('HH:mm')}`
    }
    if (repeatMode === 'monthly') {
      return `每月${tarTime.format('D日 HH:mm')}`
    }
    return `${repeatMode === 'weekday' ? '工作日' : repeatMode === 'weekend' ? '周末' : '每天'} ${tarTime.format(
      'HH:mm',
    )}`
  },
  // quanhai fix icon 2021.4.30
  getTodoItemDateIsRepeat: (remindDate: RemindDate) => {
    const { time, repeatMode } = remindDate
    if (!time) {
      return false
    }
    if (repeatMode === 'noRepeat') {
      return false
    }
    return true
  },
}

// global utils
export const utils = {
  // 通过previewHelper变更todo并获取到新的content
  updateNoteTodo: (
    content: string,
    uid: string,
    modifyData: Partial<TodoData>,
  ): { textContent?: string; editorContent?: string } => {
    const helper = new PreviewHelper(tryJsonParse(content), uid)
    helper.updateBlock('todo', {
      uid,
      ...modifyData,
    })
    const editorContent = helper.getEditorContent()
    const textContent = helper.getTextContent()
    return {
      editorContent,
      textContent,
    }
  },

  // 通过previewHelper变更file并获取到新的content
  updateNoteFile: (content: string, uid: string, modifyData: Partial<FileData>) => {
    const helper = new PreviewHelper(tryJsonParse(content), uid)
    helper.updateBlock('file', {
      uid,
      ...modifyData,
    })
    const editorContent = helper.getEditorContent()
    const textContent = helper.getTextContent()
    return {
      editorContent,
      textContent,
    }
  },

  // 获取文字的长度
  getStringWidth: (text: string, fontSize: number = 12, letterSpacing = 2) => {
    const span = document.createElement('span')
    span.style.fontSize = fontSize + 'px'
    span.style.position = 'absolute'
    span.style.top = '-9999px'
    span.style.left = '-9999px'
    span.style.letterSpacing = letterSpacing + 'px'
    span.innerText = text
    document.body.append(span)
    const width = span.getBoundingClientRect().width
    document.body.removeChild(span)
    return width
  },

  /** 复制文本  */
  copyText: (text: string): boolean => {
    const el = document.createElement('section')
    el.innerText = text
    document.body.appendChild(el)
    const sel = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(el)
    sel!.removeAllRanges()
    sel!.addRange(range)
    const bool = document.execCommand('copy')
    el.remove()
    return bool
  },
  // 只比较时间部分 忽略日期
  timeIsBefore: (cur: Moment, tar: Moment): boolean => {
    const curH = cur.get('h')
    const tarH = tar.get('h')
    const curM = cur.get('m')
    const tarM = tar.get('m')
    const curS = cur.get('s')
    const tarS = tar.get('s')

    if (curH < tarH) {
      return false
    }
    if (curH > tarH) {
      return true
    }
    if (curH === tarH && curM < tarM) {
      return false
    }
    if (curH === tarH && curM > tarM) {
      return true
    }
    if (curH === tarH && curM === tarM) {
      return curS >= tarS
    }
    // 其实不会走到这里
    return true
  },
  genUUid: () => {
    const temp_url = URL.createObjectURL(new Blob())
    const uuid = temp_url.toString()
    URL.revokeObjectURL(temp_url)
    return uuid.substr(uuid.lastIndexOf('/') + 1)
  },

  getSearchParams: (search: string) => {
    const searchParams: { [key: string]: string } = {}
    const searchStr = search.substring(1)
    const searchArr = searchStr.length ? searchStr.split('&') : []
    searchArr.forEach((item) => {
      let keyAndValue = item.split('=')
      let key = decodeURIComponent(keyAndValue[0])
      let value = decodeURIComponent(keyAndValue[1])
      if (key) {
        searchParams[key] = value
      }
    })
    return searchParams
  },
  /** 获取人类可读的文件尺寸 */
  getDisplayFileSize: (sizeInByte: number) => {
    if (sizeInByte < SIZE_KB) {
      return sizeInByte + 'B'
    }
    if (sizeInByte < SIZE_MB) {
      return Math.floor(sizeInByte / SIZE_KB) + 'K'
    }
    if (sizeInByte < SIZE_GB) {
      return Math.floor(sizeInByte / SIZE_MB) + 'M'
    }
    return (sizeInByte / SIZE_GB).toFixed(2) + 'G'
  },

  getFileType: (format: FileFormat): FileTypeMap => {
    let fileType: FileType = 'other'
    for (let key in FILE_FORMAT_MAP) {
      if (FILE_FORMAT_MAP[key as FileType].includes(format)) {
        fileType = key as FileType
        break
      }
    }
    return FileTypeMap[fileType]
  },

  /**
   * 将时间戳转化为友好的字符串
   * @param timestamp 时间戳
   * @returns 格式化对象
   */
  transformTime: (timestamp: number) => {
    function formatRecentTime(params: any) {
      let date = ''
      if (isNaN(params)) {
        // 判断是否是时间戳
        date = params.toString()
      } else {
        date = timeFormat(params)
      }
      const year = date.substring(0, 4)
      const month = date.substring(5, 7)
      const day = date.substring(8, 10)
      const hour = date.substring(11, 13)
      const minute = date.substring(14, 16)
      const seconds = date.substring(17, 19)
      const orignDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + seconds
      const yesterday = GetDateStr(-1) // 昨天
      const yesterdayStr = yesterday.split('-')
      yesterdayStr[1] = yesterdayStr[1].length === 1 ? '0' + yesterdayStr[1] : yesterdayStr[1]
      yesterdayStr[2] = yesterdayStr[2].length === 1 ? '0' + yesterdayStr[2] : yesterdayStr[2]

      const today = GetDateStr(0) // 今天
      const todayStr = today.split('-')
      todayStr[1] = todayStr[1].length === 1 ? '0' + todayStr[1] : todayStr[1]
      todayStr[2] = todayStr[2].length === 1 ? '0' + todayStr[2] : todayStr[2]

      const tomorrow = GetDateStr(1) // 明天
      const tomorrowStr = tomorrow.split('-')
      tomorrowStr[1] = tomorrowStr[1].length === 1 ? '0' + tomorrowStr[1] : tomorrowStr[1]
      tomorrowStr[2] = tomorrowStr[2].length === 1 ? '0' + tomorrowStr[2] : tomorrowStr[2]

      const afterTomorrow = GetDateStr(2) // 后天
      const afterTomorrowStr = afterTomorrow.split('-')
      afterTomorrowStr[1] = afterTomorrowStr[1].length === 1 ? '0' + afterTomorrowStr[1] : afterTomorrowStr[1]
      afterTomorrowStr[2] = afterTomorrowStr[2].length === 1 ? '0' + afterTomorrowStr[2] : afterTomorrowStr[2]

      if (year === yesterdayStr[0] && month === yesterdayStr[1] && day === yesterdayStr[2]) {
        return '昨天' + ' ' + hour + ':' + minute
      } else if (year === todayStr[0] && month === todayStr[1] && day === todayStr[2]) {
        return '今天' + ' ' + hour + ':' + minute
      } else if (year === tomorrowStr[0] && month === tomorrowStr[1] && day === tomorrowStr[2]) {
        return '明天' + ' ' + hour + ':' + minute
      } else if (year === afterTomorrowStr[0] && month === afterTomorrowStr[1] && day === afterTomorrowStr[2]) {
        return '后天' + ' ' + hour + ':' + minute
      } else {
        return orignDate
      }
    }

    // 时间戳转化成时间格式
    function timeFormat(timestamp: number) {
      const time = new Date(timestamp)
      const year = time.getFullYear()
      const month = time.getMonth() + 1
      const date = time.getDate()
      const hours = time.getHours()
      const minutes = time.getMinutes()
      const seconds = time.getSeconds()
      return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds)
    }

    // 保证不出现个位数情况
    function add0(m: number) {
      return m < 10 ? '0' + m : m
    }

    function GetDateStr(AddDayCount: number) {
      const dd = new Date()
      dd.setDate(dd.getDate() + AddDayCount)
      const y = dd.getFullYear()
      const m = dd.getMonth() + 1
      const d = dd.getDate()
      return y + '-' + m + '-' + d
    }

    return formatRecentTime(timestamp)
  },
  getDateStr: (date: Moment) => {
    let y = moment().get('year')
    const tY = date.get('year')
    return date.format(y === tY ? 'M月D日 HH:mm' : 'YYYY年M月D日 HH:mm')
  },
  downloadB64: (fileName: string, content: string) => {
    let aLink = document.createElement('a')
    let blob = utils.base64ToBlob(content)

    let evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', true, true)
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)
    aLink.click()
  },
  //base64转blob
  base64ToBlob: (code: string) => {
    let parts = code.split(';base64,')
    let contentType = parts[0].split(':')[1]
    let raw = window.atob(parts[1])
    let rawLength = raw.length

    let uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: contentType })
  },
  getBase64Image: (url: string): Promise<string> => {
    return new Promise((res) => {
      const image = new Image()
      image.crossOrigin = '*' //跨域
      image.src = url + '?v=' + Math.random() //防缓存

      image.onerror = function () {
        console.log('error')
      }
      image.onload = function () {
        const base64 = utils.drawBase64Image(image)
        res(base64)
      }
    })
  },

  drawBase64Image: (img: HTMLImageElement) => {
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx!.drawImage(img, 0, 0, img.width, img.height)
    return canvas.toDataURL('image/png')
  },
}

/**
 * 类名管理
 * @example
 * classNames('foo', 'bar'); // => 'foo bar'
 * classNames('foo', { bar: true }); // => 'foo bar'
 * classNames({ 'foo-bar': true }); // => 'foo-bar'
 * classNames({ 'foo-bar': false }); // => ''
 * classNames({ foo: true }, { bar: true }); // => 'foo bar'
 * classNames({ foo: true, bar: true }); // => 'foo bar'
 * // lots of arguments of various types
 * classNames('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'
 * // other falsy values are just ignored
 * classNames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'
 */
export const classNames = (...args: any) => {
  const classes: string[] = []
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (!arg) {
      continue
    }
    const argType = typeof arg
    if (argType === 'string' || argType === 'number') {
      classes.push(arg)
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = classNames.apply(null, arg)
        if (inner) {
          classes.push(inner)
        }
      }
    } else if (argType === 'object') {
      if (arg.toString !== Object.prototype.toString) {
        classes.push(arg.toString())
      } else {
        for (const key in arg) {
          if (Object.prototype.hasOwnProperty.call(arg, key) && arg[key]) {
            classes.push(key)
          }
        }
      }
    }
  }
  return classes.join(' ')
}

/**
 * @debounce 防抖函数 callback:回到 delay:防抖的时延
 */

export function debounce(callback: any, delay: number) {
  let timer: null | NodeJS.Timeout = null
  return function (...args: any) {
    if (timer !== null) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      callback(...args)
    }, delay)
  }
}

/**
 * @transSeconds 转换音频时间 time 秒数
 */

export function transSeconds(time: number) {
  if (time <= 0) {
    return '00:00'
  }
  let h = Math.floor(time / 3600) < 10 ? '0' + Math.floor(time / 3600) : Math.floor(time / 3600)
  let m = Math.floor((time / 60) % 60) < 10 ? '0' + Math.floor((time / 60) % 60) : Math.floor((time / 60) % 60)
  let s = Math.floor(time % 60) < 10 ? '0' + Math.floor(time % 60) : Math.floor(time % 60)

  let res = ''
  if (h !== '00') res += `${h}:`
  res += `${m}:${s}`
  return res
}

/**
 * @transSeconds 转换音频时间 time 秒数
 */

export function tryJsonParse(content?: string): DefaultElement[] {
  const normalErrorContent: DefaultElement[] = [
    {
      type: 'p',
      children: [{ text: '数据异常，请联系工作人员' }],
      deep: 0,
      index: 0,
    },
  ]
  if (!content) {
    return normalErrorContent
  }
  let parseContent: DefaultElement[] = []
  try {
    parseContent = JSON.parse(content)
    return parseContent
  } catch (err) {
    return normalErrorContent
  }
}
