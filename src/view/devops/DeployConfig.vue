<!--部署配置-->
<template>
  <div style="color: #666666;">
    <div style="overflow-y: auto" :style="{height: conHeight}">
      <div class="table-title">容器配置</div>
      <div style="overflow-y: auto">
        <el-table :data="listData"  stripe >
          <el-table-column prop="containerPort" label="服务端口">
          </el-table-column>
          <el-table-column prop="externalIps" label="externalIps">
          </el-table-column>
          <el-table-column prop="devNum" label="部署数">
          </el-table-column>
          <el-table-column prop="replicas" label="副本数">
          </el-table-column>
          <el-table-column prop="containerCpus" label="cpu">
          </el-table-column>
          <el-table-column prop="containerMems" label="内存">
          </el-table-column>
          <el-table-column label="操作"  align="center" >
            <template slot-scope="scope">
              <el-tooltip content="编辑" placement="top" effect="dark">
                <img class="img" @click="handleEdit(scope.row)" src="../../common/img/icon_edit_s.png" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-title">配置文件</div>
      <div>
        <span style="margin-right: 20px;margin-left: 35px;">名称</span>
        <el-input style="width: 217px;" v-model="configName" placeholder="请输入内容"></el-input>
      </div>
      <div class="table-title">data</div>
      <div style="padding-left: 20px;">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" style="width: 98%;margin-bottom: 15px;"
                  v-model="configData" placeholder="请输入内容"></el-input>
        <el-button @click="saveConfig" style="background: #67A0FF" type="primary">保存</el-button>
        <el-button @click="cancleConfig" style="background: #9B83FD" type="primary">取消</el-button>
      </div>
    </div>
    <el-dialog  title="修改容器配置参数" :visible.sync="popVisible" width="580px">
      <el-form :model="containerConfig" label-width="100px">
        <el-form-item label="服务端口：" >
          <el-input v-model="containerConfig.containerPort" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="部署数：">
          <el-input v-model="containerConfig.devNum" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="副本数：" >
          <el-input v-model="containerConfig.replicas" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="cpu：" >
          <el-input v-model="containerConfig.containerCpus" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="内存：">
          <el-input v-model="containerConfig.containerMems" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="externalIps：">
          <el-input v-model="containerConfig.externalIps" placeholder="请输入内容"></el-input>
        </el-form-item>
        <!--<el-form-item label="部署模式">
          <el-select v-model="containerConfig.deployMode" placeholder="请选择部署模式">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="popVisible = false" >取消</el-button>
        <el-button @click="editConfig" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { Message } from 'element-ui'
  export default {
    name: "DeployConfig",
    props: ['deployUnitId','env','projectId'],
    watch:{
      env(){
        this.loadData();
      }
    },
    data(){
      return {
        formKeys: [],
        conHeight: '',
        configName: '',
        configData: '',
        popVisible: false,
        options: [
          {
            value: '0',
            label: '混合部署'
          }, {
            value: '1',
            label: '独立部署'
          }],
        containerConfig: {
          containerPort: '',
          devNum: '',
          replicas: '',
          containerCpus: '',
          containerMems: '',
          externalIps: '',
          deployMode: ''
        },
        listData: []
      }
    },
    methods: {
      handleEdit(row) {
        this.popVisible = true;
        this.containerConfig = Object.assign({},row);
      },
      editConfig(){
        var self = this;
        let len = self.formKeys.length-1;
        let msgs = ['请输入服务端口', '请输入部署数', '请输入副本数', '请输入cpu', '请输入内存', '请输入externalIps','请选择模式']
        for(let i = 0; i < len; i++){
          if(!self.containerConfig[self.formKeys[i]]&&self.formKeys[i]!='externalIps'){
            Message.error({
              message: msgs[i]
            })
            return;
          }
        }
        var p = {
          deployUnitId: self.deployUnitId,
          env: self.env,
          projectId: self.projectId,
          containerPort: self.containerConfig.containerPort,
          devNum: self.containerConfig.devNum,
          replicas: self.containerConfig.replicas,
          containerCpus: self.containerConfig.containerCpus,
          containerMems: self.containerConfig.containerMems,
          externalIps: self.containerConfig.externalIps,
          deployMode: self.containerConfig.deployMode,
        }
        self.$api.post('cicd/updateConfig', p, r => {
          Message.success({
            message: r.msg
          })
          self.loadData();
          self.popVisible = false;
        },e =>{
          Message.error({
            message: e.msg
          })
        })
      },
      saveConfig(){
        var self = this;
        if(!self.configName){
          Message.error({
            message: '请输入名称'
          })
          return;
        }
        if(!self.configData){
          Message.error({
            message: '请输入data'
          })
          return;
        }
        var p = {
          deployUnitId: self.deployUnitId,
          env: self.env,
          projectId: self.projectId,
          configName: self.configName,
          configData: self.configData,
        }
        self.$api.post('cicd/updateCfgMap', p, r => {
          Message.success({
            message: r.msg
          })
          this.$router.push("/DeployEnv");
        },e =>{
          Message.error({
            message: e.msg
          })
        })
      },
      cancleConfig(){
        this.$router.push("/DeployEnv");
      },
      loadData(){
        var self = this;
        var p = {
          deployUnitId: self.deployUnitId,
          env: self.env,
          projectId: self.projectId
        }
        self.listData.length = [];
        self.$api.post('cicd/queryConfig', p, r => {
          if(r.data.deployConfig){
            self.listData.push(r.data.deployConfig);
          }
          self.configName = r.data.ciDeployCfgMap ? r.data.ciDeployCfgMap.configName : '';
          self.configData = r.data.ciDeployCfgMap ? r.data.ciDeployCfgMap.configData : '';
        },e =>{
          Message.error({
            message: e.msg
          })
        })
      }
    },
    mounted() {
      this.conHeight = (window.innerHeight - 262) + 'px';
    },
    created() {
      this.formKeys = Object.keys(this.containerConfig);
      this.loadData();
    }
  }
</script>

<style scoped>
  .table-title:before{
    content:'';
    position: absolute;
    display: block;
    width: 0px;
    height: 0px;
    left: 5px;
    top: 13px;
    border-left: 5px solid #888888;
    border-top: 5px solid #888888;
    border-right: 5px solid transparent;
    border-bottom: 5px solid transparent;
  }
  .img {
    vertical-align: top;
    width: 16px;
    height: 16px;
    padding: 7px 12px;
    cursor: pointer
  }
  .table-title{
    line-height: 40px;
    font-size: 14px;
    padding-left: 20px;
    color: #666666;
    font-weight: 600;
    position: relative;
  }
  .el-dialog .el-dialog__footer{
    padding-bottom: 0;
  }
</style>
