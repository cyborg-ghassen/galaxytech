from django.contrib.auth import login
from django.contrib.auth.models import Group
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django_rest_passwordreset.models import ResetPasswordToken
from django_rest_passwordreset.views import ResetPasswordRequestToken
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegistrationSerializer, LoginSerializer, UserSerializer, GroupSerializer
from accounts.models import User

from utils.permissions import ViewAdmin

ensure_csrf = method_decorator(ensure_csrf_cookie)


class RegistrationViewSet(viewsets.ModelViewSet):
    serializer_class = RegistrationSerializer
    permission_classes = (AllowAny,)
    http_method_names = ['post']


csrf_protect_method = method_decorator(csrf_protect)


class LoginView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()

    @csrf_protect_method
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        user_data = UserSerializer(user).data
        return Response({"user": user_data})


class SetCSRFCookie(APIView):
    permission_classes = []
    authentication_classes = []

    @ensure_csrf
    def get(self, request):
        csrf_token = get_token(request)
        response = Response()
        response.set_cookie("csrftoken", csrf_token)
        print(request.COOKIES)
        return Response({'detail': 'CSRF cookie set.',
                         'csrftoken': request.COOKIES.get("csrftoken", None),
                         'sessionid': request.COOKIES.get("sessionid", None)
                         })


class CustomResetPasswordRequestToken(ResetPasswordRequestToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # Get the email from the request data
        email = request.data.get('email')
        try:
            # Get the token associated with the email
            token = ResetPasswordToken.objects.get(user__email=email).key
            # Return the token in the response
            return Response({'token': token})
        except ResetPasswordToken.DoesNotExist:
            # If token does not exist, return the original response
            return response


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.order_by("-date_joined")
    permission_classes = [ViewAdmin]
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.order_by("-id")
    permission_classes = [ViewAdmin]
    serializer_class = GroupSerializer
