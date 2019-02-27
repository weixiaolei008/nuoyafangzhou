import {Message} from 'element-ui'
// 配置API接口地址
var root = 'http://10.108.6.107:8201/'  // 服务器
// var root = 'http://10.108.12.94:8201/' // 饶德明
// var root = 'http://10.108.14.98:8201/'  // 服务器
//root = "http://localhost:8201/"
// 引用axios
var axios = require('axios')

function apiAxios(method, url, params, success, failure) {
  let token;
  let user = sGetObject("_user");
  let time = new Date().getTime();
  user == undefined || user == null ? token = '' : token = user.token;
  // console.log(token);
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: true,
    timeout: 10000,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    auth: {
      token: token,
      time: time
    },
  })
    .then(function (res) {
      if(res.data.success === true){
        success(res.data)
      }
      else{
        // console.log(failure);
        failure(res.data)
        // Message.error({
        //   message: res.msg
        // })
      }
    })
    .catch(function (err) {
      if(err.response && err.response.data=="TIMEOUT"){
        window.location.href = "/login";
        return;
      }
      console.log("系统错误："+err);
      /*Message.error({
        message: '服务器异常'
      })*/
    })
}

function sGetObject(k) {
  try {
    var v = sessionStorage.getItem(k);
    return v == null ? null : JSON.parse(v);
  } catch (e) {
  }
};

// 返回在vue模板中的调用接口
export default {
  root: root,
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  },
  sSetObject: function (k, v) {
    try {
      sessionStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
    }
  },
  sGetObject: function (k) {
    try {
      var v = sessionStorage.getItem(k);
      return v == null ? null : JSON.parse(v);
    } catch (e) {
    }
  }
}
