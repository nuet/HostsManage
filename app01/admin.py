from django.contrib import admin
from app01 import models


# Register your models here.
admin.site.register(models.HostGroup),
admin.site.register(models.Host),
admin.site.register(models.User),
