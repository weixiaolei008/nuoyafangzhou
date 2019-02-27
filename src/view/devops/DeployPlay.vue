<!--部署执行-->
<template>
  <div style="color: #666666;">
    <div class="table-title">状态图</div>
    <el-row style="height: 80px;">
      <el-col class="item-status" v-for="(item,index) in statusList" :key="index" style="width: 120px;">
        <img :src="item.icon_back" alt="" v-if="index > currentStatus"  style="z-index: 0"/>
        <div v-if="index == currentStatus&& progress == 1" class="success" :class="{play: progress == 1}">
          <img :src="item.icon" alt="" /></div>
        <img :src="item.icon" alt="" v-if="index == currentStatus && progress == 2" style="z-index: 9"/>
        <img :src="item.icon_error" alt="" v-if="index == currentStatus && progress == 3" style="z-index: 9"/>
        <img :src="item.icon" alt="" v-if="index < currentStatus" style="z-index: 9"/>
        <!--text-->
        <div style="text-align: center; margin-top: 50px;">{{item.name}}</div>
        <!--line-->
        <img v-if="index < currentStatus" style="width: 60px;height: 6px;margin-left: 45px;margin-top: 13px;"
             src="../../common/img/line.png" alt=""/>
        <img v-if="index >= currentStatus && index !=statusList.length - 1" style="width: 60px;height: 6px;margin-left: 45px;margin-top: 13px;"
             src="../../common/img/line_back.png" alt=""/>
      </el-col>
    </el-row>
    <div class="table-title">控制台输出 <el-button v-if="this.env == 'prod'"
                                              @click="back" style="background: #9B83FD;margin: 5px 20px"
                                              type="primary">返回</el-button></div>
    <textarea class="log" id="logArea" v-model="log" placeholder="">
    </textarea>
  </div>
</template>

