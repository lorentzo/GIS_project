from django.shortcuts import render
from .models import *
from django.http import HttpResponse


def get_points(request):
    return HttpResponse("What a wonderful world...")