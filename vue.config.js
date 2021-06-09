module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views',
                'plugins':'@/plugins'
            }
        }
    },
    lintOnSave: false
  //  // 配置跨域代理
  // devServer: {
  //   // // Paths
  //   host: 'localhost',
  //   port: '8080',
  //   https: false,
  //   open: true,
  //   proxy: {
  //    '/api': { // 匹配所有以 '/api'开头的请求路径
  //     target: 'https://gxz.api.aixzu.com', // 代理目标的基础路径
  //     changeOrigin: true, // 支持跨域
  //     pathRewrite: {// 重写路径: 去掉路径中开头的'/api'
  //      '^/api': ''
  //     }
  //    }
  //   },
  // },
  // chainWebpack: config => {
  //   config.module
  //     .rule('css')
  //       .test(/\.css$/)
  //       .oneOf('vue')
  //       .resourceQuery(/\?vue/)
  //       .use('px2rem')
  //         .loader('px2rem-loader')
  //         .options({
  //           remUnit: 75
  //         })
  // }
}