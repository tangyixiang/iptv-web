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

export function addUser(data) {
  return request({
    url: '/auth/user/add',
    method: 'post',
    data: data,
  })
}

export function updateUser(data) {
  return request({
    url: '/auth/user/update',
    method: 'post',
    data: data,
  })
}

export function listUser(param) {
  return request({
    url: '/auth/user/list',
    method: 'get',
    params: param,
  })
}

export function delUser(data) {
    return request({
      url: '/auth/user/del',
      method: 'post',
      data: data,
    })
}

export function updatePassword(data) {
    return request({
      url: '/auth/user/password',
      method: 'post',
      data: data,
    })
}