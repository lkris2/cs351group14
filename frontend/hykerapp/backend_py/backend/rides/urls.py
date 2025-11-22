# # from django.urls import path, include
# # from .views import request_ride, drivers_nearby, accept_ride

# # urlpatterns = [
# #     path('api/', include('rides.urls')),
# #     path("request_ride/", request_ride),
# #     path("drivers_nearby/", drivers_nearby),
# #     path("ride/accept/", accept_ride),
# # ]

# from django.contrib import admin
# from django.urls import path, include

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('api/', include('rides.urls')), 
# ]

from django.urls import path
from .views import request_ride, drivers_nearby, accept_ride

urlpatterns = [
    path("request_ride/", request_ride),
    path("drivers_nearby/", drivers_nearby),
    path("ride/accept/", accept_ride),
]