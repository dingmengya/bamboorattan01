var baseUrl="http://47.111.135.7:8081";
//var baseUrl="http://192.168.43.120:8080";
//var baseUrl="http://192.168.0.10:8080";//zl
//var baseUrl="http://10.5.139.187:8080";
//var baseUrl="http://127.0.0.1:8080";//wzl本地
//给body元素手动加上 modal-opens
var openModalClass=function () {
    $('body').addClass('modal-open');
}
var openLoading=function () {
    var _PageHeight = document.documentElement.clientHeight,
        _PageWidth = document.documentElement.clientWidth;
    //计算loading框距离顶部和左部的距离（loading框的宽度为108px，高度为108px）
    var _LoadingTop = _PageHeight > 100 ? (_PageHeight - 108) * 0.382 : 0,
        _LoadingLeft = _PageWidth > 100 ? (_PageWidth - 108) * 0.5: 0;
    //在页面未加载完毕之前显示的loading Html自定义内容
    var _LoadingHtml = '' +
        '<div id="loadingFckDiv" style="position:fixed;left:0;width:100%;height:' + _PageHeight + 'px;top:0;z-index:1000000;filter:alpha(opacity=70); -moz-opacity:0.7; -khtml-opacity: 0.7; opacity: 0.7;">' +
        '   <div style="position: absolute; cursor: wait; left: ' + _LoadingLeft + 'px; top:' + _LoadingTop + 'px; width: 108px; height: 108px; line-height: 100px;">' +

        '<div class="spiner-example" style="z-index:20000;position:absolute;">' +
        '<div class="sk-spinner sk-spinner-fading-circle">' +
        '<div class="sk-circle1 sk-circle"></div>' +
        '<div class="sk-circle2 sk-circle"></div>' +
        '<div class="sk-circle3 sk-circle"></div>' +
        '<div class="sk-circle4 sk-circle"></div>' +
        '<div class="sk-circle5 sk-circle"></div>' +
        '<div class="sk-circle6 sk-circle"></div>' +
        '<div style="color:#fff;width:100%;color:#8BC34A;" align="center">请稍等...</div>'+
        '<div class="sk-circle7 sk-circle"></div>' +
        '<div class="sk-circle8 sk-circle"></div>' +
        '<div class="sk-circle9 sk-circle"></div>' +
        '<div class="sk-circle10 sk-circle"></div>' +
        '<div class="sk-circle11 sk-circle"></div>' +
        '<div class="sk-circle12 sk-circle"></div>' +

        '</div>' +
        '</div>' +


        '       </div>' +
        '   </div>' +
        '</div>';
    //呈现loading效果


    var div = document.createElement("div");
    div.id = "mainFckLoading";
    div.innerHTML = _LoadingHtml;
    document.body.appendChild(div);

}
var closeLoading=function () {
    $('#mainFckLoading').remove();
}
$(function () {
    $.ajaxSetup({
        headers:{'Authorization':sessionStorage.getItem('jsessionId')},
        beforeSend: function(xhr,request){
            openLoading();
        },
        complete: function(xhr) {
            closeLoading();
        }
    });
    $('.username').html('欢迎您，'+ sessionStorage.getItem('BAM_USERNAME'));
    initNav();
    //退出
    $("#logout").on('click',logout);
    // console.log(window.location.href);
});
// $("#logout").on('click',logout);
 //退出
 function logout() {
// console.log(window.location.href);

     $.ajax({
         url: baseUrl + '/user/logOut',		//请求路径
         type: 'POST',			            //请求方式
         dataType: "JSON",		            //返回数据类型
         contentType: 'application/json',

         success: function (res) {
            // console.log("res:"+res);
             if (res.code === 200) {
                 /*
                //清除用户信息cookie
                 var total=$.cookie('BAM_USERINFO_TOTAL');
                if(typeof total!="undefined"&&total!=null){
                    for(var i=0;i<total;i++){
                        $.removeCookie('BAM_USERINFO_'+i,{ expires: 365});
                    }
                    $.removeCookie('BAM_USERINFO_TOTAL',{ expires: 365});
                }*/

                 //清除会话jsessionId
                 sessionStorage.removeItem('jsessionId');
                 sessionStorage.removeItem('BAM_USERINFO');
                 sessionStorage.removeItem('BAM_USERNAME');
                 $.niftyNoty({
                     type: 'success',
                     icon: 'pli-like-2 icon-2x',
                     message: '退出成功',
                     container: 'floating',
                     timer: 2000
                 });
                 window.location.href = "login.html";
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

 //根据名称获取地址栏的参数值
 var getUrlParam = function (name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return decodeURI(r[2]); return null;
 }

 var getUserInfo=function () {
     /*
     var total=$.cookie('BAM_USERINFO_TOTAL');
     var strUser='';
     for(var i=0;i<total;i++){
         strUser+=$.cookie('BAM_USERINFO_'+i);
     }*/
     var strUser=sessionStorage.getItem('BAM_USERINFO');
     if(typeof strUser=='undefined'||strUser==null||strUser==''){
         return null;
     }
     return JSON.parse(strUser);
 }
 var hasAuthority=function (auth_name,key) {
     var userInfo=getUserInfo();
     if(userInfo==null){
         return false;
     }
     var authorities=userInfo.authorities;
     for(var i=0;i<authorities.length;i++){
         if(authorities[i].authName==auth_name){
             if(key=="auth_view"){
                return authorities[i].authView==1;
             }else if(key=="auth_create"){
                 return authorities[i].authCreate==1;
             }
             else if(key=="auth_edit"){
                 return authorities[i].authEdit==1;
             }
             else if(key=="auth_delete"){
                 return authorities[i].authDelete==1;
             }
             else{
                 return false;
             }
         }
     }
     return false;
 }
 var initNav=function () {
//bamboo竹，rattan藤,nature性质，form形态,anatomy解剖
     var bamboorattandata=[];       //竹藤数据

     var bamboodata=[];             //竹种资源数据
     var bamboogenus=[];            //竹 - 属名
     var bamboospec=[];             //竹 - 种名
     var bambooform=[];             //竹 - 形态
     var bamboonature=[];           //竹 - 性质
     var bamboonatureanatomy=[];    //竹 - 解剖特征

     var rattandata=[];             //藤种资源数据
     var rattangenus=[];            //藤 - 属名
     var rattanspec=[];             //藤 - 种名
     var rattanform=[];             //藤 - 形态
     var rattannature=[];           //藤 - 性质
     var rattannatureanatomy=[];    //藤 - 解剖特征

     var unit=[];                   //单位

     var system=[];                 //系统管理

     var control=[];                //系统监控

     if(hasAuthority('genus','auth_view')){
         bamboogenus.push(1);
         $("#bamboo_genus_page").removeClass('hide')
     }else{
         $("#bamboo_genus_page").addClass('hide');
     }
     if(hasAuthority('spec','auth_view')){
         bamboospec.push(1);
         $("#bamboo_spec_page").removeClass('hide')
     }else{
         $("#bamboo_spec_page").addClass('hide');
     }
     if(hasAuthority('understem','auth_view')){
         bambooform.push(1);
         $("#bamboo_understem_page").removeClass('hide')
     }else{
         $("#bamboo_understem_page").addClass('hide');
     }
     if(hasAuthority('culm','auth_view')){
         bambooform.push(1);
         $("#bamboo_culm_page").removeClass('hide')
     }else{
         $("#bamboo_culm_page").addClass('hide');
     }
     if(hasAuthority('sheathnode','auth_view')){
         bambooform.push(1);
         $("#bamboo_sheathnode_page").removeClass('hide')
     }else{
         $("#bamboo_sheathnode_page").addClass('hide');
     }
     if(hasAuthority('sheath','auth_view')){
         bambooform.push(1);
         $("#bamboo_sheath_page").removeClass('hide')
     }else{
         $("#bamboo_sheath_page").addClass('hide');
     }
     if(hasAuthority('sheathear','auth_view')){
         bambooform.push(1);
         $("#bamboo_sheathear_page").removeClass('hide')
     }else{
         $("#bamboo_sheathear_page").addClass('hide');
     }
     if(hasAuthority('sheathtongue','auth_view')){
         bambooform.push(1);
         $("#bamboo_sheathtongue_page").removeClass('hide')
     }else{
         $("#bamboo_sheathtongue_page").addClass('hide');
     }
     if(hasAuthority('sheathshell','auth_view')){
         bambooform.push(1);
         $("#bamboo_sheathshell_page").removeClass('hide')
     }else{
         $("#bamboo_sheathshell_page").addClass('hide');
     }
     if(hasAuthority('leaf','auth_view')){
         bambooform.push(1);
         $("#bamboo_leaf_page").removeClass('hide')
     }else{
         $("#bamboo_leaf_page").addClass('hide');
     }
     if(hasAuthority('fruit','auth_view')){
         bambooform.push(1);
         $("#bamboo_fruit_page").removeClass('hide')
     }else{
         $("#bamboo_fruit_page").addClass('hide');
     }
     if(hasAuthority('chemistry','auth_view')){
         bamboonature.push(1);
         $("#bamboo_chemistry_page").removeClass('hide')
     }else{
         $("#bamboo_chemistry_page").addClass('hide');
     }
     if(hasAuthority('physical','auth_view')){
         bamboonature.push(1);
         $("#bamboo_physical_page").removeClass('hide')
     }else{
         $("#bamboo_physical_page").addClass('hide');
     }
     if(hasAuthority('structure','auth_view')){
         bamboonature.push(1);
         $("#bamboo_structure_page").removeClass('hide')
     }else{
         $("#bamboo_structure_page").addClass('hide');
     }
     if(hasAuthority('mechanics','auth_view')){
         bamboonature.push(1);
         $("#bamboo_mechanics_page").removeClass('hide')
     }else{
         $("#bamboo_mechanics_page").addClass('hide');
     }
     if(hasAuthority('tissueproportion','auth_view')){
         bamboonatureanatomy.push(1);
         $("#bamboo_tissueproportion_page").removeClass('hide')
     }else{
         $("#bamboo_tissueproportion_page").addClass('hide');
     }
     if(hasAuthority('fibermorphology','auth_view')){
         bamboonatureanatomy.push(1);
         $("#bamboo_fibermorphology_page").removeClass('hide')
     }else{
         $("#bamboo_fibermorphology_page").addClass('hide');
     }
     if(hasAuthority('cathermorphology','auth_view')){
         bamboonatureanatomy.push(1);
         $("#bamboo_cathermorphology_page").removeClass('hide')
     }else{
         $("#bamboo_cathermorphology_page").addClass('hide');
     }
     if(hasAuthority('vascularbundelmorphology','auth_view')){
         bamboonatureanatomy.push(1);
         $("#bamboo_vascularbundelmorphology_page").removeClass('hide')
     }else{
         $("#bamboo_vascularbundelmorphology_page").addClass('hide');
     }

     if(hasAuthority('rattangenus','auth_view')){
         rattangenus.push(1);
         $("#rattan_genus_page").removeClass('hide')
     }else{
         $("#rattan_genus_page").addClass('hide');
     }
     if(hasAuthority('rattanspec','auth_view')){
         rattanspec.push(1);
         $("#rattan_spec_page").removeClass('hide')
     }else{
         $("#rattan_spec_page").addClass('hide');
     }
     if(hasAuthority('rattanunderstem','auth_view')){
         rattanform.push(1);
         $("#rattan_understem_page").removeClass('hide')
     }else{
         $("#rattan_understem_page").addClass('hide');
     }
     if(hasAuthority('rattanculm','auth_view')){
         bambooform.push(1);
         $("#rattan_culm_page").removeClass('hide')
     }else{
         $("#rattan_culm_page").addClass('hide');
     }
     if(hasAuthority('rattansheathnode','auth_view')){
         bambooform.push(1);
         $("#rattan_sheathnode_page").removeClass('hide')
     }else{
         $("#rattan_sheathnode_page").addClass('hide');
     }
     if(hasAuthority('rattansheath','auth_view')){
         bambooform.push(1);
         $("#rattan_sheath_page").removeClass('hide')
     }else{
         $("#rattan_sheath_page").addClass('hide');
     }
     if(hasAuthority('rattansheathear','auth_view')){
         bambooform.push(1);
         $("#rattan_sheathear_page").removeClass('hide')
     }else{
         $("#rattan_sheathear_page").addClass('hide');
     }
     if(hasAuthority('rattansheathtongue','auth_view')){
         bambooform.push(1);
         $("#rattan_sheathtongue_page").removeClass('hide')
     }else{
         $("#rattan_sheathtongue_page").addClass('hide');
     }
     if(hasAuthority('rattansheathshell','auth_view')){
         bambooform.push(1);
         $("#rattan_sheathshell_page").removeClass('hide')
     }else{
         $("#rattan_sheathshell_page").addClass('hide');
     }
     if(hasAuthority('rattanleaf','auth_view')){
         rattanform.push(1);
         $("#rattan_leaf_page").removeClass('hide')
     }else{
         $("#rattan_leaft_page").addClass('hide');
     }
     if(hasAuthority('rattanfruit','auth_view')){
         rattanform.push(1);
         $("#rattan_fruit_page").removeClass('hide')
     }else{
         $("#rattan_fruit_page").addClass('hide');
     }
     if(hasAuthority('rattanchemistry','auth_view')){
         rattannature.push(1);
         $("#rattan_chemistry_page").removeClass('hide')
     }else{
         $("#rattan_chemistry_page").addClass('hide');
     }
     if(hasAuthority('rattanphysical','auth_view')){
         rattannature.push(1);
         $("#rattan_physical_page").removeClass('hide')
     }else{
         $("#rattan_physical_page").addClass('hide');
     }
     if(hasAuthority('rattanstructure','auth_view')){
         rattannature.push(1);
         $("#rattan_structure_page").removeClass('hide')
     }else{
         $("#rattan_structure_page").addClass('hide');
     }
     if(hasAuthority('rattanmechanics','auth_view')){
         rattannature.push(1);
         $("#rattan_mechanics_page").removeClass('hide')
     }else{
         $("#rattan_mechanics_page").addClass('hide');
     }
     if(hasAuthority('rattantissueproportion','auth_view')){
         rattannatureanatomy.push(1);
         $("#rattan_tissueproportion_page").removeClass('hide')
     }else{
         $("#rattan_tissueproportion_page").addClass('hide');
     }
     if(hasAuthority('rattanfibermorphology','auth_view')){
         rattannatureanatomy.push(1);
         $("#rattan_fibermorphology_page").removeClass('hide')
     }else{
         $("#rattan_fibermorphology_page").addClass('hide');
     }
     if(hasAuthority('rattancathermorphology','auth_view')){
         rattannatureanatomy.push(1);
         $("#rattan_cathermorphology_page").removeClass('hide')
     }else{
         $("#rattan_cathermorphology_page").addClass('hide');
     }
     if(hasAuthority('rattanvascularbundelmorphology','auth_view')){
         rattannatureanatomy.push(1);
         $("#rattan_vascularbundelmorphology_page").removeClass('hide')
     }else{
         $("#rattan_vascularbundelmorphology_page").addClass('hide');
     }
     if(hasAuthority('unittable','auth_view')){
         unit.push(1);
         $("#unittable_page").removeClass('hide')
     }else{
         $("#unittable_page").addClass('hide');
     }
     if(hasAuthority('user','auth_view')){
         system.push(1);
         $("#user_page").removeClass('hide')
     }else{
         $("#user_page").addClass('hide');
     }
     if(hasAuthority('role','auth_view')){
         system.push(1);
         $("#role_page").removeClass('hide')
     }else{
         $("#role_page").addClass('hide');
     }
     if(hasAuthority('log','auth_view')){
         control.push(1);
         $("#log_page").removeClass('hide')
     }else{
         $("#log_page").addClass('hide');
     }


     for (var i=0;i<bamboogenus.length;i++){
         bamboodata.push(bamboogenus[i])
     }
     for (var i=0;i<bamboospec.length;i++){
         bamboodata.push(bamboospec[i])
     }
     for (var i=0;i<bambooform.length;i++){
         bamboodata.push(bambooform[i])
     }
     for (var i=0;i<bamboonatureanatomy.length;i++){
         bamboonature.push(bamboonatureanatomy[i])
     }
     for (var i=0;i<bamboonature.length;i++){
         bamboodata.push(bamboonature[i])
     }
     for (var i=0;i<bamboodata.length;i++){
         bamboorattandata.push(bamboodata[i])
     }

     for (var i=0;i<rattangenus.length;i++){
         rattandata.push(rattangenus[i])
     }
     for (var i=0;i<rattanspec.length;i++){
         rattandata.push(rattanspec[i])
     }
     for (var i=0;i<rattanform.length;i++){
         rattandata.push(rattanform[i])
     }
     for (var i=0;i<rattannatureanatomy.length;i++){
         rattannature.push(rattannatureanatomy[i])
     }
     for (var i=0;i<rattannature.length;i++){
         rattandata.push(rattannature[i])
     }
     for (var i=0;i<rattandata.length;i++){
         bamboorattandata.push(rattandata[i])
     }

     for (var i=0;i<unit.length;i++){
         bamboorattandata.push(unit[i])
     }

     if(bamboorattandata.length<=0){
         $("#bamboorattandata_page").addClass('hide');
     }else{
         if(bamboodata.length<=0){
             $("#bamboodata_page").addClass('hide');
         }else{
             if(bamboogenus.length<=0){
                 $("#bamboogenus_page").addClass('hide');
             }
             if(bamboospec.length<=0){
                 $("#bamboospec_page").addClass('hide');
             }
             if(bambooform.length<=0){
                 $("#bambooform_page").addClass('hide');
             }
             if(bamboonature.length<=0){
                 $("#bamboonature_page").addClass('hide');
             }else{
                 if(bamboonatureanatomy.length<=0){
                     $("#bamboonatureanatomy_page").addClass('hide');
                 }
             }
         }
         if(rattandata.length<=0){
             $("#rattandata_page").addClass('hide');
         }else{
             if(rattangenus.length<=0){
                 $("#rattangenus_page").addClass('hide');
             }
             if(rattanspec.length<=0){
                 $("#rattanspec_page").addClass('hide');
             }
             if(rattanform.length<=0){
                 $("#rattanform_page").addClass('hide');
             }
             if(rattannature.length<=0){
                 $("#rattannature_page").addClass('hide');
             }else{
                 if(rattannatureanatomy.length<=0){
                     $("#rattannatureanatomy_page").addClass('hide');
                 }
             }
         }
         if(unit.length<=0){
             $("#unit_page").addClass('hide');
         }
     }
     if(system.length<=0){
         $("#system_page").addClass('hide');
     }
     if(control.length<=0){
         $("#control_page").addClass('hide');
     }

     if(bamboorattandata.length<=0&&system.length<=0&&control.length<=0){
         $("#mainnav-menu").addClass('hide');
     }
 }
