from rest_framework import serializers
from .models import Reservation

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'status', 'num_guests', 'date_booked_start', 'date_booked_end', 'renter', 'property']
