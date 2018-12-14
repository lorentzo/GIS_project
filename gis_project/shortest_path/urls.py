from django.urls import path
from .views import *

urlpatterns = [
    path('', points, name='points'),
    path('points/list', list_points, name='list_points'),
    path('points/create', create_point, name='create_point'),
    path('paths/shortest_for_points', calculate_shortest_path, name='calculate_shortest_path'),
    path(r'^points/delete/(?P<id>\d+)/$', delete_point, name='delete_point')
]
