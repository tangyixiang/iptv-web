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

export function rebootDevice(data) {
  return request({
    url: '/adb/reboot',
    method: 'post',
    data: data,
  })
}

export function apkopenDevice(data) {
  return request({
    url: '/adb/apk/open',
    method: 'post',
    data: data,
  })
}

export function changeDeviceEth(data) {
  return request({
    url: '/adb/eth',
    method: 'post',
    data: data,
  })
}

export function changeDeviceWifi(data) {
  return request({
    url: '/adb/wifi',
    method: 'post',
    data: data,
  })
}

export function changeDeviceHotspot(data) {
  return request({
    url: '/adb/hotspot',
    method: 'post',
    data: data,
  })
}
