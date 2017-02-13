from django.db import models


# Create your models here.
class HostGroup(models.Model):
    name = models.CharField(max_length=32)

    def __str__(self):
        return self.name


class Host(models.Model):
    hostname = models.CharField(max_length=32)
    ip = models.GenericIPAddressField()
    port = models.IntegerField()
    username = models.CharField(max_length=32)
    password = models.CharField(max_length=32)
    group = models.ForeignKey('HostGroup')

    def __str__(self):
        return self.hostname


class User(models.Model):
    user = models.CharField(max_length=32)
    pwd = models.CharField(max_length=32)
    group = models.ManyToManyField('HostGroup')

    def __str__(self):
        return self.user
