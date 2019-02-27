<!--中间件-->
<template>
  <el-container class="middle-ware">
    <el-header >
      <el-row style="padding-top: 15px;">
        <el-col :span="18">
          <span style="margin-right: 20px;">应用名称</span>
          <el-select v-model="appName" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input style="width: 280px;margin-left: 50px;" v-model="searchVal" placeholder="请输入关键字搜索">
          </el-input>
          <img class="btn-search" @click="search" src="../../common/img/icon_search.png" alt="">
        </el-col>
        <el-col :span="6" style="text-align: right;">
          <span class="create-app" @click="creatApp"><img src="../../common/img/icon_creat.png" alt=""> 创建应用</span>
        </el-col>
      </el-row>
    </el-header>
    <!--表格-->
    <el-main>
      <el-table :data="listData"  stripe @row-dblclick="toDetail" >
        <el-table-column type="index" label="ID">
        </el-table-column>
        <el-table-column prop="templateName" label="应用名称" >
        </el-table-column>
        <el-table-column prop="templateType" label="应用类型">
        </el-table-column>
        <el-table-column prop="templateAppSce" label="应用场景">
        </el-table-column>
        <el-table-column prop="createUser" label="创建者">
        </el-table-column>
        <el-table-column prop="content" label="部署记录">
        </el-table-column>
        <el-table-column prop="updateTime" :formatter="dateFormat" label="更新时间" width="180px" align="center">
        </el-table-column>
        <el-table-column label="操作"  width="" align="center">
          <template slot-scope="scope">
            <div style="text-align: center;">
              <el-tooltip content="编辑" placement="top" effect="dark">
                <img class="img" @click.stop="handleEdit(scope.row)" src="../../common/img/icon_edit_s.png" />
              </el-tooltip>
              <el-tooltip content="部署" placement="top" effect="dark">
                <img class="img ml-10" @click.stop="handleDeploy(scope.row)" src="../../common/img/icon_lock.png" />
              </el-tooltip>
              <el-tooltip content="删除" placement="top" effect="dark">
                <img class="img ml-10" @click.stop="handleDel(scope.row)" src="../../common/img/icon_delete.png" />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!--分页-->
    <el-footer class="footerDiv">
      <el-pagination style="text-align: center;padding: 6px 0px;"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     :page-sizes="[20,50,100]"
                     :page-size="pageRows"
                     layout="total,sizes, prev,pager, next,jumper"
                     :total="pageTotal">
      </el-pagination>
    </el-footer>
    <!--部署pop-->
    <el-dialog  title="中间件部署" center :visible.sync="popVisible" width="580px" left>
      <el-form :model="formData" label-width="90px" style="margin-top: 10px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目组">
              <el-select v-model="formData.projectId" @change="loadEnvList" placeholder="请选择项目">
                <el-option
                  v-for="item in optionsId"
                  :key="item.id"
                  :label="item.projectName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="环境选择">
              <el-select v-model="formData.env" placeholder="请选择环境">
                <el-option
                  v-for="item in optionsEnv"
                  :key="item.id"
                  :label="item.envName"
                  :value="item.namespace">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="服务器：">
          <el-input v-model="selector" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="popVisible = false" >取消</el-button>
        <el-button @click="deploySure" :disabled="deployDisabled" type="primary">部署</el-button>
        <el-button @click="lookLog" type="primary" :disabled = '!this.logPath?true:false'>查看日志</el-button>
      </span>
    </el-dialog>
    <el-dialog  title="中间件部署日志" center :visible.sync="logVisible" width="580px" left>
        <el-input type="textarea"
                  v-model="logContent"
                  placeholder=""
                  :autosize="{ minRows: 15,maxRows: 15}"></el-input>
    </el-dialog>
  </el-container>
</template>

