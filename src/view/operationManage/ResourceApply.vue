<!--资源申请-->
<template>
  <el-container class="resource-apply">
    <el-header style="text-align: right;">
      <el-button type="primary" @click="popShow" style="margin-top: 15px;">添加</el-button>
    </el-header>
    <el-main>
      <el-table :data="listData"  stripe>
        <el-table-column prop="projectName" label="项目组">
        </el-table-column>
        <el-table-column prop="env" label="部署环境" >
        </el-table-column>
        <el-table-column prop="cpuCores" label="cpu" align="center">
        </el-table-column>
        <el-table-column prop="mems" label="内存" align="center">
        </el-table-column>
        <el-table-column prop="disk" label="硬盘" align="center">
        </el-table-column>
        <el-table-column prop="servers" label="服务器数"  align="center" width="80px">
        </el-table-column>
        <el-table-column prop="image" label="OS">
        </el-table-column>
        <el-table-column prop="nickName" label="申请人">
        </el-table-column>
        <el-table-column prop="note" label="审核意见" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column prop="createTime" :formatter="dateFormat" label="申请时间" width="180px" align="center">
        </el-table-column>
        <el-table-column prop="state" label="状态"  align="center">
          <template slot-scope="scope">
            <div style="text-align: center;color: #E81236;" v-if="scope.row.state == 0">不通过</div>
            <div style="text-align: center;color: #0DE7D1;" v-if="scope.row.state == 1">申请中</div>
            <div style="text-align: center;color: #4AFF40;" v-if="scope.row.state == 2">申请成功</div>
          </template>
        </el-table-column>
        <el-table-column label="操作"  align="center" >
          <template slot-scope="scope">
            <div style="text-align: center;" v-if="scope.row.state !== 2">
              <el-tooltip content="编辑" placement="top" effect="dark">
                <img class="img" @click="handleEdit(scope.row)" src="../../common/img/icon_edit_s.png" />
              </el-tooltip>
            </div>
            <!--<div style="text-align: center;color: #4AFF40;" v-if="scope.row.state == 2">已通过</div>-->
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
                     :page-sizes="[10,50,100]"
                     :page-size="pageRows"
                     layout="total,sizes, prev,pager, next,jumper"
                     :total="pageTotal">
      </el-pagination>
    </el-footer>
    <el-dialog  title="资源申请" :visible.sync="popVisible" width="580px" left>
      <div class="resource-apply-con">
        <el-form ref="applyForm" :model="formData" label-width="85px" style="padding: 20px 20px 10px; margin-bottom: 20px;">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目ID">
                <el-select v-model="formData.projectId" @change="loadEnvList" placeholder="请选择项目" :disabled="editStatus">
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
                <el-select v-model="formData.env" placeholder="请选择环境" :disabled="editStatus">
                  <el-option
                    v-for="(item, index) in optionsEnv"
                    :key="index"
                    :label="item.envName"
                    :value="item.namespace">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <!--cpu-->
              <el-form-item label="cpu">
                <el-select v-model="formData.cpuCores" placeholder="请选择cpu">
                  <el-option
                    v-for="item in optionsCpu"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!--内存-->
              <el-form-item label="内存">
                <el-select v-model="formData.mems" placeholder="请选择内存">
                  <el-option
                    v-for="item in optionsMems"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <!--硬盘-->
              <el-form-item label="硬盘">
                <el-select v-model="formData.disk" placeholder="请选择硬盘">
                  <el-option
                    v-for="item in optionsDisk"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!--服务器数-->
              <el-form-item label="服务器数">
                <el-select v-model="formData.servers" placeholder="请选择服务器数">
                  <el-option
                    v-for="item in optionsServers"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <!--ISO-->
              <el-form-item label="ISO">
                <el-select v-model="formData.image" placeholder="请选择ISO">
                  <el-option
                    v-for="item in optionsImage"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item style="text-align: center;">
            <el-button class="submitStyle" style="margin-right: 10px;" type="primary" @click="onSubmit">保存</el-button>
            <el-button class="cancelStyle" @click="cancle">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import { Message } from 'element-ui'
    export default {
      name: "ResourceApply",
      components: {
      },
      data() {
        return {
          formKeys: [],
          editStatus: false,
          drId :'',
          drdId: '',
          popVisible: false,
          listData: [],
          currentPage: 1,
          pageRows: 10,
          pageTotal: 0,
          formData: {
            projectId: '',
            env: '',
            cpuCores: '',
            mems: '',
            disk: '',
            servers: '',
            image: ''
          },
          optionsId: [],
          optionsEnv: [],
          optionsCpu: [
            {
              value: '1',
              label: '1核'
            }, {
              value: '2',
              label: '2核'
            }, {
              value: '3',
              label: '3核'
            }, {
              value: '4',
              label: '4核'
            }, {
              value: '5',
              label: '5核'
            }, {
              value: '6',
              label: '6核'
            }, {
              value: '7',
              label: '7核'
          }],
          optionsMems: [
            {
              value: '2',
              label: '2G'
            }, {
              value: '4',
              label: '4G'
            }, {
              value: '8',
              label: '8G'
            }, {
              value: '16',
              label: '16G'
            }],
          optionsDisk: [
            {
              value: '60',
              label: '60GB'
            }, {
              value: '100',
              label: '100GB'
            }, {
              value: '200',
              label: '200GB'
            }, {
              value: '500',
              label: '500GB'
            }],
          optionsServers: [
            {
              value: '1',
              label: '1'
            }, {
              value: '2',
              label: '2'
            }, {
              value: '3',
              label: '3'
            }, {
              value: '4',
              label: '4'
            }],
          optionsImage: [
            {
              value: 'centos7.3',
              label: 'centos7.3'
            },{
              value: 'centos7.5',
              label: 'centos7.5'
            },{
              value: 'redhat7',
              label: 'redhat7'
            }],
        }
      },
      computed: {
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
          self.$api.post('OperationManagement/getEnvByProjectId?id='+self.formData.projectId, {}, r => {
            self.optionsEnv = r.data;
          }, e => {
            Message.error({
              message: e.msg
            })
          })
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
          this.popVisible = true;
          this.editStatus = true;
          this.optionsEnv = [];
          for (let k of this.formKeys){
            this.formData[k] = row[k];
          }
          this.drId = row.drId;
          this.drdId = row.drdId;
        },
        popShow() {
          this.editStatus = false;
          this.popVisible = true;
          this.optionsEnv = [];
          this.editStatus = false;
          for (let k of this.formKeys){
            this.formData[k] = '';
          }
        },
        loadData(){
          var self = this;
          var p = {
            "pageNo": this.currentPage,
            "pageSize": this.pageRows
          }
          self.$api.post('OperationManagement/getDeployRequirementListByUser', p, r => {
            this.pageTotal = r.data.total;
            this.listData = r.data.rows;
          })
        },
        onSubmit(){
          var self = this;
          let urls = ['OperationManagement/saveDeployRequirementAndDeployRequirementDetail', 'OperationManagement/updateDeployRequirementAndDeployRequirementDetail']
          let url;
          let p;
          if(this.editStatus){
            url = urls[1];
            p = {
              projectId: self.formData.projectId,
              env: self.formData.env,
              cpuCores: self.formData.cpuCores,
              mems: self.formData.mems,
              disk: self.formData.disk,
              servers: self.formData.servers,
              image: self.formData.image,
              drId: this.drId || '',
              drdId: this.drdId || ''
            }
          }else {
            url = urls[0];
            p = {
              projectId: self.formData.projectId,
              env: self.formData.env,
              cpuCores: self.formData.cpuCores,
              mems: self.formData.mems,
              disk: self.formData.disk,
              servers: self.formData.servers,
              image: self.formData.image
            }
          }
          let len = self.formKeys.length;
          let msgs = ['请选择项目id', '请选择环境', '请选择cpu', '请选择内存', '请选择硬盘', '请选择服务器数', '请选择ISO']
          for(let i = 0; i < len; i++){
            if(!self.formData[self.formKeys[i]]){
              Message.error({
                message: msgs[i]
              })
              return;
            }
          }
          self.$api.post(url, p, r => {
            Message.success({
              message: r.msg
            })
            self.loadData();
            self.popVisible = false;
          }, e => {
            Message.error({
              message: e.data
            })
          })
        },
        cancle(){
          this.popVisible = false;
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

<style>
  .resource-apply{
    background: #FFFFFF;
    height: 100%;
  }
  .img {
    width: 16px;
    height: 16px;
    padding: 7px 15px;
    cursor: pointer;
    vertical-align: top;
  }
  .footerDiv {
    height: 40px;
    margin-top: 20px;
    position: relative;
  }
  /*-----------------pop---------------------*/
  .resource-apply-con{
    background: #fff;
    border-radius: 4px;
  }
  .resource-apply-con .title{
    padding-left: 35px;
    line-height: 40px;
    font-size: 14px;
    color: #333333;
    border-bottom: 1px solid #E6E8F1;
  }
  .resource-apply-con .el-form-item__label{
    text-align: left;
    padding-left: 15px;
  }
</style>
