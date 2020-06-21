<template>
  <div>
    <div class="myChat">
      <div class="userInfo" v-show="isUserInfo">
        <div style="color: #2b7a78;font-size: 30px;flex: 1.3;margin-top: 30px">个人信息</div>
        <div style="flex: 1;display: flex;flex-flow: revert">
          <div>用户名</div>
          <div>{{ curUsername }}</div>
        </div>
        <div style="flex: 1;display: flex;flex-flow: revert">
          <div>新头像</div>
          <img :src="this.curHeadImg" alt="头像">
          <div class="upLoadImg">
            <img :src="require('../../static/img/picture.png')" alt="">
            <input type="file" ref="upLoadImgBtn" @change="updateImg" accept="image/*" />
          </div>
        </div>
        <div style="flex: 1;display: flex;flex-flow: revert">
          <div><span style="color: white;pointer-events: none">密</span>旧密码</div>
          <input style="height: 30px;margin-top: -5px;margin-left: 20px" type="password" v-model="oldPassword" placeholder="旧密码" onfocus="this.placeholder=''">
        </div>
        <div style="flex: 1;display: flex;flex-flow: revert">
          <div><span style="color: white;pointer-events: none">密</span>新密码</div>
          <input style="height: 30px;margin-top: -5px;margin-left: 20px" type="password" v-model="newPassword1" placeholder="新密码" onfocus="this.placeholder=''">
        </div>
        <div style="flex: 1;display: flex;flex-flow: revert">
          <div><span style="color: white;pointer-events: none">密</span>再次输入新密码</div>
          <input style="height: 30px;margin-top: -5px;margin-left: 20px" type="password" v-model="newPassword2" placeholder="新密码" onfocus="this.placeholder=''">
        </div>
        <div style="flex: 1;display: flex;flex-flow: revert">
          <div class="btn2" style="margin: 0" @click="updateInformation">修改</div>
          <div class="btn2" style="margin: 0" @click="isUserInfo = !isUserInfo">取消</div>
        </div>
      </div>
      <div class="topSide">
        <img :src="this.curHeadImg" alt="头像">
        <p id="me" style="color: white">{{ curUsername }}</p>
        <p style="color: #def2f1">在线好友人数 【{{ onlineNum }}】</p>
        <img :src="require('../../static/img/add.png')" @click="openBar()" class="addFriend" :style="{ transform : 'rotate(' + rotateDeg + 'deg)' }">
        <div class="rightBar" :style="{display: isBar ? 'block' : 'none'}" >
          <div class="rightBarInfo" @click="isUserInfo = !isUserInfo">修改信息</div>
          <div style="margin-left:5%;width: 90%;height: 1px;background-color: white"></div>
          <div class="rightBarInfo" @click="isAdd = !isAdd">添加好友</div>
          <div style="margin-left:5%;width: 90%;height: 1px;background-color: white"></div>
          <div class="rightBarInfo" @click="offLine">退出登录</div>
        </div>
      </div>
      <div class="leftSide" v-show="isMsg">
          <ul>
            <li v-for="(friend,i) in friends" :key="i" :class="{'activeLi': i === nowChat}" style="border-bottom: 1px solid white" @click="chatWith(i)">
              <div id="redpoint" class="redPoint"></div>
              <img :src="require('../../static/img/favicon.png')" :alt="friend.username">
              <p>{{ friend.username }}</p>
            </li>
          </ul>
      </div>
      <div class="leftSide" v-show="!isMsg">
        <ul>
          <li v-for="(application,i) in applications" :key="i" style="border-bottom: 1px solid white">
            <img :src="require('../../static/img/favicon.png')" :alt="friend.username">
            <p style="width: 110px;text-overflow: clip">{{ application.username }}</p>
            <p class="sendBtn" @click="accApplic()">√</p>
            <div style="width: 5px"> </div>
            <p class="sendBtn" @click="rejApplic()">×</p>
          </li>
        </ul>
      </div>
      <div class="leftSide3">
        <div class="btn_msg" @click="isMsg = true;isBold1 = 'bold';isBold2 = 'normal'" :style="{ fontWeight : isBold1}">消息</div>
        <div class="btn_fri" @click="isMsg = false;isBold2 = 'bold';isBold1 = 'normal'" :style="{ fontWeight : isBold2}">好友列表</div>
      </div>
      <div class="rightSide">
        <div id="chatPlace">
          <p class="nowChatName">{{ friends.length > 0 ? friends[nowChat].username : '' }}</p>
          <div v-for="(item, i) in newMsg" :key="i" v-show="item.from === friends[nowChat].username || item.to === friends[nowChat].username" class="msgBox">
            <div>
              <p :style="{ float: item.from === curUsername ? 'right' : 'left'}" style="font-size: 12px">{{ item.date }}</p>
            </div>
            <p :class="{'myMsg': item.from === curUsername, 'msg': true}" v-html="changeMsg(item.msg)" style="font-size: 14px"></p>
          </div>
        </div>
        <div class="editBox">
          <div class="toolsBar">
            <img class="emojiBtn" :src="require('../../static/img/emoji.png')" alt="" @click="emojiShow = !emojiShow">
            <div class="upLoadImg">
              <img :src="require('../../static/img/picture.png')" alt="">
              <input type="file" ref="upLoadImgBtn" @change="sendImg" accept="image/*" />
            </div>
            <div class="upLoadFile">
              <img :src="require('../../static/img/uploadFile.png')" alt="">
              <input type="file" ref="upLoadFileBtn" @change="sendFile" />
            </div>
            <div class="emojiWrapper" v-show="emojiShow">
              <img v-for="i in emojiTotal" @click="addEmoji(i+1)" :key="i" :src="require('../../static/emoji/'+ (i+1) +'.gif')" alt="">
            </div>
          </div>
          <div class="msgText">
            <edit-pre ref="editPre" v-if="friends.length>0" @keyup.enter="send()" :child="friends[nowChat].textmsg" @updateMsg="updateMsg"></edit-pre>
            <edit-pre ref="editPre" v-else @keyup.enter="send(textmsg)" :child="textmsg" @updateMsg="updateMsg"></edit-pre>
          </div>
          <!-- <textarea name="message" class="msgText" @keyup.enter="send" v-if="friends.length>0" v-model="friends[nowChat].textmsg"></textarea>
          <textarea name="message" class="msgText" @keyup.enter="send" v-model="textmsg" v-else></textarea> -->
        </div>
        <div class="btn2" style="position: absolute;right: 10px;bottom: 10px" @click="send()">发送</div>
      </div>
    </div>
    <div class="add" :style="{display: isAdd ? 'block' : 'none'}">
      <label for="friendName">用户名：</label>
      <input type="text" v-model="friend">
      <p class="btn2" @click="addFriend">添加</p>
      <p class="btn2" @click="isAdd = !isAdd">关闭</p>
    </div>
  </div>
