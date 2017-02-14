/**
 * Created by Administrator on 2016/12/22.
 */

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
}

function Submit(ths, status, group_name) {
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
function Edit(ths) {
    if($(ths).text() == '编辑') {
        OnEdit(ths);
    } else {
        //退出编辑模式
        OffEdit(ths);
        var group_name = $(ths).parent().parent().parent().parent().parent().parent().parent().prev().find('a').eq(0).text();
        Submit(ths, 'edit',group_name)
    }
}

//删除单行数据
function Delete(ths) {
    $(ths).parent().parent().remove();
    var group_name = $(ths).parent().parent().parent().parent().parent().parent().parent().prev().find('a').eq(0).text();
    Submit(ths, 'delete', group_name);
}

//添加数据
function Add(ths) {
    var tr = $(ths).parent().parent().parent().next().find('tr').eq(0).clone();  //复制表格一行数据
    tr.find('td').eq(0).empty();
    tr.find('.edit_input').empty();
    $(ths).parent().parent().parent().next().append(tr); //表格追加数据
    OnEdit($(ths).parent().parent().parent().next().find('a').last());   //复制的数据改为编辑模式
}