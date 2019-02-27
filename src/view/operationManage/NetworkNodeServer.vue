<!--服务器节点-->
<template>
  <el-container class="server-node">
    <el-header >
      <el-row style="padding-top: 15px;">
        <el-col :span="18">
          <span style="margin-right: 20px;">环境</span>
          <el-select v-model="envName" placeholder="请选择部署环境"
                     @change="loadEnvList">
            <el-option
              v-for="(k,v) in envList"
              :key="v"
              :label="k"
              :value="v">
            </el-option>
          </el-select>
          <span style="margin-right: 20px;">项目</span>
          <el-select v-model="proName" placeholder="请选择项目" @change="loadProList">
            <el-option
              v-for="item in proList"
              :key="item.projectCode"
              :label="item.projectName"
              :value="item.projectCode">
            </el-option>
          </el-select>
          <span style="margin-right: 20px;">ip</span>
          <el-input style="width: 180px;margin-left: 10px;" v-model="nodeNameVal" placeholder="请输入节点名称搜索">
          </el-input>
          <el-input style="width: 180px;margin-left: 10px;" v-model="ipVal" placeholder="请输入ip搜索">
          </el-input>
        </el-col>
        <img class="btn-search" @click="search" src="../../common/img/icon_search.png" alt="">
      </el-row>
    </el-header>
    <!--表格-->
    <el-main>
      <el-table :data="listData" width="100%">
        <el-table-column prop="env" label="部署环境" align="center"  width="80px;">
        </el-table-column>
        <el-table-column prop="name" label="名称" align="center" width="120px;" >
        </el-table-column>
        <el-table-column prop="hostNameAddress" label="IP" width="120px" align="center" >
        </el-table-column>
        <el-table-column prop="cidr" label="容器组" width="120px" align="center">
        </el-table-column>
        <el-table-column prop="capacityCpu" label="CPU" align="center" width="100px">
        </el-table-column>
        <el-table-column prop="capacityMemory" label="内存" align="center" width="100px">
        </el-table-column>
        <el-table-column prop="allocatableMemory" label="硬盘总使用量" align="center" width="100px">
        </el-table-column>
        <!--<el-table-column prop="osVersion" label="os版本" align="center">
        </el-table-column>
        <el-table-column prop="kubeVersion" label="kube版本" align="center">
        </el-table-column>
        <el-table-column prop="createTime" :formatter="dateFormat" label="更新时间" width="160px" align="center">
        </el-table-column>-->
        <el-table-column label="标签" align="center" >
          <template slot-scope="scope">
            <el-table :data="scope.row.labels" :show-header="false">
              <el-table-column prop="env" label="env" align="center" v-if="1==2">
              </el-table-column>
              <el-table-column prop="node" label="node" align="center" v-if="1==2">
              </el-table-column>
              <el-table-column prop="key" label="key" align="center">
              </el-table-column>
              <el-table-column prop="value" label="value" align="center">
              </el-table-column>
              <el-table-column   width="120px;">
                <template slot-scope="scope">
                  <div style="text-align: center;">
                    <el-tooltip content="修改" placement="top" effect="dark">
                      <img class="img ml-10" @click.stop="handleEdit(scope.row,1)"
                           src="../../common/img/icon_lock.png" />
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top" effect="dark">
                      <img class="img ml-10" @click.stop="handleDel(scope.row)"
                           src="../../common/img/icon_delete.png" />
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="标签操作"  align="center" width="80px">
          <template slot-scope="scope">
            <div style="text-align: center;">
              <el-tooltip content="添加" placement="top" effect="dark">
                <img class="img" @click.stop="handleEdit(scope.row,0)" src="../../common/img/icon_edit_s.png" />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!--分页-->
    <el-footer class="footerDiv">
      <el-pagination style="text-align: center;padding: 6px 0px;" v-show="false"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page.sync="currentPage"
                     :page-sizes="[20,50,100]"
                     :page-size="pageRows"
                     layout="total,sizes, prev,pager, next,jumper"
                     :total="pageTotal">
      </el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
  import { Message } from 'element-ui'
  // import editor from '../components/Editor'
  export default {
    name: "NetworkNodeServer",
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
        nodeNameVal: '',
        ipVal: '',
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
        envName: '',
        proName: '',
        envList: [],
        proList: [],
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
      spanMethod({row,col,rowIdx,colIdx}){
        if(colIdx == 5){
          return {
            rowSpan:1, colSpan:1
          }
        }
        return {
          rowSpan:1, colSpan:1
        }
      },
      loadIdList() {
        var self = this;
        var p = {};
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
        var p = {};
        self.$api.post('/serverNode/queryEnv', p, r => {
          self.envList = r.data;
        }, e => {
          Message.error({
            message: e.msg
          })
        })
      },
      loadProList() {
        var self = this;
        var p = {};
        self.$api.post('/cicd/getProjectList', p, r => {
          self.proList = r.data;
        }, e => {
          Message.error({
            message: e.msg
          })
        })
      },
      search() {
        this.loadData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loadData();
      },
      handleSizeChange(val) {
        this.pageRows = val;
        this.loadData();
      },
      handleEdit(row,flag) {
        this.$api.sSetObject('_nodeEditObj',row);
        this.$api.sSetObject("_editFlag",flag);
        this.$router.push("/EditNodeLabel");
      },
      handleDeploy(row) {
        this.popVisible = true;
        this.currentRow = row;
        for (let k of this.formKeys){
          this.formData[k] = '';
        }
      },
     handleDel(row){
       var self = this;
       this.$confirm('确认删除', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(() => {
         var p = {
           env: row.env,
           nodeName: row.node,
           key: row.key
         }
         self.$api.post('serverNode/delLabel', p, r => {
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

      },
      loadData(){
        var self = this;
        var p = {
          "pageNo": this.currentPage,
          "pageSize": this.pageRows,
          "env":this.envName,
          "projectCode":this.proName
        }
        self.$api.post('/serverNode/queryNods',p, r => {
          //serverNode/findServerNodeByPage
          //  this.pageTotal = r.data.total;
          this.listData = r.data.data;
        }, e => {
          Message.error({
            message: e.msg
          })
        })
      },
      creatApp(){
//        this.$router.push("/add");
      }
    },
    created() {
      this.formKeys = Object.keys(this.formData);
      this.envName = "dev";
      this.loadData();
      this.loadIdList();
      this.loadEnvList();
      this.loadProList();
    },
    mounted() {
    }
  }
</script>

<style scoped>
  .server-node{
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
