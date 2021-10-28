import React, { useCallback, useState } from 'react'
// import { get } from '@/common/axios'
import { observer } from 'mobx-react'
import { Button } from 'antd'
import { useStores } from '@/hooks'
import { useHistory } from 'react-router-dom'

export default observer(() => {
  const { userStore } = useStores()
  const history = useHistory()

  const [value, setValue] = useState('nix')
  const login = useCallback(() => {
    // get('/').then((RES) => {
    //   console.log(RES)
    // })
    userStore.setUserInfo(value)
    setTimeout(() => {
      history.push('/')
    }, 1000)
  }, [value, userStore])

  return (
    <div>
      <h1>login in </h1>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          console.log(e.target.value)
        }}
      />
      <Button onClick={login}>login in</Button>
      {userStore.username !== '' && <h4>welcome {userStore.username}!! 1s自动跳转</h4>}
    </div>
  )
})
