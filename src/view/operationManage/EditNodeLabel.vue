<!--新建应用-->
<template>
  <el-container class="new-app" style="width: 100%;">
    <el-form :model="appConfig" label-width="130px">
      <el-form-item label="节点名称：" >
        <el-input v-model="appConfig.nodeName" placeholder="节点名称" :contenteditable="false"></el-input>
      </el-form-item>
      <el-form-item label="标签key：" >
        <el-input v-model="appConfig.key" placeholder="请输入标签key"></el-input>
      </el-form-item>
      <el-form-item label="标签value：" >
        <el-input v-model="appConfig.value" placeholder="请输入标签value"></el-input>
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
      name: "EditNodeLabel",
      data() {
        return {
          updateStatus: false,//是否是更新
          appConfigEditId: '',
          formKeys : [],
          appId: '',
          successMsg: '维护成功',
          appConfig: {
            nodeName: '',
            key: '',
            value: '',
            env:''
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
          this.$router.push("/serverNode");
        },
        loadData(id){
          /*var self = this;
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
          })*/
        },
        saveApp(){
          var self = this;
          let len = self.formKeys.length;
          let msgs = ['请输入节点名称', '请输入标签Key', '请输入标签value']
          for(let i = 0; i < len; i++){
            if(!self.appConfig[self.formKeys[i]]){
              Message.error({
                message: msgs[i]
              })
              return;
            }
          }
          let urls = ['serverNode/addLabel', 'serverNode/updateLabel']
          let url;
          let p;
          p = {
            nodeName: self.appConfig.nodeName,
            key: self.appConfig.key,
            value: self.appConfig.value,
            env: self.appConfig.env
          }
          if(this.updateStatus){
            url = urls[0];
            //p.nodeName = self.appConfigEditId
          }else {
            url = urls[0];
          }
          //url = url.concat("?")+JSON.stringify(p);
          self.$api.post(url, p, r => {
            Message.success({
              message: self.successMsg
            })
            this.$router.push("/serverNode");
          }, e => {
            Message.error({
              message: e.msg
            })
          })
        },
      },
      created() {
        this.formKeys = Object.keys(this.appConfig);
        let obj = this.$api.sGetObject("_nodeEditObj");
        this.appConfigEditId= obj.name;
        this.appConfig.nodeName = obj.name;
        this.appConfig.env = obj.env;
        let flag = this.$api.sGetObject("_editFlag");
        if(flag>0){
          //this.loadData(this.appConfigEditId);
          this.appConfig.nodeName = obj.node;
          this.appConfig.key = obj.key;
          this.appConfig.value = obj.value;
          this.updateStatus = true;
          this.successMsg = '维护成功';
        }
      },
      mounted() {
      },
      beforeDestroy() {
        sessionStorage.removeItem('_nodeEditObj')
        sessionStorage.removeItem('_editFlag')
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
