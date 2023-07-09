import datetime
from django.shortcuts import get_object_or_404, render
from notifications.models import Notification
# Create your views here.
import django_filters
from django.http import JsonResponse
from rest_framework import status as st
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Reservation, Property
from properties.models import Availability
from .serializers import ReservationSerializer
from users.models import RestifyUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.generics import ListAPIView, CreateAPIView
from rest_framework.pagination import PageNumberPagination
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q



class ReservationFilter(django_filters.FilterSet):

    status = django_filters.CharFilter(field_name='status')

    class Meta:
        model = Reservation
        fields = ['status']

class ReservationsPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100



class ReservationListAPIView(ListAPIView):

    serializer_class = ReservationSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ReservationFilter
    ordering_fields = ['date_booked_start', 'date_booked_end', 'status']
    pagination_class = ReservationsPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        refresh_reservations()
        user = self.request.user

        params = self.request.GET
        user_type = params.get('user_type', None)
        status = params.get('status', None)


        lst = []
        for reservation in Reservation.objects.all():
            if reservation.property.host == user:
                lst.append(reservation.property)

        # query_set = Reservation.objects.filter(renter=user) | Reservation.objects.filter(property__in=lst)
        query_set = Reservation.objects.all()
        # .filter(Q(renter=user) | Q(property__in=lst))

        
        if user_type:
            if user_type == "host":
                query_set = query_set.filter(property__in=lst)
            
            elif user_type == "guest":
                query_set = query_set.filter(renter=user)
            
            else:
                # return Response({'error': 'user_type must be host or guest'}, status=st.HTTP_400_BAD_REQUEST)
                return Reservation.objects.none()
        
        if status:
            if status not in ['pending','approved', 'terminated', 'completed', 'canceled', 'denied', 'expired', 'Expired', 'pending cancel']:
                # return Response({'error': 'Invalid status. Must be one of pending, approved, terminated, completed, canceled, denied, expired, pending cancel'}, status=st.HTTP_400_BAD_REQUEST)
                return Reservation.objects.none()
            if status in ['pending']:
                query_set = query_set.filter(status__startswith='pending')
                # query_set = query_set.filter(Q(status__iexact='pending') | Q(status__iexact='pending cancel'))
            else:
                query_set = query_set.filter(status=status)
        
            
        return query_set


@permission_classes([IsAuthenticated])
@csrf_exempt
@api_view(['POST'])
def create_reservation(request):
    
    user = request.user
    # Get the property and reservation details from the request
    
    # property_id = request.POST.get('property_id', '')
    num_guests = request.POST.get('num_guests')
    # start_date_str = request.POST.get('start_date')
    # end_date_str = request.POST.get('end_date')
    
        # request.POST is [],  use request.data for the request body

    property_id = request.data['property_id']
    num_guests = request.data['num_guests']
    start_date_str = request.data['start_date']
    end_date_str = request.data['end_date']
    
    if property_id is None:
        return JsonResponse({'error': 'property_id is a required field'})
    if num_guests is None:
        return JsonResponse({'error': 'num_guests is a required field'})
    if start_date_str == '':
        return JsonResponse({'error': 'start_date_str is a required field'})
    if end_date_str == '':
        return JsonResponse({'error': 'end_date_str is a required field'})

    # Convert the start and end dates to datetime objects
    start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d').date()
    end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d').date()
    

    # Check if the property is available for the selected dates
    conflicting_reservations = Reservation.objects.filter(
        property_id=property_id,
        status='approved',
        date_booked_start__lt=end_date,
        date_booked_end__gt=start_date
    )
    
    # we_good = False
    # avail = Availability.objects.filter(property_id=property_id)
    # for a in avail:
    #     if a.start_date <= start_date and a.end_date >= end_date:
    #         we_good = True
    #         break

    # if not we_good:
    #     return JsonResponse({'message': 'The property is not available for the selected dates.'})

    if start_date > end_date:
        return JsonResponse({'error': 'Booking start date must be before end date'})
    
    if start_date < datetime.date.today():
        return JsonResponse({'error': 'Booking start date must be in the future'})
    
    if conflicting_reservations.exists():
        return JsonResponse({'message': 'The property is not available for the selected dates. There is a conflicting reservation.'})
    
    property = get_object_or_404(Property, id=property_id)
    if int(num_guests) > property.num_guests:
        return JsonResponse({'message': 'The number of guests is more than the maximum'})
    
    already = Reservation.objects.filter(
        property_id=property_id,
        date_booked_start=start_date,
        date_booked_end=end_date,
        renter=user
    )
    if already.exists():
        return JsonResponse({'message': 'You have already requested this reservation'})
    
    if user == property.host:
        return JsonResponse({'message': 'You cannot reserve your own property'})
    
    # Create the reservation
    
    reservation = Reservation.objects.create(
        status='pending',
        num_guests=num_guests,
        date_booked_start=start_date,
        date_booked_end=end_date,
        renter=user,
        property=property
    )
    notification = Notification(user=property.host, title='Someone wants to rent your property!', message=f'{user} wants to rent your property on {start_date_str}')
    notification.save()

    return JsonResponse({'message': 'Reservation created successfully.'})

