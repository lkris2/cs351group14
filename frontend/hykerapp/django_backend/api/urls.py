from django.urls import path
from . import views

urlpatterns = [
    path('signup', views.signup),
    path('login', views.login),
    path('oauth/google', views.oauth_google),
    path('', views.users_list),
]
