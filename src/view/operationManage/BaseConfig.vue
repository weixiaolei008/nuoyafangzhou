<!--运维管理-基础配置-->
<template>
  <el-container class="base-config">
    <el-aside width="190px">
      <div class="nav-item"
           :class="{'nav-item-active': currentNav == index}"
           v-for="(item, index) in navList"
           @click="navChange(index,item)"
      >{{item[2]}}</div>
    </el-aside>
    <el-main>
      <div class="add-item">
        <span style="font-size: 18px;color: #999999;margin-left: 20px;">{{currentName}}</span>
        <!--<span class="btn-add" @click="addItem">+ 添加</span>-->
      </div>
      <!--表格-->
      <el-table :data="listData"  stripe >
        <el-table-column :prop="item.val" :label="item.name" v-for="(item,index) in keys" :key="index">
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <div style="text-align: center;">
              <img class="img"  @click="handleEdit(scope.$index, scope.row)" src="../../common/img/icon_edit.png" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--<div class="footerDiv">-->
        <!--<el-pagination style="text-align: center;padding: 6px 0px;"-->
                       <!--@size-change="handleSizeChange"-->
                       <!--@current-change="handleCurrentChange"-->
                       <!--:current-page.sync="currentPage"-->
                       <!--:page-sizes="[20,50,100]"-->
                       <!--:page-size="pageRows"-->
                       <!--layout="total,sizes, prev,pager, next,jumper"-->
                       <!--:total="pageTotal">-->
        <!--</el-pagination>-->
      <!--</div>-->
    </el-main>
    <el-dialog  title="添加编译工具" :visible.sync="popVisible" width="580px">
      <el-form :model="compileToolConfig" :label-width="formLabelWidth">
        <el-form-item label="工具名称：" >
          <el-radio-group v-model="compileToolConfig.type">
            <el-radio :label="0">maven</el-radio>
            <el-radio :label="1">gradle</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Name：" >
          <el-input v-model="compileToolConfig.name" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="MAVEN_HOME：">
          <el-input v-model="compileToolConfig.path" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="popVisible = false" >取消</el-button>
        <el-button @click="" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
  import { Message } from 'element-ui'
    export default {
      name: "BaseConfig",
      components: {
      },
      data() {
        return {
          typeCode: '',
          formLabelWidth: '130px',
          currentNav: 0,
          currentName: '编译工具',
          popVisible: false,
          navList: [],
          listData: [],
          compileToolConfig: {
            type: 0,
            name: '',
            path: ''
          }
        }
      },
      computed: {
        keys(){
          let keys;
          switch (this.currentNav) {
            case 0:
              keys = [{
                name: '工具名称',
                val: 'configKey',
              },{
                name: 'Name',
                val: 'configName',
              },{
                name: 'MAVEN_HOME',
                val: 'configValue',
              }]
              break;
            case 1:
              keys = [{
                name: '语言名称',
                val: 'configKey',
              },{
                name: '别名',
                val: 'configName',
              },{
                name: 'JAVA_HOME',
                val: 'configValue',
              }]
              break;
            case 2:
              keys = [{
                name: '工具名称',
                val: 'configKey',
              },{
                name: '代码仓库',
                val: 'configName',
              },{
                name: '用户名',
                val: 'configValue',
              }]
              break;
            case 3:
              keys = [{
                name: '工具名称',
                val: 'configKey',
              },{
                name: 'Name',
                val: 'configName',
              },{
                name: 'ANSIBLE_HOME',
                val: 'configValue',
              }]
              break;
            case 4:
              keys = [{
                name: '工具名称',
                val: 'configKey',
              },{
                name: '仓库地址',
                val: 'configName',
              },{
                name: '用户名',
                val: 'configValue',
              }]
              break;
            case 5:
              keys = [{
                name: '工具名称',
                val: 'configKey',
              },{
                name: '邮箱地址',
                val: 'configName',
              },{
                name: 'STMP服务器地址',
                val: 'configValue',
              },{
                name: 'STMP服务器端口',
                val: 'port',
              }]
              break;
          }
          return keys;
        }
      },
      watch:{
        typeCode(){
          this.loadList();
        }
      },
      methods: {
        navChange(index, item){
          this.currentNav = index;
          this.currentName = item[2];
          this.typeCode = item[1];
        },
        addItem(){
          this.popVisible = true;
        },
        handleEdit(index, row){
        },
        loadData(){
          var self = this;
          self.$api.post('configure/typeNameList', {}, r => {
            self.typeCode = r.data[0][1];
            self.navList = r.data;
            // self.loadList();
          },e => {
            Message.error({
              message: e.msg
            })
          })
        },
        loadList(){
          var self = this;
          self.$api.post('configure/typeCodeList?typeCode=' + self.typeCode, {}, r => {
            self.listData = r.data;
          },e => {
            Message.error({
              message: e.msg
            })
          })
        },
      },
      created() {
        this.loadData();
      },
      mounted() {
      }
    }
</script>

<style scoped>
  .base-config{
    height: 100%;
  }
  /*nav-s*/
  .nav-item{
    cursor: pointer;
    line-height: 60px;
    border-bottom: 1px solid #E6E8F1;
    color: #666666;
    box-sizing: border-box;
    padding: 0 20px 0 30px;
    position: relative;
    background: url("../../common/img/icon_check.png") no-repeat 150px center;
  }
  .nav-item-active{
    background: url("../../common/img/icon_check_active.png") no-repeat 150px center #F8F9FE;
  }
  .nav-item-active:before{
    position: absolute;
    content: '';
    width: 4px;
    height: 100%;
    left: 0;
    background: #67A0FF;
  }
  /*----*/
  .add-item{
    position: relative;
    line-height: 50px;
    background: #F8F9FE;
    margin-bottom: 20px;
  }
  .btn-add{
    position: absolute;
    cursor: pointer;
    display: inline-block;
    width: 100px;
    text-align: center;
    font-weight: bold;
    right: 0;
    font-size: 18px;
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
    padding: 20px;
    background-color: #FFFFFF;
    color: #999999;
  }
</style>