@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
def cancel_reservation(request, reservation_id):

    user = request.user
    
    reservation = get_object_or_404(Reservation, id=reservation_id)
    if user != reservation.renter:
        return Response({'error': 'You are unauthorized to cancel this reservation'})

    if reservation.status in ["canceled", "terminated"]:
        return Response({'error': 'This reservation has already been cancelled or terminated.'})
    
    if reservation.status in ["expired", "denied", "completed"]:
        return Response({'error': 'This reservation has already been expired or denied or completed.'})
    
    if reservation.status in ["pending cancel"]:
        return Response({'error': 'This reservation has already requested to cancel.'})
    
    if reservation.status == "approved":
        reservation.status = "pending cancel"
        reservation.save()
        notification = Notification(user=reservation.property.host, title='Someone wants to cancel their reservation', message=f'{user} wants to cancel their reservation')
        notification.save()
        return JsonResponse({'message': 'Reservation is now pending cancelation on approval of host.'})
    
    reservation.status = "canceled"
    reservation.save()

    return JsonResponse({'message': 'Reservation canceled successfully.'})

@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
def approve_reservation(request, reservation_id):

    user = request.user
    
    reservation = get_object_or_404(Reservation, id=reservation_id)
    if user != reservation.property.host:
        return Response({'error': 'You are unauthorized to approve this reservation'})

    if reservation.status in ["approved", "denied"]:
        return Response({'error': 'This reservation has already been approved or denied.'})
    
    if reservation.status in ["terminated", "canceled", "pending cancel"]:
        return Response({'error': 'This reservation has already been terminated or canceled.'})
    
    if reservation.status in ["expired", "completed"]:
        return Response({'error': 'This reservation has already been expired or completed.'})
    
    conflicting_reservations = Reservation.objects.filter(
        property=reservation.property,
        status__in=['approved', 'pending cancel'],
        date_booked_start__lt=reservation.date_booked_end,
        date_booked_end__gt=reservation.date_booked_start
    )
    if conflicting_reservations.exists():
        return JsonResponse({'message': 'The property is not available for the selected dates.'})

    reservation.status = "approved"
    reservation.save()
    notification = Notification(user=reservation.renter, title='Your reservation has been approved!', message=f'Your reservation for {reservation.property} has been approved!')
    notification.save()

    return JsonResponse({'message': 'Reservation approved successfully.'})


@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
def deny_reservation(request, reservation_id):

    user = request.user
    
    reservation = get_object_or_404(Reservation, id=reservation_id)
    if user != reservation.property.host:
        return Response({'error': 'You are unauthorized to deny this reservation'})

    if reservation.status in ["approved", "denied"]:
        return Response({'error': 'This reservation has already been approved or denied.'})
    
    if reservation.status in ["terminated", "canceled", "pending cancel"]:
        return Response({'error': 'This reservation has already been terminated or canceled.'})
    
    if reservation.status in ["expired", "completed"]:
        return Response({'error': 'This reservation has already been expired or completed.'})
    

    reservation.status = "denied"
    reservation.save()
    notification = Notification(user=reservation.renter, title='Your reservation has been denied.', message=f'Your reservation for {reservation.property} has been denied.')
    notification.save()

    return JsonResponse({'message': 'Reservation denied successfully.'})


