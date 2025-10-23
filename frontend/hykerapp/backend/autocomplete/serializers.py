from rest_framework import serializers
from .models import SearchTerm

class SearchTermSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchTerm
        fields = ['term', 'frequency']