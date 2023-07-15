from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from .api.viewsets import LoginView, CustomResetPasswordRequestToken
from .views import logout_view

urlpatterns = [
    path('login/', csrf_exempt(LoginView.as_view()), name='login'),
    path('logout/', logout_view, name='logout'),
    path('password_reset/', CustomResetPasswordRequestToken.as_view(), name='password_reset'),
]
