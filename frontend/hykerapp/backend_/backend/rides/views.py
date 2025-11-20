from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Rider, Driver, Location, RideRequest
import math

@api_view(['POST'])
def request_ride(request):
    rider_id = request.data['rider_id']
    pickup_lat = request.data['pickup_lat']
    pickup_long = request.data['pickup_long']
    drop_lat = request.data['drop_lat']
    drop_long = request.data['drop_long']

    rider = Rider.objects.get(id=rider_id)

    pickup = Location.objects.create(lat=pickup_lat, long=pickup_long)
    dropoff = Location.objects.create(lat=drop_lat, long=drop_long)

    ride = RideRequest.objects.create(
        rider=rider,
        pickup=pickup,
        dropoff=dropoff
    )

    return Response({"ride_id": ride.id, "status": ride.status})

def distance(lat1, lng1, lat2, lng2):
    return math.sqrt((lat1 - lat2)**2 + (lng1 - lng2)**2)

@api_view(['GET'])
def drivers_nearby(request):
    rider_lat = float(request.query_params['lat'])
    rider_long = float(request.query_params['long'])

    drivers = Driver.objects.filter(is_available=True)

    nearby_drivers = []
    for driver in drivers:
        dist = distance(rider_lat, rider_long, driver.location.lat, driver.location.long)
        nearby_drivers.append({
            "driver_id": driver.id,
            "distance": dist,
            "lat": driver.location.lat,
            "long": driver.location.long
        })

    nearby_drivers.sort(key=lambda x: x['distance'])

    return Response(nearby_drivers[:5]) # closest 5 drivers


@api_view(['POST'])
def accept_ride(request):
    ride_id = request.data['ride_id']
    driver_id = request.data['driver_id']

    ride_req = RideRequest.objects.get(id=ride_id)
    driver = Driver.objects.get(id=driver_id)

    ride_req.driver = driver
    ride_req.status = "ACCEPTED"
    ride_req.save()

    return Response({"status": "ACCEPTED"})
