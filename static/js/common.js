/**
 * Created by Administrator on 2016/12/22.
 */
//num = 0;  //全局变量：0代表非编辑模式  1代表编辑模式

//全选
function SelectAll(ths) {
    num = $(ths).parent().attr('num');
    if(num == '0') {
        $(ths).parent().next().find("input[type='checkbox']").prop('checked',true);
    } else {
        $(ths).parent().next().find("input[type='checkbox']").each(function () {
            //判断是否选中，选中则取消；没有则选中
            if($(this).prop('checked') == false) {
                OnEdit(this);  //进入编辑模式
            }
         });
        $(ths).parent().next().find("input[type='checkbox']").prop('checked',true);
    }
}
//取消
function CancelAll(ths) {
    num = $(ths).parent().attr('num');
    if(num == "0"){
        $(ths).parent().next().find("input[type='checkbox']").prop('checked',false);
    } else {
        //循环所有input标签
        $(ths).parent().next().find("input[type='checkbox']").each(function () {
            if($(this).prop('checked')) {
                OffEdit(this);//退出编辑模式
            }
        });
        $(ths).parent().next().find("input[type='checkbox']").prop('checked',false);
    }
}
//反选
function ReverseAll(ths) {
    num = $(ths).parent().attr('num');
    if(num == "0") {
        //循环所有input标签
        $(ths).parent().next().find("input[type='checkbox']").each(function () {
            //判断是否选中，选中则取消；没有则选中
            if ($(this).prop('checked')) {
                $(this).prop('checked', false);
            } else {
                $(this).prop('checked', true);
            }
        })
    } else {
        //循环所有input标签
        $(ths).parent().next().find("input[type='checkbox']").each(function () {
            //判断是否选中，选中则取消；没有则选中
            if ($(this).prop('checked')) {
                OffEdit(this);//退出编辑模式
                $(this).prop('checked', false);
            } else {
                $(this).prop('checked', true);
                OnEdit(this);  //进入编辑模式
            }
        })
    }
}

//编辑模式切换
function ChangeMode(ths) {
    num = $(ths).parent().attr('num');
    //0代表非编辑模式  1代表编辑模式
    if(num == "0") {  //原来是非编辑模式，点击后变成编辑模式
        $(ths).parent().attr('num', "1");
        $(ths).addClass('editmode');  //变换成编辑模式的样式
        //循环所有input标签
        $(ths).parent().next().find("input[type='checkbox']").each(function () {
            //判断是否选中，选中则取消；没有则选中
            if($(this).prop('checked') && $(this).parent().parent().find("a").eq(0).text() == '编辑') {
                OnEdit(this);  //进入编辑模式
            }
         });

    } else { //原来是编辑模式，点击后变成非编辑模式
        $(ths).parent().attr('num', "0");
//                console.log('非编辑模式');
        $(ths).removeClass('editmode');  //删除编辑模式的样式
        //循环所有input标签
        $(ths).parent().next().find("input[type='checkbox']").each(function () {
            if($(this).prop('checked')) {
                OffEdit(this);//退出编辑模式
            }
        });
    }
}

//进入编辑模式
function OnEdit(ths) {
    $(ths).parent().parent().find('a').eq(0).text('保存');
    //将内容变为文本输入框
    $(ths).parent().parent().find('.edit_input').each(function () {//找到所有需要变成文本输入框的标签，然后遍历
//                            console.log($(this).text());
        var t = document.createElement('input'); //创建input标签
        t.setAttribute('type','text'); //深圳type为text
        t.value = $(this).text();  //将原来标签的值赋给input标签
        $(this).empty(); //清空原标签的内容
        $(this).html(t); //将input标签插入
    });

    //将内容变为下拉选择框
    $(ths).parent().parent().find('.edit_select').each(function () {
//                            console.log($(this).text());
        var text = $(this).text();  //获取标签的内容
        var select = document.createElement('select');  //创建select标签
        $(select).html("<option>在线</option><option>下线</option>");  //select标签中添加option选项
        //原来td标签中的值是什么，就选中哪个option标签
        $(select).find('option').each(function () {
           if($(this).text() == text) {
               $(this).attr('selected',true);
           }
        });
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
        text_select = $(this).find('option:selected').val();//获取当前下拉框选中的值
        $(this).empty();//清空td标签
        $(this).text(text_select);//将select下拉框位普通内容
    })
}

//编辑模式下，选中或取消checkbox也能进入退出编辑状态
$('table input[type="checkbox"]').click(function () {
    num = $(this).parent().parent().parent().parent().prev().attr('num');
    //编辑模式下，点击CheckBox也能进入退出编辑模式
    if(num == "1") {
        if($(this).prop('checked')) {  //选中，进入编辑模式
            OnEdit(this);
        } else {  //取消选中，退出编辑模式
            OffEdit(this);
        }
    } else if(num == '0' && $(this).parent().parent().find('a').eq(0).text() == '保存') {
        if($(this).prop('checked') == false) {
            OffEdit(this);
        }
    }
});


//批量删除
function DeleteSelect(ths) {
    $(ths).parent().next().find("input[type='checkbox']").each(function () {
        //判断是否选中，选中则删除
        if($(this).prop('checked')) {
            $(this).parent().parent().remove();
        }
     });
}


//编辑单行数据
function Edit(ths) {
    if($(ths).text() == '编辑') {
        if($(ths).parent().parent().find('input[type="checkbox"]').prop('checked') == false) {
            $(ths).parent().parent().find('input[type="checkbox"]').prop('checked', true);
        }
        OnEdit(ths);
    } else {
        if($(ths).parent().parent().find('input[type="checkbox"]').prop('checked')) {
            $(ths).parent().parent().find('input[type="checkbox"]').prop('checked', false)
        }
        OffEdit(ths);
    }
}

//删除单行数据
function Delete(ths) {
    $(ths).parent().parent().remove();
}