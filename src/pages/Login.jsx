import React, { useState, useEffect } from 'react'
import styles from './login.module.scss'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Form, Input, message } from 'antd'
import request from '../utils/request'
import LeftBg from '../assets/login_left.png'
import { setSessionToken, clearSessionToken } from '../utils/access'
import useGlobalStore from '../store'
import { observer } from 'mobx-react-lite'
import { login, getUserInfo } from '../api/user'

function Login() {
  const [uuid, setUuid] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { userStore } = useGlobalStore()

  // 获取URL来路，/ or /protected
  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    // getCaptchaCode()
  }, [])

  const handleSubmit = async (values) => {
    try {
      // 登录
      const response = await login(values)
      if (response.status === 200) {
        const current = new Date()
        const expireTime = current.setTime(
          current.getTime() + 1000 * 12 * 60 * 60
        )
        setSessionToken(response.data.token, expireTime)
        message.success('登录成功')
        getUserInfo().then((res) => {
          const { name, user_name } = res.data
          userStore.setUserInfo({ name, user_name })
          navigate(from, { replace: true })
        })
        return
      } else {
        console.log('login failed')
        clearSessionToken()
        message.error(response.msg)
      }
    } catch (error) {
      clearSessionToken()
      console.log(error)
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.loginBox}>
        <div className={styles.boxLeft}>
          <img alt="logo" src={LeftBg} />
        </div>
        <div className={styles.boxRight}>
          <Form name="loginForm" className="w-[336px]" onFinish={handleSubmit}>
            <Form.Item>
              <div className="flex justify-center">
                <span className="text-3xl font-bold mb-4">欢迎使用</span>
              </div>
            </Form.Item>
            <Form.Item
              name="username"
              className="mb-6"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input
                placeholder="用户名"
                autoComplete="off"
                className="rounded h-10"
              />
            </Form.Item>
            <Form.Item
              name="password"
              className="mb-6"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
              ]}
            >
              <Input.Password placeholder="密码" className="rounded h-10" />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-center ...">
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  className="w-[268px] rounded-3xl mt-6"
                >
                  登录
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default observer(Login)
