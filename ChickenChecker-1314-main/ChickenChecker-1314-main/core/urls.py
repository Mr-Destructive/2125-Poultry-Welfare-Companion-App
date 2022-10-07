from django.urls import path
from .views import *

urlpatterns = [
    path('', LoginView.as_view(), name='login'),
    path('farmer/<int:userid>', listHouses, name='farmFarmView'),
    path('farmer/house/<int:houseID>', generateHeatmap, name='heatmap'),
    path('report/house/<int:houseID>', pdf_update, name='pdf_update'),    
    path('integrator/<int:userid>', listComplexes, name='complexManagement'),
    path('integrator/complex/<int:complexid>', listCompFarms, name='ComplexView'),
    path('integrator/complex/delete/farm/<int:farmid>', deleteFarm),
    path('integrator/complex/<int:complexid>/add/farm', addFarm, name="addfarm"),
    path('update_username', updateUsername, name='updateUsername'),
    path('update_password', updatePassword, name='updatePassword'),
    path('validate_password', validatePassword, name='validatePassword'),
]
