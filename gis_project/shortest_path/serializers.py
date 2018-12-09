from rest_framework import serializers
from .models import Point


class PointSerializer(serializers.ModelSerializer):

    class Meta:
        model = Point
        fields = ('name', 'coordinate_x', 'coordinate_y')