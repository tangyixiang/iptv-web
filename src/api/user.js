import request from '../utils/request'
import { MD5 } from 'crypto-js'

export function login(params) {
  const data = {
    ...params,
    password: MD5(params.password.trim()).toString(),
  }

  return request({
    url: '/auth/login',
    method: 'post',
    data: data,
  })
}

export function getUserInfo() {
  return request({
    url: '/auth/userInfo',
    method: 'get',
  })
}
