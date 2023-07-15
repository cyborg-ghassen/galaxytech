# Create your views here.
from django.contrib.auth import logout
from django.http import HttpResponse
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['POST'])
def logout_view(request):
    logout(request)
    response = Response({'detail': 'Logout successful.'})
    # Delete the session cookie
    response.delete_cookie('sessionid')
    return response


def setcsrf(request):
    csrf_token = get_token(request)
    print(request.COOKIES)  # Check if the CSRF token cookie is present
    print(csrf_token)  # Check the value of the CSRF token
    response = HttpResponse()
    response.set_cookie("csrftoken", csrf_token)
    return response
