<template>
  <el-container class="devops">
    <el-aside width="190px">
      <div class="nav-item" :class="{'nav-item-active': currentNav == -1}">
        {{propData.projectCode}}
      </div>
      <div class="nav-item"
           :class="{'nav-item-active': currentNav == index}"
           v-for="(item, index) in propData.units"
           @click="navChange(index,item)"
      >{{item.unitName}}</div>
      <div style="text-align: center;line-height: 60px;font-size: 40px;color: #DADEEE;" @click="newApplication">+</div>
    </el-aside>
    <el-main style="padding: 10px;">
      <div class="env-list">
        <span class="env-nav" :class="{'env-active': currentEnv == index}" v-for="(item, index) in envList"
              @click="envChange(index,item)">{{item.envName+'('+item.namespace+')'}}</span>
        <span class="env-add" @click="addItem">+</span>
      </div>
      <!---------------------------------------------------组件------------------------------------>
      <div is="DeployInfo"
           @eventDel="loadEnvList"
           ref="DeployInfo"
           :envId="envId"
           :delshow="delshow"
           :env="env"
           :projectCode="propData.projectCode"
           :projectId="propData.projectId"></div>
    </el-main>
    <el-dialog  title="添加环境" :visible.sync="popVisible" width="480px">
      <el-form :model="newEnv" label-width="100px">
        <el-form-item label="集群：" >
          <el-select v-model="newEnv.env" placeholder="选择环境" style="width: 340px;">
            <el-option
              v-for="item in optionsEnv"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环境名称：" >
          <el-input v-model="newEnv.envName" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="命名空间：">
          <el-input v-model="newEnv.nameSpace" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="popVisible = false" >取消</el-button>
        <el-button @click="addNewEnv" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
  import DeployInfo from './DeployInfo';
  import { Message } from 'element-ui'
    export default {
      name: "Devops",
      components: {
        DeployInfo
      },
      // mixins: [nav],
      data() {
        return {
          baseEnv: '',
          propData: null,
          envId: '',
          currentNav: -1,
          currentEnv: -1,
          popVisible: false,
          currentCompoent: 'DeployInfo',
          env: '',
          optionsEnv: [
            {name: '开发环境',id:'dev'},
            {name: '测试环境',id:'uat'},
            {name: '预发环境',id:'beta'}
            ],
          envList: [],
          newEnv: {
            env: '',
            envName: '',
            nameSpace: ''
          }
        }
      },
      computed: {
        delshow() {
          let bool = false;
          this.envList.forEach((item)=>{
            if((item.namespace == this.env)&&(item.state==2)){
              bool = true;
            }
          })
          return bool;
        }
      },
      watch:{
      },
      methods: {
				newApplication(){
					this.$router.push("/newApplication");
				},
        navChange(index, item){
          this.$api.sSetObject("_navStatus",index);
          this.$api.sSetObject("_deployUnitId",item.unitId);
          this.$api.sSetObject("_deployUnitCode",item.unitName);
          this.currentNav = index;
          this.$router.push("/DeployEnv");
        },
        envChange(index, item){
          if(this.currentEnv == index){
            return;
          }
          this.envId = item.id;
          this.currentEnv = index;
          this.env = item.namespace;
          this.$api.sSetObject("_currentEnv",index);
          this.$api.sSetObject("_env",item.namespace);
          this.$api.sSetObject("_envId",item.id);
        },
        addItem(){
          this.popVisible = true;
        },
        loadEnvList(){
          let self = this;
          self.$api.post('cicd/getEnvListByProjectId?projectId='+self.propData.projectId, {} , r => {
            self.envList = r.data;
            self.currentEnv = 0;
            self.env = r.data[0].namespace;
            self.baseEnv = r.data[0].namespace;
            self.$api.sSetObject("_env",self.env);
            self.$api.sSetObject("_currentEnv",0);
            self.$api.sSetObject("_envList",self.envList);
          },e => {
            Message.error({
              message: e.msg
            })
          })
        },
        addNewEnv(){
          let self = this;
          let keys = Object.keys(self.newEnv);
          let len = keys.length;
          let msgs = ['请选择集群', '请输入环境名称', '请输入命名空间']
          for(let i = 0; i < len; i++){
            if(!self.newEnv[keys[i]]){
              Message.error({
                message: msgs[i]
              })
              return;
            }
          }
          let p = {
            projectId: self.propData.projectId,
            env: self.newEnv.env,
            envName: self.newEnv.envName,
            nameSpace: self.newEnv.nameSpace
          }
          self.$api.post('cicd/createEnv', p , r => {
            Message.success({
              message: r.msg
            })
            self.popVisible = false;
            this.loadEnvList();
          },e => {
            Message.error({
              message: e.msg
            })
          })
        }
      },
      created() {
        this.propData = this.$api.sGetObject("_cicd");
        let navStatus = this.$api.sGetObject("_navStatus");
        if (navStatus==0 || navStatus) {
          this.currentNav = this.$api.sGetObject("_navStatus");
        }else{
          this.currentNav = -1;
        }
        let envStatus = this.$api.sGetObject("_currentEnv");
        if (envStatus==0 || envStatus) {
          this.currentEnv = this.$api.sGetObject("_currentEnv");
        }else{
          this.currentEnv = 0;
          this.$api.sSetObject("_currentEnv", 0);
        }
        let _env = this.$api.sGetObject("_env");
        if (_env) {
          this.env = this.$api.sGetObject("_env");
        }else{
          this.env = this.baseEnv;
          this.$api.sSetObject("_env", this.env);
        }
        // this.loadEnvList();
        let envList = this.$api.sGetObject("_envList");
        if(envList == null){
          this.loadEnvList();
        }else{
          this.envList = this.$api.sGetObject("_envList");
        }
        let envId = this.$api.sGetObject("_envId");
        if(envId){
          this.envId = this.$api.sGetObject("_envId");
        }
      },
      mounted(){
        // this.$refs.DeployInfo.loadData();
      },
      beforeCreate(){
        sessionStorage.removeItem('_deployUnitId');
        sessionStorage.removeItem('_deployUnitCode');
        sessionStorage.removeItem('_optionsBranch');
        sessionStorage.removeItem('_branch');
      },
      beforeDestroy(){
      }
    }
