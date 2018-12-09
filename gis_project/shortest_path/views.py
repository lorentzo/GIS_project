from django.shortcuts import render
from .models import *
from .forms import *
from django.http import HttpResponse
from django.shortcuts import redirect


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


def points(request):
    if request.method == 'GET':
        form = PointForm()
        points = Point.objects.all()

        return render(request, 'index.html', {'form': form, 'points': points})

    return HttpResponse(status=403)
