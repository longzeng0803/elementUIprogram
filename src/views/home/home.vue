<template>
  <div>
    <el-button @click="logout" type="info">退出登录</el-button>
  </div>
</template>
 
<script>
export default {
  name: 'home',
  data() {
    return {}
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
  props: {},
  components: {},
  computed: {},
}
</script>
 
<style Lang='less' scoped>
</style>