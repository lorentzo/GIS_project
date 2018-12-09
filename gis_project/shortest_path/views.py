from django.shortcuts import render
from .models import *
from .forms import *
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
# from .serializers import *
from django.core import serializers
import json


def create_point(request):
    if request.method == "POST":
        form = PointForm(request.POST)

        if form.is_valid():
            point = form.save(commit=False)
            point.save()

            return redirect('points')

    return HttpResponse(status=403)


def delete_point(request, id):
    if request.method == 'POST':
        point = Point.objects.get(id=id)
        point.delete()

        return redirect('points')

    return HttpResponse(status=403)


def list_points(request):
    if request.method == 'GET':

        # import pdb
        # pdb.set_trace()

        points = Point.objects.all()

        points_json = serializers.serialize('json', points)
        points_json_object = json.loads(points_json)
        points_json_object.append({'success': True})

        json_response = json.dumps(points_json_object)

        return HttpResponse(json_response, content_type="application/json")

    return HttpResponse(status=403)


def points(request):
    if request.method == 'GET':
        form = PointForm()
        points = Point.objects.all()

        return render(request, 'index.html', {'form': form, 'points': points})

    return HttpResponse(status=403)
