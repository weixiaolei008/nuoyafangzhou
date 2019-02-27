<template>
  <div style="color: #666666;">
    <div class="table-title">状态图</div>
    <div style="height: 80px;">
      <!--
      <img style="height: 120px;margin-top: -20px;" v-if="env != 'prod'" src="../../common/img/status_other.png" alt="">
      <img style="height: 120px;margin-top: -20px;" v-else src="../../common/img/status_port.png" alt="">
      -->
      <el-row style="height: 80px;">
        <el-col class="item-status" v-for="(item,index) in statusList" :key="index" style="width: 120px;">
          <img :src="item.icon" alt="" style="z-index: 9" />
          <!--text-->
          <div style="text-align: center; margin-top: 50px;">{{item.name}}</div>
          <!--line-->
          <img style="width: 60px;height: 6px;margin-left: 45px;margin-top: 13px;"
               src="../../common/img/line.png" alt="" v-if="index <statusList.length-1" />
          </el-col>
      </el-row>
    </div>
    <div class="table-title">环境信息
      <el-input v-model="remark" placeholder="请输入内容" v-if="deployShow && handleShow"
                style="margin-left: 50px;width: 300px;margin-bottom: 10px; "></el-input>
      <el-button class="play" style="background: #67A0FF" type="primary" @click="deploy" v-if="deployShow && handleShow">部署</el-button>
    </div>
    <div style="overflow-y: auto" :style="{height: conHeight}">
      <el-table :data="k8sPodList"  stripe   highlight-current-row @current-change="handleCurrentChange">
        <!--<el-table-column type="selection" width="55" v-if="deployShow && handleShow">-->
        <!--</el-table-column>-->
        <el-table-column label=""  width="30px" align="center" v-if="deployShow && handleShow">
          <template slot-scope="scope" style="position: relative;">
              <!--<input style="position:absolute;top: 50%;left: 15px; opacity: 0;width: 1.6em;z-index: 99;margin-top: -.8em;-->
                            <!--height: 1.6em;" type="radio" name="abc" :id="scope.row.startTime"-->
                     <!--@click="handleSelect(scope.row)">-->
              <!--<label for="scope.row.startTime"></label>-->
            <el-radio v-model="radio" :label="scope.row.startTime+scope.row.deployments"
                      @click="handleSelect(scope.row)"></el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="deployments" label="deployments">
        </el-table-column>
        <el-table-column label="操作"  width="" align="center" v-if="deployShow && handleShow">
          <template slot-scope="scope">
            <el-tooltip content="回退" placement="top" effect="dark">
              <img class="img" @click="loadHistory(scope.row)" src="../../common/img/icon_back.png" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="image" label="IMAGES">
          <template slot-scope="scope">
              <el-tooltip :content="scope.row.image" placement="top" effect="dark">
                <div style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.image}}</div>
              </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="podName" label="POD-NAME">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.podName" placement="top" effect="light">
              <div style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.podName}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="node" label="Node">
        </el-table-column>
        <el-table-column prop="podIP" label="IP">
        </el-table-column>
        <el-table-column prop="phase" label="STATUS" :show-overflow-tooltip=true style="width: 55px;!important;">
          <template slot-scope="scope">
            {{scope.row.phase}}
            <el-tooltip :content="scope.row.phase"  placement="top" effect="red"  style="width: 15px;!important;">
              <img class="img" @click.stop="showStatus(scope.row)"
                   src="../../common/img/icon_back.png" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" label="部署人">
        </el-table-column>
        <el-table-column prop="startTime" :formatter="dateFormat" label="部署时间" width="180px" align="center">
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="下载jar" placement="top">
              <img class="img" @click.stop="handleLoad(scope.row)" src="../../common/img/donload.png" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看部署日志" placement="top">
              <img class="img" @click.stop="handleDeployLog(scope.row)" src="../../common/img/icon_route.png" />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="查看应用日志" placement="top">
              <img class="img" @click.stop="handleAppLog(scope.row)" src="../../common/img/icon_look.png" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--历史纪录-->
      <el-table :data="historyList"  stripe style="margin-top: 20px;" v-show="historyVisible">
        <el-table-column prop="revision" label="REVISION" width="130px" align="center">
        </el-table-column>
        <el-table-column prop="image" label="历史IMAGES">
        </el-table-column>
        <el-table-column prop="seqNo" label="序号" width="150px">
        </el-table-column>
        <el-table-column prop="remark" label="版本备注" width="300px">
        </el-table-column>
        <el-table-column label="操作"  width="100px" align="center">
          <template slot-scope="scope">
            <el-tooltip content="回退" placement="top" effect="dark">
              <img class="img" @click.stop="handleBack(scope.row)" src="../../common/img/icon_back.png" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="k8sServiceList"  stripe style="margin-top: 20px;">
        <el-table-column prop="loadbanceName" label="loadbance name ">
        </el-table-column>
        <el-table-column prop="type" label="类型">
        </el-table-column>
        <el-table-column prop="clusterIP" label="ClusterIP">
        </el-table-column>
        <el-table-column prop="endPoint" label="ENDPOINTS">
        </el-table-column>
        <el-table-column prop="externalIPs" label="EXTERNAL-IP">
        </el-table-column>
        <el-table-column prop="port" label="PORT">
        </el-table-column>
        <el-table-column prop="nodePort" label="NodePort">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import base from '../../common/js/index'
  import { Message } from 'element-ui';
  const icon1 = require('../../common/img/icon1.png');
  const icon2 = require('../../common/img/icon2.png');
  const icon3 = require('../../common/img/icon3.png');
  const icon4 = require('../../common/img/icon4.png');
  const icon5 = require('../../common/img/icon5.png');
  const icon6 = require('../../common/img/icon6.png');
  const icon7 = require('../../common/img/icon7.png');

  let service = base.root;
    export default {
      name: "EnvInfo",
      props: ['env','deployUnitCode','deployUnitId','projectCode','branch'],
      watch:{
        env(){
          this.loadData();
        },
        deployUnitCode(){
          this.loadData();
        },
      },
      data(){
        return {
          radio: '',
          isFirst: true,
          remark: '',
          version: '',
          deployShow: false, // 权限
          historyVisible: false,
          conHeight: '',
          optionsBranch :[],
          k8sPodList: [],
          k8sServiceList: [],
          historyList: []
        }
      },
      computed:{
        handleShow() {
          let bool = false;
          if(this.env == 'prod'){
            bool = true;
          }
          return bool;
        },
        statusList(){
          let statusList = [
            {
              name: '配置检查',
              icon: icon1
            },
            {
              name: '拉取代码',
              icon: icon2
            },
            {
              name: '编译代码',
              icon: icon3
            },
            {
              name: '构建镜像',
              icon: icon4
            },
            {
              name: '上传镜像',
              icon: icon5
            },
            {
              name: '部署',
              icon: icon6
            },
            {
              name: '提交版本库',
              icon: icon7
            },
            {
              name: '完成',
              icon: icon7
            }
          ]
          if(this.env !== 'prod'){
            //statusList.length = 7;
            let ss = [
              statusList[0],statusList[1],statusList[2],statusList[3]
              ,statusList[4],statusList[5],statusList[7]
            ];
            statusList = ss;
          }
          return statusList;
        }
      },
      methods: {
        deploy(){
          if(!this.branch){
            Message.error({
              message: '请选择分支'
            })
            return
          }
          if(!this.version){
            Message.error({
              message: '请选择一条数据'
            })
            return
          }
          this.$router.push({
            path:'/DeployPlay',
            query:{
              remark: this.remark,
              version: this.version,
              isFirst: this.isFirst
            }
          })
        },
        handleCurrentChange(val) {
          if(!val) return;
          this.radio = val.startTime+val.deployments;
          this.version = val.deployments;
        },
        handleSelect(val) {
          if(!val) return;
          this.radio = val.startTime+val.deployments;
          this.version = val.deployments;
        },
        loadHistory(row){
          let self = this;
          self.radio = row.startTime+row.deployments;
          self.historyVisible = true;
          let p = {
            projectName: self.projectCode,
            deployUnitCode: self.deployUnitCode,
            env: self.env,
            seqNo: row.seqNo
          }
          self.$api.post('k8s/queryRolloutHistory', p , r => {
            self.historyList = r.data;
          },e => {
            Message.error({
              message: e.msg
            })
          })
        },
        handleBack(row){
          let self = this;
          let p = {
            revision: row.revision,
            image: row.image,
            projectName: self.projectCode,
            deployUnitCode: self.deployUnitCode,
            env: self.env
          }
          self.$api.post('k8s/rollOutDeploy', p , r => {
            self.historyVisible = false
            Message.success({
              message: r.msg
            })
          },e => {
            Message.error({
              message: e.msg
            })
          })
        },
        loadData() {
          let self = this;
          let p = {
            projectName: self.projectCode,
            deployUnitCode: self.deployUnitCode,
            deployUnitId: self.deployUnitId,
            env: self.env
          }
          self.k8sPodList = [];
          self.k8sServiceList = [];
          self.$api.post('k8s/queryDeployUnitPodAndService', p , r => {
            if(!r.data.ciDeployState || r.data.ciDeployState.state!=3) {
              self.isFirst = true;
              self.$router.push({
                path:'/DeployPlay',
                query:{
                  isFirst: self.isFirst
                }
              });
            }else{
              self.isFirst = false;
            }
            if(r.data.podList) {
              self.k8sPodList = r.data.podList;
            }
            if(r.data) {
              self.k8sServiceList.push(r.data);
            }
          },e => {
            Message.error({
              message: e.msg
            })
          })
        },
        handleLoad(row){
          if(row.fileSize > 100){
            Message.error({
              message: '文件大于100M,禁止下载'
            })
            return;
          }
          window.open(service+'k8s/jarDownload?deploymentId=' + row.deploymentId,"_blank");
        },
        handleAppLog(row){
          let self = this;
          ///uat/devops-uat/ops-build-proxy/ops-build-proxy-59b54b5dcc-t2bp5
          var url = "log/"+self.env+"/"+self.projectCode+"-"+self.env+"/"+self.deployUnitCode+"/"+row.podName;
          window.open(service+url,"_blank");
        },
        handleDeployLog(row){
          let self = this;
          ///uat/devops-uat/ops-build-proxy/ops-build-proxy-59b54b5dcc-t2bp5
          var url = "log/deployLog/"+self.env+"/"+self.projectCode+"-"+self.env+"/"+self.deployUnitCode+"/"+row.deploymentId;
          window.open(service+url,"_blank");
        },
        showStatus(row){
          let self = this;
          var url = "log/currStatus/"+self.env+"/"+self.projectCode+"-"+self.env+"/"+self.deployUnitCode+"/"+row.podName;
          self.$api.get(url, {} , r =>{
            console.log("currStatus:"+r.data);
            row.phase += "          "+r.data;
          },e=>{

          });
        }
      },
      mounted() {
        this.conHeight = (window.innerHeight - 430) + 'px';
      },
      created() {
        let permissionList = this.$api.sGetObject("_user").permissionList;
        permissionList.forEach((item) => {
          if(item.authCode === 'cicd_deploy_prod'){
            this.deployShow = true;
            return;
          }
        })
        this.loadData();
      }
    }
</script>

<style scoped>
  input[type="radio"] + label::before {
    content: "\a0"; /*不换行空格*/
    display: inline-block;
    vertical-align: middle;
    font-size: 18px;
    width: .8em;
    height: .8em;
    margin-right: .4em;
    border-radius: 50%;
    border: 1px solid #67A0FF;
    text-indent: .15em;
    line-height: 1;
  }
  input[type="radio"]:checked + label::before {
    background-color: #67A0FF;
    background-clip: content-box;
    padding: .2em;
    top:6px;
  }
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
  .table-title{
    line-height: 40px;
    font-size: 14px;
    padding-left: 20px;
    color: #666666;
    font-weight: 600;
    position: relative;
  }
  .img {
    vertical-align: top;
    width: 13px;
    height: 13px;
    padding: 5px 5px;
    cursor: pointer
  }
  .item-status{
     position: relative;
     height: 80px;
   }
  .item-status>img{
    position: absolute;
    top: 10px;
    left: 45px;
    width: 20px;
    height: 20px;
  }
  .item-status>.play{
    position: absolute;
    top: 10px;
    left: 45px;
  }
  .item-status>.success{
    position: absolute;
    top: 10px;
    left: 45px;
  }
</style>
