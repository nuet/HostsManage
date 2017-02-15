/**
 * Created by Administrator on 2016/12/22.
 */

Groups = [];

function GetGroups() {
    var csrftoken = $.cookie('csrftoken'); //去cookie中获取csrftoken的值
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $.ajax({
        url: '/get_groups/',
        type: "POST",
        data: {'status': 'group'},
        dataType: 'json',
        async:false,
        success: function (data) {
            if(data.status){
                // console.log(data.message);
                Groups = data.message;
                // var groups= data.message;
                return data.message;
                // console.log(groups);
            }else {
                alert('数据保存失败！');
            }
        }
    });
}

//进入编辑模式
function OnEdit(ths) {
    $(ths).parent().parent().find('a').eq(0).text('保存');
    //将内容变为文本输入框
    $(ths).parent().parent().find('.edit_input').each(function () {//找到所有需要变成文本输入框的标签，然后遍历
        var t = document.createElement('input'); //创建input标签
        t.setAttribute('type','text'); //设置type为text
        t.className = 'edit';
        t.value = $(this).text();  //将原来标签的值赋给input标签
        $(this).empty(); //清空原标签的内容
        $(this).html(t); //将input标签插入
    });


    //将内容变为下拉选择框
    $(ths).parent().parent().find('.edit_select').each(function () {

        var text = $(this).find('span');  //获取标签的内容
        GetGroups();
        var host_groups = Groups;
        // console.log(Groups);
        // console.log($(this).find('span').text());
//                            console.log($(this).text());

        var select = document.createElement('select');  //创建select标签
        select.setAttribute('multiple',true);

        for(var index in host_groups){
            var tag = document.createElement('option');
            tag.innerText = host_groups[index];
            text.each(function () {
                if(host_groups[index] == $(this).text()){
                    tag.setAttribute('selected',true);
                }
            });
            select.append(tag);
        }
        // console.log(select.innerHTML);

        $(this).empty();  //清空td标签
        $(this).html(select);  //td标签中添加select标签
    })
}

//退出编辑模式
function OffEdit(ths) {
    $(ths).parent().parent().find('a').eq(0).text('编辑');
    //将文本输入框变为普通内容
    $(ths).parent().parent().find('.edit_input').each(function () {//找到所有需要变成普通内容的标签，然后遍历
        text_input = $(this).find('input').val();  //获取input标签的内容
        $(this).empty(); //清空td标签
        $(this).text(text_input);  //将文本框换位普通内容
    });
    
    //将下拉选择框变为内容
    $(ths).parent().parent().find('.edit_select').each(function () {

        // console.log($(this).find('option:selected').text());
        var text_select = '';
        $(this).find('option:selected').each(function () {
           text_select += "<span>" + $(this).text() + "</span>&nbsp;"
        });
        $(this).empty();//清空td标签
        $(this).html(text_select);//将select下拉框位普通内容
    })
}

function SubmitHost(ths, status, group_name) {
    //获取当前行数据，提交给后台
    var id = $(ths).parent().parent().find('td').eq(0).text();
    var hostname = $(ths).parent().parent().find('td').eq(1).text();
    var ip = $(ths).parent().parent().find('td').eq(2).text();
    var port = $(ths).parent().parent().find('td').eq(3).text();
    var username = $(ths).parent().parent().find('td').eq(4).text();
    var password = $(ths).parent().parent().find('td').eq(5).text();

    var csrftoken = $.cookie('csrftoken'); //去cookie中获取csrftoken的值
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $.ajax({
        url: '/index/',
        type: "post",
        data: {'status': status, 'group_name': group_name, 'id': id, 'hostname': hostname, 'ip': ip, 'port': port, 'username': username, 'password': password},
        dataType: 'json',
        success: function (data) {
            if(data.status){
                //console.log('提交成功');
                if(data.id) {
                    $(ths).parent().parent().find('td').eq(0).text(data.id);
                }
            }else {
                alert('数据保存失败！');
            }
        }
    })
}

//编辑单行数据
function EditHost(ths) {
    if($(ths).text() == '编辑') {
        OnEdit(ths);
    } else {
        //退出编辑模式
        OffEdit(ths);
        var group_name = $(ths).parent().parent().parent().parent().parent().parent().parent().prev().find('a').eq(0).text();
        SubmitHost(ths, 'edit',group_name)
    }
}

