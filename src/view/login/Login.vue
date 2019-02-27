<template>
	<div class="login-bg">
    <div :style="loginBox">
      <div class="login-lf"></div>
      <div class="login-rt" :style="rtStyle">
        <div class="login-logo" :style="loginStyle">
         <img style="width: 100%; height: 100%;" src="../../common/img/icon_logo.png">
        </div>
        <div class="input-box">
          <label class="icon-username" for="usernameIput"></label>
          <input placeholder="请输入用户名" id="usernameIput" type="text" v-model="loginName" @keydown="submit($event)" />
        </div>

        <div class="input-box">
          <label class="icon-password" for="passwordIput"></label>
          <input placeholder="请输入密码" id="passwordIput" type="password" v-model="loginPassword" @keydown="submit($event)"/>
        </div>

        <div class="loginbutonDiv">
          <el-button class="buttonSize button-solid" type="primary" @click="login">登录</el-button>
        </div>
      </div>
    </div>
	</div>
</template>

<script>
  import md5 from 'js-md5';
	import { Message } from 'element-ui'

	export default {
		data() {
			return {
				loginName: '',
				loginPassword: '',
				id: '',
        screenWidth: $(window).width(),
        screenHeight: $(window).height(),
			}
		},
    computed: {
      loginBox: function () {
        if(this.screenWidth < 1400){
          return {
            'width': (this.screenWidth - 220) + 'px',
            'height': (this.screenHeight - 140) + 'px',
            'background': '#f1f1f1',
            'position': 'absolute',
            'top': '70px',
            'left': '110px'
          }
        }
        else{
          return {
            'width': (this.screenWidth - 340) + 'px',
            'height': (this.screenHeight - 240) + 'px',
            'background': '#f1f1f1',
            'position': 'absolute',
            'top': '120px',
            'left': '170px'
          }
        }
      },
      rtStyle: function () {
        if(this.screenWidth < 1400){
          return {
            'width': '25%',
            'right': '30px',
            'paddingTop': '50px',
          }
        }
        else if(this.screenWidth >= 1400 && this.screenWidth < 1650){
          return {
            'width': '25%',
            'right': '45px',
            'paddingTop': '80px',
          }
        }
        else{
          return {
            'width': '25%',
            'right': '70px',
            'paddingTop': '150px',
          }
        }
      },
      loginStyle:function () {
        if(this.screenWidth < 1400){
          return {
            'width': '100%',
            'marginBottom': '25px',
          }
        }
        else{
          return {
            'width': '100%',
            'marginBottom': '40px',
          }
        }
      }
    },
    mounted(){
      const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          window.screenHeight = document.body.clientHeight
          that.screenWidth = window.screenWidth
          that.screenHeight = window.screenHeight
        })()
      }

    },
    watch: {
      screenWidth (val) {
        if (!this.timer) {
          this.screenWidth = val
          this.timer = true
          let that = this
          setTimeout(function () {
            that.init()
            that.timer = false
          }, 400)
        }
      },
      screenHeight (val) {
        if (!this.timer) {
          this.screenHeight = val
          this.timer = true
          let that = this
          setTimeout(function () {
            that.init()
            that.timer = false
          }, 400)
        }
      }
    },
		methods: {
			login() {
				let self = this;
				if(!self.loginName) {
					Message.error({
						message: '请填写用户名'
					})
					return
				}
				if(!self.loginPassword) {
					Message.error({
						message: '请填写密码'
					})
					return
				}
				var p = {
          username: self.loginName,
          password: md5(self.loginPassword)
				}
				self.$api.post('login', p, r => {
          let user = {
						"token": r.data.sessionId,
						"username": r.data.username,
					}
					self.$api.sSetObject('_user', user);
          self.$router.push("/pageIndex");
				}, e => {
          // console.log(e);
          Message.error({
            message: e.msg
          })
				})
			},
			submit(e) {
        var self = this
				// key.Code === 13表示回车键
				if(e.keyCode === 13) {
					//逻辑处理
					if(this.$route.path == '/' ){
						self.login();
						return false;
					}
				}
			}
		},
	}
</script>

<style scoped>
	.login-bg {
		width: 100%;
		height: 100%;
    /*min-width: 1366px;*/
    /*min-height: 768px;*/
		background: url(../../common/img/icon_loginbg.png);
		background-attachment: fixed;
		background-repeat: no-repeat;
		/*占满屏幕,auto是随尺寸*/
		background-size: 100% 100%;
	}
	/*400*300*/

	/*.login-box {*/
		/*width: 360px;*/
		/*height: 360px;*/
		/*padding: 20px;*/
		/*position: fixed;*/
		/*border-radius: 5px;*/
		/*background-color: rgba(255, 255, 255, 0.3);*/
		/*margin: -200px 0 0 -200px;*/
		/*left: 50%;*/
		/*top: 50%;*/
	/*}*/
  .login-lf{
    width: 100%;
    height: 100%;
    background: url(../../common/img/icon_loginlf.png) no-repeat 0 0;
    background-size: 70% 100%;
  }
  .login-rt{
    position: absolute;
    top: 0;
  }
	.login-logo {
		width: 100%;
	}
	/*输入框*/

	.input-box {
		width: 100%;
		height: 50px;
		line-height: 50px;
		/*margin: 0 auto;*/
    margin-bottom: 20px;
    border-bottom: 1px solid #c1c1c1;
		overflow: hidden;
		position: relative;
	}

	.input-box>input {
		width: 100%;
		height: 100%;
		background: none;
		color: #666;
		font-size: 14px;
		line-height: inherit;
		padding-left: 40px;
		display: inline-block;
		/*去除谷歌输入框的黄色背景*/
		-webkit-box-shadow: 0 0 0px 1000px #f1f1f1 inset;
		overflow: hidden;
	}

	.icon-username {
		position: absolute;
		width: 40px;
		height: 50px;
		background: url(../../common/img/icon_head.png) no-repeat center;
		display: inline-block;
	}

	.icon-password {
		position: absolute;
		width: 40px;
		height: 50px;
		background: url(../../common/img/icon_password.png) no-repeat center;
		display: inline-block;
	}

	.loginbutonDiv {
    width: 100%;
    margin-top: 50px;
	}

	.buttonSize {
		width: 100%;
		height: 40px;
		border-radius: 4px;
	}
	/*实心*/

	.button-solid {
		background: #f4aa14;
		color: white;
		border-color: #f4aa14;
	}

	/*.button-solid.is-active,*/
	/*.button-solid:active {*/
		/*background: #f4aa14;*/
		/*border-color: #f4aa14;*/
		/*color: white;*/
	/*}*/

	/*.button-solid:focus,*/
	/*.button-solid:hover {*/
		/*background: #f4aa14;*/
		/*border-color: #f4aa14;*/
		/*color: white;*/
	/*}*/
</style>
