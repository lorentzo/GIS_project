from django.shortcuts import render

from .path import get_endpoints, get_path_geometry
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


def calculate_shortest_path(request):
    if request.method == 'GET':
        data = request.GET.get('point_list', None)
        point_list = Point.json2list(data)

        dummy_points_json = serializers.serialize('json', point_list)
        points_json_object = json.loads(dummy_points_json)
        points_json_object.append({'success': True})

        json_response = json.dumps(points_json_object)

        return HttpResponse(json_response, content_type="application/json")

    return HttpResponse(status=403)