from djongo import models
from django.contrib.auth.models import User
from django.db import models
from mongoengine import Document, StringField, EmailField

class Location(models.Model):
    lat = models.FloatField()
    long = models.FloatField()

class Rider(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True)


class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True)
    is_available = models.BooleanField(default=True)

class RideRequest(models.Model):
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, null=True, blank=True, on_delete=models.SET_NULL)
    pickup = models.ForeignKey(Location, related_name="pickup", on_delete=models.CASCADE)
    dropoff = models.ForeignKey(Location, related_name="dropoff", on_delete=models.CASCADE)
    pickupStr = models.CharField(max_length=20, default="Pick Up Loc")
    dropOffStr = models.CharField(max_length=20, default="Drop Up Loc")
    status = models.CharField(max_length=20, default="SEARCHING")  # SEARCHING, ACCEPTED, PICKED_UP, COMPLETED

class User(Document):
    name = StringField(max_length=100, required=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    _id = StringField(max_length=100, required=True)
    meta = {'collection': 'current_users'}
