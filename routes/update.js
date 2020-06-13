const UserController = require('../controller/userController')

module.exports = function (koaRouter, options) {
  // 创建controller实例
  const user = new UserController(options)
  // post请求
  // koaRouter.post('/updateName', user.updateName) // 修改用户名
  koaRouter.post('/updatePassword', user.updatePassword) // 修改密码
  koaRouter.post('/updateImg', user.updateImg) // 修改用户头像
}
