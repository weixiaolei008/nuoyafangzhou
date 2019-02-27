<template>
  <div>
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#393B6A"
      text-color="#fff"
      :router="true"
      :default-active="activeMenu"
      active-text-color="#fff">
      <el-menu-item index="/pageIndex" route="/pageIndex" class="menu-bg">主页</el-menu-item>
      <el-submenu :index="items.id" :key="items.id" class="menu-bg" style="padding-left: 1px;" v-for="items in menu">
        <template slot="title">
          <span>{{items.desc}}</span>
        </template>
        <el-menu-item v-for="item in items.children" :index="item.url" :key="item.url" style="height: 50px; line-height: 50px;">
          <div v-if="item.url != '/opsImage'">{{item.desc}}</div>
          <div v-if="item.url == '/opsImage'"><a style="color: #fff; width: 100%; height: 100%; display: inline-block" href="https://harbor.anji-allways.com/harbor/sign-in?redirect_url=/harbor/projects" target="_blank">{{item.desc}}</a></div>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
  import api from '../../common/js/index'

  export default {
    data() {
      return {
        menu: [],
				user:{}
      }
    },
    computed: {
      activeMenu() {
        return this.$route.path;
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      getMenu() {
        let self = this;
        this.$api.post('index', {}, r => {
            self.menu = r.data.menuTree;
						self.user.permissionList = r.data.permissionList
						self.$api.sSetObject("_user",self.user)
          }
        )
      }
    },
    created: function () {
			this.user = api.sGetObject("_user")
      this.getMenu();
    }
  }
</script>

<style scoped>
  .el-menu {
    /*border:0;*/
  }

  .menu-bg {
    background: url("../../common/img/icon_head.png") no-repeat 0 center;
    background-size: 1px 30%;
    min-width: 120px;
    text-align: center;
  }
</style>
