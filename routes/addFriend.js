
const UserController = require('../controller/userController')

module.exports = function (koaRouter, options) {
  const user = new UserController(options)
  koaRouter.post('/addFriend', user.addFriend)
  koaRouter.post('/addApplic', user.addApplic) // 申请添加
  koaRouter.post('/accApplic', user.accApplic)
  koaRouter.post('/rejApplic', user.rejApplic)
}
