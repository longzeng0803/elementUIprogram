<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="showAddRole = true">添加角色</el-button>
      <el-table :data="rolesData" border style="width: 100%" stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :class="['bdbottom', i1 == 0 ? 'bdtop' : '']"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  @close="removeRightById(scope.row, item1.id)"
                  closable
                  >{{ item1.authName }}</el-tag
                ><i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 == 0 ? '' : 'bdtop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column
          type="index"
          align="center"
          label="#"
        ></el-table-column>
        <el-table-column
          prop="roleName"
          align="center"
          label="角色名称"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          align="center"
          label="角色描述"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="openEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deletingRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showPowerDialog(scope.row)"
              >权限分配</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      title="添加角色"
      :close-on-click-modal="false"
      :visible.sync="showAddRole"
      width="50%"
      @close="addClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="AddRoleform"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="AddRoleform.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="AddRoleform.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddRole = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改角色信息"
      :visible.sync="showSetingDidlog"
      width="50%"
      @close="editClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="setFormData"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="setFormData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="setFormData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSetingDidlog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="showAddPowerDialog"
      width="50%"
      @close="addPowerClosed"
    >
      <el-tree
        show-checkbox
        :data="rightsData"
        :props="defaultProps"
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref='treeRef'
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddPowerDialog = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import {
  getRolesData,
  addRole,
  getRolesById,
  editRole,
  deleteRole,
  removePower,
  getRightsData,
  givePower
} from 'network/power'
export default {
  name: 'roles',
  data() {
    return {
      rolesData: [],
      //  显示添加角色对话框
      showAddRole: false,
      AddRoleform: {
        roleName: '',
        roleDesc: '',
      },
      addFormRules: {
        roleName: [
          { message: '角色名称不能为空！', required: true, trigger: 'blur' },
        ],
      },
      setFormData: {},
      showSetingDidlog: false,
      showAddPowerDialog: false,
      rightsData: [],
      defaultProps: {
        children: 'children',
        label: 'authName',
      },
      defkeys: [],
      roleId:null
    }
  },
  created() {
    this.getRData()
  },
  methods: {
    // 监听权限分配关闭
    addPowerClosed() {
      this.defkeys=[]
    },
    // 打开权限对话框
    showPowerDialog(role) {
      this.roleId=role.id
      getRightsData('tree').then((res) => {
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg)
        } else {
          this.rightsData = res.data
          console.log(this.rightsData)
        }
      })
      console.log(role)
      this.getleafKeys(role, this.defkeys)
      // 获取所有权限的数据
      this.showAddPowerDialog = true
    },
    // 确认分配权限
    allotRights(){
    const keys=[
      ...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys()
    ]
    const rids=keys.join(',')
    givePower(this.roleId,rids).then(res=>{
      if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg)
        } else {
          this.getRData()
          this.showAddPowerDialog=false
          return this.$message.success('添加权限成功')
          
        }
    })
    },
    // 递归获取三级节点
    getleafKeys(node, arr) {
      //如果当前是节点没有children，把id存在arr里
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getleafKeys(item, arr)
      })
    },
    //   获取角色数据
    getRData() {
      getRolesData().then((res) => {
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg)
        } else {
          this.rolesData = res.data
          console.log(this.rolesData)
        }
      })
    },
    // 添加角色
    addRole() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        addRole(this.AddRoleform).then((res) => {
          if (res.meta.status != 201) {
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success('角色创建成功！')
            this.showAddRole = false
            this.getRData()
          }
        })
      })
      //编辑角色
    },
    // 监听添加角色对话框关闭
    addClosed() {
      this.$refs.addFormRef.resetFields()
    },
    editClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 打开编辑角色
    openEdit(id) {
      getRolesById(id).then((res) => {
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg)
        } else {
          this.setFormData = res.data
          this.showSetingDidlog = true
        }
      })
    },
    // 编辑角色
    editRole() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return
        const config = {
          id: '',
          data: {
            roleName: '',
            roleDesc: '',
          },
        }
        config.id = this.setFormData.roleId
        config.data.roleName = this.setFormData.roleName
        config.data.roleDesc = this.setFormData.roleDesc
        editRole(config).then((res) => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success('修改角色' + res.data.roleName + '信息成功！')
            this.showSetingDidlog = false
            this.getRData()
          }
        })
      })
    },
    // 删除角色
    deletingRole(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteRole(id).then((res) => {
            if (res.meta.status != 200) {
              return this.$message.error(res.meta.msg)
            } else {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.getRData()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 根据id删除权限
    removeRightById(role, id) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let config = {}
          config.roleId = role.id
          config.rightId = id
          removePower(config).then((res) => {
            if (res.meta.status != 200) {
              return this.$message.error(res.meta.msg)
            } else {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              role.children = res.data
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
  props: {},
  components: {},
  computed: {},
}
</script>
 
<style lang='less' scoped>
.el-tag {
  margin: 7px;
}
.el-row {
  display: flex;
  align-items: center;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>