var queryPageUrl='';

$(function(){
    queryPageUrl = baseUrl+'/Elasticsearch/search';
    var key_word=getUrlParam("keywords");//获取地址栏中keyWord的值
    search(key_word);
    $("#bnt_search").on('click',search_click);
});
//根据名称获取地址栏的参数值
var getUrlParam = function (name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURI(r[2]); return null;
}
//获取搜索内容
function search(keyWord){
    $.ajax({
        url:queryPageUrl+'?page=1&size=10&keywords='+keyWord,
        method: 'GET',
        dataType:'json',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        data: {
          values: {
           name: 'elements'
         }
        }
        },function(ret,err){
            if(ret){
                var result=ret.data;
                if(result){
                    var _html='';
                    for(var i=0;i<result.length;i++) {
                        var item=result[i];
                        //没有图片
                        _html += '\
                            <li class="list-group-item list-item-lg">\
                                <div class="media-heading mar-no">\
                                    <a class="h4 text-primary" href="#">'+item.spec_name_ch+'</a>\
                                </div>\
                                <p class="text-sm">'+item.spec_desc+'</p>\
                            </li>';
                    }
                }
            }else {
                api.alert({ msg: JSON.stringify(err) });
            }
        });
}
//点击搜索
function search_click(){
    var key_word=$("#kw").val();//搜索内容
    //如果搜索内容不为空，这跳转到搜索页面
    if($.trim(key_word)!=''){
        search(key_word);
    }
}
