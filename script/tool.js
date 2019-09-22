let whiteList = ['login', 'index']  // 按下返回键退出程序的页面，若不在whiteList中则是返回上一页

// 跳转  参数： 新打开frame的名字 | 新打开页面的路径 | 需要传递的参数

function goto (name, path, pageParam) {

    // 保存历史记录

    let historyList = api.getGlobalData({

        key: 'historyList'

    }) || '[]'; // 历史记录 首次进入是没有值的 所以赋值为字符串 ‘[]’

    historyList = JSON.parse(historyList) // 转换为数组

    historyList.push(name)     // 将新页面放进history

    api.setGlobalData({ // 将history 存入缓存

        key: 'historyList',

        value: JSON.stringify(historyList)

    });

    api.openFrame({ // 打开新页面

        name: name,

        url: path,

        bounces: false,

        rect: {

            w: 'auto'

        },

        animation: {

            type: 'push',

            subType: 'from_bottom'

        },

        pageParam: pageParam // 需要传递的参数

    });

}

// 返回上一页
var baseUrl="http://47.111.135.7:8081";

function back () {

  api.ajax({
      url: baseUrl + '/user/logOut',		//请求路径
      type: 'POST',			            //请求方式
      dataType: "JSON",		            //返回数据类型
      contentType: 'application/json',

      success: function (res) {
         // console.log("res:"+res);
          if (res.code === 200) {
              $.niftyNoty({
                  type: 'success',
                  icon: 'pli-like-2 icon-2x',
                  message: '退出成功',
                  container: 'floating',
                  timer: 2000
              });
              window.location.href = "../../login.html";
          } else if (res.code === 404) {
              window.location.href = '../../page-404.html';
          }
          else if (res.code === 505) {
              window.location.href = '../../page-500.html';
          }
          else {
              $.niftyNoty({
                  type: 'danger',
                  icon: 'pli-cross icon-2x',
                  message: res.msg,
                  container: 'floating',
                  timer: 1000
              });
          }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {		//请求失败回调函数
      }
  });

}
