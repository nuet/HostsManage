# HostsManage 主机管理系统

# 需求 #
> 1. 通过前端页面实现操作后台数据库：实现增删改查
> 2. 实现主机分组
> 3. 实现不同的用户可以管理不同的主机
> 4. 在前端可以对主机信息实现增删改查"

# django后台管理页面 #
> - http://127.0.0.1/admin/
> - 账号密码：admin/admin123

# 主机管理系统用户信息 #
> 超级管理员：admin/123456
> 
> 普通用户：alex/123


# 数据库设计 #
## HostGroup ##
> id  groupname
## Host ##
> id  hostname    ip  port  username    password hostgroup_id
## User ##
> id  user    pwd
## HostGroup_To_User ##
> id  hostgroup_id    user_id


# 功能实现 #

## 通过前端页面实现操作后台数据库：实现增删改查 ##
> 前端修改数据，然后通过form或ajax提交到Django后台，然后写入数据库

## 实现主机分组 ##
> 通过Django的models进行数据库设计

## 实现不同的用户可以管理不同的主机 ##
> Django数据库多对多设计：一个用户可能管理多个主机组；一个主机组可能被多个用户管理
