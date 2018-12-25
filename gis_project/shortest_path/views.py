from django.shortcuts import render
import operator
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

        if not data:
            return HttpResponse(status=200)

        point_list_json = json.loads(data)

        if not point_list_json or len(point_list_json) < 2:
            return HttpResponse(status=200)

        point_list = Point.json2list(point_list_json)

        distances = {}

        for point_1 in point_list:
            for point_2 in point_list:
                if point_1.coordinate_x == point_2.coordinate_x and \
                        point_1.coordinate_y == point_2.coordinate_y:
                    continue
                if (point_1, point_2) in distances:
                    continue
                if (point_2, point_1) in distances:
                    continue

                start, end = get_endpoints(
                    point_1.coordinate_x,
                    point_1.coordinate_y,
                    point_2.coordinate_x,
                    point_2.coordinate_y
                )

                _, length = get_path_geometry(start, end)

                distances[(point_1, point_2)] = length
                distances[(point_2, point_1)] = length

        sorted_distances = sorted(distances.items(), key=operator.itemgetter(1))
        used_vertices = set()
        used_vertices_sets = []
        mst_path = []

        for sorted_distance in sorted_distances:

            point_1 = sorted_distance[0][0]
            point_2 = sorted_distance[0][1]
            distance = sorted_distance[1]

            if point_1 not in used_vertices and point_2 not in used_vertices:
                subset = set()
                subset.add(point_1)
                subset.add(point_2)

                used_vertices_sets.append(subset)

                used_vertices.add(point_1)
                used_vertices.add(point_2)

                mst_path.append((point_1, point_2, distance))

            elif point_1 not in used_vertices:
                subset_1 = None
                subset_2 = None

                for subset in used_vertices_sets:
                    if point_2 in subset:
                        if subset_1 is None:
                            subset_1 = subset
                        else:
                            subset_2 = subset

                if subset_1 is not None and subset_2 is not None:
                    used_vertices_sets.remove(subset_1)
                    used_vertices_sets.remove(subset_2)
                    union = subset_1.union(subset_2)
                    union.add(point_1)
                    used_vertices_sets.append(union)

                elif subset_1 is not None:
                    subset_1.add(point_1)

                used_vertices.add(point_1)
                mst_path.append((point_1, point_2, distance))

            elif point_2 not in used_vertices:
                subset_1 = None
                subset_2 = None

                for subset in used_vertices_sets:
                    if point_1 in subset:
                        if subset_1 is None:
                            subset_1 = subset
                        else:
                            subset_2 = subset

                if subset_1 is not None and subset_2 is not None:
                    used_vertices_sets.remove(subset_1)
                    used_vertices_sets.remove(subset_2)
                    union = subset_1.union(subset_2)
                    union.add(point_2)
                    used_vertices_sets.append(union)

                elif subset_1 is not None:
                    subset_1.add(point_2)

                used_vertices.add(point_2)
                mst_path.append((point_1, point_2, distance))

            # if len(mst_path) > len(point_list) - 1:
            #     break

            elif len(mst_path) == len(point_list)-2:
                    subset_1 = None
                    subset_2 = None

                    for subset in used_vertices_sets:
                        if point_1 in subset:
                            subset_1 = subset
                        if point_2 in subset:
                            subset_2 = subset

                    if subset_1 != subset_2:
                        mst_path.append((point_1, point_2, distance))

            if len(mst_path) >= len(point_list)-1:
                break

        total_path = []

        for single_path in mst_path:
            start, end = get_endpoints(
                single_path[0].coordinate_x,
                single_path[0].coordinate_y,
                single_path[1].coordinate_x,
                single_path[1].coordinate_y,
            )

            path_geometry, length = get_path_geometry(start, end)
            path_list = []

            for line in path_geometry:
                deserialized = json.loads(line)
                path_list += deserialized['coordinates']

            total_path.append({'path_list': path_list, 'distance': length})

        # import pdb
        # pdb.set_trace()

        response_data = json.dumps(total_path)

        data = {'response_data': response_data, 'success': True}

        return JsonResponse(data)

    return HttpResponse(status=403)