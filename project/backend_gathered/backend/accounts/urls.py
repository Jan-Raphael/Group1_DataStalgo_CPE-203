from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('signup/', SignupView.as_view()),
    path('login/', LoginView.as_view()),
    path('user/<str:username>/', UserProfileView.as_view()),
    path('avatar/<int:user_id>/', AvatarView.as_view()),
    path('paypal/', paypal_topup),
    path('follow/', follow_user),
    path('subscribe/', subscribe_user),
    path('update/information/<int:user_id>/', update_user_info),
    path('purchased/<int:user_id>/', purchased_posts),
    path('subscriptions/<int:user_id>/', subscriptions_list),
    path('user/subscribe/', toggle_subscription),
]