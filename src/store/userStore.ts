import { makeAutoObservable, observable } from 'mobx'

class UserStore {
  // 初始值
  username = sessionStorage.getItem('username') ? sessionStorage.getItem('username') : ''

  constructor() {
    // 这里是实现响应式的关键
    makeAutoObservable(this)
  }

  setUserInfo(username: string) {
    this.username = username
    sessionStorage.setItem('username', username)
  }
}

export default new UserStore()
