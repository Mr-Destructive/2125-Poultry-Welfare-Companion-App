from django.shortcuts import redirect, render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate


from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer

#import { View, StyleSheet, Button, Alert } from "react-native";

from .serializer import *
from .models import *
from core.data.heatmap import *
from core.pdf_gen import house_report
import datetime as dt

from .analysis import *



class LoginView(APIView):

	model = User
	def post(self, request, format=None):
		res = request.data['params']
		user_exists = User.objects.filter(username = res['user'].lower()).exists()
		if user_exists:
			# username was valid
			user = User.objects.get(username = res['user'].lower())
			print("User:", user)
		else:
			# username was invalid; return 404
			# print("none")
			return Response(status=status.HTTP_404_NOT_FOUND)

		u = authenticate(username=res['user'].lower(), password=res['pass'].lower())
		
		if u is None:
			# password was invalid
			return Response(status=status.HTTP_400_BAD_REQUEST)
		else:
			# valid username & pass
			serializer = LoginSerializer(u)
			print(serializer.data)
			return Response(serializer.data)
			

@api_view(['GET'])
def listComplexes(request, userid):
	user = User.objects.get(id=userid)
	comps = user.complexes.all() 
	serializer = ComplexSerializer(comps, many=True)
	return Response(serializer.data)

@api_view(['GET'])
def listCompFarms(request, complexid):
	comp = Complex.objects.get(id=complexid)
	farms = Farm.objects.filter(complex_id=complexid)
	serializer = FarmSerializer(farms, many=True)
	return Response(serializer.data)

@api_view(['GET'])
def generateHeatmap(request, houseID, format=None):
	h = House.objects.get(id=houseID)
	map = Heatmap(house = h)
	map.update_heatmap()
	return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
def pdf_update(request, houseID, format=None):
	h = House.objects.get(id=houseID)
	house_report(h)
	return Response(data="visuals/houses/5/report.pdf")


@api_view(['POST'])
def deleteFarm(request, farmid):
    farm = Farm.objects.get(id=farmid)
    farm.complex = None
    farm.save()
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def addFarm(request, complexid):
    resp = request.data['params']
    u = User.objects.get(email=resp['farmeremail'])
    if u is None:
      return Response("No such user", status=status.HTTP_404_NOT_FOUND)

    farm = Farm.objects.get(name=resp['farmname'])
    if farm is None:
      return Response("No such farm", status=status.HTTP_404_NOT_FOUND)
    farm.complex = Complex.objects.get(id=complexid)
    farm.save()
    return Response(status=status.HTTP_200_OK)


@api_view(['GET'])
def listHouses(request, userid):
    user = User.objects.get(id=userid)
    farms = Farm.objects.filter(user=user)
    if farms:
        houses = House.objects.filter(farm=farms[0])
        serializer = HouseSerializer(houses, many=True)
        return Response(serializer.data)
    complexid = Complex.objects.get(user=user.id)
    return redirect("addfarm", complexid.id)

@api_view(['POST'])
def updateUsername(request):
	resp = request.data['params']
	u = User.objects.get(username=resp['old_username'])
	if u is None:
		return Response("No such user", status=status.HTTP_404_NOT_FOUND)
	u.username = resp['new_username']
	u.save()
	return Response(data=u.username, status=status.HTTP_200_OK)

@api_view(['POST'])
def updatePassword(request):
	resp = request.data['params']
	u = User.objects.get(username=resp['username'])
	if u is None:
		return Response("No such user", status=status.HTTP_404_NOT_FOUND)
	u.set_password(resp['new_password'])
	u.save()
	return Response(data=u.password, status=status.HTTP_200_OK)

@api_view(['POST'])
def validatePassword(request):
		res = request.data['params']
		u = authenticate(username=res['user'].lower(), password=res['pass'].lower())
		
		if u is not None:
			serializer = LoginSerializer(u)
			return Response(serializer.data)

		return Response(False) 
