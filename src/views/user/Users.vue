<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="15">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="keywords" clearable @input="inputKeywords">
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column prop="username" align="center" label="姓名"></el-table-column>
        <el-table-column prop="email" align="center" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" align="center" label="电话"></el-table-column>
        <el-table-column prop="role_name" align="center" label="角色"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="userStateChange(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showSetingcli(scope.row.id)"
              size="mini"
            ></el-button>

            <!-- 删除 -->
            <el-button
              type="danger"
              @click="deletingUser(scope.row.id)"
              icon="el-icon-delete"
              size="mini"
            ></el-button>

            <!-- 分配角色 -->
            <el-tooltip
              effect="light"
              content="分配角色"
              placement="top"
              :open-delay="500"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1,2, 4, 6, 8]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
      width="50%"
      @close="addClosed"
    >
      <!-- 内容主体区域 -->
      <el-form :model="AddUserform" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="AddUserform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="AddUserform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="AddUserform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="AddUserform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false ">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="showSetingDidlog" width="50%" @close="setClosed">
      <!-- 内容主体区域 -->
      <el-form :model="setFormData" :rules="addFormRules" ref="setFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="setFormData.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="setFormData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="setFormData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="showSetingDidlog = false ">取 消</el-button>
        <el-button type="primary" @click="setingUserInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
<script>
import {
  getUsersData,
  changeUserState,
  addUser,
  setUserInfo,
  getUserInfoById,
  deleteUser,
} from 'network/users'
export default {
  name: 'Users',
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则
      const regEmail =
        /^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
      if (regEmail.test(value)) {
        //合法邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkPhone = (rule, value, cb) => {
      // 验证手机号的正则
      const regMobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        //合法邮箱
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

    return {
      Common: this.$common.common,
      keywords: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 4,
      },
      userList: [],
      total: 0,
      currentPage4: 4,
      AddUserform: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      dialogFormVisible: false,
      showSetingDidlog: false,
      setFormData: {},
      addFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '用户名长度在3到20个字符',
            trigger: 'blur',
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 10,
            message: '密码长度在6到10个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getUsers()
    this.inputKeywords = this.Common.debounce(
      this.inputKeywords.bind(this),
      500
    )
  },
  methods: {
    //获取用户列表
    getUsers() {
      getUsersData(this.queryInfo).then((res) => {
        if (res.meta.status !== 200)
          return this.$message.error('获取用户列表失败！')
        this.userList = res.data.users
        this.total = res.data.total
      })
    },
    //清除表单数据
    addClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 输入搜索框
    inputKeywords() {
      this.searchUser()
    },
    searchUser() {
      console.log(1)
      this.queryInfo.query = this.keywords
      this.getUsers()
    },
    //点击修改用户信息按钮
    showSetingcli(id) {
      console.log(id)
      getUserInfoById(id).then((res) => {
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.setFormData = res.data
        this.showSetingDidlog = true
      })
    },
    // 修改用户信息
    setingUserInfo() {
      this.$refs.setFormRef.validate((valid) => {
        if (!valid) return
        const config = {
          id: '',
          data: {
            email: '',
            mobile: '',
          },
        }
        console.log()
        config.id = this.setFormData.id
        config.data.email = this.setFormData.email
        config.data.mobile = this.setFormData.mobile
        setUserInfo(config).then((res) => {
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success('修改用户' + res.data.username + '信息成功！')
            this.showSetingDidlog = false
            this.getUsers()
          }
        })
      })
    },
    //监控set对话框被关闭
    setClosed() {
      this.$refs.setFormRef.resetFields()
    },
    // 改变单页个数
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUsers()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUsers()
    },
    //监听switch切换
    userStateChange(userinfo) {
      let config = {
        uid: userinfo.id,
        state: userinfo.mg_state,
      }
      changeUserState(config).then((res) => {
        console.log(res)

        if (res.meta.status != 200) {
          userinfo.mg_state = !userinfo.mg_state
          return this.$message.error('更新用户状态失败！')
        } else {
          this.$message.success('更新用户状态成功！')
        }
      })
    },
    //添加用户
    addUsers() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return
        console.log(this.AddUserform)
        addUser(this.AddUserform).then((res) => {
          console.log(res)
          if (res.meta.status != 201) return this.$message.error(res.meta.msg)
          this.dialogFormVisible = false
          this.keywords = ''
          this.queryInfo.query = ''
          this.getUsers()
        })
      })
    },
    // 删除用户
    deletingUser(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteUser(id).then((res) => {
            if (res.meta.status != 200) {
              return this.$message.error(res.meta.msg)
            } else {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.getUsers()
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
</style>