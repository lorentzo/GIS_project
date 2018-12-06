from django.urls import path
from .views import *

urlpatterns = [
    path('', points, name='points'),
]
