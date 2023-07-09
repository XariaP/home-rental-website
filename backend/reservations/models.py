from django.db import models

from users.models import RestifyUser
from properties.models import Property
# Create your models here.
class Reservation(models.Model):
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('terminated', 'Terminated'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
        ('denied', 'Denied'),
        ('expired', 'Expired'),
        ('pending cancel', 'Pending cancel')
    )

    
    renter = models.ForeignKey(RestifyUser, on_delete=models.CASCADE)
    
    status = models.CharField(max_length=25, choices=STATUS_CHOICES)
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    date_booked_start = models.DateField()
    date_booked_end = models.DateField()
    num_guests = models.IntegerField(default=1)

    def __str__(self) -> str:
        return f"Reservation for {self.property}"
