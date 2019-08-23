$(function(){
    loadGenus(genusId);
  });
  function loadGenus(genusId){
    api.parseTapmode();
    api.ajax({
        url:baseUrl+'/genus/findId/'+genusId,
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
            var genus=ret.data;
            if(genus!=null){
                $('#gang').html(genus.genusNameCh)
                // $('.info p').html(genus.genusDesc);
                loadSpeces(genusId,genus.genusNameCh);
            }
        }else {
            api.alert({ msg: JSON.stringify(err) });
        }
      });
    }


function loadSpeces(genusId,genusNameCh){
    $.ajax({
        url:baseUrl+'/spec/findAll',
        type:'GET',
        success:function(response){

            if(response.code==200){
                var speces=response.data;

                if(speces!=null&&speces.length>0){
                    var html='';
                    for(var i=0;i<speces.length;i++){
                        var spec=speces[i];
                        if(spec.genus!=null&&spec.genus.genusId==genusId){
                            var img='';
                            if(spec.files!=null&&spec.files.length>0){
                                for(var j=0;j<spec.files.length;j++){
                                    var file=spec.files[j];
                                    if(file.type=='image'){
                                        img=baseUrl+'/'+ file.path;
                                        console.log(img);
                                        break;
                                    }
                                }
                            }
                            console.log(spec.specId);

                            html+='\
                                <div class="aui-col-xs-6">\
                                <div class="aui-card-list">\
                                    <div class="aui-card-list-content">\
                                        <img src="'+img+'">\
                                    </div>\
                                    <div class="aui-card-list-header aui-font-size-14">\
                                        <h4>'+spec.specNameCh+'</h4>\
                                    </div>\
                                </div>\
                                </div>\
                            ';
                        }
                    }
                    $('.aui-row-padded').html(html);
                    $('.aui-card-list-content').on('click',function(){
                        location.href='specdetail.html?specId='+$(this).attr('data-id');

                    });
                }
            }
        }
    });

}
