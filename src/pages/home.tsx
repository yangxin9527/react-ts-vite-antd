import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { Icon } from '@/components'
import { Button } from 'antd'
import { observer } from 'mobx-react'
import { useStores } from '@/hooks'
console.log('环境变量', import.meta.env)
// console.log(process.env.VITE_APP_API_WS)
export default observer(() => {
  const history = useHistory()
  const { userStore } = useStores()
  const login = useCallback(() => {
    history.push('/login')
  }, [])
  const toUserPage = useCallback(() => {
    history.push('/user')
  }, [])

  return (
    <div>
      {userStore.username ? (
        <div>
          <h1>已登录 {userStore.username}</h1>
          <Button icon={<Icon type="icon-check" />} onClick={toUserPage}>
            个人中心
          </Button>
        </div>
      ) : (
        <div>
          <h1>未登录</h1>
          <Button onClick={login}>go to login</Button>
        </div>
      )}
    </div>
  )
})