//删除单行数据
function DeleteHost(ths) {
    $(ths).parent().parent().remove();
    var group_name = $(ths).parent().parent().parent().parent().parent().parent().parent().prev().find('a').eq(0).text();
    SubmitHost(ths, 'delete', group_name);
}

//添加数据
function AddHost(ths) {
    var tr = $(ths).parent().parent().parent().next().find('tr').eq(0).clone();  //复制表格一行数据
    tr.find('td').eq(0).empty();
    tr.find('.edit_input').empty();
    $(ths).parent().parent().parent().next().append(tr); //表格追加数据
    OnEdit($(ths).parent().parent().parent().next().find('a').last());   //复制的数据改为编辑模式
}



function SubmitUser(ths, status) {
    //获取当前行数据，提交给后台
    var id = $(ths).parent().parent().find('td').eq(0).text();
    var username = $(ths).parent().parent().find('td').eq(1).text();
    var password = $(ths).parent().parent().find('td').eq(2).text();
    var hostgroup = [];
    $(ths).parent().parent().find('td').eq(3).find('span').each(function () {
        hostgroup.push($(this).text());
    });
    // console.log(hostgroup);

    var csrftoken = $.cookie('csrftoken'); //去cookie中获取csrftoken的值
    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $.ajax({
        url: '/user/',
        type: "post",
        data: {'status': status, 'id': id, 'username': username, 'password': password, 'hostgroup': hostgroup.join('_')},
        dataType: 'json',
        success: function (data) {
            if(data.status){
                //console.log('提交成功');
                if(data.id) {
                    $(ths).parent().parent().find('td').eq(0).text(data.id);
                }
            }else {
                alert('数据保存失败！');
            }
        }
    })
}

//编辑单行数据
function EditUser(ths) {
    if($(ths).text() == '编辑') {
        OnEdit(ths);
    } else {
        //退出编辑模式
        OffEdit(ths);
        SubmitUser(ths, 'edit')
    }
}

//删除单行数据
function DeleteUser(ths) {
    $(ths).parent().parent().remove();
    SubmitUser(ths, 'delete');
}

//添加数据
function AddUser(ths) {
    var tr = $(ths).parent().parent().parent().next().find('tr').eq(0).clone();  //复制表格一行数据
    tr.find('td').eq(0).empty();
    tr.find('.edit_input').empty();
    tr.find('.edit_select').empty();
    $(ths).parent().parent().parent().next().append(tr); //表格追加数据
    OnEdit($(ths).parent().parent().parent().next().find('a').last());   //复制的数据改为编辑模式
}

//判断两次输入是否相同
function CheckValid() {
    $('form td span').remove();  //如果原来有span标签，就删除

    var flag = true; //返回值，默认为true
    var old_password = $('#old_password').val();
    var new_password = $('#new_password').val();
    var re_password = $('#re_password').val();
    if(new_password != re_password){
        var tag = document.createElement('span');
            tag.style.color = 'red';
            tag.innerText = '*两次输入不一致';
            $('#re_password').after(tag);  //将span标签添加到当前输入框标签的后面
    }else {
        var csrftoken = $.cookie('csrftoken'); //去cookie中获取csrftoken的值
        function csrfSafeMethod(method) {
            // these HTTP methods do not require CSRF protection
            return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        $.ajax({
            url: '/user/',
            type: "post",
            data: {'status': 'update_pwd', 'old_password':old_password,'new_password':new_password,'re_password':re_password },
            dataType: 'json',
            success: function (data) {
                if(data.status){
                    //console.log('提交成功');
                    alert('密码修改成功！');
                    location.href = '/login/';
                }else {
                    if (data.message == 'pwd_diff') {
                        var tag = document.createElement('span');
                        tag.style.color = 'red';
                        tag.innerText = '*两次输入不一致';
                        $('#re_password').after(tag);  //将span标签添加到当前输入框标签的后面
                    }else if(data.message == 'pwd_error') {
                        var tag = document.createElement('span');
                        tag.style.color = 'red';
                        tag.innerText = '*密码错误';
                        $('#old_password').after(tag);  //将span标签添加到当前输入框标签的后面
                    }
                }
            }
        })
    }
}