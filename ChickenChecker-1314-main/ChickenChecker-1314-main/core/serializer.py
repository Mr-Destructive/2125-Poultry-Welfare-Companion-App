from rest_framework import serializers
from . models import *
from django.contrib.auth.models import User, Group



class GroupSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Group
        fields = ('name',)

class LoginSerializer(serializers.ModelSerializer):
	groups = GroupSerializer(many=True)
	class Meta:
		model = User
		fields = ['id', 'username', 'first_name', 'last_name', 'email', 'groups',]

class MonitorSerializer(serializers.ModelSerializer):
	class Meta:
		model = Monitor
		fields = ['id', 'status', 'name', 'house', 'posX', 'posY']

class HouseSerializer(serializers.ModelSerializer):
	class Meta:
		model = House
		fields = ['id', 'status', 'farm', 'length', 'width', 'doorCount', 'monitorCount', 'lastFlockEntry', 'flockAge']

class FarmSerializer(serializers.ModelSerializer):
	user = LoginSerializer()
	class Meta:
		model = Farm
		fields = ['id', 'status', 'user', 'name', 'lat', 'long', 'complex', 'houseCount']

class ComplexSerializer(serializers.ModelSerializer):
	class Meta:
		model = Complex
		fields = ['id', 'status', 'user', 'name', 'long', 'lat', 'farmCount']