</template>
<script>
import EditPre from './EditDiv'
import Push from 'push.js'
export default {
  data () {
    return {
      isUserInfo: false,
      rotateDeg: 0,
      isBar: false,
      isMsg: true,
      isAdd: false,
      isBold1: 'bold',
      isBold2: 'normal',
      friend: '',
      application: '',
      curUsername: this.$store.state.username,
      curHeadImg: this.$store.state.headImg,
      friends: this.$store.state.friends,
      applications: this.$store.state.applications,
      nowChat: 0,
      id: '',
      onlineNum: 0,
      textmsg: '',
      newMsg: [],
      emojiShow: false,
      emojiTotal: 45,
      imgArr: []
    }
  },
  components: {
    EditPre
  },
  methods: {
    updatePassword () {
      // 检验密码是否一致
      if (this.newPassword1 !== this.newPassword2) {
        alert('两次密码输入不一致')
      } else {
        // 修改密码
        this.$axios.post('/updatePassword', {
          username: this.curUsername,
          password: this.newPassword1
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    updateImg () {
      const file = this.$refs.upLoadImgBtn.files[0]
      this.imgArr.push({'name': file.name, 'fileObj': file})
      console.log(file)
      console.log(this.imgArr)
      // this.formData.append(file.name, file)
      if (window.FileReader) {
        let fileReader = new FileReader()
        fileReader.onload = event => {
          this.curHeadImg = `<img style="max-width: 200px" src="${event.target.result}" data-name="${file.name}" alt="[图片]">`
        }
        fileReader.readAsDataURL(file)
      }
      // 更新头像
      this.$axios.post('/updateImg', {
        username: this.curUsername,
        img: this.newPassword1
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    offLine () {
      this.$axios.post('/offLine', {
        username: this.curUsername,
        status: false
      }).then(res => {
        console.log(res)
        // alert(res.data.msg)
        if (res.data.status === 200) {
          this.$socket.emit('forceOffLine', this.curUsername)
          this.$router.push('/login')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    accApplic () {
      this.$axios.post('/accApplic', {
        username: this.curUsername,
        friend: this.application
      }).then(res => {
        if (res.data.status === 200) {
          this.applications = res.data.data
          this.$axios.post('/addFriend', {
            username: this.curUsername,
            friend: this.application
          }).then(res => {
            if (res.data.status === 200) {
              this.$store.commit('updateFriends', res.data.data)
              this.friends = res.data.data
              this.$socket.emit('updateFriends', this.curUsername, this.application)
            }
          }).catch(err => {
            console.log(err)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    rejApplic () {
      this.$axios.post('/rejApplic', {
        username: this.curUsername,
        friend: this.friend
      }).then(res => {
        if (res.data.status === 200) {
          this.applications = res.data.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    pushMessage (message, head) {
      Push.create(head, {
        body: message,
        requireInteraction: true,
        timeout: 600000
      })
    },
    openBar () {
      this.rotateDeg = this.isBar ? 0 : 45
      this.isBar = !this.isBar
    },
    chatWith (i) {
      this.nowChat = i
      this.$refs.editPre.setInnerText()
    },
    updateMsg (msg) {
      if (this.friends.length > 0) {
        this.friends[this.nowChat].textmsg = msg
      } else {
        this.textmsg = msg
      }
    },
    send () {
      let imgList = document.querySelector('.msgText').querySelectorAll('img')
      let isNull = true
      let formData = new FormData()
      for (let i = 0; i < imgList.length; i++) {
        this.imgArr.map((ele, idx) => {
          if (ele.name === imgList[i].getAttribute('data-name')) {
            isNull = false
            formData.append(ele.name, ele.fileObj)
          }
        })
      }
      this.imgArr = []
      if (this.friends.length > 0) {
        if (!isNull) {
          this.$axios.post('/uploadImg', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(res => {
            if (res.data.status === 200) {
              for (let i = 0; i < imgList.length; i++) {
                for (let key in res.data.data) {
                  if (imgList[i].getAttribute('data-name') === key) {
                    imgList[i].src = res.data.data[key]
                  }
                }
              }
              // send发数据
              this.$socket.emit('receive', document.querySelector('.msgText pre').innerHTML, this.curUsername, this.friends[this.nowChat].username)
              this.friends[this.nowChat].textmsg = ''
              this.$refs.editPre.setInnerText()
            }
          })
        } else {
          // send发数据
          this.$socket.emit('receive', document.querySelector('.msgText pre').innerHTML, this.curUsername, this.friends[this.nowChat].username)
          this.friends[this.nowChat].textmsg = ''
          this.$refs.editPre.setInnerText()
        }
      } else {
        alert('你还没有好友，先去加好友吧')
      }
    },
    addFriend () {
      this.$axios.post('/addFriend', {
        username: this.curUsername,
        friend: this.friend
      }).then(res => {
        if (res.data.status === 200) {
          this.$store.commit('updateFriends', res.data.data)
          this.friends = res.data.data
          // send发数据
          this.$socket.emit('updateFriends', this.curUsername, this.friend)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getNewsList () {
      this.$axios.post('/getNews', {
        username: this.curUsername
      }).then(res => {
        console.log(res)
        this.newMsg = res.data.data
      }).catch(err => console.log(err))
    },
    addEmoji (index) {
      this.$axios.post('/searchEmojiUrl', {
        emojiId: index
      }).then(res => {
        if (this.friends.length > 0) {
          this.friends[this.nowChat].textmsg += '<img src="' + res.data.data.emojiUrl + '" alt="emoji">'
        } else {
          this.textmsg += '<img src="' + res.data.data.emojiUrl + '" alt="emoji">'
        }
        this.emojiShow = false
      }).catch(err => console.log(err))
    },
    changeMsg (msg) {
      let fileName = ''
      let result = msg
      let fileReg = /\[file:.+?\]/g
      let fileMatch = fileReg.exec(msg)
      let fileType = ''
      while (fileMatch) {
        fileName = fileMatch[0].slice(6, -1)
        console.log(fileName)
        var index = fileName.lastIndexOf('/')
        var str = fileName.substring(index + 1, fileName.length)
        var strFileName = str.replace(/^.+?\\([^\\]+?)(\.[^.\\]*?)?$/gi, '$1')
        var fileExt = str.replace(/.+\./, '').toLowerCase()
        if (fileExt === 'doc') {
          fileType = 'word'
        } else if (fileExt === 'xlsx') {
          fileType = 'excel'
        } else {
          fileType = 'file'
        }
        result = result.replace(fileMatch[0], `<p class="fileMsg"><img src="../../static/img/${fileType}.png" ><span>${strFileName}</span><a href="${fileName}" class="downloadBtn">下载</a></p>`)
        fileMatch = fileReg.exec(msg)
      }
      return result
    },
    emojiWrapperHide () {
      var that = this
      document.body.onclick = function (e) {
        if (e.target.className !== 'emojiWrapper' && e.target.className !== 'emojiBtn') {
          that.emojiShow = false
        }
      }
    },
    sendImg () {
      const file = this.$refs.upLoadImgBtn.files[0]
      this.imgArr.push({'name': file.name, 'fileObj': file})
      console.log(file)
      console.log(this.imgArr)
      // this.formData.append(file.name, file)
      if (window.FileReader) {
        let fileReader = new FileReader()
        fileReader.onload = event => {
          if (this.friends.length > 0) {
            this.friends[this.nowChat].textmsg += `<img style="max-width: 200px" src="${event.target.result}" data-name="${file.name}" alt="[图片]">`
          } else {
            this.textmsg += `<img style="max-width: 200px" src="${event.target.result}" data-name="${file.name}" alt="[图片]">`
          }
        }
        fileReader.readAsDataURL(file)
      }
      // this.$axios.post('/uploadImg', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // }).then(res => {
      //   if (res.data.status === 200) {
      //     if (this.friends.length > 0) {
      //       this.$socket.emit('receive', '[img:' + res.data.data.pictureUrl + ']', this.curUsername, this.friends[this.nowChat].username)
      //     } else {
      //       alert('你还没有好友，先去加好友吧')
      //     }
      //   }
      // })
    },
    sendFile () {
      const file = this.$refs.upLoadFileBtn.files[0]
      let formData = new FormData()
      formData.append('file', file)
      this.$axios.post('/uploadFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        if (res.data.status === 200) {
          if (this.friends.length > 0) {
            // send发数据
            this.$socket.emit('receive', '[file:' + res.data.data.pictureUrl + ']', this.curUsername, this.friends[this.nowChat].username)
          } else {
            alert('你还没有好友，先去加好友吧')
          }
        }
      })
    }
  },
  updated: function () {
    this.$nextTick(function () {
      var div = document.getElementById('chatPlace')
      div.scrollTop = div.scrollHeight + 20
    })
  },
  sockets: { // 不能改
    getOnlineNum: function (num) {
      this.onlineNum = num
    },
    newMsg: function (data) {
      this.pushMessage(data.msg, '来自' + data.from + '的信息')

      // console.log('newMsg')
      // console.log(data)
      this.newMsg.push(data)
      this.friends[this.nowChat].textmsg = ''
      document.title = '有新消息啦'
    },
    updateFriends: function (data) {
      this.friends.push({
        username: data,
        textmsg: ''
      })
    },
    offLine () {
      this.$store.commit('LOGIN_OUT')
      this.$router.push('/login')
    }
  },
  mounted () {
    this.getNewsList()
    this.emojiWrapperHide()
    this.pushMessage('开始畅聊吧', '打开了IM')
    window.onfocus = function () {
      document.title = 'IM chat'
    }
    // document.title = '哈哈哈'
  },
  beforeRouteLeave (to, from, next) {
    this.$axios.post('/forceUpdateStatus', {
      username: this.$store.state.username,
      status: false
    }).then(res => {
      console.log(res.data)
      if (res.data.status === 200) {
        next()
      }
    })
  }
}
</script>
<style>
  .userInfo{
    position: fixed;
    width: 400px;
    height: 300px;
    background-color: white;
    top: 50%;
    left: 50%;
    margin-left: -200px;
    margin-top: -100px;
    z-index: 1000;
    border: 1px solid #2b7a78;
    border-radius: 10px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
  }
  .redPoint{
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: red;
    margin-left: 5px;
    margin-top: -15px;
  }
  .btn2{
    display: inline-block;
    width: 60px;
    height: 25px;
    line-height: 25px;
    border-radius: 3px;
    align-items: center;
    text-align: center;
    margin-top: -20px;
    background-color: #2b7a78;
    color: white;
    transition: background-color 0.2s ease;
    cursor: pointer;
  }
  .btn2:hover{
    background-color: #204846;
  }
  .btn2:active{
    background-color: #3aafa9;
  }
  .rightBarInfo{
    height: 59px;
    line-height: 59px;
    text-align: center;
    cursor: pointer;
  }
  .rightBar{
    position: absolute;
    right: 0;
    width: 120px;
    height: 180px;
    background-color: #def2f1;
    z-index: 1000;
    top: 60px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }
.checkBtn{
  cursor: pointer;
  font-weight: bold;
  font-family: 微软雅黑;
}
.checkBtn:hover{
  color: #2b7a78;
}
.connect{
  padding-left: 20px;
  padding-right: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  border: 1px solid rgb(233, 230, 230);
  background: rgb(89, 158, 175);
  border-radius: 10px;
}
.myChat{
  width: 800px;
  height: 86vh;
  margin: 7vh auto;
  background: white;
  border-radius: 5px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
}
.topSide,.leftSide,.rightSide{
  float: left;
}
.topSide{
  width: 100%;
  background: #2b7a78;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 5px 5px 0 0;
  position: relative;
}
.topSide img{
  height: 80%;
  border-radius: 100%;
}
.topSide p{
  width: 160px;
  overflow: hidden;
  /*text-overflow: ellipsis;*/
  white-space: nowrap;
}
.leftSide{
  margin-top: 40px;

  width: 200px;
  height: calc(86vh - 100px);
  background: #def2f1;
  /*overflow-y: scroll;*/
}
.leftSide2{
  width: 200px;
  height: calc(86vh - 100px);
  margin-top: 100px;
  background: #def2f1;
  /*overflow-y: scroll;*/
  /*position: absolute;*/
  /*display: inline;*/
}
.leftSide3 div {
  /*background-color: #71b0c9;*/
  display: inline;
  line-height: 40px;
  margin-left: 30px;
  margin-right: 10px;
}
.leftSide3{
  color: #2b7a78;
  width: 200px;
  height: calc(40px);
  margin-top: 60px;
  background: #def2f1;
  position: absolute;
  border-bottom: 1px solid white;
}
.leftSide ul {
  padding: 0;
  margin: 5px 0;
}
.leftSide ul li {
  font-size: 14px;
  width: 100%;
  list-style: none;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #def2f1;
}
.leftSide ul li:hover{
  background: white;
}
.leftSide ul li img{
  height: 80%;
}
.activeLi{
  background: white !important;

}
.rightSide{
  width: calc(100% - 200px);
  height: calc(100% - 60px);
  overflow-x: hidden;
  position: relative;
}
.rightSide #chatPlace{
  width: calc(100% + 20px);
  height: calc(100% - 210px);
  overflow-y: scroll;
  padding-right: 20px;
  margin-top: 40px;
}
/* #chatPlace::-webkit-scrollbar {
    display: none;
} */
#chatPlace .nowChatName{
  padding: 10px 0 10px 10px;
  border-bottom: 1px solid rgb(230, 228, 228);
  position: absolute;
  top: 0;
  left: 0;
  background: white;
  width: 100%;
  margin: 0;
}
.toolsBar{
  height: 30px;
  border-top: 1px solid rgb(223, 221, 221);
  display: flex;
  flex-direction: row;
  position: relative;
}
.toolsBar img {
  height: 80%;
  margin-left: 10px;
  margin-top: 5px;
  cursor: pointer;
}
.upLoadImg,.upLoadFile{
  position: relative;
  width:35px;
  overflow: hidden;
  cursor: pointer;
}
.upLoadImg input,.upLoadFile input{
  position: absolute;
  left: 10px;
  top: 5px;
  opacity: 0;
  filter: opacity(0);
}
.emojiWrapper{
  position: absolute;
  top: -120px;
  left: 0;
  z-index: 10;
  background: #dededf;
  border-radius: 5px;
}
.emojiWrapper img {
  width: 30px;
  height: 30px;
  margin: 3px 3px;
}
.rightSide .msgText{
  width: calc(100% - 10px);
  height: 100px;
}
.sendBtn{
  padding: 5px 10px;
  border-radius: 3px;
  background: #71b0c9;
  color:white;
  float: right;
  margin-right: 5px;
  margin-top: 10px;
  cursor: pointer;
}
img.addFriend{
  height: 30px;
  position: absolute;
  right: 10px;
  cursor: pointer;
  transition: transform 0.5s ease;
  /*transform: rotate(30deg);*/
}
.add{
  padding: 20px;
  position: absolute;
  height: 50px;
  line-height: 50px;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  border: 1px solid #2b7a78;
  background: rgb(255, 255, 255);
  border-radius: 10px;
}
.add label{
  display: inline-block;
  width: 70px;
  text-align: right;
}
.add input{
  width: auto;
  border: 1px solid #71b0c9;
  padding: 5px;
  font-size: 14px;
  border-radius: 3px;
}
/*.add p{*/
/*  display: inline-block;*/
/*  padding: 5px 10px;*/
/*  border-radius: 3px;*/
/*  background: #71b0c9;*/
/*  color:white;*/
/*  margin-right: 5px;*/
/*  cursor: pointer;*/
/*}*/
.msgBox{
  margin-right: 25px;
  margin-left: 15px;
}
.msgBox,.msgBox div{
  overflow: hidden;
}
.msgBox p {
  margin: 5px;
}
.msg{
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  float: left;
  margin: 0;
}
.myMsg{
  background: #def2f1;
  float: right;
  color: black;
}
.fileMsg{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.fileMsg img {
  width: 50px;
  height: 50px;
}
.fileMsg span{
  margin: 0 5px;
}
.fileMsg span:last-child{
  display: inline-block;
  cursor: pointer;
}
a.downloadBtn{
  text-decoration: none;
  color: black;
}
.myMsg a.downloadBtn{
  text-decoration: none;
  color: white;
}
</style>
