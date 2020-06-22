<template>
  <div id="loginWrapper">
    <div class="title-is" @click="isLoginPage = true;toLogin()">登录</div>
    <div class="title-is2" @click="isLoginPage = false;toRegister()">注册</div>
    <div>
      <div id="nickWrapper" v-show="isLoginPage">
<!--        <h3>Login</h3>-->
        <div class="formItem">
          <label for="LUsername">用户名：</label>
          <input v-model="LUsername" @keyup.enter="signIn" type="text" name="LUsername" placeholder="账号 / 用户名" onfocus="this.placeholder=''">
        </div>
        <div class="formItem">
          <label for="LPassword">密码：</label>
          <input v-model="LPassword" @keyup.enter="signIn" type="password" name="LPassword" placeholder="密码" onfocus="this.placeholder=''">
        </div>
        <div class="formItem">
          <a class="toBtn" href="javascript:;" @click="isLoginPage = !isLoginPage;toRegister()">还没有账号？注册一个吧</a>
          <div class="btn" id="loginBtn" @click="signIn">登录</div>
        </div>
      </div>
      <div id="registWrapper" v-show="!isLoginPage">
<!--        <h3>Register</h3>-->
        <div class="formItem">
          <label for="RUsername">用户名：</label>
          <input v-model="RUsername" @keyup.enter="signUp" type="text" name="RUsername" placeholder="用户名" onfocus="this.placeholder=''">
        </div>
        <div class="formItem">
          <label for="RPassword">密码：</label>
          <input v-model="RPassword" @keyup.enter="signUp" type="password" name="RPassword" placeholder="密码" onfocus="this.placeholder=''">
        </div>
        <div class="formItem">
          <a class="toBtn" href="javascript:;" @click="isLoginPage = !isLoginPage;toLogin()">已有账号，快去登录吧</a>
          <div class="btn" @click="signUp">注册</div>
        </div>
      </div>
    </div>
    <div class="repeatDialog" :style="{display: repeatdialog ? 'block' : 'none'}">
      <div>该账号已在另一地点登录，确定继续登录吗？</div>
      <div style="width: 100%;height: 50px"></div>
      <div class="btn" @click="forceOffLine" style="right: 130px;margin-top: -30px">确定</div>
      <div class="btn" @click="repeatdialog = !repeatdialog" style="margin-top: -30px">取消</div>
    </div>
  </div>
