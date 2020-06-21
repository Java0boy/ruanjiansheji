const baseController = require('./baseController')

module.exports = class extends baseController {
  constructor (options) {
    super(options)

    // 项目初始化
    // 注册 修改
    this.signUp = async (ctx, next) => {
      const params = ctx.request.body
      const isFind = await this.DBModule.User.findUser({ username: params.username })
      const re = /^[0-9]*$/
      const stringRandom = require('string-random')
      if (params.username.length > 16) {
        ctx.body = { status: 401, msg: '该用户名超过了16个字符', data: isFind.data }
      } else if (re.test(params.username)) {
        ctx.body = { status: 401, msg: '该用户名为纯数字', data: isFind.data }
      } else {
        if (isFind.status === 'success' && isFind.data.length > 0) {
          ctx.body = { status: 401, msg: '该用户名已被使用', data: isFind.data }
        } else {
          const userObj = {
            id: stringRandom(8, { letters: false }),
            username: params.username,
            password: params.password,
            token: '123ds465sxsdfs', // 登录验证token
            friends: [], // 好友
            status: false // 登录状态
          }
          const result = await this.DBModule.User.saveUser(userObj)
          if (result.status === 'success') {
            ctx.body = { status: 200, msg: result.msg, data: result.data }
          } else {
            ctx.body = { status: 400, msg: '注册失败，请重试' }
          }
        }
      }
    }

    // 登录 修改
    this.signIn = async (ctx, next) => {
      const params = ctx.request.body
      const isFind1 = await this.DBModule.User.findUser({ username: params.username })
      const isFind2 = await this.DBModule.User.findUser({ id: params.username })
      if (isFind1.status === 'success' && isFind2.status === 'success') {
        if (isFind1.data.length > 0) {
          if (isFind1.data[0].password === params.password) {
            const isUpdateSuccess = await this.DBModule.User.updateStatus({ username: params.username, status: true })
            if (isUpdateSuccess.status === 'success') {
              ctx.body = { status: 200, msg: '验证成功', data: isFind1.data[0] }
            } else if (isUpdateSuccess.status === 'onLine') {
              ctx.body = { status: 'onLine', msg: '该用户已在线' }
            } else {
              ctx.body = { status: 400, msg: '更新状态失败' }
            }
          } else {
            ctx.body = { status: 401, msg: '密码错误' }
          }
        } else if (isFind2.data.length > 0) {
          if (isFind2.data[0].password === params.password) {
            const isUpdateSuccess = await this.DBModule.User.updateStatus({ username: isFind2.data[0].username, status: true })
            if (isUpdateSuccess.status === 'success') {
              ctx.body = { status: 200, msg: '验证成功', data: isFind2.data[0] }
            } else if (isUpdateSuccess.status === 'onLine') {
              ctx.body = { status: 'onLine', msg: '该用户已在线' }
            } else {
              ctx.body = { status: 400, msg: '更新状态失败' }
            }
          } else {
            ctx.body = { status: 401, msg: '密码错误' }
          }
        } else {
          ctx.body = { status: 401, msg: '用户名或账户不存在' }
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

    // 下线
    this.offLine = async (ctx, next) => {
      const params = ctx.request.body
      const isUpdateSuccess = await this.DBModule.User.updateStatus({ username: params.username, status: false })
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
    // 添加申请
    this.addApplic = async (ctx, next) => {
      const params = ctx.request.body
      const from = params.username
      const to = params.friend
      // 在数据库中找到B，也就是to
      const isFindTo = await this.DBModule.User.findUser({username: to})
      if (isFindTo.status === 'success') {
        if (isFindTo.data.length > 0) {
          let haveThisApplication = false
          for (let i = 0; i < isFindTo.data[0].applications.length; i++) {
            if (isFindTo.data[0].applications[i].username === params.friend) {
              haveThisApplication = true
            }
          }
          if (haveThisApplication) {
            ctx.body = { status: 400, msg: '您已添加过该用户，请等待对方通过申请' }
          } else {
            let haveThisFriend = false
            for (let i = 0; i < isFindTo.data[0].applications.length; i++) {
              if (isFindTo.data[0].applications[i].username === params.friend) {
                haveThisFriend = true
              }
            }
            if (haveThisFriend) {
              ctx.body = {status: 400, msg: '您已添加过该好友'}
            } else {
              const isAddApplic = await this.DBModule.User.addApplic({from: from, to: to})
              if (isAddApplic.status === 'success') {
                ctx.body = {status: 200, msg: '发送申请成功', data: isAddApplic.data}
              } else {
                ctx.body = {status: 500, msg: '发送申请失败，请重试'}
              }
            }
          }
        } else {
          ctx.body = {status: 404, msg: '未找到该用户'}
        }
      } else {
        ctx.body = {status: 404, msg: isFindTo.msg}
      }
    }

    // 同意申请
    this.accApplic = async (ctx, next) => {
      const params = ctx.request.body
      const deleteSuccess = await this.DBModule.User.deleteApplic({username: params.username, friend: params.friend})
      if (deleteSuccess.status === 'success') {
        ctx.body = {status: 200, msg: '已同意申请', data: deleteSuccess.data}
      } else {
        ctx.body = {status: 500, msg: '噢HO，同意申请时出错了'}
      }
    }

    // 拒绝申请,其实和上面的accApplic是一样的，都是删除这条消息
    this.rejApplic = async (ctx, next) => {
      const params = ctx.request.body
      const deleteSuccess = await this.DBModule.User.deleteApplic({username: params.username, friend: params.friend})
      if (deleteSuccess.status === 'success') {
        ctx.body = {status: 200, msg: '已拒绝申请', data: deleteSuccess.data}
      } else {
        ctx.body = {status: 500, msg: '噢HO，拒绝申请时出错了'}
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
