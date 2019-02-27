<!--部署详情-->
<template>
  <el-container class="deployment-detail">
    <el-header>
      <el-col :span="18" style="padding-top: 15px;">
        <el-input style="width: 280px;" v-model="searchVal" placeholder="请输入关键字搜索">
        </el-input>
        <img class="btn-search" @click="search" src="../../common/img/icon_search.png" alt="">
      </el-col>
    </el-header>
    <!--表格-->
    <el-main>
      <el-table :data="listData"  stripe >
        <el-table-column prop="id" label="ID" width="80px">
        </el-table-column>
        <el-table-column prop="templateName" label="应用名称" >
        </el-table-column>
        <el-table-column prop="templateType" label="应用类型">
        </el-table-column>
        <el-table-column prop="createUser" label="创建者">
        </el-table-column>
        <el-table-column prop="projectName" label="项目组" width="100px">
        </el-table-column>
        <el-table-column prop="selector" label="部署环境" width="240px" align="center">
        </el-table-column>
        <el-table-column prop="nodeIp" label="NodeIP">
        </el-table-column>
        <el-table-column prop="node" label="IP">
        </el-table-column>
        <el-table-column prop="createTime" :formatter="dateFormat" label="更新时间"
                         width="180px" align="center">
        </el-table-column>
        <el-table-column label="操作"  width="150px" align="center">
          <template slot-scope="scope">
            <div style="text-align: center;">
              <el-tooltip content="编辑" placement="top" effect="dark">
                <img class="img" @click.stop="handleEdit(scope.row)"
                     src="../../common/img/icon_edit_s.png" />
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

    <el-dialog  title="部署更新" :visible.sync="popVisible" width="580px" left>
      <div>
        <el-input type="textarea"
                  v-model="content"
                  placeholder="请输入内容..."
                  :autosize="{ minRows: 15,maxRows: 15}"></el-input>
        <div style="text-align: center;margin-top: 20px;">
          <el-button class="submitStyle" style="margin-right: 10px;" type="primary" @click="updataContent">更新</el-button>
          <el-button class="cancelStyle" @click="cancle">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
  import { Message } from 'element-ui'
  export default {
    name: "DeploymentDetail",
    components: {
    },
    data() {
      return {
        deployDetailId: '',
        popVisible: false,
        searchVal: '',
        listData: [],
        currentPage: 1,
        pageRows: 10,
        pageTotal: 0,
        popVisible: false,
        currentRow: null,
        appConfig: {
        },
        appName: '',
        options: [],
        content:''
      }
    },
    computed: {
    },
    watch:{
    },
    methods: {
      search() {
      },
      cancle() {
        this.popVisible = false;
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
        this.currentRow = row;
        this.popVisible = true;
        var self = this;
        var p = {
          deployInstanceId: row.id
        }
        self.$api.post('app/deploy/findDeploySpecific', p, r => {
          if(r.data){
            self.content = r.data;
          }
        }, e => {
          Message.error({
            message: e.msg
          })
        })
      },
      updataContent(){
        var self = this;
        var p = {
          deployInstanceId: self.currentRow.id,
          specific: self.content,
        }
        self.$api.post('app/deploy/replaceDeploySpecific', p, r => {
          Message.success({
            message: r.msg
          })
          this.popVisible = false;
        }, e => {
          Message.error({
            message: e.msg
          })
        })
      },
      loadData(){
        var self = this;
        var p = {
          id: this.deployDetailId,
          pageNo: this.currentPage,
          pageSize: this.pageRows
        }
        self.$api.post('app/deploy/findDeployByPage', p, r => {
          this.pageTotal = r.data.total;
          this.listData = r.data.rows;
        }, e => {
          Message.error({
            message: e.msg
          })
        })
      }
    },
    created() {
      this.deployDetailId= this.$api.sGetObject('_deployDetailId');
      this.loadData();
    },
    mounted() {
    }
  }
</script>

<style scoped>
  .deployment-detail{
    background: #FFFFFF;
    height: 100%;
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
    width: 16px;
    height: 16px;
    padding: 5px;
    cursor: pointer
  }
  .ml-10{
    margin-left: 10px;
  }
  .footerDiv {
    height: 40px;
    margin-top: 20px;
    position: relative;
  }
</style>
