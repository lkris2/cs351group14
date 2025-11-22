from math import radians, cos, sin, asin, sqrt
from .models import Driver, RideRequest

class DriverMatchingService:
    
    @staticmethod
    def haversine_distance(lat1, lon1, lat2, lon2):
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        km = 6371 * c
        return km
    
    def find_nearby_drivers(self, rider_lat, rider_lon, max_distance_km=5):
        available_drivers = Driver.objects.filter(
            is_available=True,
            user__is_active=True
        ).select_related('user')
        
        nearby = []
        for driver in available_drivers:
            if driver.user.current_latitude and driver.user.current_longitude:
                distance = self.haversine_distance(
                    rider_lat, rider_lon,
                    driver.user.current_latitude,
                    driver.user.current_longitude
                )
                if distance <= max_distance_km:
                    nearby.append({
                        'driver': driver,
                        'distance': round(distance, 2),
                        'user_info': {
                            'name': driver.user.name,
                            'rating': driver.rating,
                            'vehicle': driver.vehicle_info
                        }
                    })
        
        # Sort by distance
        return sorted(nearby, key=lambda x: x['distance'])

class RideManagementService:
    
    def create_ride_request(self, rider_id, pickup_lat, pickup_lon, dropoff_lat, dropoff_lon):
        ride = RideRequest.objects.create(
            rider_id=rider_id,
            pickup_latitude=pickup_lat,
            pickup_longitude=pickup_lon,
            dropoff_latitude=dropoff_lat,
            dropoff_longitude=dropoff_lon,
            status='SEARCHING'
        )
        return ride
    
    def assign_driver(self, ride_id, driver_id):
        ride = RideRequest.objects.get(ride_id=ride_id)
        ride.driver_id = driver_id
        ride.status = 'ACCEPTED'
        ride.save()
        
        # Make driver unavailable
        Driver.objects.filter(user_id=driver_id).update(is_available=False)
        return ride
    
    def mark_picked_up(self, ride_id):
        ride = RideRequest.objects.get(ride_id=ride_id)
        ride.status = 'IN_PROGRESS'
        ride.save()
        return ride
    
    def complete_ride(self, ride_id):
        ride = RideRequest.objects.get(ride_id=ride_id)
        ride.status = 'COMPLETED'
        ride.save()
        
        # Make driver available again
        if ride.driver:
            ride.driver.is_available = True
            ride.driver.save()
        return ride