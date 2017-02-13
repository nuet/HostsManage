# HostsManage
主机管理系统

通过前端页面实现操作后台数据库：实现增删改查
实现主机分组
实现不同的用户可以管理不同的主机
在前端可以对主机信息实现增删改查"

django后台管理页面
admin/admin123


数据库
HostGroup
    id  groupname
Host
    id  hostname    ip  port  username    password  hostgroup_id
User
    id  user    pwd

HostGroup_To_User
    id  hostgroup_id    user_id


访问index
    判断是否登录
        未登录-----跳转到登录页
        已登录-----显示个人信息
            显示当前用户能够管理的主机
                根据用户信息查找当前用户对应的主机组（可管理的主机组）
                    根据主机组查找对应的所有主机信息
                        对主机信息进行增删改查操作