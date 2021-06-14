import {
  request
} from 'network/request.js'
// 获取权限数据
export function getRightsData(type) {
  return request({
    url: `rights/${type}`
  })
}
// 获取角色数据
export function getRolesData() {
  return request({
    url: `roles`
  })
}
// 添加角色
export function addRole(data) {
  return request({
    method: 'post',
    url: 'roles',
    data
  })
}
// 根据角色id查询数据
export function getRolesById(id) {
  return request({
    url: `roles/${id}`
  })
}
// 编辑角色
export function editRole(config) {
  return request({
    method: 'put',
    url: `roles/${config.id}`,
    data: config.data
  })
}
// 删除角色
export function deleteRole(id) {
  return request({
    method:'delete',
    url: `roles/${id}`
  })
}
// 删除角色指定权限
export function removePower(config){
  return request({
    method:'delete',
    url:`roles/${config.roleId}/rights/${config.rightId}`
  })
}
// 角色授权
export function givePower(roleId,rids){
  return request({
    method:'post',
    url:`roles/${roleId}/rights`,
    data:{
      rids
    }
  })
}