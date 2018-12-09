from django.urls import path
from .views import *

urlpatterns = [
    path('', points, name='points'),
    path('points/create', create_point, name='create_point'),
    path(r'^points/delete/(?P<id>\d+)/$', delete_point, name='delete_point')
]
