import request from '../utils/request'

export function allLocation() {
  return request({
    url: '/location/all',
    method: 'get',
  })
}

export function listLocation(query) {
  return request({
    url: '/location/list',
    method: 'get',
    params: query,
  })
}

export function addLocation(data) {
  return request({
    url: '/location/add',
    method: 'post',
    data: data,
  })
}

export function delLocation(dataId) {
  return request({
    url: '/location/del/' + dataId,
    method: 'delete',
  })
}
