
export default {
  methods: {
    dateFormat(row, column , boolen) {
      if(row[column.property]){
        var date = new Date(row[column.property]);
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
        if(boolen){
          return [year, month, day].map(this.formatNumber).join('-')
        }
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()
        return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
      }
    },
    // 个位数补零
    formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
  }
}
