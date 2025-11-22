from django.urls import path
from .views import root, request_ride, drivers_nearby, accept_ride, users_list, user_login, user_signup,list_ride_requests

urlpatterns = [
    path('', root),
    path("request_ride/", request_ride),
    path("ride_requests/", list_ride_requests, name="ride_requests"),
    path("drivers_nearby/", drivers_nearby),
    path("ride/accept/", accept_ride),
    path("users/", users_list),
    path("users/login/", user_login),
    path("users/signup/", user_signup),
]