from django.urls import path
from django.urls import re_path
from .views import register, user_login, user_logout, index, publish_image, search_images

urlpatterns = [
    path('images/', index, name='index'),
    path('cadastro/', register, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('publish-image/', publish_image, name='publish_image'),
    path('search/', search_images, name='search_images'),
]
