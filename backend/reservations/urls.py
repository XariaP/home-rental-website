from django.urls import path
from .views import ReservationListAPIView, create_reservation, cancel_reservation, approve_cancel_reservation, approve_reservation, deny_cancel_reservation, deny_reservation, terminate

app_name="reservations"
urlpatterns = [
    path('', ReservationListAPIView.as_view(), name='reservation-list'),
    path('create/', create_reservation, name='make-reservation'),
    path('<int:reservation_id>/cancel/', cancel_reservation, name='cancel_reservation'),
    path('<int:reservation_id>/approve/', approve_reservation, name='approve_reservation'),
    path('<int:reservation_id>/deny/', deny_reservation, name='deny_reservation'),
    path('<int:reservation_id>/approve_cancel/', approve_cancel_reservation, name='approve_cancel'),
    path('<int:reservation_id>/deny_cancel/', deny_cancel_reservation, name='deny_cancel'),
    path('<int:reservation_id>/terminate/', terminate, name='terminate'),
]