<script>
  import base from '../../common/js/index'
  var axios = require('axios');
  // let service = "http://10.108.14.98:8201/";
  let service = base.root;

  import {Message} from 'element-ui';
  const icon1 = require('../../common/img/icon1.png');
  const icon1_back = require('../../common/img/icon1_back.png');
  const icon1_error = require('../../common/img/icon1_error.png');

  const icon2 = require('../../common/img/icon2.png');
  const icon2_back = require('../../common/img/icon2_back.png');
  const icon2_error = require('../../common/img/icon2_error.png');

  const icon3 = require('../../common/img/icon3.png');
  const icon3_back = require('../../common/img/icon3_back.png');
  const icon3_error = require('../../common/img/icon3_error.png');

  const icon4 = require('../../common/img/icon4.png');
  const icon4_back = require('../../common/img/icon4_back.png');
  const icon4_error = require('../../common/img/icon4_error.png');

  const icon5 = require('../../common/img/icon5.png');
  const icon5_back = require('../../common/img/icon5_back.png');
  const icon5_error = require('../../common/img/icon5_error.png');

  const icon6 = require('../../common/img/icon6.png');
  const icon6_back = require('../../common/img/icon6_back.png');
  const icon6_error = require('../../common/img/icon6_error.png');

  const icon7 = require('../../common/img/icon7.png');
  const icon7_back = require('../../common/img/icon7_back.png');
  const icon7_error = require('../../common/img/icon7_error.png');

  export default {
    name: "DeployPlay",
    props: ['branch', 'deployUnitId', 'env', 'projectId', 'deployUnitCode', 'projectCode','envSource'],
    data() {
      return {
        stompClient: null,
        socket: null,
        topic:null,stateTopic:null,
        conHeight: '',
        log: '',
        optionsBranch: [],
        currentStatus: -1,
        progress: 1,
        startPrepareLoading: null,
        openCnt:0,connected:false
      }
    },
    watch: {
      progress(val){
        let bool = this.env == 'prod' ? val==2&&this.currentStatus == 6 : val==2&&this.currentStatus == 5;
        if(val == 3){
          this.reset(true);
        }
        if(bool){
          this.$router.push("/DeployEnv");
        }
        if(val==2 && this.currentStatus>=5){
          if(this.startPrepareLoading !=null){
            this.startPrepareLoading.close();
          }
        }
      },
      log(val){
        this.$nextTick(function(){
          var div = document.getElementById('logArea');
          div.scrollTop = div.scrollHeight;
        });
      }
    },
    computed: {
      statusList(){
        let statusList = [
          {
            name: '配置检查',
            icon: icon1,
            icon_back: icon1_back,
            icon_error: icon1_error
          },
          {
            name: '拉取代码',
            icon: icon2,
            icon_back: icon2_back,
            icon_error: icon2_error
          },
          {
            name: '编译代码',
            icon: icon3,
            icon_back: icon3_back,
            icon_error: icon3_error
          },
          {
            name: '构建镜像',
            icon: icon4,
            icon_back: icon4_back,
            icon_error: icon4_error
          },
          {
            name: '上传镜像',
            icon: icon5,
            icon_back: icon5_back,
            icon_error: icon5_error
          },
          {
            name: '部署',
            icon: icon6,
            icon_back: icon6_back,
            icon_error: icon6_error
          },
          {
            name: '提交版本库',
            icon: icon7,
            icon_back: icon7_back,
            icon_error: icon7_error
          },
          {
            name: '完成',
            icon: icon7,
            icon_back: icon7_back,
            icon_error: icon7_error
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
      back(){
        this.$router.push("/DeployEnv");
      },

      openSocket(unitId, deployId) {
        let self = this;
        var topic = "/topic/deployLogView/u" + unitId + "/d" + deployId;
        var stateTopic = "/topic/deployLogView/u" + unitId + "/s" + deployId;

        self.socket = new SockJS(service + "deployLogView");
        self.stompClient = Stomp.over(self.socket);
        let user = base.sGetObject("_user");
        var headers = {
          login: user.username,
          //passcode: '',
          //additional header
          'cookie:JSESSIONID': user.token
        };
        self.stompClient.connect(headers, function (frame) {
          // setConnected(true);
          console.log('Connect-ok: ');
          self.connected = true;
          self.topic = self.stompClient.subscribe(topic, function (log) {
            //console.log("topic-msg:" + log.head);
            self.log += log.body.split('</br>').join('\n');
          });
          self.stateTopic = self.stompClient.subscribe(stateTopic, function (log) {
            //console.log('state-topic:'+log.head);
            let res = JSON.parse(log.body);
            self.currentStatus = res.step;
            self.progress = res.state;
            console.log(res);
          });
          self.linkPost(deployId,unitId);
        },function (err) {
          console.log("stompClient-connect-error:"+err);
          self.reConnect(unitId,deployId);
        });
        self.stompClient.debug = function (str) {
          console.log("msg:"+str);
        }
        /**/
      },
      reConnect(unitId,deployId){
        let t = this;
        this.reset(false);
        console.log("reconnect....");
        t.openSocket(unitId, deployId);
      },
      handleDeploy(callback) {
        let self = this;

        if (!self.branch) {
          Message.error({
            message: '请选择分支'
          })
          return;
        }
        let p = {
          "deployUnitId": self.deployUnitId,
          "deployUnitCode": self.deployUnitCode,
          "projectId": self.projectId,
          "projectCode": self.projectCode,
          "mergeBranch": self.branch,
          "operation": "deploy",
          "buildBranch": self.branch,
          "env": self.env,
          "envTemp": self.env,
          "seqName": self.$route.query.version || '',
          "remark": self.$route.query.remark  || ''
        }
        let url = 'cicd/build/' + self.envSource + '/exec';
        this.startPrepareLoading = this.$loading({
          lock: false,
          text: '部署进行中，详情见日志...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
        self.$api.post(url, p, r => {
          let unit = r.data.unitId;
          let id = r.data.deployId;
          self.openSocket(unit, id);
          if(callback){
            //callback.call();
          }
          /*if(self.startPrepareLoading !=null){
            self.startPrepareLoading.close();
          }*/
        }, e => {
          Message.error({
            message: e.msg
          });
          if(callback){
            callback.call();
          }
          self.reset(true);
        });
      },

      linkPost(id,unit){
        let token;
        let user = this.$api.sGetObject("_user");
        let time = new Date().getTime();
        user == undefined || user == null ? token = '' : token = user.token;
        axios({
          method: 'get',
          data: "",
          baseURL: service + "feed/"+unit+"/"+id,//?deployId="+id+"&unitId="+unit
          withCredentials: true,
          timeout: 20000,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json; charset=UTF-8'
          },
          auth: {
            token: token,
            time: time
          },
        })
          .then(function (res) {
            console.log(res);
          })
          .catch(function (err) {
            console.log(err);
          })
      },

      reset(closeLoading){
        this.connected = false;
        this.$parent.deployDisabled = false;
        let _this = this;
        if (this.stompClient != null){
          if(this.topic){
            this.stompClient.unsubscribe(this.topic);
            this.stompClient.unsubscribe(this.stateTopic);
          }
          this.stompClient.disconnect(function () {
            if(_this.socket){
              _this.socket.close();
              _this.socket = null;
              console.log("closed-socket");
            }
          });
          console.log("close-stompClient");
        }
        if(this.timer) {
          clearInterval(this.timer);
        }
        if(closeLoading) {
          if (this.startPrepareLoading != null) {
            this.startPrepareLoading.close();
          }
        }
      }
    },
    mounted() {
      this.conHeight = (window.innerHeight - 430) + 'px';
      //非产线环境部署
      if(!this.$route.query.version && !this.$route.query.isFirst){
        this.handleDeploy();
      }else if(this.$route.query.version){//产线环境增量发布时
        this.handleDeploy();
      }
    },
    created() {

    },
    beforeDestroy(){
      this.reset(true);
    }
  }
</script>

<style scoped>
  .log{
    width: 90%;
    padding: 5px 8px;
    line-height: 1.5em;
    height: 300px;
    resize: none;
    border: 1px solid #ddd;
    background: #000;
    color: #fff;
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
  .success{
    overflow: hidden;
    z-index: 20;
    background: #fff;
  }
  .success img{
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
  }
  .play img{
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
  }
  .play{
    position: absolute;
    left: 0;
    z-index: 99;
    height: 20px;
    overflow: hidden;
    background: #fff;
    animation: progress 1s linear infinite;
  }
  @-webkit-keyframes progress{
    0%{
      width: 30px;
      height: 30px;
      opacity: 0.1;
    }
    50%{
      width: 30px;
      height: 30px;
      opacity: 0.5;
    }
    100%{
      width: 30px;
      height: 30px;
      opacity: 1;
    }
  }
  .table-title {
    line-height: 40px;
    font-size: 14px;
    padding-left: 20px;
    color: #666666;
    font-weight: 600;
    position: relative;
  }

</style>
