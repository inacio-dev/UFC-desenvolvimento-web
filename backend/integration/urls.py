from django.urls import path
from .views import register, user_login, user_logout, index, publish_image, search_images, get_profile, update_profile, update_wallet, buy_image

urlpatterns = [
    path('images/', index, name='index'),
    path('cadastro/', register, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('publish-image/', publish_image, name='publish_image'),
    path('search/', search_images, name='search_images'),
    path('profile/<user_id>', get_profile, name='get_profile'),
    path('update-profile/', update_profile, name='update_profile'),
    path('update-wallet/', update_wallet, name='update_wallet'),
    path('buy-image/', buy_image, name='buy_image'),
]
