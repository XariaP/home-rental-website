from django.db import models
from users.models import RestifyUser
from django.contrib.contenttypes.fields import GenericRelation
from comments.models import Comment

# Create your models here.
class Property(models.Model):
    name = models.CharField(max_length=150)
    description = models.CharField(max_length=500)
    address = models.CharField(max_length=200)
    num_guests = models.IntegerField()
    num_beds = models.IntegerField()
    num_baths = models.IntegerField()
    amenities = models.JSONField(null=True, blank=True)
    img = models.ImageField(blank=True, null=True)
    # rental_type? (What is this field? Cannot find from the rubric)
    
    # === Relationships ===
    host = models.ForeignKey(RestifyUser, on_delete=models.CASCADE, related_name='property')
    # availability (How can this be modeled?: Data infinitely many)
    comments = GenericRelation(Comment, related_query_name='property')
    # avg_rating is not needed since it is calculatable by avging out the ratings in comment model

    def __str__(self) -> str:
        return f"{self.name} at {self.address}"


class Availability(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    price = models.FloatField()
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='availability')