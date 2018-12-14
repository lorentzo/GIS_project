from django.db import models
import json

# Create your models here.


class Point(models.Model):
    name = models.CharField(max_length=128, blank=True, default="Untitled")
    coordinate_x = models.FloatField(blank=True)
    coordinate_y = models.FloatField(blank=True)

    @staticmethod
    def json2list(json_list):
        json_points = json.loads(json_list)
        point_list = []

        for _point in json_points:
            point_list.append(Point(coordinate_x=float(_point[0]), coordinate_y=float(_point[1])))
        return point_list