@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
def approve_cancel_reservation(request, reservation_id):

    user = request.user
    
    reservation = get_object_or_404(Reservation, id=reservation_id)
    if user != reservation.property.host:
        return Response({'error': 'You are unauthorized to approve this reservation'})

    if reservation.status in ["approved", "denied"]:
        return Response({'error': 'This reservation has already been approved or denied.'})
    
    if reservation.status in ["terminated", "canceled"]:
        return Response({'error': 'This reservation has already been terminated or canceled.'})
    
    if reservation.status in ["expired", "completed"]:
        return Response({'error': 'This reservation has already been expired or completed.'})
    
    if reservation.status == "pending":
        return Response({'error': 'This reservation is pending approval or denial. Not pending cancelation.'})
    
    # return JsonResponse({'error': reservation.status})

    reservation.status = "canceled"
    reservation.save()

    notification = Notification(user=reservation.renter, title='Your reservation cancel request has been approved!', message=f'Your reservation cancel request for {reservation.property} has been approved! Your reservation has been canceled successfully.')
    notification.save()

    return JsonResponse({'message': 'Reservation cancellation request approved. Canceled successfully.'})


@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
def deny_cancel_reservation(request, reservation_id):

    user = request.user
    
    reservation = get_object_or_404(Reservation, id=reservation_id)
    if user != reservation.property.host:
        return Response({'error': 'You are unauthorized to deny this reservation'})

    if reservation.status in ["approved", "denied"]:
        return Response({'error': 'This reservation has already been approved or denied.'})
    
    if reservation.status in ["terminated", "canceled"]:
        return Response({'error': 'This reservation has already been terminated or canceled.'})
    
    if reservation.status in ["expired", "completed"]:
        return Response({'error': 'This reservation has already been expired or completed.'})
    
    if reservation.status == "pending":
        return Response({'error': 'This reservation is pending approval or denial. Not pending cancelation.'})

    reservation.status = "approved"
    reservation.save()
    
    notification = Notification(user=reservation.renter, title='Your reservation cancel request has been denied!', message=f'Your reservation cancel request for {reservation.property} has been denied. Your reservation is still in effect.')
    notification.save()

    return JsonResponse({'message': 'Reservation cancellation request denied successfully.'})


@permission_classes([IsAuthenticated])
@api_view(['POST', 'GET'])
def terminate(request, reservation_id):

    user = request.user
    
    reservation = get_object_or_404(Reservation, id=reservation_id)
    if user != reservation.property.host:
        return Response({'error': 'You are unauthorized to terminate this reservation'})

    if reservation.status in ["denied"]:
        return Response({'error': 'This reservation has already been denied.'})
    
    if reservation.status in ["terminated", "canceled"]:
        return Response({'error': 'This reservation has already been terminated or canceled.'})
    
    if reservation.status in ["expired", "completed"]:
        return Response({'error': 'This reservation has already been expired or completed.'})
    
    if reservation.status in ["pending", "pending cancel"]:
         return Response({'error': 'This reservation is pending or pending cancel. Please deny the reservation request instead of terminating or approve cancel request.'})
    
    reservation.status = "terminated"
    reservation.save()

    return JsonResponse({'message': 'Reservation terminated successfully.'})


def refresh_reservations():

    reservations = Reservation.objects.all()
    
    for reservation in reservations:

        if reservation.status == "pending" and reservation.date_booked_start <= datetime.date.today():
            reservation.status = "expired"
            reservation.save()
        
        elif reservation.status == "approved" and reservation.date_booked_end <= datetime.date.today():
            reservation.status = "completed"
            reservation.save()
        
        elif reservation.status == "pending cancel" and reservation.date_booked_start <= datetime.date.today():
            reservation.status = "approved"
            reservation.save()

        # if reservation.status == "expired" and reservation.date_booked_start > datetime.date.today():
        #     reservation.status = "pending"
        #     reservation.save()

