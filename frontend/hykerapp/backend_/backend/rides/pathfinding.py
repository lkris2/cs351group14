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
from collections import deque

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
    # print(coordinate_map)
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
            dest = int(row["target"])
            dist = float(row["length"])
            # print(start, dest, dist)
            if mode == "car":
                
                if row["car_forward"] != "Forbidden":
                    # print("going here")
                    graph[start].append((dest,dist))

                if row["car_backward"] != "Forbidden":
                    # print("going here too")
                    graph[dest].append((start,dist))
            else:
                raise ValueError("Only going to support car mode")
    # count = 0
    # for node, neighbors in graph.items():
    #     print(f"Node {node}: {neighbors}")
    #     count += 1
    #     if count == 10: 
    #         break
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
                f_score[neighbor] = temp_g + h_value(coord_map, neighbor, goal)

                if neighbor not in open_set:
                    open_set.add(neighbor)
                    heapq.heappush(open_heap,(f_score[neighbor], neighbor))
    
    return None

def get_nearest_node(lat, lon, coord_map, allowed_nodes):
    nearest_node = None
    best_dist = float("inf")
    target = (lat,lon)
    
    for node_id in allowed_nodes:
        if node_id not in coord_map:
            continue
        nlat, nlon = coord_map[node_id]
        d = get_haversine_distance(target, (nlat, nlon))
        if d < best_dist:
            best_dist = d
            nearest_node = node_id
    return nearest_node

def build_components(graph):
    """
    Returns a dict: comp[node_id] = component_id
    Works safely even if graph is a defaultdict(list).
    """
    comp = {}
    comp_id = 0

    
    nodes = set(graph.keys())
    for adj in graph.values():
        for v, _ in adj:
            nodes.add(v)

   
    for node in nodes:
        if node in comp:
            continue

        comp_id += 1
        queue = deque([node])
        comp[node] = comp_id

        while queue:
            u = queue.popleft()
            
            for v, _ in graph.get(u, []):
                if v not in comp:
                    comp[v] = comp_id
                    queue.append(v)

    return comp

# coord_map = load_nodes()
# graph = make_graph("car")

# # Build connected components for the car graph
# components = build_components(graph)
# print("Number of car components:", len(set(components.values())))

# start_lat = 41.87
# start_lon = -87.65          # UIC SCE

# end_lat = 41.8787
# end_lon = -87.6403          # Union Station-ish (NEGATIVE!)

# # 1) Pick start in ANY car node
# all_car_nodes = set(graph.keys())
# start_id = get_nearest_node(start_lat, start_lon, coord_map, all_car_nodes)
# start_comp = components[start_id]

# # 2) Restrict end search to nodes in the SAME component as start
# same_comp_nodes = [nid for nid, cid in components.items() if cid == start_comp]
# end_id   = get_nearest_node(end_lat, end_lon, coord_map, same_comp_nodes)

# print("start_id:", start_id, "deg:", coord_map[start_id])
# print("end_id:", end_id, "deg:", coord_map[end_id])
# print("start neighbors:", len(graph[start_id]))
# print("end neighbors:", len(graph[end_id]))

# path_node_ids = a_star(graph, start_id, end_id, coord_map)
# print("Path nodes:", path_node_ids)

# if path_node_ids:
#     path_coords = [coord_map[nid] for nid in path_node_ids]
#     print("Path coords:", path_coords)
# else:
#     print("No path found")

    


# class PathFinderAlgo:

#     def finding_path(self, start, end):
#         return
    