</template>
<script>
import Push from 'push.js'
export default {
  data () {
    return {
      isLoginPage: true,
      LUsername: '',
      LPassword: '',
      RUsername: '',
      RPassword: '',
      repeatdialog: false
    }
  },
  created () {
    Push.Permission.request()
  },
  methods: {
    signUp () {
      if (this.RUsername.trim() === '') {
        alert('用户名不能为空')
      } else if (this.RPassword.trim() === '') {
        alert('密码不能为空')
      } else {
        this.$axios.post('/signUp', {
          username: this.RUsername,
          password: this.RPassword
        }).then(res => {
          console.log(this.isLoginPage)
          if (res.data.status === 200) {
            alert(res.data.msg)
            // console.log('res == 200')
            this.isLoginPage = !this.isLoginPage
            this.toLogin()
            this.LUsername = this.RUsername
          } else {
            alert(res.data.msg)
          }
        })
      }
    },
    signIn () {
      if (this.LUsername.trim() === '') {
        alert('用户名不能为空')
      } else if (this.LPassword.trim() === '') {
        alert('密码不能为空')
      } else {
        this.$axios.post('/signIn', {
          username: this.LUsername,
          password: this.LPassword,
          status: true
        }).then(res => {
          console.log(res)
          // alert(res.data.msg)
          if (res.data.status === 200) {
            this.$store.commit('LOGIN_IN', res.data.data)
            this.$socket.emit('signIn', res.data.data.username)
            //  修改前this.$socket.emit('signIn', this.LUsername)
            this.$router.push('/mychat')
          } else if (res.data.status === 'onLine') {
            this.repeatdialog = true
          } else {
            alert(res.data.msg)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    forceOffLine () {
      this.$socket.emit('forceOffLine', this.LUsername)
      this.$axios.post('/signIn', {
        username: this.LUsername,
        password: this.LPassword,
        status: true
      }).then(res => {
        console.log(res)
        // alert(res.data.msg)
        if (res.data.status === 200) {
          this.$store.commit('LOGIN_IN', res.data.data)
          this.$socket.emit('signIn', this.LUsername)
          this.$router.push('/mychat')
        } else if (res.data.status === 'onLine') {
          this.repeatdialog = true
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toRegister () {
      var is = document.getElementsByClassName('title-is')[0]
      var is2 = document.getElementsByClassName('title-is2')[0]
      is.style.transform = 'scale(0.8,0.8) translate(0px,6px)'
      is.style.color = '#def2f1'
      is.style.backgroundColor = '#2b7a78'
      is2.style.transform = 'scale(1,1) translate(0px,0px)'
      is2.style.color = '#2b7a78'
      is2.style.backgroundColor = '#def2f1'
      // is.style.opacity = 0.5
    },
    toLogin () {
      // alert('??')
      var is = document.getElementsByClassName('title-is')[0]
      var is2 = document.getElementsByClassName('title-is2')[0]
      is.style.transform = 'scale(1,1) translate(0px,0px)'
      is2.style.transform = 'scale(0.8,0.8) translate(0px,6px)'
      is2.style.color = '#def2f1'
      is2.style.backgroundColor = '#2b7a78'
      is.style.color = '#2b7a78'
      is.style.backgroundColor = '#def2f1'
      // is.style.opacity = 0.5
    }
  },
  socket: {
  }
}
</script>
<style scoped>
  input::placeholder {
    padding-left: 3px;
    font-size: 12px;
    font-family: Arial;
    letter-spacing: 3px;
    color: darkgrey;
    text-align: left;
  }
#loginWrapper{
  width: 300px;
  height: 200px;
  padding-left: 20px;
  padding-right: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  border: 1px solid rgb(244, 251, 255);
  background: rgba(255, 255, 255, 1);
  border-radius: 0px 0px 10px 10px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.1);
  font-family: "Gen Jyuu Gothic Regular";
  color: #3aafa9;
}
#nickWrapper,#registWrapper{
  margin-top: 40px;
  margin-bottom: 20px;
}
h3{
  text-align: center;
  color: #71b0c9;
}
.formItem{
  margin: 10px auto;
  overflow: hidden;
}
label{
  display: inline-block;
  width: 70px;
  text-align: right;
}
input{
  width: auto;
  border: 1px solid #71b0c9;
  padding: 5px;
  font-size: 16px;
  border-radius: 3px;
}
.toBtn{
  display: inline-block;
  margin-top: 25px;
  font-size: 14px;
  color: #71b0c9;
}
#nickWrapper p,#registWrapper p{
  /*padding: 5px 10px;*/
  background: #71b0c9;
  color: white;
  border: 5px;
  cursor: pointer;
  float:right;
}
.repeatDialog{
  width: 200px;
  height: 100px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: white;
  text-align: center;
  padding: 20px 15px 15px;
  border: 1px solid #2b7a78;
  border-radius: 5px;
}
.repeatDialog p{
  /*display: inline-block;*/
  /*padding: 5px 10px;*/
  /*border-radius: 3px;*/
  /*background: #71b0c9;*/
  /*color:white;*/
  /*margin-right: 5px;*/
  /*cursor: pointer;*/
}
  .title-is{
    height: 35px;
    line-height: 35px;
    width: 145px;
    position: absolute;
    margin-top: -46px;
    margin-left: -21px;
    /*font-family: 汉仪新人文宋W;*/
    color: #2b7a78;
    font-size: 23px;
    background-color: #def2f1;
    z-index: -50;
    padding: 5px 20px;
    border-radius: 10px 0px 0px 0px;
    /*letter-spacing: -2px;*/
    transition: transform 0.4s ease,color 0.2s ease,background-color 0.2s ease;
    cursor: pointer;
  }
  /*.title-is:hover{*/
  /*  transform: scale(0.8,0.8) translate(0px,6px);*/
  /*}*/
  .title-is2{
  text-align: right;
    height: 35px;
    line-height: 35px;
    width: 135px;
    position: absolute;
    margin-top: -46px;
    margin-left: 146px;
    /*font-family: 汉仪新人文宋W;*/
    color: #def2f1;
    font-size: 23px;
    background-color: #2b7a78;
    z-index: -200;
    padding: 5px 20px;
    border-radius: 0px 10px 0px 0px;
  transform: scale(0.8,0.8) translate(0px,6px);
    transition: transform 0.4s ease,color 0.2s ease,background-color 0.2s ease;
    cursor: pointer;
    /*letter-spacing: -2px;*/

  }
  .btn{
    position: absolute;
    right: 40px;
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
  .btn:hover{
    background-color: #204846;
  }
  .btn:active{
    background-color: #3aafa9;
  }
  /*.title-is2:hover{*/
  /*  transform: scale(1,1) translate(0px,0px);*/

  /*}*/
</style>
