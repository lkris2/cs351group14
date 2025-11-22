import os
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Rider, Driver, Location, RideRequest
import math

from .pathfinding import load_nodes, make_graph, get_nearest_node, a_star, build_components

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

    return Response({"ride_id": ride.id, "status": ride.status, "route": route_coords})

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
