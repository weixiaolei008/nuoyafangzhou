<!--新建应用-->
<template>
  <el-container class="new-app" style="width: 100%;">
    <el-form :model="appConfig" label-width="130px">
      <el-form-item label="应用名称：" >
        <el-input v-model="appConfig.templateName" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="模板类型：" >
        <el-input v-model="appConfig.templateType" placeholder="请输入模板类型(如 mysql,mq,nginx)"></el-input>
      </el-form-item>
      <el-form-item label="应用场景：" >
        <el-input v-model="appConfig.templateAppSce" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="编排内容：">
        <!--<el-input type="file" v-model="appConfig.path" style="width: 300px;"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="">-->
        <el-input type="textarea"
                  v-model="appConfig.content"
                  placeholder="请输入内容..."
                  :autosize="{ minRows: 15,maxRows: 15}"></el-input>
      </el-form-item>
    </el-form>
    <el-footer style="margin-top: 20px;text-align: center;">
      <el-button @click="cancle" >取消</el-button>
      <el-button @click="saveApp" type="primary">确定</el-button>
    </el-footer>
  </el-container>
</template>

<script>
  import { Message } from 'element-ui'
    export default {
      name: "NewMiddleware",
      data() {
        return {
          updateStatus: false,//是否是更新
          appConfigEditId: '',
          formKeys : [],
          appId: '',
          successMsg: '新增成功',
          appConfig: {
            templateName: '',
            templateType: '',
            templateAppSce: '',
            content: ''
          },
          config: {
            initialFrameWidth: null,
            initialFrameHeight: 350
          }
        }
      },
      computed: {
      },
      watch:{
      },
      methods: {
        cancle() {
          this.$router.push("/opsMdware");
        },
        loadData(id){
          var self = this;
          let p ={};
          self.$api.post('app/template/findTemplateById?id=' + id, p, r => {
            for (let k of this.formKeys){
              this.appConfig[k] = r.data[k];
            }
            self.appId = r.data.id;
          }, e => {
            Message.error({
              message: e.msg
            })
          })
        },
        saveApp(){
          var self = this;
          let len = self.formKeys.length;
          let msgs = ['请输入应用名称', '请选择模板类型', '请编写内容']
          for(let i = 0; i < len; i++){
            if(!self.appConfig[self.formKeys[i]]){
              Message.error({
                message: msgs[i]
              })
              return;
            }
          }
          let urls = ['app/template/addTemplate', 'app/template/updateTemplate']
          let url;
          let p;
          if(this.updateStatus){
            url = urls[1];
            p = {
              id: self.appConfigEditId,
              templateName: self.appConfig.templateName,
              templateType: self.appConfig.templateType,
              templateAppSce: self.appConfig.templateAppSce,
              content: self.appConfig.content
            }
          }else {
            url = urls[0];
            p = {
              templateName: self.appConfig.templateName,
              templateType: self.appConfig.templateType,
              templateAppSce: self.appConfig.templateAppSce,
              content: self.appConfig.content
            }
          }
          self.$api.post(url, p, r => {
            Message.success({
              message: self.successMsg
            })
            this.$router.push("/opsMdware");
          }, e => {
            Message.error({
              message: e.msg
            })
          })
        },
      },
      created() {
        this.formKeys = Object.keys(this.appConfig);
        this.appConfigEditId= this.$api.sGetObject('_appConfigEditId');
        if(this.appConfigEditId){
          this.loadData(this.appConfigEditId);
          this.updateStatus = true;
          this.successMsg = '修改成功';
        }
      },
      mounted() {
      },
      beforeDestroy() {
        sessionStorage.removeItem('_appConfigEditId')
      }
    }
</script>

<style scoped>
  .new-app{
    width: 100%;
    background: #FFFFFF;
    height: 100%;
    padding: 25px 25px 30px;
  }
</style>
