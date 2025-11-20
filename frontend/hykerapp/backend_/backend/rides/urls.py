from django.urls import path
from .views import request_ride, drivers_nearby, accept_ride

urlpatterns = [
    path("request_ride/", request_ride),
    path("drivers_nearby/", drivers_nearby),
    path("ride/accept/", accept_ride),
]
