<template>
  <el-container class="devops">
    <el-aside width="190px">
      <div @click="navFirst" class="nav-item" :class="{'nav-item-active': currentNav == -1}">
        {{propData.projectCode}}
      </div>
      <div class="nav-item"
           :class="{'nav-item-active': currentNav == index}"
           v-for="(item, index) in propData.units"
           @click="navChange(index,item)"
      >{{item.unitName}}</div>
    </el-aside>
    <el-main style="padding: 10px;">
      <div class="env-list">
        <span class="env-nav" :class="{'env-active': currentEnv == index}" v-for="(item, index) in envList"
              @click="envChange(index,item)"
        >{{item.envName+'('+item.namespace+')'}}</span>
      </div>
      <el-row style="padding: 15px 0;box-shadow: 0 1px 0 0 rgba(0,0,0,0.03);">
        <el-col :span="12">
          <span style="margin-right: 20px;margin-left: 10px;">选择分支</span>
          <el-select v-model="branch" placeholder="选择分支" @change="slectBranch">
            <el-option
              v-for="item in optionsBranch"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="11" style="text-align: right;">
          <el-button style="background: #67A0FF" type="primary" @click="deploy" :disabled="deployDisabled" v-if="(env != 'prod')||(deployShow&&isFirst)">部署</el-button>
          <el-button @click="handleConfig" style="background: #9B83FD" type="primary">配置</el-button>
        </el-col>
      </el-row>
      <!-----------------------------------------组件----------------------------------------------------------------->
      <div is="DeployPlay"
           :envSource="envSource"
           ref="DeployPlay"
           :branch="branch"
           :env="env"
           :deployUnitId="deployUnitId"
           :deployUnitCode="deployUnitCode"
           :projectCode="propData.projectCode"
           :projectId="propData.projectId"></div>
    </el-main>
  </el-container>
</template>

<script>
  import { Message } from 'element-ui'
  import DeployPlay from './DeployPlay';
    export default {
      name: "Devops",
      components: {
        DeployPlay
      },
      // mixins: [nav],
      data() {
        return {
          isFirst: true,
          deployDisabled: false,
          refreshStatus: false,
          deployShow: false,
          baseEnv: '',
          deployBtn: false,
          deployUnitId: '',
          deployUnitCode: '',
          propData: null,
          currentNav: -1,
          currentEnv: 0,
          popVisible: false,
          branch: '',
          env: '',
          optionsBranch :[],
          optionsEnv: [
            {name: '开发环境'},
            {name: '测试环境'},
            {name: '预发环境'}
          ],
          envList: [],
          newEnv: {
            env: '',
            name: '',
            path: ''
          }
        }
      },
      computed: {
        envSource() {
          let env;
          this.envList.forEach((item) => {
            if(item.namespace == this.env){
              env = item.env
            }
          })
          return env
        }
      },
      watch:{
        env(){
          this.loadBranchList();
        }
      },
      methods: {
        deploy() {
          if (!this.branch) {
            Message.error({
              message: '请选择分支'
            })
            return;
          }
          this.deployDisabled = true;
          let self = this;
          this.$refs.DeployPlay.handleDeploy(function () {
            self.deployDisabled = false;
          });
        },
        slectBranch(val) {
          if(val == '刷新'){
            this.branch = '';
            this.refreshStatus = true;
            this.loadBranchList();
            return;
          }
          this.$api.sSetObject("_branch",this.branch);
        },
        navFirst() {
          this.$api.sSetObject("_navStatus",-1);
          this.$router.push("/devops");
        },
        navChange(index, item){
          if(this.currentNav !== index){
            sessionStorage.removeItem('_branch');
          }
          this.deployUnitId = item.unitId;
          this.currentNav = index;
          this.$api.sSetObject("_navStatus",index);
          this.$api.sSetObject("_deployUnitId",item.unitId);
          this.$api.sSetObject("_deployUnitCode",item.unitName);
          this.$router.push("/DeployEnv");
        },
        envChange(index, item){
          if(this.currentEnv == index){
            return;
          }
          this.currentEnv = index;
          this.env = item.namespace;
          this.$api.sSetObject("_currentEnv",index);
          this.$api.sSetObject("_env",item.namespace);
          this.$router.push("/DeployEnv");
        },
        handleConfig() {
          this.$router.push("/DeployConfig");
        },
        loadBranchList(){
          let self = this;
          let p = {
            deployUnitId: self.deployUnitId,
            env: self.env,
            projectId: self.propData.projectId,
            pull: self.refreshStatus
          }
          self.$api.post('cicd/getUnitBranchList', p , r => {
            self.refreshStatus = false;
            self.optionsBranch = r.data;
            self.optionsBranch.push('刷新');
            self.$api.sSetObject("_optionsBranch",r.data);
          },e => {
            Message.error({
              message: e.msg
            })
          })
        },
      },
      created() {
        let permissionList = this.$api.sGetObject("_user").permissionList;
        permissionList.forEach((item) => {
          if(item.authCode === 'cicd_deploy_prod'){
            this.deployShow = true;
            return;
          }
        })
        this.envList = this.$api.sGetObject("_envList");
        this.baseEnv =  this.envList[0].namespace;
        this.optionsBranch = this.$api.sGetObject("_optionsBranch");
        this.deployUnitId = this.$api.sGetObject("_deployUnitId");
        this.deployUnitCode = this.$api.sGetObject("_deployUnitCode");
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
        }
        let _env = this.$api.sGetObject("_env");
        if (_env) {
          this.env = this.$api.sGetObject("_env");
        }else{
          this.env = this.baseEnv;
        }
        let _branch = this.$api.sGetObject("_branch");
        if (_branch) {
          this.branch = this.$api.sGetObject("_branch");
        }else{
          this.branch = '';
        }
        this.isFirst = this.$route.query.isFirst ? true : false;
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
    box-sizing: border-box;
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
  .el-aside {
    background-color: #FFFFFF;
    color: #666666;
    font-size: 16px;
    border-radius: 4px;
  }
  .el-main {
    margin-left: 10px;
    background-color: #FFFFFF;
    /*color: #999999;*/
    /*border-radius: 4px;*/
  }
  /*---table----*/


</style>
