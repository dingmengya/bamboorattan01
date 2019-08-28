(function(){
    var specId=getUrlParam('specId');

    loadSpec(specId);
});
//根据名称获取地址栏的参数值
var getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    console.log(window.location.href);
    if (r != null) return decodeURI(r[2]); return null;
}
function loadSpec(specId){
    $.ajax({
        url:baseUrl+'/spec/findId/'+specId,
        type:'GET',
        success:function(response){
            if(response.code==200){
                var spec=response.data;
                if(spec!=null){
                    $('#specNameCh').html(spec.specNameCh);
                    var files=spec.files;
                    var imgsHtml='';
                    for(var i=0;i<files.length;i++){
                        var file=files[i];
                        if(file!=null&&file.type=='image'){
                            imgsHtml+='<img src="'+baseUrl+'/'+file.path+'">';
                        }
                    }
                    var html='\
                        <div class="row info">\
                            <p>'+spec.specDesc+'</p>'
                            +imgsHtml+'\
                        </div>\
                    ';
                    $('.info').html(html);
                }
            }
        }
    });
}
