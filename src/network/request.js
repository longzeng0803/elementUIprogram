import axios from 'axios';
//方法3
export function request(config) {
  const instance1 = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })

  //请求拦截器
    instance1.interceptors.request.use(config => {
        config.headers.Authorization=window.sessionStorage.getItem('token')
      return config
    }, err => {
      console.log(err)
    })
  //响应拦截
  instance1.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err)
  })
  return instance1(config)
}