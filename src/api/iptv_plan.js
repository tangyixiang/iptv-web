import request from '../utils/request'

export function allIptvPlan() {
  return request({
    url: '/iptv/all',
    method: 'get',
  })
}

export function listIptvPlan(query) {
  return request({
    url: '/iptv/list',
    method: 'get',
    params: query,
  })
}

export function addIptvPlan(data) {
  return request({
    url: '/iptv/add',
    method: 'post',
    data: data,
  })
}

export function delIptvPlan(dataId) {
  return request({
    url: '/iptv/del/' + dataId,
    method: 'delete',
  })
}
