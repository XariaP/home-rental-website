from django.shortcuts import render, get_object_or_404
from rest_framework.generics import CreateAPIView, RetrieveAPIView, ListAPIView, DestroyAPIView, UpdateAPIView
from ..models import Property, Availability
from rest_framework.permissions import BasePermission, AllowAny, IsAuthenticated
from ..serializers import ListPropertySerializer, CreatePropertySerializer, RetrievePropertySerializer, CreateAvailableDateSerializer
from django.core.exceptions import PermissionDenied
# Create your views here.

class IsHost(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user.id
        host = obj.host.id
        return user == host

class PropertyCreate(CreateAPIView):
    serializer_class = CreatePropertySerializer
    permission_classes = [IsAuthenticated]
    def get_serializer_context(self):
        return {"host_pk": self.request.user.pk}


class AvailableDateCreate(CreateAPIView):
    serializer_class = CreateAvailableDateSerializer
    permission_classes = [IsAuthenticated]
    def get_serializer_context(self):
        property = get_object_or_404(Property, id=self.kwargs['pk'])
        if property.host.id != self.request.user.id:
            raise PermissionDenied
        else:
            return {"property_pk": self.kwargs['pk']}
        

class AvailableDateUpdate(UpdateAPIView):
    serializer_class = CreateAvailableDateSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        date_session = get_object_or_404(Availability, id=self.kwargs['pk'])
        if date_session.property.host.id != self.request.user.id:
            raise PermissionDenied
        else:
            return date_session
        

class AvailableDateDelete(DestroyAPIView):
    serializer_class = CreateAvailableDateSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        date_session = get_object_or_404(Availability, id=self.kwargs['pk'])
        if date_session.property.host.id != self.request.user.id:
            raise PermissionDenied
        else:
            return date_session
    

class PropertyUpdate(UpdateAPIView):
    serializer_class = CreatePropertySerializer
    permission_classes = [IsAuthenticated|IsHost]
    def get_object(self):
        property = get_object_or_404(Property, id=self.kwargs['pk'])
        if property.host.id != self.request.user.id:
            raise PermissionDenied
        else:
            return property
    

class PropertySearch(ListAPIView):
    # Test completed
    serializer_class = ListPropertySerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        params = self.request.GET
        num_guests = params.get('num_guests', None)
        location = params.get('location', None)
        amenities = params.get('amenities', None)
        num_beds = params.get('num_beds', None)
        num_baths = params.get('num_baths', None)
        order_by_1 = params.get('order_by_1', None)
        order_by_2 = params.get('order_by_2', None)
        query_set = Property.objects.all()
        if num_guests:
            query_set = query_set.filter(num_guests__gte=num_guests)
        if location:
            query_set = query_set.filter(address__contains=location)
        if amenities:
            query_set = query_set.filter(amenities__icontains=amenities)
        if num_beds:
            if num_beds == 4:
                query_set = query_set.filter(num_beds__gte=num_beds)
            else:
                query_set = query_set.filter(num_beds=num_beds)
        if num_baths:
            if num_baths == 4:
                query_set = query_set.filter(num_baths__gte=num_baths)
            else:
                query_set = query_set.filter(num_baths=num_baths)
        if order_by_1:
            query_set = query_set.order_by(order_by_1)
        if order_by_2:
            query_set = query_set.order_by(order_by_2)
        return query_set
    

class PropertyManage(ListAPIView):
    # Test completed
    serializer_class = ListPropertySerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        query_set = Property.objects.filter(host=self.request.user)
        return query_set


class PropertyDetail(RetrieveAPIView):
    serializer_class = RetrievePropertySerializer
    permission_classes = [AllowAny]
    def get_object(self):
        return get_object_or_404(Property, id=self.kwargs['pk'])
    

class PropertyDelete(DestroyAPIView):
    serializer_class = CreatePropertySerializer
    permission_classes = [IsAuthenticated|IsHost]
    def get_object(self):
        property = get_object_or_404(Property, id=self.kwargs['pk'])
        if property.host.id != self.request.user.id:
            raise PermissionDenied
        else:
            return property

