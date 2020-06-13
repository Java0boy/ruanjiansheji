const baseController = require('./baseController')

module.exports = class extends baseController {
  constructor (options) {
    super(options)

    // 项目初始化
    // 注册
    this.signUp = async (ctx, next) => {
      const params = ctx.request.body
      const isFind = await this.DBModule.User.findUser({ username: params.username })
      if (isFind.status === 'success' && isFind.data.length > 0) {
        ctx.body = { status: 401, msg: '该用户名已被使用', data: isFind.data }
      } else {
        // 获取随机id
        while (1) {
          var uid = GetRandomNum(10000000, 99999999) + ''
          const isUsed = await this.DBModule.User.findUser({ id: uid })
          if (isUsed.status === 'failed' || isUsed.data.length === 0) { break }
        }
        var headImg = '<img src="' + `http://${ctx.host}/img/favicon.png` + '">'// 默认头像（可能需要修改）
        const userObj = {
          id: uid,
          username: params.username,
          password: params.password,
          token: '123ds465sxsdfs', // 登录验证token
          friends: [], // 好友
          status: false, // 登录状态
          img: headImg
        }
        const result = await this.DBModule.User.saveUser(userObj)
        if (result.status === 'success') {
          ctx.body = { status: 200, msg: result.msg, data: result.data }
        } else {
          ctx.body = { status: 400, msg: '注册失败，请重试' }
        }
      }
    }

    // 登录
    this.signIn = async (ctx, next) => {
      const params = ctx.request.body
      const isFind = await this.DBModule.User.findUser({ username: params.username })
      if (isFind.status === 'success') {
        if (isFind.data.length > 0) {
          if (isFind.data[0].password === params.password) {
            const isUpdateSuccess = await this.DBModule.User.updateStatus({ username: params.username, status: true })
            if (isUpdateSuccess.status === 'success') {
              ctx.body = { status: 200, msg: '验证成功', data: isFind.data[0] }
            } else if (isUpdateSuccess.status === 'onLine') {
              ctx.body = { status: 'onLine', msg: '该用户已在线' }
            } else {
              ctx.body = { status: 400, msg: '更新状态失败' }
            }
          } else {
            ctx.body = { status: 401, msg: '密码错误' }
          }
        } else {
          ctx.body = { status: 401, msg: '用户名不存在' }
        }
      } else {
        ctx.body = { status: 400, msg: '服务器访问数据失败' }
      }
    }

    // 更新状态
    this.forceUpdateStatus = async (ctx, next) => {
      const params = ctx.request.body
      const isUpdateSuccess = await this.DBModule.User.forceUpdateStatus(params)
      if (isUpdateSuccess) {
        if (isUpdateSuccess.status === 'success') {
          ctx.body = { status: 200, msg: '更新状态成功' }
        } else {
          ctx.body = { status: 400, msg: '更新状态失败' }
        }
      } else {
        ctx.body = { status: 200 }
      }
    }

    // 添加好友
    this.addFriend = async (ctx, next) => {
      const params = ctx.request.body
      const isFindUser = await this.DBModule.User.findUser({username: params.username})
      const isFind = await this.DBModule.User.findUser({username: params.friend})
      if (isFind.status === 'success') {
        if (isFind.data.length > 0) {
          let haveThis = false
          for (let i = 0; i < isFindUser.data[0].friends.length; i++) {
            if (isFindUser.data[0].friends[i].username === params.friend) {
              haveThis = true
            }
          }
          if (haveThis) {
            ctx.body = { status: 400, msg: '该用户已是你的好友' }
          } else {
            const isAddSuccess = await this.DBModule.User.addFriend({username: params.username, friend: params.friend})
            const isAddMe = await this.DBModule.User.addFriend({username: params.friend, friend: params.username})
            if (isAddSuccess.status === 'success' && isAddMe.status === 'success') {
              ctx.body = { status: 200, msg: '添加成功', data: isAddSuccess.data }
            } else {
              ctx.body = { status: 500, msg: '添加失败，请重试' }
            }
          }
        } else {
          ctx.body = { status: 404, msg: '未找到该用户' }
        }
      } else {
        ctx.body = { status: 404, msg: isFind.msg }
      }
    }

    // 修改用户名
    // this.updateName = async (ctx, next) => {
    //   const params = ctx.request.body
    //   const isUpdateSuccess = await this.DBModule.User.updateName(params)
    //   if (isUpdateSuccess) {
    //     if (isUpdateSuccess.status === 'success') {
    //       ctx.body = { status: 200, msg: '修改成功' }
    //     } else {
    //       ctx.body = { status: 400, msg: '修改失败' }
    //     }
    //   } else {
    //     ctx.body = { status: 200 }
    //   }
    // }

    // 修改密码
    this.updatePassword = async (ctx, next) => {
      const params = ctx.request.body
      const isUpdateSuccess = await this.DBModule.User.updatePassword({username: params.username, password: params.password})
      if (isUpdateSuccess) {
        if (isUpdateSuccess.status === 'success') {
          ctx.body = { status: 200, msg: '修改密码成功' }
        } else {
          ctx.body = { status: 400, msg: '修改密码失败' }
        }
      } else {
        ctx.body = { status: 400 }
      }
    }

    // 修改用户头像
    this.updateImg = async (ctx, next) => {
      const params = ctx.request.body
      const isUpdateSuccess = await this.DBModule.User.updateImg({username: params.username, img: params.img})
      if (isUpdateSuccess) {
        if (isUpdateSuccess.status === 'success') {
          ctx.body = { status: 200, msg: '修改头像成功' }
        } else {
          ctx.body = { status: 400, msg: '修改头像失败' }
        }
      } else {
        ctx.body = { status: 400 }
      }
    }

    // 添加消息
    // this.addNewsList = async (ctx, next) => {
    //   const params = ctx.request.body
    //   const isAdd = await this.DBModule.User.addNewsList(params)
    //   if (isAdd.status === 'success') {
    //     ctx.body = { status: 200, msg: '发送成功', data: isAdd.data }
    //   } else {
    //     ctx.body = { status: 403, msg: '发送失败，请重试' }
    //   }
    // }

    // 获取消息记录
    // this.getNewsList = async (ctx, next) => {
    //   const params = ctx.request.body
    //   const isFind = await this.DBModule.User.findUser({ username: params.username })
    //   if (isFind.status === 'success') {
    //     ctx.body = { state: 200, msg: '获取成功', data: isFind.data[0].newsList }
    //   } else {
    //     ctx.body = { state: 403, msg: '获取失败' }
    //   }
    // }
  }
}

function GetRandomNum (Min, Max) {
  var Range = Max - Min
  var Rand = Math.random()
  return (Min + Math.round(Rand * Range))
}
