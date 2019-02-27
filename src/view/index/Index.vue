<template>
  <div style="width: 100%; height: 100%;">
    <el-container style="height: 100%;">
      <el-aside width="200px" class="model" style="position: relative;overflow: auto">
        <div class="nav-item"
             :class="{'nav-item-active': currentNav == index}"
             v-for="(item, index) in cicdList"
             :key="index"
             @click="navChange(index,item)">{{item.projectName}}
        </div>
      </el-aside>
      <el-main style="margin-left: 12px; padding: 0;">
        <div class="d-box v-box">
          <div class="d-flex1 model" style="margin-bottom:12px;">
            <div class="d-box v-box">
              <div class="info-header service-info">环境信息</div>
              <div class="service-li"><span>环境</span><span>服务器数</span>
                <span>CPUS</span><span>CPUS(已使用)</span><span>内存</span><span>内存(已使用)</span></div>
              <div class="d-flex1">
                <div style="position: absolute; width: 100%; height: 100%; overflow: auto;">
                  <div v-for="(envx,index) in listData" class="service-li" @click="changeObj(index)"
                       :class="envx.select == true?'service-select':''"
                       style='cursor: pointer;'>
                    <span>{{envx.envName}}</span>
                    <span>{{envx.serverNum}}</span>
                    <span>{{envx.cpuCapacity != null ? envx.cpuCapacity + '核' : 0}}</span>
                    <span>{{envx.cpuUsageRate != null ? envx.cpuUsageRate/1000.0 + '核' : 0}}</span>
                    <span>{{envx.memoryCapacity != null ? envx.memoryCapacity: 0}}</span>
                    <span>{{envx.memoryRequests != null ? envx.memoryRequests: 0}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex1">
            <div class="d-box">
              <div class="d-flex1 model">
                <div class="d-box v-box">
                  <div class="info-header service-use">CPU统计图</div>
                  <div class="d-flex1">
                    <pie id='chart1'
                         name='CPU统计'
                         :option='option1'>
                    </pie>
                  </div>
                </div>
              </div>
              <div class="d-flex1 model" style="margin-left: 10px;">
                <div class="d-box v-box">
                  <div class="info-header service-use">内存统计图</div>
                  <div class="d-flex1">
                    <pie id='chart2'
                         name='内存统计'
                         :option='option2'>
                    </pie>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import {Message} from 'element-ui'
  import Pie from './../echart/pie';

  export default {
    data() {
      return {
        currentNav: 0,
        projectId: '',
        cicdList: [],
        projectStyle: {},
        navList: [],
        listData: [],
        envx: '',
        cpu: '',
        cpuU: '',
        cpuF: '',
        cpuR: '',
        memoryU: '',
        memoryF: '',
        option1: {},
        option2: {},
      }
    },
    components: {
      Pie
    },
    methods: {
      navChange(index, item) {
        if (this.currentNav == index) {
          return;
        }
        this.currentNav = index;
        this.projectId = item.projectId;
        this.loadData();
      },
      loadList() {
        var self = this;
        self.$api.post('cicd/getProjectListByUserId', {}, r => {
          console.log(r.data);
          if (r.data && r.data.length>0) {
            self.cicdList = r.data;
            self.projectId = r.data[0].projectId;
            this.loadData();
          }
        })
      },
      loadData() {
        var self = this;
        var p = {
          "projectId": self.projectId
        }
        self.$api.post('k8s/queryNods', p, r => {
          this.listData = r.data;
          console.log(this.listData);
          for (var i in this.listData) {
            this.listData[i].select = false
          }
          this.listData[0].select = true;

          this.cpu = this.listData[0].cpuCapacity != null ? this.listData[0].cpuCapacity * 1000 : 0;
          this.cpuU = this.listData[0].cpuUsageRate;
          this.cpuF = this.cpu - this.listData[0].cpuUsageRate;
          this.memoryU = this.listData[0].memoryUse != null ? this.listData[0].memoryUse : 0;
          this.memoryF = this.listData[0].memoryUnUse != null ? this.listData[0].memoryUnUse : 100;
          this.option1 = {
            series: [
              {value: this.cpuU, name: 'CPU使用'},
              {value: this.cpuF, name: 'CPU空闲'}
            ]
          }
          this.option2 = {
            series: [
              {value: this.memoryU, name: '内存使用'},
              {value: this.memoryF, name: '内存空闲'}
            ]
          }
        }, e => {
          Message.error({
            message: e.msg
          })
        })
      },
      changeObj(index) {
        for (var i in this.listData) {
          this.listData[i].select = false
        }
        this.listData[index].select = true;
        this.cpu = this.listData[index].cpuCapacity != null ? this.listData[index].cpuCapacity * 1000 : 0;
        this.cpuU = this.listData[index].cpuUsageRate != null ? this.listData[index].cpuUsageRate : 0;
        this.cpuF = this.cpu == 0 ? 100 : this.cpu - this.listData[index].cpuUsageRate;
        this.memoryU = this.listData[index].memoryUse != null ? this.listData[index].memoryUse : 0;
        this.memoryF = this.listData[index].memoryUnUse != null ? this.listData[index].memoryUnUse : 100;
        this.option1 = {
          series: [
            {value: this.cpuU, name: 'CPU使用'},
            {value: this.cpuF, name: 'CPU空闲'}
          ]
        }
        this.option2 = {
          series: [
            {value: this.memoryU, name: '内存使用'},
            {value: this.memoryF, name: '内存空闲'}
          ]
        }
      }
    },
    created: function () {
      this.loadList();
    }
  }
</script>
<style scoped>
  .d-box {
    display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
    display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
    display: -webkit-flex; /* NEW - Chrome */
    display: -ms-flexbox; /* TWEENER - IE 10 */
    display: box;
    display: flexbox;
    display: flex; /* NEW, Spec - Opera 12.1, Firefox 20+ */
    height: 100%;
    width: 100%;
  }

  .v-box {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -moz-box-orient: vertical;
    -moz-box-direction: normal;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
  }

  .d-flex1 {
    -webkit-box-flex: 1;
    -moz-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    position: relative;
  }

  .model {
    border-radius: 8px;
    -webkit-border-radius: 8px;
    overflow: hidden;
    background: #fff;
    box-shadow: 2px 2px 10px #ccc;
  }

  .info-header {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: 18px;
  }

  .service-info {
    background: -webkit-linear-gradient(left, #6D80FE, #23D2FD); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #6D80FE, #23D2FD); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #6D80FE, #23D2FD); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #6D80FE, #23D2FD); /* 标准的语法 */
  }

  .service-use {
    background: -webkit-linear-gradient(left, #0AAFE9, #6BF2B6); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #0AAFE9, #6BF2B6); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #0AAFE9, #6BF2B6); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #0AAFE9, #6BF2B6); /* 标准的语法 */
  }

  .service-li {
    width: 98%;
    margin: 0 auto;
    height: 50px;
    line-height: 50px;
    color: #666;
    font-size: 16px;
    border-bottom: 1px solid #c1c1c1;
  }

  .service-li span {
    width: 16%;
    height: 100%;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
  }

  .service-select {
    background: #f5f5f5;
    /*border-bottom: none;*/
  }

  /*nav-s*/
  .nav-item {
    cursor: pointer;
    line-height: 60px;
    border-bottom: 1px solid #E6E8F1;
    color: #666666;
    box-sizing: border-box;
    padding: 0 20px;
    position: relative;
    background: url("../../common/img/icon_check.png") no-repeat 170px center;
  }

  .nav-item-active {
    background: url("../../common/img/icon_check_active.png") no-repeat 170px center #F8F9FE;
  }

  .nav-item-active:before {
    position: absolute;
    content: '';
    width: 4px;
    height: 100%;
    left: 0;
    background: #67A0FF;
  }

  /*----*/
  .el-aside {
    background-color: #FFFFFF;
    color: #666666;
    font-size: 16px;
    /*border-radius: 4px;*/
  }
</style>