<script>
  import { Message } from 'element-ui'
    // import editor from '../components/Editor'
    export default {
      name: "Middleware",
      components: {
        // 'editor':editor
      },
      data() {
        return {
          deployDisabled: false,
          logPath: '',
          optionsId: [],
          optionsEnv: [],
          formKeys: [],
          searchVal: '',
          listData: [],
          currentRow: {},
          currentPage: 1,
          pageRows: 10,
          pageTotal: 0,
          popVisible: false,
          logVisible: false,
          logContent: '',
          projectCode: '',
          formData: {
            projectId: '',
            env: '',
            selector: ''
          },
          appName: '',
          options: [],
          content:'我是富文本编辑器的内容',
          //tinymce的配置信息 参考官方文档 https://www.tinymce.com/docs/configure/integration-and-setup/
          editorSetting:{
            height:100,
          }
        }
      },
      computed: {
        selector: {
          get: function () {
            let self =this;
            let pre,mid;
            this.optionsId.forEach(item => {
              if(item.id == self.formData.projectId){
                pre = item.projectCode;
              }
            })
            this.optionsEnv.forEach(item => {
              if(item.namespace == self.formData.env){
                mid = item.namespace;
              }
            })
            if(pre&&mid) {
              return pre + '-' + mid + '-' + 'middleware'+"-"+self.currentRow.templateType;
            }
          },
          set: function (val) {
          }
        }
      },
      watch:{
      },
      methods: {
        loadIdList() {
          var self = this;
          var p = {}
          self.$api.post('OperationManagement/getProjectListByLogin', p, r => {
            self.optionsId = r.data;
          }, e => {
            Message.error({
              message: e.msg
            })
          })
        },
        loadEnvList() {
          var self = this;
          self.optionsId.forEach((item) => {
            if(item.id === self.formData.projectId){
              self.projectCode = item.projectCode;
            }
          })
          self.$api.post('OperationManagement/getEnvByProjectId?id='+self.formData.projectId, {}, r => {
            self.optionsEnv = r.data;
          }, e => {
            Message.error({
              message: e.msg
            })
          })
        },
        search() {
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.loadData();
        },
        handleSizeChange(val) {
          this.pageRows = val;
          this.loadData();
        },
        handleEdit(row) {
          this.$api.sSetObject('_appConfigEditId', row.id);
          this.$router.push("/NewMiddleware");
        },
        handleDeploy(row) {
          this.popVisible = true;
          this.currentRow = row;
          for (let k of this.formKeys){
            this.formData[k] = '';
          }
        },
        deploySure() {
          var self = this;
          let len = self.formKeys.length;
          self.formData.selector = self.selector;
          let msgs = ['请选择项目组', '请选择环境', '请输入服务器数']
          for(let i = 0; i < len; i++){
            if(!self.formData[self.formKeys[i]]){
              Message.error({
                message: msgs[i]
              })
              return;
            }
          }
          self.deployDisabled = true;
          var p = {
            templateId: self.currentRow.id,
            templateName: self.currentRow.templateName,
            templateType: self.currentRow.templateType,
            project: self.formData.projectId,
            projectCode: self.projectCode,
            envTemp: self.formData.env,
            env: self.formData.env,
            node: self.formData.node,
            selector: self.formData.selector
          }
          self.$api.post('app/deploy/middlewareDep', p, r => {
            self.logPath = r.data;
            self.deployDisabled = false;
            self.loadData();
            Message.success({
              message: '部署成功'
            })
          }, e => {
            self.deployDisabled = false;
            self.logPath = e.data;
            Message.error({
              message: e.msg
            })
          })
        },
        lookLog(){
          let self = this;
          self.popVisible = false;
          self.logVisible = true;
          let p = {
            filePath: self.logPath
          }
          self.$api.post('app/deploy/getLogWithDeploy', p, r => {
            self.logContent = r.data;
          }, e => {
            Message.success({
              message: e.msg
            })
          })
        },
        handleDel(row){
          var self = this;
          this.$confirm('确认删除', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            var p = {
              id: row.id,
              templateName: row.templateName,
              templateType: row.templateType,
              content: row.templateType
            }
            self.$api.post('app/template/deleteTemplate', p, r => {
              this.loadData();
              Message.success({
                message: '删除成功'
              })
            }, e => {
              Message.error({
                message: e.msg
              })
            })
          }).catch(() => {
          });
        },
        toDetail(row) {
          this.$api.sSetObject('_deployDetailId', row.id);
          this.$router.push("/DeploymentDetail");
        },
        loadData(){
          var self = this;
          var p = {
            "pageNo": this.currentPage,
            "pageSize": this.pageRows
          }
          self.$api.post('app/template/findTemplateByPage', p, r => {
            this.pageTotal = r.data.total;
            this.listData = r.data.rows;
          }, e => {
            Message.error({
              message: e.msg
            })
          })
        },
        creatApp(){
          this.$router.push("/NewMiddleware");
        }
      },
      created() {
        this.formKeys = Object.keys(this.formData);
        this.loadData();
        this.loadIdList();
      },
      mounted() {
      }
    }
</script>

<style scoped>
  .middle-ware{
    height: 100%;
    background: #FFFFFF;
  }
  .btn-search{
    width: 20px;
    height: 20px;
    border: 8px solid transparent;
    vertical-align: middle;
    position: relative;
    left: -45px;
    cursor: pointer;
  }
  .img {
    vertical-align: top;
    width: 16px;
    height: 16px;
    padding: 7px 12px;
    cursor: pointer
  }
  .create-app{
    display: inline-block;
    font-size: 16px;
    color: #67A0FF;
    line-height: 36px;
    cursor: pointer;
    border: 1px solid #67A0FF;
    padding: 0 15px;
    border-radius: 5px;
  }
  .create-app img{
    vertical-align: -2px;
  }
  .ml-10{
    margin-left: 5px;
  }
  .footerDiv {
    height: 40px;
    margin-top: 20px;
    position: relative;
  }
</style>
