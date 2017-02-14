from django.shortcuts import render, redirect, HttpResponse
from app01 import models
import json


# Create your views here.
def auth(func):
    """
    装饰器，验证用户是否登录，登录显示；未登录返回登录页面
    :param func:
    :return:
    """
    def inner(request, *args, **kwargs):
        user = request.session.get('user', None)
        if not user:
            return redirect('/login/')
        return func(request, *args, **kwargs)
    return inner


@auth
def index(request):
    """
    用户详情页
    :param request:
    :return:
    """
    if request.POST:
        ret = {'status': False, 'id':None}
        status = request.POST.get('status')
        group_name = request.POST.get('group_name')
        host_id = request.POST.get('id')
        hostname = request.POST.get('hostname')
        ip = request.POST.get('ip')
        port = request.POST.get('port')
        username = request.POST.get('username')
        password = request.POST.get('password')
        if status == 'edit':  # 修改数据
            if host_id:  # 有id，修改数据
                models.Host.objects.filter(id=host_id).update(hostname=hostname, ip=ip, port=port, username=username, password=password)
                ret['status'] = True
            else:  # 无id，添加数据
                models.Host.objects.create(hostname=hostname, ip=ip, port=port, username=username, password=password, group=models.HostGroup.objects.get(name=group_name))
                id = models.Host.objects.get(hostname=hostname, ip=ip, port=port, username=username, password=password).id
                ret['id'] = id
                ret['status'] = True
        elif status == 'delete':  # 删除数据
            models.Host.objects.filter(id=host_id).delete()
            ret['status'] = True
        return HttpResponse(json.dumps(ret))
    else:
        user_info = {'user': None, 'message': {}}
        user = request.session.get('user', None)
        user_info['user'] = user
        user_obj = models.User.objects.get(user=user)
        group_objs = user_obj.group.all()
        # print(group_objs)
        for group in group_objs:
            host_objs = group.host_set.all()
            user_info['message'][group.name] = []
            for host in host_objs:
                user_info['message'][group.name].append(host)
        # print(user_info)
        return render(request, 'index.html', user_info)


def login(request):
    """
    登录
    :param request:
    :return:
    """
    if request.POST:
        username = request.POST.get('username')
        password = request.POST.get('password')
        ret = models.User.objects.filter(user=username, pwd=password)
        if len(ret):  # 匹配成功
            request.session['user'] = username
            return redirect('/index/')
    return render(request, 'login.html')


def logout(request):
    """
    注销
    :param request:
    :return:
    """
    del request.session['user']
    return redirect('/login/')