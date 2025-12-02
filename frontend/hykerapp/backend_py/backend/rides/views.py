import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Rider, Driver, Location, RideRequest, User
import math
from django.http import HttpResponse, JsonResponse
from mongoengine import connect
from bson import ObjectId
# connect(
#     host=os.environ.get('MONGO_DB')
# )

from .pathfinding import load_nodes, make_graph, get_nearest_node, a_star, build_components
from django.views.decorators.csrf import csrf_exempt
import json

base_directory = os.path.dirname(os.path.abspath(__file__))
nodes = os.path.join(base_directory,"nodes.csv")
edges = os.path.join(base_directory,"edges.csv")


try:
    coord_map = load_nodes(nodes)
    graph = make_graph("car", path=edges)
    components = build_components(graph)
except Exception as exc:
    coord_map = None
    graph = None
    components = None
    startup_error = str(exc)

@api_view(['POST'])
def request_ride(request):
    rider_id = request.data.get('rider_id')
    pickup_lat = request.data.get('pickup_lat')
    pickup_long = request.data.get('pickup_long')
    drop_lat = request.data.get('drop_lat')
    drop_long = request.data.get('drop_long')
    pickup_s = request.data.get('pickup_s', 'Pick Up Loc')
    dropoff_s = request.data.get('dropoff_s', 'Drop Off Loc')
    
    if not all([rider_id, pickup_lat, pickup_long, drop_lat, drop_long]):
        return Response(
            {"error": "Missing required fields"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    try:
        # Fetch the user to get their name
        user = User.objects(id=rider_id).first()
        print("user", user.name)
        user_name = user.name if user else "Rider"
        
        # Check if rider exists, if not create one with user's actual name
        rider = Rider.objects(user_id=rider_id).first()
        if not rider:
            rider = Rider(user_id=rider_id, name=user_name).save()
        
        # Create locations
        pickup = Location(lat=pickup_lat, long=pickup_long).save()
        dropoff = Location(lat=drop_lat, long=drop_long).save()
        
        # Create ride request
        ride = RideRequest(
            rider_id=rider_id,
            pickup=pickup,
            dropoff=dropoff,
            pickup_str=pickup_s,
            dropoff_str=dropoff_s
        ).save()
        
        return Response({"ride_id": str(ride.id), "status": ride.status}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error creating ride: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def find_route(request):
    pickup_lat = float(request.query_params['pickup_lat'])
    pickup_long = float(request.query_params['pickup_long'])
    drop_lat = float(request.query_params['drop_lat'])
    drop_long = float(request.query_params['drop_long'])

    route_coords = []
    if coord_map is not None and graph is not None:
        try:
            all_car_nodes = set(graph.keys())
            start_id = get_nearest_node(pickup_lat, pickup_long, coord_map,all_car_nodes)
            if components and start_id in components:
                start_comp = components[start_id]
                same_comp_nodes = set()
                for nid, cid in components.items():
                    if cid == start_comp:
                        same_comp_nodes.add(nid)
                end_id = get_nearest_node(drop_lat, drop_long, coord_map, same_comp_nodes) or get_nearest_node(drop_lat, drop_long, coord_map, all_car_nodes)
            else:
                end_id = get_nearest_node(drop_lat, drop_long, coord_map, all_car_nodes)

            if start_id and end_id:
                path_node_ids = a_star(graph,start_id,end_id,coord_map)
                
                if path_node_ids:
                    route_coords = []
                    for n in path_node_ids:
                        lat = coord_map[n][0]
                        lon = coord_map[n][1]

                        coord_dict = {
                            "lat" : lat,
                            "lon" : lon
                        }
                        route_coords.append(coord_dict)
        except:
            route_coords = []

    return Response({"route": route_coords})

def distance(lat1, lng1, lat2, lng2):
    return math.sqrt((lat1 - lat2)**2 + (lng1 - lng2)**2)

@api_view(['GET'])
def drivers_nearby(request):
    rider_lat = float(request.query_params.get('lat', 0))
    rider_long = float(request.query_params.get('long', 0))

    drivers = Driver.objects(is_available=True)

    nearby_drivers = []
    for driver in drivers:
        if driver.location:
            dist = distance(rider_lat, rider_long, driver.location.lat, driver.location.long)
            nearby_drivers.append({
                "driver_id": str(driver.id),
                "distance": dist,
                "lat": driver.location.lat,
                "long": driver.location.long
            })

    nearby_drivers.sort(key=lambda x: x['distance'])

    return Response(nearby_drivers[:5])

@api_view(['GET'])
def my_rides(request, mongo_user_id):
    try:
        rider = Rider.objects(user_id=mongo_user_id).first()
        if not rider:
            return Response({"rides": []}, status=200)
        
        rides = RideRequest.objects(rider_id=mongo_user_id)
        
        data = [
            {
                "id": str(r.id),
                "status": r.status,
                "pickup": {"lat": r.pickup.lat, "long": r.pickup.long},
                "dropoff": {"lat": r.dropoff.lat, "long": r.dropoff.long},
            }
            for r in rides if r.pickup and r.dropoff
        ]
        
        return Response({"rides": data}, status=200)
    except Exception as e:
        print(f"Error fetching rides: {e}")
        return Response({"rides": []}, status=200)


# add new call to pull all existing ride requests from db
@api_view(['GET'])
def get_rides(request):
    try:
        rides_qs = RideRequest.objects(status="SEARCHING")
        
        rides = []
        for r in rides_qs:
            # Get rider info
            rider = Rider.objects(user_id=r.rider_id).first()
            rider_name = rider.name if rider else "Unknown Rider"
            initials = "".join([part[0].upper() for part in rider_name.split()[:2]]) if rider_name else "U"
            # print(rider_name)
            if r.pickup and r.dropoff:
                rides.append({
                    "id": str(r.id),
                    "name": rider_name,
                    "initials": initials,
                    "from": r.pickup_str or f"{r.pickup.lat:.4f},{r.pickup.long:.4f}",
                    "to": r.dropoff_str or f"{r.dropoff.lat:.4f},{r.dropoff.long:.4f}",
                    "pickupLocation": {"lat": r.pickup.lat, "lng": r.pickup.long},
                    "dropoffLocation": {"lat": r.dropoff.lat, "lng": r.dropoff.long},
                    "status": r.status,
                })
        
        return Response(rides, status=200)
    except Exception as e:
        print(f"Error fetching rides: {e}")
        return Response([], status=200)
    
@api_view(['POST'])
def accept_ride(request):
    try:
        from bson import ObjectId
        ride_id = request.data.get('ride_id')
        driver_id = request.data.get('driver_id')
        
        # Find and update ride
        ride_req = RideRequest.objects(id=ObjectId(ride_id)).first()
        if not ride_req:
            return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)
        print("coming here")
        ride_req.driver_id = driver_id
        ride_req.status = "ACCEPTED"
        ride_req.save()
        
        # Mark driver as unavailable
        driver = Driver.objects(user_id=driver_id).first()
        if driver:
            driver.is_available = False
            driver.save()
        
        return Response({
            "status": "ACCEPTED",
            "ride_id": str(ride_req.id)
        })
    except Exception as e:
        print(f"Error accepting ride: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_ride_detail(request, ride_id):
    try:
        ride = RideRequest.objects(id=ObjectId(ride_id)).first()
        if not ride:
            return Response({"error: Ride is not found"}, status=status.HTTP_404_NOT_FOUND)
        rider_user = User.objects(id=ride.rider_id).first() if ride.rider_id else None
        driver_user = User.objects(id=ride.driver_id).first() if ride.driver_id else None
        data = {
            "id": str(ride.id),
            "status": ride.status,
            "pickup": {
                "lat": ride.pickup.lat,
                "long": ride.pickup.long,
                "label": ride.pickup_str,
            } if ride.pickup else None,
            "dropoff": {
                "lat": ride.dropoff.lat,
                "long": ride.dropoff.long,
                "label": ride.dropoff_str,
            } if ride.dropoff else None,
            "rider": {
                "id": ride.rider_id,
                "name": rider_user.name if rider_user else None,
                "email": rider_user.email if rider_user else None,
            } if rider_user else None,
            "driver": {
                "id": ride.driver_id,
                "name": driver_user.name if driver_user else None,
                "email": driver_user.email if driver_user else None,
            } if driver_user else None,
        }
        return Response(data, status=200)
    except Exception as e:
        print(f"Error fetching ride detail: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
def users_list(request):
    try:
        if request.method == 'GET':
            users = User.objects()
            data = [{"name": u.name, "email": u.email} for u in users]
            return JsonResponse(data, safe=False)
        elif request.method == 'POST':
            body = json.loads(request.body)
            if User.objects(email=body['email']).first():
                return JsonResponse({"error": "Email already exists"}, status=409)
            user = User(name=body['name'], email=body['email'], password=body['password']).save()
            return JsonResponse({"message": "User created", "id": str(user.id)}, status=201)
    except Exception as e:
        print(f"Error in users_list: {e}")
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def user_login(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            email = body.get('email')
            password = body.get('password')
            
            user = User.objects(email=email, password=password).first()
            if not user:
                return JsonResponse({"message": "Invalid credentials"}, status=401)
            
            return JsonResponse({"message": "Login successful", "name": user.name, "user_id": str(user.id)}, status=200)
        except Exception as e:
            print(f"Login error: {e}")
            return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def user_signup(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            email = body.get('email')
            name = body.get('name')
            password = body.get('password')
            
            if not all([email, name, password]):
                return JsonResponse({'error': 'Missing required fields'}, status=400)
            
            if User.objects(email=email).first():
                return JsonResponse({'error': 'Email already exists'}, status=409)
            
            user = User(name=name, email=email, password=password).save()
            
            # Create corresponding Rider
            Rider(user_id=str(user.id), name=name).save()
            
            return JsonResponse({'message': 'User created', 'user_id': str(user.id)}, status=201)
        except Exception as e:
            print(f"Signup error: {e}")
            return JsonResponse({'error': str(e)}, status=500)

def root(request):
    return HttpResponse("haiii Hello, MongoDB!")
