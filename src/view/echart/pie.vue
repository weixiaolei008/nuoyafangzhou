<template>
  <div :id="id" style="width:100%;height:100%">
    <!--{{options}}-->
  </div>
</template>
<script>
  import echarts from 'echarts'

  export default {
    name: "pie",
    props: {
      //父组件需要传递的参数：id，width，height，option
      id: {
        type: String
      },
      name: {
        type: String
      },
      option: {
        type: Object,
        default() {
          return {
          }
        }
      }
    },
    // props: ['id','name','option'],
    data() {
      return {
        chart: ''
      }
    },
    watch: {
      //观察option的变化
      option: {
        handler(newVal, oldVal) {
          if (this.chart) {
            this.drawPie();
            // if (newVal) {
            //   this.drawPie();
            //   this.chart.setOption(newVal);
            // } else {
            //   this.chart.setOption(oldVal);
            // }
          } else {
            this.drawPie();
          }
        },
        deep: true //对象内部属性的监听，关键。
      }
    },
    methods: {
      drawPie() {
        // 基于准备好的dom，初始化echarts实例
        this.chart = echarts.init(document.getElementById(this.id));
        this.chart.setOption({
          title: {},
          tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b} : {c} ({d}%)"
            formatter: "{a} <br/>{b} : {d}%"
          },
          series: [{
            name: this.name,
            type: 'pie',
            hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果
            selectedMode: 'single',  //选中模式，表示是否支持多个选中，默认关闭，支持布尔值和字符串，字符串取值可选'single'，'multiple'，分别表示单选还是多选。
            selectedOffset: 10, //选中扇区的偏移距离
            data: this.option.series,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            color: ['#6BF2B6', '#23D2FD', '#6D80FE', '#67A0FF']
          }]
        })
        // 绘制柱状图
        // myChart.setOption({
        //   title: {text: ''},
        //   tooltip: {},
        //   xAxis: {
        //     data: ["天", "时", "分", "秒"]
        //   },
        //   yAxis: {},
        //   series: [{
        //     name: '',
        //     type: 'bar',
        //     itemStyle: {
        //       normal: {
        //         //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
        //         color: function (params) {
        //           // build a color map as your need.
        //           var colorList = [
        //             // '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
        //             '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
        //             // '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
        //           ];
        //           return colorList[params.dataIndex]
        //         },
        //         //以下为是否显示，显示位置和显示格式的设置了
        //         label: {
        //           show: true,
        //           position: 'top',
        //           formatter: '{c}',
        //           // formatter: '{b}\n{c}'
        //         }
        //       }
        //     },
        //     //设置柱的宽度，要是数据太少，柱子太宽不美观~
        //     barWidth: 40,
        //     data: [5, 20, 36, 8]
        //   }]
        // });
      }
    }
  }

</script>

<style scoped>
</style>
