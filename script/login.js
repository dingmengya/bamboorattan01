var baseUrl="http://47.111.135.7:8081";

//前端生成验证码检验验证码
var code ;
//生成验证码
function createCode(){
    code = new Array();
    var codeLength = 4;
    var checkCode = document.getElementById("checkCode");
    checkCode.value = "";
    var selectChar = new Array(2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z');
    for(var i=0;i<codeLength;i++) {
        var charIndex = Math.floor(Math.random()*32);
        code +=selectChar[charIndex];
    }
    checkCode.value = code;
}

function keyEnter(e){
    var e = e||event;
    if(e.keyCode == 13){
        document.getElementsByName("submit")[0].click();
    }
}
document.onkeydown = keyEnter;
function validate() {
    var validateForm = $('#form-login').data('bootstrapValidator');
    //手动触发验证
    validateForm.validate();
    //表单验证不通过，直接return，不往下执行
    if(!validateForm.isValid()){
        return;
    }

    var inputCode = document.getElementById("yzm").value.toUpperCase();
    if(inputCode != code ){
        $.niftyNoty({
            type: 'danger',
            icon: 'pli-cross icon-2x',
            message: '验证码错误',
            container: 'floating',
            timer: 2000
        });
    }else{
        login();
    }
}
//登录
function login(){

    var userName = $("#userName").val();    // 获取id为username的<input>框数据

    var password = $("#password").val();    // 获取id为password的<input>框数据
    var formData={
        "userName": userName,
        "password": password
    }
    $.ajax({
      url: baseUrl + '/user/login',	    //请求路径
      type: 'POST',				        //请求方式
      //data: JSON.stringify(formData),	    //数据
      data: formData,	                    //数据
      //contentType: 'application/json',
      success: function (res) {  // 请求成功后的回调函数，其中的参数data为controller返回的map,也就是说,@ResponseBody将返回的map转化为JSON格式的数据，然后通过data这个参数取JSON数据中的值
           //res.code=400;
            if (res.code===200) {

                jsessionId=res.data.jsessionid;
                sessionStorage.setItem("jsessionId",jsessionId);//该方法接受一个键名(key)和值(value)作为参数，将键值对添加到存储中；如果键名存在，则更新其对应的值
                //$.cookie('BAM_USERNAME',formData.userName,{ expires: 365});
                sessionStorage.setItem("BAM_USERNAME",formData.userName);
                var authorities=[];
                var roles=res.data.user.roles;
                for(var i=0;i<roles.length;i++){
                    for(var j=0;j<roles[i].authorities.length;j++){
                        var isExisted=false;
                        for(var k=0;k<authorities.length;k++){
                            if(roles[i].authorities[j].authName==authorities[k].authName){
                                isExisted=true;
                                authorities[k].authView=authorities[k].authView|roles[i].authorities[j].authView;
                                authorities[k].authCreate=authorities[k].authCreate|roles[i].authorities[j].authCreate;
                                authorities[k].authEdit=authorities[k].authEdit|roles[i].authorities[j].authEdit;
                                authorities[k].authDelete=authorities[k].authDelete|roles[i].authorities[j].authDelete;
                                break;
                            }
                        }
                        if(!isExisted){
                            authorities.push(roles[i].authorities[j]);
                        }
                    }
                }
                res.data.user.authorities=authorities;
                var strUser=JSON.stringify(res.data.user);
                sessionStorage.setItem("BAM_USERINFO",strUser);

                saveInfo();
                $.niftyNoty({
                    type: 'success',
                    icon: 'pli-like-2 icon-2x',
                    message: '登录成功',
                    container: 'floating',
                    timer: 2000
                });
                window.location.href = "index.html";
                // window.location.href = "frame3.html?userId="+res.data.user.userId;
                api.setGlobalData({
                        key: 'userId',
                        value: res.data.user.userId
                      });

            }else if(res.code === 404){
                window.location.href='page-page-404.html';
            }
            else if(res.code === 505){
                window.location.href='page-page-500.html';
            } else{
                //alert("账号或密码错误");
                $.niftyNoty({
                    type: 'danger',
                    icon: 'pli-cross icon-2x',
                    message: res.msg,
                    container: 'floating',
                    timer: 2000
                });
            }
        }
      });
}
//判断用户名和密码是否为空
function checkInCorrect()
{
    $("#form-login").bootstrapValidator({
        //submitHandler: function (valiadtor, loginForm, submitButton) {
        //    valiadtor.defaultSubmit();
        //},
        fields: {
            userName: {
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    stringLength: {
                        /*长度提示*/
                        min: 2,
                        max: 10,
                        message: '用户名长度必须在2到10之间'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        /*长度提示*/
                        min: 6,
                        max: 30,
                        message: '密码长度必须在6到30之间'
                    },
                    different: {//不能和用户名相同
                        field: ' userName',//需要进行比较的input name值
                        message: '不能和用户名相同'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码由数字字母下划线和.组成'
                    }
                }
            },
            verify_input: {
                validators: {
                    notEmpty: {
                        message: '验证码不能为空'
                    },
                    stringLength: {
                        /*长度提示*/
                        min: 4,
                        max: 4,
                        message: '验证码长度必须为4'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: '密码由数字字母下划线和.组成'
                    }
                }
            }
        }
    });
}

$(function(){
    checkInCorrect();
    GetCookie();
});

saveInfo = function(){
    try{
        var isSave = document.getElementById('remember-password').checked;   //保存按键是否选中
        if (isSave) {
            var usernm = document.getElementById('userName').value;

            var userpsw = document.getElementById('password').value;

            if(usernm!="" && userpsw!=""){
                SetCookie(usernm,userpsw);
            }
        }else {
            SetCookie("","");
        }
    }catch(e){

    }
}

function SetCookie(usernm,userpsw){
    var oDate = new Date();
    oDate.setTime(oDate.getTime() + 1866240000000);
    document.cookie ="username=" + usernm + "%%"+userpsw+";expires="+ oDate.toGMTString() ;
}

function GetCookie(){
    var nmpsd;
    var nm;
    var psd;
    var cookieString = new String(document.cookie);
    var cookieHeader = "username=";
    var beginPosition = cookieString.indexOf(cookieHeader);
    cookieString = cookieString.substring(beginPosition);
    var ends=cookieString.indexOf(";");
    if (ends!=-1){
        cookieString = cookieString.substring(0,ends);
    }
    if (beginPosition>-1){
        nmpsd = cookieString.substring(cookieHeader.length);
        if (nmpsd!=""){
            beginPosition = nmpsd.indexOf("%%");
            nm=nmpsd.substring(0,beginPosition);
            psd=nmpsd.substring(beginPosition+2);
            document.getElementById('userName').value=nm;
            document.getElementById('password').value=psd;
            if(nm!="" && psd!=""){
                document.getElementById('remember-password').checked = true;
            }
        }
    }
}
