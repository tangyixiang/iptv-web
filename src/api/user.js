import request from '../utils/request'

export function login(data) {
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
