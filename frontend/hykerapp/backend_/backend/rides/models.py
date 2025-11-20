from djongo import models

class Location(models.Model):
    lat = models.FloatField()
    long = models.FloatField()

class Rider(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
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
    status = models.CharField(max_length=20, default="SEARCHING")  # SEARCHING, ACCEPTED, PICKED_UP, COMPLETED
