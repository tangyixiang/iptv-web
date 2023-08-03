import request from '../utils/request'

export function listRom(query) {
  return request({
    url: '/rom/list',
    method: 'get',
    params: query,
  })
}

export function addRom(data) {
  return request({
    url: '/rom/add',
    method: 'post',
    data: data,
  })
}

export function delRom(dataId) {
  return request({
    url: '/rom/del/' + dataId,
    method: 'delete',
  })
}
