<template>
	<div class="header-style">
		<div class="header-logo">诺亚方舟</div>
		<!-- <div class="header-user" @click="clearPop">{{user.username}}</div>		 -->
		<!-- <div class="header-user"> -->
			<el-dropdown @command="handleCommand">
				<span class="el-dropdown-link">
					{{user.username}}
				</span>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command='modify'>修改密码</el-dropdown-item>
					<el-dropdown-item command="clearPop">退出</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		<!-- </div> -->
		<div class="header-menu">
			<Menu></Menu>
		</div>
		<!--修改密码-->
		<el-dialog style='text-align: center;' title="修改密码" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
			<span>
				<el-input placeholder="请输入旧密码" type='password' v-model="oldPassword" clearable>
				</el-input>
				<el-input placeholder="请输入新密码" type='password' v-model="newPassword" clearable>
				</el-input>
				<el-input placeholder="请确认新密码" type='password' v-model="newPasswords" clearable>
				</el-input>
			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="password" type="primary" class="submitStyle">确认</el-button>
				<el-button @click="dialogVisible = false" class="cancelStyle">取消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import Menu from '../menu/Menu.vue'
	import api from '../../common/js/index'
	import md5 from 'js-md5';
	export default {
		data() {
			return {
				user: {},
				dialogVisible: false,
				oldPassword: '',
				newPassword: '',
				newPasswords: ''
			}
		},
		components: {
			Menu
		},
		methods: {
			handleCommand(type) {
				if (type == 'clearPop') {
					this.$confirm('', '确定退出登录？', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						center: true
					}).then(() => {
						// this.userClear()
						this.$api.post('/toLogin', {}, r => {
							sessionStorage.clear();
							this.$router.push('/')
						}, e => {
							console.log(e);
						})
					}).catch(() => {

					});
				} else if (type == 'modify') {
					this.dialogVisible = true
					this.oldPassword = ''
					this.newPassword = ''
					this.newPasswords = ''
				}
			},
			//初始化数据
			loadData() {
				var self = this;
				self.$api.post('crm/customer/getByPrimaryKey', {
					id: this.user.userId
				}, r => {
					this.user.custType = r.repData.custType;
					self.$api.sSetObject('_user', this.user);
					if (r.repData.crmAuthList != null) {
						if (r.repData.custType == 3) {
							this.userId = r.repData.custType
							this.options = r.repData.crmAuthList
							this.value = r.repData.name
						}
					}
				}, e => {
					console.log(e);
				})
			},
			//修改密码x关闭 
			handleClose(done) {
				this.dialogVisible = false
			},
			//修改密码确认
			password() {
				var self = this
				if (this.oldPassword == '') {
					this.$message({
						message: '旧密码不能为空',
						type: 'warning'
					});
				} else if (this.newPassword == '' || this.newPasswords == '') {
					this.$message({
						message: '新密码不能为空',
						type: 'warning'
					});
				} else if (this.oldPassword == this.newPassword) {
					this.$message({
						message: '新密码与旧密码不能一致',
						type: 'warning'
					});
				} else if (this.newPassword != this.newPasswords) {
					this.$message({
						message: '两次新密码输入不同',
						type: 'warning'
					});
				} else {
					this.$api.post('/user/modifyAccountPwd', {
						nickName: md5(this.oldPassword),
						passwd: md5(this.newPassword)
					}, r => {
						this.$message({
							message: '修改成功',
							type: 'success'
						});
						this.dialogVisible = false
						this.$api.post('/toLogin', {}, r => {
							sessionStorage.clear();
							this.$router.push('/')
						}, e => {
							console.log(e);
						})
					}, e => {
						this.$message({
							message: e.msg,
							type: 'error'
						});
					})
				}
			},
		},
		created: function () {
			this.user = api.sGetObject("_user");
		}
	}
</script>
<style scoped>
	.header-style {
		width: 100%;
		height: 60px;
		background: #393B6A;
		position: relative;
	}

	.header-logo {
		width: auto;
		height: 60px;
		line-height: 60px;
		font-size: 24px;
		font-weight: bold;
		color: #fff;
		float: left;
		margin-left: 30px;
		letter-spacing: 3px;
	}

	.header-user {
		
	}

	.header-menu {
		float: right;
		margin-right: 60px;
		background: url("../../common/img/icon_head.png") no-repeat right center;
		background-size: 1px 30%;
		padding-right: 1px;
	}
	/*.imgStyle {*/
	/*width: 130px;*/
	/*height: 30px;*/
	/*padding-top: 15px;*/
	/*padding-left: 38px;*/
	/*}*/
	/*.imgStyle img {*/
	/*width: 100%;*/
	/*height: 100%;*/
	/*}*/
	/*.login-out {*/
	/*width: 100px;*/
	/*height: 60px;*/
	/*position: absolute;*/
	/*top: 0;*/
	/*right: 10px;*/
	/*!*background: url("../../common/img/icon_out.png") no-repeat center;*!*/
	/*background-size: 24px;*/
	/*cursor: pointer;*/
	/*}*/

	.user {
		position: absolute;
		width: auto;
		line-height: 60px;
		top: 0;
		right: 100px;
		text-align: right;
		color: #fff;
	}

	.el-dropdown {
		color: #fff;
		min-width: 30px;
		height: 60px;
		line-height: 60px;
		color: #fff;
		font-size: 16px;
		float: right;
		background: url("../../common/img/icon_header_user.png") no-repeat 0 center;
		padding-left: 30px;
		margin-right: 30px;
	}

	.el-input {
		width: 80%;
		margin-top: 10px;
	}
</style>
