from properties.models import Property
from reservations.models import Reservation
from users.models import RestifyUser
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from accounts.serializers import EditUserSerializer, DisplayUserSerializer
from rest_framework.response import Response
from rest_framework.generics import UpdateAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class EditInfoView(RetrieveAPIView, UpdateAPIView):
    serializer_class = EditUserSerializer
    permission_classes = [IsAuthenticated]
    
    # https://stackoverflow.com/questions/15424658/how-to-restrict-access-to-certain-user-to-an-updateview
    # def get_object(self):
    #     profile = get_object_or_404(RestifyUser, id=self.kwargs['pk'])
    #     if profile != self.request.user:
    #         raise PermissionDenied() # 403
    #     return profile
    
    def get_object(self):
        return self.request.user
    
    # https://stackoverflow.com/questions/57306682/how-to-update-a-single-field-in-a-model-using-updateapiview-from-djangorestframe
    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # if "new_email" in serializer.data:
            #     user.email = serializer.data['new_email']
            #     user.save()
            if "password1" in serializer.data:
                user.set_password(serializer.data['password1'])
                user.save()
            return Response(serializer.data)
        # Calling super returns the errors
        return super().update(request)

class DisplayInfoView(RetrieveAPIView):
    serializer_class = DisplayUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile = get_object_or_404(RestifyUser, id=self.kwargs['pk'])
        profile_type = self.kwargs['type']
        # if profile_type == "host" :
        #     raise PermissionDenied() # 403
        if profile_type == "renter" and profile != self.request.user:
            user = get_object_or_404(RestifyUser, id=self.kwargs['pk'])
            my_properties = Property.objects.filter(host=self.request.user)
            reservations = Reservation.objects.filter(property__in=my_properties, renter=user)
            # If profile.id does not have a reservation with one of your properties
            if not reservations:
                raise PermissionDenied() # 403
        if profile_type == "renter" and profile == self.request.user:
            raise PermissionDenied() # 403
        return profile
    
class DisplayMyInfoView(RetrieveAPIView):
    serializer_class = DisplayUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile = self.request.user
        return profile