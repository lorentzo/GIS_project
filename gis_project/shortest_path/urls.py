from django.urls import path
from .views import *

urlpatterns = [
    path('', points, name='points'),
    path('points/list', list_points, name='list_points'),
    path('points/create', create_point, name='create_point'),
    path(r'^points/delete/(?P<id>\d+)/$', delete_point, name='delete_point')
]
