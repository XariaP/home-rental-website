from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from accounts.serializers import CreateUserSerializer
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import logout as logout_user

# Create your views here.
class SignupView(CreateAPIView):
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(f"User successfully created for {serializer.data['email']}")
        return super().post(request)

# https://medium.com/geekculture/register-login-and-logout-users-in-django-rest-framework-51486390c29
# https://medium.com/devgorilla/how-to-log-out-when-using-jwt-a8c7823e8a6
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def logout(request):
    logout_user(request)
    return Response('User logged out successfully')


