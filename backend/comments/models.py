from django.db import models

# Create your models here.
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils import timezone

from users.models import RestifyUser

class Comment(models.Model):
    # User / Property Object
    # https://docs.djangoproject.com/en/4.1/ref/contrib/contenttypes/
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    # Other Details
    written_by = models.ForeignKey(RestifyUser, on_delete=models.CASCADE)
    date = models.DateTimeField(verbose_name="Date posted", default=timezone.localtime)
    #reply = models.OneToOneField("Reply", blank=True, null=True, on_delete=models.SET_NULL)
    content = models.TextField()
    rating = models.IntegerField()

    def __str__(self):
        return self.content

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

class Reply(models.Model):
    reply_to = models.ForeignKey(Comment, related_name="replies", on_delete=models.CASCADE)
    written_by = models.ForeignKey(RestifyUser, on_delete=models.CASCADE)
    date = models.DateTimeField(verbose_name="Date posted", default=timezone.localtime)
    content = models.TextField()

    def __str__(self):
        return self.content