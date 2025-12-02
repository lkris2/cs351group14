from django.urls import path
from .views import root, request_ride, drivers_nearby, accept_ride, users_list, get_rides, user_login, user_signup, find_route, get_ride_detail

urlpatterns = [
    path('', root),
    path("request_ride/", request_ride),
    path("find_route/", find_route),
    path("get_rides/", get_rides),
    path("drivers_nearby/", drivers_nearby),
    path("ride/accept/", accept_ride),
    path("users/", users_list),
    path("users/login/", user_login),
    path("users/signup/", user_signup),
    path('rides/<str:ride_id>/', get_ride_detail),
]