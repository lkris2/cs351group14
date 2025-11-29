from django.contrib import admin
from .models import Location, Rider, Driver, RideRequest

admin.site.register(Location)
admin.site.register(Rider)
admin.site.register(Driver)
admin.site.register(RideRequest)