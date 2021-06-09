import {
    request
  } from "network/request";
  
  export function LoginFun(info) {
    return request({
        method: 'post',
      url: 'login',
      data: info
    })
  }