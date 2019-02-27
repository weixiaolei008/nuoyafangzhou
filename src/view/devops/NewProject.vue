<!--devops-新增项目-->
<template>
	<el-container style="width: 100%;height:100%;">
		<el-header class='publicStyle footer'>
			<span class="describe"> 项目名称：</span>
			<el-select v-model="id" placeholder="请选择项目名称">
				<el-option v-for="item in options" :key="item.id" :label="item.projectName" :value="item.id">
				</el-option>
			</el-select>
		</el-header>
		<div class="main">
			<div class="header">
				选择源代码
			</div>
			<div style="padding: 0 20px;">
				<span class="describe">Git URL</span>
				<el-input placeholder="请输入关URL" v-model="gitUrl"></el-input>
				<br />
				<span class="describe">Git 用户名</span>
				<el-input placeholder="请输入用户名" v-model="username"></el-input>
				<br />
				<span class="describe">Git 密码</span>
				<el-input placeholder="请输入密码" type='password' v-model="pwd"></el-input>
			</div>
		</div>
		<!-- <el-main class='publicStyle'>
			<div class="header">
				选择源代码
			</div>
			<div style="padding: 0 20px;">
				<span class="describe">Git URL</span>
				<el-input placeholder="请输入关键字搜索" v-model="gitUrl"></el-input>
				<br />
				<span class="describe">Git 用户名</span>
				<el-input placeholder="请输入关键字搜索" v-model="username"></el-input>
				<br />
				<span class="describe">Git 密码</span>
				<el-input placeholder="请输入关键字搜索" type='password' v-model="pwd"></el-input>
			</div>
		</el-main> -->
		<el-footer class='publicStyle footer'>
			<span class="describe">开发语言</span>
			<el-radio v-model="developmentLanguage" label="Java">Java</el-radio>
			<el-radio v-model="developmentLanguage" label="NodeJs">NodeJs</el-radio>
		</el-footer>
		<el-footer class='publicStyle footer'>
			<span class="describe">编译工具</span>
			<el-radio v-model="compilationTool" label="Gradle">Gradle</el-radio>
			<!-- <el-radio v-model="compilationTool" label="Maven">Maven</el-radio> -->
		</el-footer>
		<el-footer>
			<el-button :disabled='disabled' @click="usergroup" type="primary" class="submitStyle">确认</el-button>
			<el-button @click="dialogVisible" class="cancelStyle">取消</el-button>
		</el-footer>
	</el-container>
</template>

<script>
	import api from '../../common/js/index'
	let Base64 = require('js-base64').Base64;
	import { Message } from 'element-ui'
	export default {
		name: "ResourceAudit",
		components: {},
		data() {
			return {
				projectName: "",
				id: '',
				developmentLanguage: '',
				compilationTool: 'Gradle',
				input5: '',
				gitUrl: '',
				username: '',
				pwd: '',
				options: [],
				disabled:false
			}
		},
		computed: {},
		methods: {
			loadData() {
				var self = this;
				var p = {}
				self.$api.post('OperationManagement/getProjectListByLogin', p, r => {
					self.options = r.data;
				}, e => {
					Message.error({
						message: e.msg
					})
				})
			},
			usergroup() {
				var self = this
				if (this.id == '') {
					this.$message({
						type: 'warning',
						message: '项目名称不能为空'
					});
					return
				}
				if (this.gitUrl == '') {
					this.$message({
						type: 'warning',
						message: 'URL地址不能为空'
					});
					return
				}
				if (this.username == '') {
					this.$message({
						type: 'warning',
						message: '用户名不能为空'
					});
					return
				}
				if (this.pwd == '') {
					this.$message({
						type: 'warning',
						message: '密码不能为空'
					});
					return
				}
				if (this.developmentLanguage == '') {
					this.$message({
						type: 'warning',
						message: '请选择开发语言'
					});
					return
				}
				if (this.compilationTool == '') {
					this.$message({
						type: 'warning',
						message: '请选择编译工具'
					});
					return
				}
				this.disabled = true
				for (var i = 0; i < this.options.length; i++) {
					if (this.options[i].id == this.id) {
						this.projectName = this.options[i].projectCode
					}
				}
				this.$api.post('/cicd/saveCiCd', {
					"projectId": this.id,
					"gitUrl": this.gitUrl,
					"username": this.username,
					"pwd": Base64.encode(this.pwd),
					"projectName": this.projectName,
					"developmentLanguage": this.developmentLanguage,
					"compilationTool": this.compilationTool
				}, r => {
					this.$message({
						type: 'success',
						message: '添加成功'
					});
					setTimeout(function () {
						self.$router.push("/cicd");
					}, 500)

				}, e => {
					self.disabled = false
					Message.error({
						message: e.msg
					})
				})
			},
			dialogVisible() {
				this.$router.push("/cicd");
			}
		},
		created() {
			this.loadData();
		},
		mounted() {}
	}
</script>

<style scoped>
	.main {
		width: 100%;
		height: 200px;
		background: #fff;
		margin-bottom: 10px;
		border-radius: 5px;
	}

	.publicStyle {
		margin-bottom: 10px;
		background: #fff;
		border-radius: 5px;
	}

	.el-main {
		padding: 0;
	}

	.el-input {
		width: 40%;
		margin-top: 12px;
	}

	.el-select {
		width: 300px;
	}

	.header {
		height: 40px;
		border-bottom: 2px solid #E6E8F1;
		line-height: 40px;
		text-indent: 20px;
	}

	.describe {
		display: inline-block;
		width: 80px;
	}

	.footer {
		line-height: 60px;
	}
</style>
