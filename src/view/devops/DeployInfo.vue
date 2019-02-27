<template>
  <div>
    <el-row style="border-bottom: 1px solid #D4D8ED;">
      <el-col :span="16">
        <div class="title">项目组应用部署信息</div>
      </el-col>
      <el-col :span="7" style="text-align: right;">
        <el-button @click="handleDel" style="background: #F97693;border: none;margin-top: 13px;" type="primary" v-if="delshow">删除</el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <div class="container" :style="{height: conHeight}">
      <div v-for="item in listData" v-if="listData.length>0">
        <div class="table-title">{{item[0]}}</div>
        <el-table :data="item[1]"  stripe >
          <el-table-column prop="deployments" label="应用名称" >
          </el-table-column>
          <el-table-column prop="podName" label="容器名称">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.podName" placement="top" effect="dark">
                <div style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.podName}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <!--<el-table-column prop="nickName" label="机房">-->
          <!--</el-table-column>-->
          <el-table-column prop="node" label="Node IP" >
          </el-table-column>
          <el-table-column prop="nodePort" label="NodePort" >
          </el-table-column>
          <el-table-column prop="status" label="STATUS"  width="80px">
          </el-table-column>
          <el-table-column prop="podIP" label="容器IP">
          </el-table-column>
          <el-table-column prop="port" label="服务端口" width="90px">
          </el-table-column>
          <el-table-column prop="domainName" label="域名">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.domainName" placement="top" effect="dark">
                <div style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.domainName}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="operatorName" label="部署人" width="90px">
          </el-table-column>
          <el-table-column label="应用监控"  align="center" width="90px">
            <template slot-scope="scope">
              <div style="text-align: center;">
                <img class="img"  src="../../common/img/icon_look.png" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="listData.length==0" style="text-align: center;color: #bbb;margin-top: 40px;">暂无部署信息</div>
    </div>
  </div>
</template>

<script>
  import { Message } from 'element-ui'
  export default {
    name: "DeployInfo",
    props: ['env','projectId','projectCode','envId','delshow'],
    watch:{
      env(){
        this.listdata = [];
        this.loadData();
      }
    },
    data() {
      return {
        conHeight: '',
        listData: [],
      }
    },
    methods: {
      loadData() {
        let self = this;
        if(!self.env){
          return
        }
        let p = {
          "projectName": self.projectCode,
          "env": self.env
        }
        self.$api.post('k8s/queryServices', p , r => {
          self.listData = Object.entries(r.data);
        },e => {
          Message.error({
            message: e.msg
          })
        })
      },
      handleDel(){
        let self = this;
        this.$confirm('确认删除当前环境', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let p ={
            projectName: self.projectCode,
            env:self.env,
            deployEnvId: self.envId
          };
          self.$api.post('cicd/deleteEnv', p , r => {
            Message.success({
              message: r.msg
            })
            self.$emit("eventDel")
          },e => {
            Message.error({
              message: e.msg
            })
          })
        }).catch(() => {
          Message.info({
            message: '已取消'
          })
        });
      }
    },
    mounted() {
      this.conHeight = (window.innerHeight - 253) + 'px';
    },
    created() {
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
  .table-title{
    line-height: 40px;
    font-size: 14px;
    padding-left: 20px;
    color: #666666;
    font-weight: 600;
    position: relative;
  }
  .container{
    overflow-y: auto;
  }
  .title{
    font-size: 14px;
    color: #666666;
    font-weight: 600;
    line-height: 60px;
    padding-left: 5px;
  }
</style>
