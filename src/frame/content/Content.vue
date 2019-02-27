<template>
  <div style="width: 100%; height: 100%;">
    <div :style="viewH">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    name: "viewContent",
    data() {
      return {
        viewH: ''
      }
    },
    methods: {

    },
    created() {
      this.viewH = {
        height: (window.innerHeight - 120) + 'px',
        paddingLeft: 10 + 'px',
        paddingRight: 10 + 'px',
        paddingBottom: 10 + 'px',
      };
    }
  }
</script>
<style scoped>
</style>
