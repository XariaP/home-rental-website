from django.db import models
from users.models import RestifyUser
# Create your models here.

class Notification(models.Model):

    user = models.ForeignKey(RestifyUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=25)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return self.title