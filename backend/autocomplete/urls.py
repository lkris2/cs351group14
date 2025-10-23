from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AutocompleteViewSet

router = DefaultRouter()
router.register(r'autocomplete', AutocompleteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]