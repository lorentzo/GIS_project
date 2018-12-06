from django.shortcuts import render
from .models import *
from django.http import HttpResponse


def points(request):
    if request.method == 'GET':
        points = Point.objects.all()

        return render(request, 'index.html', {'points': points})

    return HttpResponse(status=400)