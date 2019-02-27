<template>
  <div style="width: 100%;height: 100%;min-width: 1200px;">
    <el-container style="width: 100%;height:100%;">
      <el-header style="padding: 0;">
        <Header></Header>
      </el-header>
      <el-container>
        <el-header style="height: 50px;" class="el-route"><span>{{$route.name}}</span></el-header>
        <el-main style="padding: 0;background: #eeecef;width: 100%;height: 100%;">
          <Content></Content>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Header from '../header/Header.vue'
  import Content from '../content/Content.vue'

  export default {
    name: 'viewHome',
    data() {
      return {}
    },
    components: {
      Header,
      Content
    }
  }
</script>
<style scoped>
  .el-route {
    height: 50px;
    line-height: 50px;
    background: rgb(238, 236, 239);
    color: #666;
    font-size: 14px;
  }
  .el-route > span{
    background: url("../../common/img/icon_route.png") no-repeat 0 center;
    background-size: 14px 19px;
    /*background-size: ;*/
    padding-left: 24px;
    display: inline-block;
    margin-left: 20px;
  }
</style>