</script>

<style scoped>
  .devops{
    height: 100%;
  }
  /*nav-left*/
  .nav-item{
    cursor: pointer;
    line-height: 60px;
    border-bottom: 1px solid #E6E8F1;
    color: #666666;
    box-sizing: border-box;
    padding: 0 20px 0 20px;
    position: relative;
    /*background: url("../../common/img/icon_check.png") no-repeat 150px center;*/
  }
  .nav-item:nth-child(1){
    font-weight: 600;
  }
  .nav-item-active{
    background: url("../../common/img/icon_check_active.png") no-repeat 165px center #F8F9FE;
  }
  .nav-item-active:before{
    position: absolute;
    content: '';
    width: 4px;
    height: 100%;
    left: 0;
    background: #67A0FF;
  }
  /*--nav-env--*/
  .env-list{
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    height: 50px;
    background: #F8F9FE;
    border: 1px solid #E6E8F1;
  }
  .env-nav{
    cursor: pointer;
    display: inline-block;
    border-right: 1px solid #E6E8F1;
    width: 150px;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
  }
  .env-active{
    position: relative;
    background: #fff;
    color: #67A0FF;
  }
  .env-add{
    cursor: pointer;
    display: inline-block;
    width: 80px;
    height: 50px;
    vertical-align: top;
    font-size: 40px;
    line-height: 50px;
    border-right: 1px solid #E6E8F1;
    text-align: center;
    color: #DADEEE;
  }
  .el-aside {
    background-color: #FFFFFF;
    color: #666666;
    font-size: 16px;
    border-radius: 4px;
  }
  .el-main {
    margin-left: 10px;
    background-color: #FFFFFF;
  }
  /*---table----*/


</style>
