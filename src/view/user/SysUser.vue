<!--用户中心-用户管理-->
<template>
	<el-container style="width: 100%;height:100%;background: #fff;">
		<el-header>
			<!-- <el-input placeholder="请输入关键字搜索" v-model="input5" class="input-with-select">
				<el-button @click='query' slot="append" icon="el-icon-search"></el-button>
			</el-input> -->
			<!-- <div class="editUser" @click="editUser">
				<img class="imga" src="../../common/img/icon_creat.png">
				<span>添加用户</span>
			</div> -->
			<el-col :span="6" style="text-align: right;float: right;margin-top: 15px;" v-show='editUserType'>
				<span class="create-app" @click="editUser">
					<img src="../../common/img/icon_creat.png" alt=""> 添加用户</span>
			</el-col>
		</el-header>
		<el-main>
			<el-table :data="listData" stripe style="width: 100%">
				<el-table-column prop="id" label="ID" width='150' align="center">
				</el-table-column>
				<el-table-column prop="username" label="用户名" width='150' align="center">
				</el-table-column>
				<el-table-column prop="nickName" label="昵称" align="center">
				</el-table-column>
				<el-table-column prop="gender" label="性别" width='150' align="center">
				</el-table-column>
				<el-table-column prop="email" label="邮箱地址" align="center">
				</el-table-column>
				<el-table-column prop="createTime" :formatter="dateFormat" label="加入时间" align="center">
				</el-table-column>
				<el-table-column label="状态" width='150' align="center">
					<template slot-scope="scope">
						<span v-show="switchType !=true" :class="switchType?'disable':'normal'" v-text="scope.row.state == 0?'停用':'正常'"></span>
						<el-switch v-show='switchType' v-model="scope.row.state" @change='switchB(scope.row)' active-color="#13ce66" inactive-color="#ff4949"
						    :active-value="1" :inactive-value="0">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="编辑用户" placement="top">
							<img class="img" effect="dark" v-show="editType" @click="edit(scope.row)" src="../../common/img/icon_edit.png" />
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="密码重置" placement="top">
							<img class="img imgL"  v-show="syspwd" @click="modify(scope.row)" src="../../common/img/icon_modify.png" />
						</el-tooltip>
						<!-- <img class="img imgL" @click="rmove(scope.row)" src="../../common/img/icon_delete.png" /> -->
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer>
			<el-pagination style="text-align: center;padding: 6px 0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			    :current-page.sync="currentPage1" :page-sizes="[20,50,100]" layout="total, sizes, prev, pager, next, jumper" :total="num">
			</el-pagination>
		</el-footer>


		<!--新增/编辑-->
		<el-dialog :title='type+myUser' :visible.sync="userType" width="30%" style='margin-top: -6vh;' :before-close="handleClose"
		    :closeOnClickModal="false">
			<span>
				<div>
					<span class="str">用户名:</span>
					<el-input :disabled="disabled" placeholder="请输入登录账号" v-model="username">
					</el-input>
				</div>
				<div class="strT">
					<span class="str">昵称:</span>
					<el-input placeholder="请输入员工姓名" v-model="nickName">
					</el-input>
				</div>
				<div class="strT">
					<span class="str">性别:</span>
					<el-radio-group v-model="gender">
						<el-radio :label="1">男</el-radio>
						<el-radio :label="2">女</el-radio>
						<el-radio :label="3">保密</el-radio>
					</el-radio-group>
				</div>
				<div class="strT">
					<span class="str">邮箱:</span>
					<el-input placeholder="请输入邮箱" v-model="email">
					</el-input>
				</div>
				<div class="strT">
					<span class="str" style="float: left;">角色:</span>
					<div class="checkbox">
						<el-checkbox-group v-model="checkList">
							<el-checkbox :disabled='accountType==1?o.roleName == "系统管理员":o.roleName == "项目管理员"||o.roleName == "系统管理员"'  v-for='o in checkbox' :key="o.roleId" :label="o.roleId">{{o.roleName}}</el-checkbox>
						</el-checkbox-group>
					</div>

				</div>
				<!-- <div class="strT">
								<span class="str">用户组</span>
								<el-input placeholder="用户组"  v-model="a" >
								</el-input>
							</div> -->
				<div style="margin-top: 20px;">
					<span class="str" style="float: left;">备注:</span>
					<el-input resize='none' class='textarea' type="textarea" :rows="4" placeholder="请输入内容" v-model="note">
					</el-input>

				</div>
			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="add" type="primary" class="submitStyle">确认</el-button>
				<el-button @click="userType = false" class="cancelStyle">取消</el-button>
			</span>
		</el-dialog>
		<!--s删除-->
		<el-dialog title='是否删除' :visible.sync="BatchReceiptBox" width="260px" top="40vh" :closeOnClickModal="false">
			<span slot="footer" class="dialog-footer">
				<el-button @click="signInBatchReceipt" type="primary" class="submitStyle">是</el-button>
				<el-button @click="BatchReceiptBox = false" class="cancelStyle">否</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script>
	import api from '../../common/js/index'

	export default {
		name: "ResourceAudit",
		components: {},
		data() {
			return {
				input5: '',
				listData: [], //加载列表集合
				pageNum: 1,
				pageRows: 20,
				pageTotal: 0,
				num: 1,
				currentPage1: 1,
				id: '',
				myUser: '用户',
				ids: '', //删除用户id
				userId: '', //编辑用户id
				userType: false, //新增编辑弹窗
				gender: '', //性别
				checkList: [], //角色集合
				note: '', //备注
				BatchReceiptBox: false, //删除
				username: '', //用户名
				nickName: '', //昵称
				email: '', //邮箱
				checkbox: '', //角色集合
				disabled: '', //用户名禁用
				type: '', //新增----编辑  状态
				state: '', //状态
				menu: [], //按钮权限集合
				editUserType: false, //按钮状态
				editType: false, //按钮状态
				switchType: false, //按钮状态
				syspwd: false, //按钮状态
				accountType:''
			}
		},
		computed: {},
		methods: {
			loadData() {
				var self = this;
				var p = {
					"pageNo": this.pageNum,
					"pageSize": this.pageRows
				}
				self.$api.post('/user/list', p, r => {
					this.listData = r.data.rows
					this.num = r.data.total
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
				for (var i = 0; i < self.menu.length; i++) {
					if (self.menu[i].authCode == 'user_add') {
						self.editUserType = true
					}
					if (self.menu[i].authCode == 'user_edit') {
						self.editType = true
					}
					if (self.menu[i].authCode == 'user_status') {
						self.switchType = true
					}
					if (self.menu[i].authCode == 'user_sys_pwd') {
						self.syspwd = true
					}
				}

			},
			//开关
			switchB(val) {
				this.$api.post('/user/modifyState?id=' + val.id + '&state=' + val.state, {}, r => {
					this.$message({
						type: 'success',
						message: '修改成功'
					});
					this.loadData()
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
			},
			//加载角色
			user() {
				this.$api.post('/user/queryRoleListByLoginId', {}, r => {
					this.checkbox = r.data.roleList
					this.accountType = r.data.accountType
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
			},
			//删除
			rmove(val) {
				this.BatchReceiptBox = true
				this.ids = val.id
				this.state = val.state
			},
			//删除确认
			signInBatchReceipt() {
				this.$api.post('/user/deleteUser?id=' + this.ids, {}, r => {
					this.$message({
						type: 'success',
						message: '删除成功'
					});
					this.BatchReceiptBox = false
					this.loadData()
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
			},
			//新增编辑确认
			add() {
				var url = ''
				if (this.type == '添加') {
					url = '/user/addUser'
					if (this.username == '') {
						this.$message({
							type: 'warning',
							message: '用户名不能为空'
						});
						return
					}
					if (this.nickName == '') {
						this.$message({
							type: 'warning',
							message: '昵称不能为空'
						});
						return
					}
					if (this.email == '') {
						this.$message({
							type: 'warning',
							message: '邮箱不能为空'
						});
						return
					}
					if (this.checkList == '') {
						this.$message({
							type: 'warning',
							message: '请选择角色'
						});
						return
					}
					
				} else if (this.type == '编辑') {
					url = '/user/updateUser'
					if (this.checkList == '') {
						this.$message({
							type: 'warning',
							message: '请选择角色'
						});
						return
					}
				}
				if (this.gender == 1) {
					this.gender = '男'
				} else if (this.gender == 2) {
					this.gender = '女'
				} else {
					this.gender = '保密'
				}
				var ePattern = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
				if (!ePattern.test(this.email)) {
					this.$message({
						type: 'warning',
						message: '邮箱格式不正确'
					});
					return false
				}
				this.$api.post(url, {
					"username": this.username,
					"id": this.userId.toString(),
					"gender": this.gender.toString(),
					"roleIds": this.checkList.join(','),
					"projectIds": "",
					"email": this.email,
					'note': this.note,
					'nickName': this.nickName
				}, r => {
					this.$message({
						type: 'success',
						message: this.type + '成功'
					});
					this.userType = false
					this.loadData()
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
			},
			//查询 
			query() {
				// alert(1)
			},
			//添加用户
			editUser() {
				this.gender = 3
				this.type = '添加'
				this.disabled = false
				this.userType = true
				this.username = ''
				this.email = ''
				this.note = ''
				this.checkList = ''
				this.nickName = ''
				this.checkList = []
				this.user()
			},
			//编辑用户
			edit(val) {
				var self = this
				this.type = '编辑'
				this.disabled = true
				this.userType = true
				this.checkList = []
				this.userId = val.id
				this.$api.post('/user/getUser?id=' + val.id, {}, r => {
					this.username = r.data.username
					if (r.data.gender == '男') {
						this.gender = 1
					} else if (r.data.gender == '女') {
						this.gender = 2
					} else {
						this.gender = 3
					}
					this.email = r.data.email
					this.note = r.data.note
					var list = r.data.roleIds.split(',')
					for (var i = 0; i < list.length; i++) {
						this.checkList.push(Number(list[i]))
					}
					this.nickName = r.data.nickName
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
				self.user()
			},
			//修改密码
			modify(val) {
				var self = this
				this.$confirm('确认重置密码, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					self.$api.post('/user/resetPassword?userId=' + val.id, {}, r => {
						this.$message({
							type: 'success',
							message: '重置成功'
						});
					}, e => {
						this.$message({
							message: e.msg,
							type: 'error'
						});
					})

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//弹窗x关闭 
			handleClose(done) {
				this.dialogVisible = false;
				this.userType = false;
			},
			search() {

			},
			handleCurrentChange(val) {
				this.pageNum = val;
				this.loadData();
			},
			handleSizeChange(val) {
				this.pageRows = val;
				this.loadData();
			},
			// 格式化时间
			dateFormat(row, column) {
				if (row[column.property]) {
					var date = new Date(row[column.property]);
					var year = date.getFullYear()
					var month = date.getMonth() + 1
					var day = date.getDate()
					// return [year, month, day].map(this.formatNumber).join('-')
					var hour = date.getHours()
					var minute = date.getMinutes()
					var second = date.getSeconds()
					return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(
						':')
				}
			},
			formatNumber(n) {
				n = n.toString()
				return n[1] ? n : '0' + n
			}
		},
		created() {
			this.menu = api.sGetObject("_user").permissionList
			this.loadData();
		},
		mounted() {}
	}
</script>

<style scoped>
	.normal{
		color: #13CE66;
	}
	.disable{
		color: #FF4949;
	}
	.el-input-group {
		width: 240px;
		margin-top: 20px;
	}

	.img {
		width: 16px;
		height: 16px;
		cursor: pointer
	}

	.imgL {
		margin-left: 10px;
	}

	.el-dialog__header {
		background: #67A0FF;
		text-indent: 20px;
		border-radius: 5px 5px 0 0;
	}

	.el-dialog {
		border-radius: 5px;
	}

	.el-dialog .el-input {
		width: 240px;
		margin-left: 10px;
	}

	.el-radio-group {
		width: 240px;
		margin-left: 10px;
		line-height: 23px;
		padding-top: 5px;
	}

	.str {
		display: inline-block;
		width: 80px;
	}

	.strT {
		margin-top: 20px;
	}

	.textarea {
		width: 70%;
		margin-left: 14px;
	}

	.zhisun {
		display: inline-block;
		width: 100%;
		text-align: center;
		font-size: 16px;
		line-height: 60px;
	}

	.checkbox {
		width: 270px;
		display: inline-block;
		margin-left: 15px;
	}

	.el-checkbox+.el-checkbox {
		margin-left: 5px;
	}

	.create-app {
		display: inline-block;
		font-size: 16px;
		color: #67A0FF;
		line-height: 36px;
		cursor: pointer;
		border: 1px solid #67A0FF;
		padding: 0 15px;
		border-radius: 5px;
	}

	.create-app img {
		vertical-align: -2px;
	}
</style>
