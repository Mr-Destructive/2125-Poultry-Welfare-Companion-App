from django.contrib import admin

from django.contrib.auth.models import User
from .models import Complex, Farm, House, Monitor, Data

class FarmInline(admin.TabularInline):
    model = Farm

class HouseInline(admin.TabularInline):
    model = House

class MonitorInline(admin.TabularInline):
    model = Monitor

class ComplexAdmin(admin.ModelAdmin):
  model = Complex
  list_display = ('name', 'user', 'lat', 'long')
  inlines = [
    FarmInline,
  ]
  

admin.site.register(Complex, ComplexAdmin)
  # @admin.display(empty_value='unknown')
  # def users(self, obj):
  #   return obj.user.name
 


class FarmAdmin(admin.ModelAdmin):
  list_display = ('name', 'user', 'lat', 'long', 'complex', 'status')

  model = Farm
  inlines = [
    HouseInline,
  ]

admin.site.register(Farm, FarmAdmin)

  
class HouseAdmin(admin.ModelAdmin):
  model = House
  list_display = ('farm', 'length', 'width', 'doorCount', 'monitorCount', 'status', 'lastFlockEntry')

  inlines = [
    MonitorInline,
  ]

admin.site.register(House, HouseAdmin)

class MonitorAdmin(admin.ModelAdmin):
  model = Monitor
  list_display = ('house', 'name', 'posX', 'posY', 'status',)


admin.site.register(Monitor, MonitorAdmin)

class DataAdmin(admin.ModelAdmin):
  model = Data
  list_display = ('monitor', 'timestamp', 'events_1', 'events_2', 'events_3', 'events_4', 'events_5',)

admin.site.register(Data, DataAdmin)



# Register your models here.
