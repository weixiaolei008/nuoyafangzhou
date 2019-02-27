<!--运维管理-资源审核-->
<template>
  <el-container class="resource-audit">
    <!--<div style="margin-bottom: 20px;">-->
        <!--<el-input style="width: 280px;" v-model="searchVal" placeholder="请输入关键字搜索">-->
        <!--</el-input>-->
        <!--<img class="btn-search" @click="search" src="../../common/img/icon_search.png" alt="">-->
    <!--</div>-->
    <!--表格-->
    <el-main>
      <el-table :data="listData"  stripe >
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
        <el-table-column prop="servers" label="服务器数"  align="center">
        </el-table-column>
        <el-table-column prop="image" label="OS">
        </el-table-column>
        <el-table-column prop="nickName" label="申请人">
        </el-table-column>
        <el-table-column prop="note" label="审核意见" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column prop="createTime" :formatter="dateFormat" label="申请时间" width="180px" align="center">
        </el-table-column>
        <el-table-column label="操作"  align="center" width="120px">
          <template slot-scope="scope">
            <div style="text-align: center;" v-if="scope.row.state == 1">
              <el-tooltip content="通过" placement="top" effect="light">
                <img class="img" @click="handleAccess(scope.row)" src="../../common/img/icon_arrow_double.png" />
              </el-tooltip>
              <el-tooltip content="拒绝" placement="top" effect="dark">
                <img class="img ml-15" @click="handleRefuse(scope.row)" src="../../common/img/icon_arrow_back.png" />
              </el-tooltip>
            </div>
            <div style="text-align: center;color: #4AFF40;" v-if="scope.row.state == 2">已通过</div>
            <div style="text-align: center;color: red;" v-if="scope.row.state == 0">不通过</div>
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
    <el-dialog  title="审核-资源申请" :visible.sync="popVisible" width="580px" left>
      <div>
        <el-input
          type="textarea"
          :rows="6"
          placeholder="请输入审核不通过意见"
          v-model="note"
          style="margin-top: 20px;
margin-bottom: 30px;">
        </el-input>
        <div style="text-align: center;">
          <el-button class="submitStyle" style="margin-right: 10px;" type="primary" @click="onSubmit">确定</el-button>
          <el-button class="cancelStyle" @click="cancle">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
    export default {
      name: "ResourceAudit",
      components: {
      },
      data() {
        return {
          popVisible: false,
          note: '',
          searchVal: '',
          listData: [],
          currentPage: 1,
          pageRows: 10,
          pageTotal: 0,
          refuseRow: null
        }
      },
      computed: {
      },
      methods: {
        onSubmit(){
          this.audit(this.refuseRow, 0)
        },
        cancle() {
          this.popVisible = false;
          this.note = '';
        },
        search() {
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.loadData();
        },
        handleSizeChange(val) {
          this.pageRows = val;
          this.loadData();
        },
        loadData(){
          var self = this;
          var p = {
            "pageNo": this.currentPage,
            "pageSize": this.pageRows
          }
          self.$api.post('OperationManagement/getDeployRequirementList', p, r => {
            this.pageTotal = r.data.total;
            this.listData = r.data.rows;
          })
        },
        handleAccess(row){
          let self = this;
          this.$confirm('通过审核', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'success'
          }).then(() => {
            self.audit(row, 2)
          }).catch(() => {
          })
        },
        handleRefuse(row){
          this.popVisible = true;
          this.refuseRow = row;
          // let self = this;
          // this.$confirm('拒绝审核', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   type: 'error'
          // }).then(() => {
          //
          // }).catch(() => {
          // })
        },
        audit(row, state){
          var self = this;
          var p = {
            drId: row.drId,
            drdId: row.drdId,
            projectId: row.projectId,
            env: row.env,
            state: state,
            note: self.note || ''
          }
          console.log(p);
          self.$api.post('OperationManagement/saveDeployRequirementAudit', p, r => {
            this.$message({
              message: '审核成功',
              type: 'success'
            });
            this.loadData();
            this.popVisible = false;
          })
        }
      },
      created() {
        this.loadData();
      },
      mounted() {
      }
    }
</script>

<style >
  .resource-audit{
    background: #FFFFFF;
    height: 100%;
  }
  .btn-search{
    width: 20px;
    height: 20px;
    border: 10px solid transparent;
    vertical-align: middle;
    position: relative;
    left: -45px;
    cursor: pointer;
  }
  .img {
    width: 16px;
    height: 16px;
    padding: 7px 2px;
    cursor: pointer;
    vertical-align: top;
  }
/*  .ml-15{
    margin-left: 10px;
  } */
  .footerDiv {
    height: 40px;
    margin-top: 20px;
    position: relative;
  }
</style>
