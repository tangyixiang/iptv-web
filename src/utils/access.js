export function setSessionToken(access_token, expireTime) {
  if (access_token) {
    sessionStorage.setItem('access_token', access_token)
  }
  sessionStorage.setItem('expireTime', `${expireTime}`)
}

export function getAccessToken() {
  return sessionStorage.getItem('access_token')
}

export function getRefreshToken() {
  return sessionStorage.getItem('refresh_token')
}

export function getTokenExpireTime() {
  return sessionStorage.getItem('expireTime')
}

export function clearSessionToken() {
  sessionStorage.removeItem('userInfo')
  sessionStorage.removeItem('access_token')
  sessionStorage.removeItem('expireTime')
}
