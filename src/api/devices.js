import request from '../utils/request'

export function listDevice(query) {
  return request({
    url: '/device/list',
    method: 'get',
    params: query,
  })
}

export function addDevice(data) {
  return request({
    url: '/device/add',
    method: 'post',
    data: data,
  })
}

export function delDevice(dataId) {
  return request({
    url: '/device/del/' + dataId,
    method: 'delete',
  })
}
