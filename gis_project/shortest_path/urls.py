from django.urls import path
from .views import *

urlpatterns = [
    path('', get_points, name='get_point'),
]
