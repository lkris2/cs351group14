from mongoengine import Document, StringField, EmailField, FloatField, ReferenceField, BooleanField, DateTimeField
from datetime import datetime

class Location(Document):
    lat = FloatField(required=True)
    long = FloatField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    meta = {'collection': 'locations'}

class Rider(Document):
    user_id = StringField(required=True, unique=True)  # references User._id
    name = StringField()
    location = ReferenceField(Location, null=True)
    created_at = DateTimeField(default=datetime.utcnow)
    meta = {'collection': 'riders'}

class Driver(Document):
    user_id = StringField(required=True, unique=True)  # references User._id
    name = StringField()
    vehicle_info = StringField()
    rating = FloatField(default=0.0)
    location = ReferenceField(Location, null=True)
    is_available = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    meta = {'collection': 'drivers'}

class RideRequest(Document):
    rider_id = StringField(required=True)  # references User._id
    driver_id = StringField(null=True)     # references User._id
    pickup = ReferenceField(Location, required=True)
    dropoff = ReferenceField(Location, required=True)
    pickup_str = StringField(default="Pick Up Loc")
    dropoff_str = StringField(default="Drop Off Loc")
    status = StringField(default="SEARCHING")  # SEARCHING, ACCEPTED, IN_PROGRESS, COMPLETED
    created_at = DateTimeField(default=datetime.utcnow)
    meta = {'collection': 'ride_requests'}

class User(Document):
    name = StringField(max_length=100, required=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    meta = {'collection': 'current_users'}
