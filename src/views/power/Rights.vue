<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightsData" border style="width: 100%" stripe>
        <el-table-column type="index" align="center" label="#"></el-table-column>
        <el-table-column prop="authName" align="center" label="名称"></el-table-column>
        <el-table-column prop="path" align="center" label="路径"></el-table-column>
        <el-table-column prop="level" align="center" label="权限等级">
            <template slot-scope="scope">
            <el-tag v-if="scope.row.level==0">一级权限</el-tag>
            <el-tag v-if="scope.row.level==1" type='success'>二级权限</el-tag>
            <el-tag v-if="scope.row.level==2" type='warning'>三级权限</el-tag>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
 
<script>
import { getRightsData } from 'network/power'
export default {
  name: 'Rights',
  data() {
    return {
      rightsData: [],
    }
  },
  created() {
    this.getRDate()
  },
  methods: {
    getRDate() {
      getRightsData('list').then((res) => {
        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg)
        } else {
          this.rightsData = res.data
        }
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