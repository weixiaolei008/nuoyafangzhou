<template>
  <div style="width: 100%; height: 100%; position: relative;" id="index">
    <div style="width: 100%; height: 100%; position: absolute; overflow: auto;" class="clearfix">
      <div class="project model" :style="projectStyle" v-for="items in cicdList" @click="toCicd(items)">
        <div class="d-box v-box">
          <div class="info-header project-info">{{items.projectCode}}</div>
          <div class="d-flex1">
            <div style="position: absolute; width: 100%; height: 100%; overflow: auto;">
              <div class="project-li" v-for="item in items.units">{{item.unitName}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="project model" :style="projectStyle" @click="jump">
        <div class="d-box v-box">
          <div class="info-header add-info" >新增</div>
          <div class="d-flex1">
            <div class="project-add"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  export default {
    name: "Devops",
    components: {},
    data() {
      return {
        projectStyle: {},
        cicdList: []
      }
    },
    mounted() {
      let w = document.getElementById("index").clientWidth;
      let h = document.getElementById("index").clientHeight;
      this.projectStyle = {
        width: (w - 60) / 5 + 'px',
        height: (h - 30) / 2 + 'px'
      }
    },
    methods: {
      toCicd(item){
        this.$api.sSetObject("_cicd",item);
        this.$router.push("/devops");
      },
      loadData(){
        var self = this;
        self.$api.post('cicd/getProjectListByUserId', {}, r => {
          self.cicdList = r.data;
        })
      },
			jump(){
				this.$router.push("/newProiect");
			}
    },
    created() {
      this.loadData();
      sessionStorage.removeItem('_env');
      sessionStorage.removeItem('_navStatus');
      sessionStorage.removeItem('_currentEnv');
      sessionStorage.removeItem('_deployUnitId');
      sessionStorage.removeItem('_deployUnitCode');
      sessionStorage.removeItem('_optionsBranch');
      sessionStorage.removeItem('_envList');
    },
    beforeDestroy(){

    }
  }
</script>

<style scoped>
  .clearfix:after {
    content: ".";
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
    font-size: 0;
  }

  * html.clearfix {
    zoom: 1;
  }

  /* IE6 */
  * + html.clearfix {
    zoom: 1;
  }

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

  .project {
    position: relative;
    float: left;
    background: #fff;
    margin-bottom: 12px;
    margin-right: 10px;
    cursor: pointer;
  }

  /*.project:nth-child(odd) {*/
  /*margin-right: 12px;*/
  /*}*/

  /*.project:last-child, .project:nth-last-child(2) {*/
  /*margin-bottom: 0;*/
  /*}*/

  .project-li {
    text-align: center;
    height: 50px;
    line-height: 50px;
    color: #333;
    font-size: 16px;
    cursor: pointer;
  }

  .project-add {
    width: 100%;
    height: 100%;
    background: url("../../common/img/project_add.png") no-repeat center;
    cursor: pointer;
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

  .project-info {
    background: -webkit-linear-gradient(left, #FF6683, #ECA298); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #FF6683, #ECA298); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #FF6683, #ECA298); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #FF6683, #ECA298); /* 标准的语法 */
  }

  .add-info {
    background: -webkit-linear-gradient(left, #FBAB7E, #F7CE68); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #FBAB7E, #F7CE68); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #FBAB7E, #F7CE68); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #FBAB7E, #F7CE68); /* 标准的语法 */
  }
</style>
