from django.db import models
import json

# Create your models here.


class Point(models.Model):
    name = models.CharField(max_length=128, blank=True, default="Untitled")
    coordinate_x = models.FloatField(blank=True)
    coordinate_y = models.FloatField(blank=True)

    @staticmethod
    def json2list(json_list):
        point_list = []
        for json_point in json_list:
            point_list.append(Point(
                name=json_point[0],
                coordinate_x=float(json_point[1]),
                coordinate_y=float(json_point[2])))
        return point_list

    def __eq__(self, other):
        if isinstance(other, Point):
            return self.coordinate_x == other.coordinate_x and self.coordinate_y == other.coordinate_y
        return False

    def __hash__(self):
        return hash((self.coordinate_x, self.coordinate_y))

    def __str__(self):
        return self.name
