# A* algo here

# gets a graph, runs the path finder on it
# before this step needs to set up graph from api data
# build a connected graph
#https://github.com/rust-transit/osm4routing2 << creates routing graph
# run algo on this graph

import csv
from collections import defaultdict 
import math
import heapq

nodes = "nodes.csv"
edges = "edges.csv"

def load_nodes(path=nodes):
    coordinate_map = {}
    with open(path, newline="",encoding="utf-8") as f:
        if "\t" in f.readline():
            reader = csv.DictReader(f,delimiter="\t")
        else:
            reader = csv.DictReader(f)
        f.seek(0)
        reader = csv.DictReader(f)
        for row in reader:
            id = int(row["id"])
            lat = float(row["lat"])
            lon = float(row["lon"])
            coordinate_map[id] = (lat,lon)
    return coordinate_map

def make_graph(mode="car", path=edges):
    graph = defaultdict(list)
    with open(path, newline="",encoding="utf-8") as f:
        if "\t" in f.readline():
            reader = csv.DictReader(f,delimiter="\t")
        else:
            reader = csv.DictReader(f)
        f.seek(0)
        reader = csv.DictReader(f)
        for row in reader:
            start = int(row["source"])
            dest = int(row("target"))
            dist = float(row["length"])
            
            if mode == "car":
                if row["car_forward"] != "Forbidden":
                    graph[start].append((dest,dist))

                if row["car_backward"] != "Forbidden":
                    graph[dest].append((start,dist))
            else:
                raise ValueError("Only going to support car mode")
    return graph

def get_haversine_distance(coord1, coord2):
    earth_radius = 6371000

    lat1, lon1 = coord1
    lat2, lon2 = coord2

    lat1_radian = math.radians(lat1)
    lat2_radian = math.radians(lat2)
    diff_lats = math.radians(lat2 - lat1)
    diff_lons = math.radians(lon2 - lon1)

    dis = math.sin(diff_lats/2)**2 + math.cos(lat1_radian) * math.cos(lat2_radian) * math.sin(diff_lons/2) ** 2
    angle_dis = 2 * math.atan2(math.sqrt(dis), math.sqrt(1-dis))

    return earth_radius * angle_dis


def reconstruct_path(came_from, current):
    path = [current]
    while current in came_from:
        current = came_from[current]
        path.append(current)
    path.reverse()
    return path

def h_value(coord_map, n, goal):
    return get_haversine_distance(coord_map[n], coord_map[goal])

def a_star(graph, start, goal, coord_map):
    open_heap = []
    heapq.heappush(open_heap,(0,start))
    came_from = {}
    g_score = defaultdict(lambda: float("inf"))
    f_score = defaultdict(lambda: float("inf"))

    g_score[start] = 0
    f_score[start] = h_value(coord_map, start, goal)

    open_set = {start}

    while open_heap:
        temp, current = heapq.heappop(open_heap)

        if current == goal:
            return reconstruct_path(came_from, current)
        
        open_set.discard(current)

        for neighbor, weight in graph[current]:
            temp_g = g_score[current] + weight
            
            if temp_g < g_score[neighbor]:
                came_from[neighbor] = current
                g_score[neighbor] = temp_g
                f_score[neighbor] = h_value(coord_map, neighbor, goal)

                if neighbor not in open_set:
                    open_set.add(neighbor)
                    heapq.heappush(open_heap,(f_score[neighbor], neighbor))
    
    return None

def get_nearest_node(lat, lon, coord_map):
    nearest_node = None
    best_dist = float("inf")
    target = (lat,lon)
    
    for node_id, (nlat, nlon) in coord_map.items():
        d = get_haversine_distance(target, (nlat, nlon))
        if d < best_dist:
            best_dist = d
            nearest_node = node_id
    return nearest_node


coord_map = load_nodes()
graph = make_graph("car")

start_lat = 41.87
start_lon = -87.65
end_lat = 41.8787
end_lon = 87.6403

start_id = get_nearest_node(start_lat, start_lon, coord_map)
end_id = get_nearest_node(end_lat, end_lon, coord_map)

path_node_ids = a_star(graph, start_id, end_id, coord_map)
path_coords = [coord_map[nid] for nid in path_node_ids]

print("Path nodes:", path_node_ids)
print("Path coords:", path_coords)


    


# class PathFinderAlgo:

#     def finding_path(self, start, end):
#         return
    
