import {
  request
} from 'network/request'
//获取用户列表
export function getUsersData(params) {
  return request({
    url: 'users',
    params
  })
}
//修改用户状态
export function changeUserState(config){
  return request({
    method: 'put',
    url:`users/${config.uid}/state/${config.state}`
  })
}
//添加用户
export function addUser(data){
  return request({
    method: 'post',
    url:'users',
    data
  })
}

//通过id查询用户信息
export function getUserInfoById(id){
  return request({
   url:`users/${id}`
  })
}

//修改用户信息
export function setUserInfo(config){
  return request({
    method: 'put',
    url:`users/${config.id}`,
    data:config.data
  })
}
// 删除用户
export function deleteUser(id){
  return request({
    method:'delete',
    url:`users/${id}`
  })
}