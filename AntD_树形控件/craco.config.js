const CracoLessPlugin = require('craco-less');
const path = require('path')
function pathHandler (pathUrl) {
    return path.join(__dirname,pathUrl)
}
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        cssLoaderOptions: {
            modules: {localIdentName: '[local]_[hash:base64:5]'}
        },
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { 
              "@primary-color": "#1890ff", // 全局主色
              "@link-color": "#1890ff", // 链接色
              "@success-color": "#52c41a", // 成功色
              "@warning-color": "#faad14", // 警告色
              "@error-color": "#f5222d", // 错误色
              "@font-size-base": "14px",// 主字号
              "@heading-color":"rgba(0, 0, 0, 0.85)", // 标题色
              "@text-color": "rgba(0, 0, 0, 0.65)", // 主文本色
              "@text-color-secondary": "rgba(0, 0, 0, 0.45)", // 次文本色
              "@disabled-color": "rgba(0, 0, 0, 0.25)", // 失效色
              "@border-radius-base": "2px", // 组件/浮层圆角
              "@border-color-base": "#d9d9d9", // 边框色
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
  devServer:{
      proxy:{
          '/ajax':{
              target:'https://m.maoyan.com',
              changeOrign:true
          }
      }
  },
  webpack:{
      alias:{
        '@': pathHandler('./src'),
        'assets': pathHandler('./src/assets'),
        'router': pathHandler('./src/router'),
        'hoc': pathHandler('./src/hoc'),
        'hooks': pathHandler('./src/hooks'),
        'store': pathHandler('./src/store'),
        'pages': pathHandler('./src/pages'),
        'comp': pathHandler('./src/components'),
      }
  },
  babel: {
    plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]]
  }
};