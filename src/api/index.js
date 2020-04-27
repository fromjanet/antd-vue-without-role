import axios from 'axios'
// import Vue from 'vue'
// import store from './../store'
// import https from 'https'
const Axios = axios.create({
  baseURL: 'http://localhost:8080' // 设置访问路径
})
Axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
Axios.defaults.headers['Content-Type'] = 'application/json; charset=UTF-8'

Axios.interceptors.response.use(
  res => {
      // 如果返回的code是202，则表示token有问题，直接把登录信息清除
      if (res.data && res.data.code === 202) {
          localStorage.removeItem('username')
          localStorage.removeItem('Authorization')
          window.location.reload()
      } else if (res.data && res.data.code === 500) {
          res.data.description = '服务器异常'
      }
      return res
  }
)
export const POST = (url, params) => {
  return Axios.post(`/${url}`, params).then(res =>
    res
  )
}

export const PUT = (url, params) => {
  return Axios.put(`/${url}`, params).then(res => res)
}

export const GET = (url, params) => {
  return Axios
    .get(`/${url}`, {
      params: params
    })
    .then(res => res)
}

export const UploadForm = (url, params) => {
  return Axios.post(`/${url}`, params, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const Download = (url, params) => {
  return Axios.post(`/${url}`, params, {
    responseType: 'blob'
  })
}

export default Axios
