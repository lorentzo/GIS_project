from django.db import models

# Create your models here.


class Point(models.Model):
    name = models.CharField(max_length=128, blank=True, default="Untitled")
    coordinate_x = models.FloatField(blank=True)
    coordinate_y = models.FloatField(blank=True)
