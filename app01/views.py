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


@auth
def user(request):
    """
    用户中心
    :param request:
    :return:
    """
    user = request.session.get('user', None)
    if request.POST:
        ret = {'status': False}
        status = request.POST.get('status')
        if status == 'update_pwd':
            old_password = request.POST.get('old_password')
            new_password = request.POST.get('new_password')
            re_password = request.POST.get('re_password')
            if len(models.User.objects.filter(user=user, pwd=old_password)) > 0:  # 原密码正确
                if new_password == re_password:  # 两次密码输入相同
                    models.User.objects.filter(user=user).update(pwd=new_password)
                    ret['status'] = True
                    del request.session['user']
                else:  # 密码输入不一致
                    ret['message'] = 'pwd_diff'
            else:  # 原密码错误
                ret['message'] = 'pwd_error'
        else:
            user_id = request.POST.get('id')
            username = request.POST.get('username')
            password = request.POST.get('password')
            hostgroup = request.POST.get('hostgroup')
            # print(hostgroup)

            if status == 'edit':  # 修改数据
                if user_id:  # 有id，修改数据
                    models.User.objects.filter(id=user_id).update(user=username, pwd=password)
                    for groupname in hostgroup.split('_'):
                        group_obj = models.HostGroup.objects.get(name=groupname)
                        models.User.objects.get(id=user_id).group.add(group_obj)
                    ret['id'] = None
                    ret['status'] = True
                else:  # 无id，添加数据
                    models.User.objects.create(user=username, pwd=password)
                    id = models.User.objects.get(user=username, pwd=password).id
                    for groupname in hostgroup.split('_'):
                        group_obj = models.HostGroup.objects.get(name=groupname)
                        models.User.objects.get(id=id).group.add(group_obj)

                    ret['id'] = id
                    ret['status'] = True
            elif status == 'delete':  # 删除数据
                models.User.objects.filter(id=user_id).delete()
                ret['status'] = True
        return HttpResponse(json.dumps(ret))
    else:
        user_info = {'user': None, 'message': {}}
        user_info['user'] = user
        user_obj = models.User.objects.filter(user=user).first()
        user_info['user_id'] = user_obj.id
        if user == 'admin':
            user_all = models.User.objects.exclude(user='admin')
            # user_info['message'] = user_all

            for u in user_all:
                u_groups = models.User.objects.get(user=u).group.all()
                user_info['message'][u] = u_groups

            groups = models.HostGroup.objects.all()
            user_info['groups'] = []
            for group in groups:
                user_info['groups'].append(group.name)
        return render(request, 'user.html', user_info)


@auth
def get_groups(request):
    """
    获取主机组信息
    :param request:
    :return:
    """
    ret = {'status': False, 'message': None}
    if request.POST:
        groups = models.HostGroup.objects.all()
        ret['message'] = []
        for group in groups:
            ret['message'].append(group.name)
        ret['status'] = True
    return HttpResponse(json.dumps(ret))
