<!--用户中心-角色管理-->
<template>
	<el-container style="width: 100%;height:100%;background: #fff;">
		<el-header>
			<!-- <el-input  placeholder="请输入关键字搜索" v-model="input5" class="input-with-select">
				<el-button @click='query' slot="append" icon="el-icon-search"></el-button>
			</el-input> -->
			<!-- <el-col :span="6" style="text-align: right;float: right;margin-top: 15px;" v-show='editUserType'>
				<span class="create-app" @click="editUser">
					<img src="../../common/img/icon_creat.png" alt=""> 添加角色</span>
			</el-col> -->
		</el-header>
		<el-main>
			<el-table :data="listData" stripe style="width: 100%">
				<el-table-column prop="id" label="ID" align="center">
				</el-table-column>
				<el-table-column prop="roleName" label="角色名称" align="center">
				</el-table-column>
				<!-- <el-table-column prop="gender" label="用户组列表">
				</el-table-column>
				<el-table-column prop="email" label="用户列表">
				</el-table-column> -->
				<el-table-column prop="desc" label="描述" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="修改角色" placement="top">
							<img class="img" v-show="editType" @click="edit(scope.row)" src="../../common/img/icon_edit.png" />
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="用户列表" placement="top">
							<img class="img imgL" v-show="editType" @click="queryUsers(scope.row)" src="../../common/img/icon_add.png" />
						</el-tooltip>
						<!-- <img class="img imgL" v-show="editType" @click="queryAuth(scope.row)" src="../../common/img/icon_lock.png" /> -->
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer>
			<el-pagination style="text-align: center;padding: 6px 0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			    :current-page.sync="currentPage1" :page-sizes="[20,50,100]" layout="total, sizes, prev, pager, next, jumper" :total="num">
			</el-pagination>
		</el-footer>

		<!--修改角色-->
		<el-dialog title="修改角色" :visible.sync="dialogVisible" width="40%" :before-close="handleClose" :closeOnClickModal="false">
			<span>
				<div>
					<span class="str">角色名称:</span>
					<el-input disabled placeholder="请输入角色名称" v-model="roleName" size="mini">
					</el-input>
				</div>
				<div style="position: relative;height: 300px;margin-top: 10px;">
					<span class="str">系统功能:</span>
					<div class="tree">
						<el-tree :props="props" :data="list" default-expand-all node-key="name" ref="tree" show-checkbox @check-change="handleCheckChange"
						    :default-checked-keys="keys">
						</el-tree>
					</div>
				</div>
			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false" class="cancelStyle">取消</el-button>
				<el-button @click="password" type="primary" class="submitStyle">确认</el-button>
			</span>
		</el-dialog>
		<!--查看角色绑定的所有用户列表
-->
		<el-dialog id='dialog' title="用户列表" :visible.sync="userList" style='margin-top: -4vh;' width="65%" :before-close="handleClose" :closeOnClickModal="false">
			<span>
				<el-table :data="tableData" stripe style="width: 100%;height:400px;overflow: auto;">
					<el-table-column prop="id" label="ID" width='50'>
					</el-table-column>
					<el-table-column prop="username" label="用户名" width='100'>
					</el-table-column>
					<el-table-column prop="nickName" label="昵" width='100'>
					</el-table-column>
					<el-table-column prop="gender" label="性别" width='100'>
					</el-table-column>
					<el-table-column prop="email" label="邮箱地址">
					</el-table-column>
					<el-table-column prop="createTime" :formatter="dateFormat" label="加入时间">
					</el-table-column>
					<el-table-column label="状态" width='60'>
						<template slot-scope="scope">
						</template>
					</el-table-column>
				</el-table>
			</span>
			<span>
				<el-pagination style="text-align: center;padding: 6px 0px;" @size-change="handleSize" @current-change="handleCurrent"
				    :current-page.sync="currentPage" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" :total="userName">
				</el-pagination>
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
				listData: [],
				tableData: [],
				pageNum: 1,
				pageRows: 20,
				pageN: 1,
				pageR: 10,
				pageTotal: 0,
				num: 1,
				userName:1,
				currentPage1: 1,
				currentPage: 1,
				dialogVisible: false, //修改密码弹窗
				id: '',
				gender: 3, //性别
				textarea: '', //备注
				roleName: '', //角色名称
				props: {
					children: 'children',
					label: 'desc'
				}, //权限树
				list: [], //权限树
				keys: [],
				menu: [],
				editUserType: true,
				editType: false,
				userList: false,
				userId:'',
			}
		},
		computed: {},
		methods: {
			queryAuthPost(){
				this.$api.post('/user/queryUsersByRoleId', {
					"pageNo": this.pageN,
					"pageSize": this.pageR,
					"id": this.userId
				}, r => {
					this.tableData = r.data.rows
					this.userName = r.data.total
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
			},
// 			queryAuth(val){
// 				this.$api.post('/user/queryAuthByRoleId?roleId='+val.id, {}, r => {
// 					
// 				}, e => {
// 					this.$message({
// 						message: e.msg,
// 						type: 'error'
// 					});
// 				})
// 			},
			queryUsers(val) {
				this.userList = true
				this.userId = val.id
				this.queryAuthPost(this.userId)
			},
			handleCheckChange(val) {
				// console.log(this.$refs.tree.getCheckedNodes())
			},
			//新增编辑确认
			add() {
				console.log(this.gender)
			},
			//查询 
			query() {

			},
			//添加用户
			editUser() {
				// this.dialogVisible = true
			},
			//修改角色
			edit(val) {
				this.id = val.id
				this.dialogVisible = true
				this.roleName = val.roleName
				this.$api.post('roles/getRoleTreeByRoleId?roleId=' + val.id, {}, r => {
					this.list = r.data.menuTrees
					this.keys = r.data.keys
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
			},
			//确认修改密码
			password() {
				var arr = '';
				var list = this.$refs.tree.getCheckedNodes(true,false)
				for (var i = 0; i < list.length; i++) {
					arr += list[i].id + ','
				}
				this.$api.post('/roles/updateRoleByRoleId', {
					"roleId": this.id,
					"auths": arr
				}, r => {
					this.$message({
						message: '修改成功',
						type: 'success'
					});
					this.dialogVisible = false
					this.loadData();
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})

			},
			//弹窗x关闭 
			handleClose(done) {
				this.dialogVisible = false;
				this.userType = false;
				this.userList = false;
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
			handleCurrent(val) {
				this.pageN = val;
				this.queryAuthPost(this.userId)
			},
			handleSize(val) {
				this.pageR = val;
				this.queryAuthPost(this.userId)
			},
			loadData() {
				var self = this;
				var p = {
					"pageNo": this.pageNum,
					"pageSize": this.pageRows
				}
				self.$api.post('roles/getRoleListByPage', p, r => {
					this.listData = r.data.rows
					this.num = r.data.total
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
				for (var i = 0; i < self.menu.length; i++) {
					if (self.menu[i].authCode == 'role_edit') {
						self.editType = true
					}
					// 					if(self.menu[i].authCode == 'role_edit'){
					// 						self.editUserType = true
					// 					}
				}
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
		width: 70%;
		margin-left: 10px;
	}

	.el-radio-group {
		width: 70%;
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

	.tree {
		width: 360px;
		height: 300px;
		display: inline-block;
		position: absolute;
		left: 85px;
		top: 0;
		overflow: auto;
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
