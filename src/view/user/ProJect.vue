<!--用户中心-项目组管理-->
<template>
	<el-container style="width: 100%;height:100%;background: #fff;">
		<el-header>
			<!-- 			<el-input  placeholder="请输入关键字搜索" v-model="input5" class="input-with-select">
				<el-button @click='query' slot="append" icon="el-icon-search"></el-button>
			</el-input> -->
			<el-col :span="6" style="text-align: right;float: right;margin-top: 15px;">
				<span class="create-app" @click="editUser" v-show="editUserType">
					<img src="../../common/img/icon_creat.png" alt=""> 添加项目组</span>
			</el-col>
		</el-header>
		<el-main>
			<el-table :data="listData" stripe style="width: 100%">
				<el-table-column prop="groupId" label="ID" align="center">
				</el-table-column>
				<el-table-column prop="groupNames" label="项目组名称" align="center">
				</el-table-column>
				<el-table-column prop="projectCode" label="项目code" align="center">
				</el-table-column>
				<el-table-column prop="userNames" label="成员名称" align="center">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.userNames" placement="top" effect="dark" align="center">
              <div style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.userNames}}</div>
            </el-tooltip>
          </template>
				</el-table-column>
				<el-table-column prop="createTime" :formatter="dateFormat" label="创建时间" align="center">
				</el-table-column>
				<el-table-column label="状态" align="center">
					<template slot-scope="scope">
						<!-- {{scope.row.state}} -->
						<el-switch v-model="scope.row.state" v-show='status' @change='switchB(scope.row)' active-color="#13ce66" inactive-color="#ff4949"
						    :active-value="1" :inactive-value="0">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-tooltip class="item" effect="dark" content="编辑项目组" placement="top">
							<img class="img"  @click="edit(scope.row)" v-show="editType" src="../../common/img/icon_edit.png" />
						</el-tooltip>
						<el-tooltip class="item" effect="dark" content="添加项目组成员" placement="top">
							<img class="img imgL"  @click="member(scope.row)" v-show="mgrAdd" src="../../common/img/icon_adds.png" />
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<el-footer>
			<el-pagination style="text-align: center;padding: 6px 0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
			    :current-page.sync="currentPage1" :page-sizes="[20,50,100]" layout="total, sizes, prev, pager, next, jumper" :total="num">
			</el-pagination>
		</el-footer>

		<!--添加用户组-->
		<el-dialog :title='type+group' :visible.sync="dialogVisible" width="30%" :before-close="handleClose" :closeOnClickModal="false">
			<span>
				<div>
					<span class="str">项目名称(中文):</span>
					<el-input placeholder="请输入项目名称" v-model="projectName">
					</el-input>
				</div>
				<div class="strT">
					<span class="str">Code名称:</span>
					<el-input :disabled="disabled" placeholder="请输入Code" v-model="projectCode">
					</el-input>
				</div>
				<div class="strT">
					<span class="str">负责人名称:</span>
					<el-input placeholder="请输入负责人名称" v-model="ownerName">
					</el-input>
				</div>
				<div class="strT">
					<span class="str">负责人邮箱:</span>
					<el-input placeholder="请输入负责人邮箱" v-model="ownerEmail">
					</el-input>
				</div>

			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="usergroup" type="primary" class="submitStyle">确认</el-button>
				<el-button @click="dialogVisible = false" class="cancelStyle">取消</el-button>
			</span>
		</el-dialog>
		<!--添加用户-->
		<el-dialog title="添加项目组成员" :visible.sync="dialog" width="42%" style='margin-top: -11vh;' :before-close="handleClose" :closeOnClickModal="false">
			<span>
				<div>
					<span class="str">项目组名称:</span>
					<el-input disabled placeholder="请输入项目名称" v-model="projectN">
					</el-input>
				</div>
				<div class="strT">
					<span class="str">角色:</span>
					<el-select v-model="roleName" placeholder="请选择" @change='optionChange'>
						<el-option v-for="item in options" :key="item.roleId" :label="item.roleName" :value="item.roleId">
						</el-option>
					</el-select>
				</div>
				<div class="strT">
					<span class="str">添加用户组到:</span>
					<el-transfer :titles="['用户', '用户组']" :props="{key: 'id',label:'nickName'}" v-model="users" :data="data"></el-transfer>
				</div>
			</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addUser" type="primary" class="submitStyle">确认</el-button>
				<el-button @click="dialog = false" class="cancelStyle">取消</el-button>
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
				pageNum: 1,
				pageRows: 20,
				pageTotal: 0,
				num: 1,
				currentPage1: 1,
				dialogVisible: false, //添加，修改用户组
				dialog: false, //添加，修改用户
				id: '',
				projectName: '', //项目名称
				projectN: '',
				projectCode: '', //Code
				ownerName: '', //负责人
				ownerEmail: '', //邮箱
				disabled: '',
				group: '项目组',
				type: '', //新增----编辑  状态
				options: [], //角色下拉
				roleName: '',
				data: [],
				users: [],
				roleId: '', //添加用户id
				menu: [],
				editUserType: false,
				status: false,
				editType: false,
				mgrAdd: false
			}
		},
		computed: {},
		methods: {
			//角色选中事件
			optionChange(val) {
				this.roleId = val
				this.users = []
				this.$api.post('/usergroup/queryUsersByProjecyIdAndRoleId?roleId=' + val + '&projectId=' + this.id, {}, r => {
					// this.users = r.data
					for (var i = 0; i < r.data.length; i++) {
						this.users.push(r.data[i].id)
					}
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
				this.$api.post('/user/queryUsersByRoleId', {
					"pageNo":1,
					"pageSize": 20,
					"id": val
				}, r => {
					this.data = r.data.rows
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
			},
			//添加用户确认
			addUser() {
				if (this.roleId == '') {
					this.$message({
						type: 'warning',
						message: '请先选择角色'
					});
					return
				}
				this.$api.post('/usergroup/addUserGroupMember', {
					"projectId": this.id,
					"roleId": this.roleId,
					"users": this.users.join(',')
				}, r => {
					this.$message({
						type: 'success',
						message: '添加成功'
					});
					this.dialog = false
					this.loadData()
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
			},
			//状态切换
			switchB(val) {
				this.$api.post('/usergroup/modifyMemberState?id=' + val.groupId + '&state=' + val.state, {}, r => {
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
			//添加用户
			member(val) {
				this.roleId = ''
				this.data = []
				this.users = []
				this.roleName = ''
				this.dialog = true
				this.projectN = val.groupNames
				this.id = val.groupId
				this.$api.post('usergroup/querySysMgrRoleListByLoginId', {}, r => {
					this.options = r.data
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
			},
			//查询
			query() {
				alert(1)
			},
			//添加用户组
			editUser() {
				this.type = '添加'
				this.projectName = ''
				this.projectCode = ''
				this.ownerName = ''
				this.ownerEmail = ''
				this.dialogVisible = true
				this.disabled = false
			},
			//编辑用户
			edit(val) {
				this.type = '编辑'
				this.dialogVisible = true
				this.disabled = true
				this.id = val.groupId
				this.$api.post('/usergroup/userGroupById?groupId=' + val.groupId, {}, r => {
					this.projectName = r.data.projectName
					this.projectCode = r.data.projectCode
					this.ownerName = r.data.ownerName
					this.ownerEmail = r.data.ownerEmail
				}, e => {

				})
			},
			//添加项目组确认
			usergroup() {
				if (this.projectName == '') {
					this.$message({
						type: 'warning',
						message: '项目名称不能为空'
					});
					return
				}
				if (this.projectCode == '') {
					this.$message({
						type: 'warning',
						message: 'Code不能为空'
					});
					return
				}
				if (this.ownerName == '') {
					this.$message({
						type: 'warning',
						message: '负责人名称不能为空'
					});
					return
				}
				if (this.ownerEmail == '') {
					this.$message({
						type: 'warning',
						message: '邮箱不能为空'
					});
					return
				}
				if (this.type == '添加') {
					this.$api.post('/usergroup/addUserGroup', {
						"projectName": this.projectName,
						"projectCode": this.projectCode,
						"ownerName": this.ownerName,
						"ownerEmail": this.ownerEmail,
					}, r => {
						this.$message({
							type: 'success',
							message: '添加成功'
						});
						this.dialogVisible = false
						this.loadData()
					}, e => {
						this.$message({
							message: e.msg,
							type: 'error'
						});
					})
				} else if (this.type == '编辑') {
					this.$api.post('/usergroup/updateUserGroup', {
						"id": this.id,
						"projectName": this.projectName,
						"ownerName": this.ownerName,
						"ownerEmail": this.ownerEmail,
					}, r => {
						this.$message({
							type: 'success',
							message: '编辑成功'
						});
						this.dialogVisible = false
						this.loadData()
					}, e => {

					})
				}

			},
			//弹窗x关闭
			handleClose(done) {
				this.dialogVisible = false;
				this.dialog = false;
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
			loadData() {
				var self = this;
				var p = {
					"pageNo": this.pageNum,
					"pageSize": this.pageRows
				}
				self.$api.post('/usergroup/getUserGroupListByPage', p, r => {
          if (r.data) {
            this.listData = r.data.rows
            this.num = r.data.total;
          }
				}, e => {
					this.$message({
						message: e.msg,
						type: 'error'
					});
				})
				for (var i = 0; i < self.menu.length; i++) {
					if (self.menu[i].authCode == 'proj_add') {
						self.editUserType = true
					}
					if (self.menu[i].authCode == 'proj_status') {
						self.status = true
					}
					if (self.menu[i].authCode == 'proj_edit') {
						self.editType = true
					}
					if (self.menu[i].authCode == 'proj_mgr_add') {
						self.mgrAdd = true
					}
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

	.el-dialog .el-input,
	.el-select {
		width: 66%;
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
		width: 100px;
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
	.el-transfer__button {
		width: 40px;
	}
</style>
