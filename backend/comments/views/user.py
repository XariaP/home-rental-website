from properties.models import Property
from reservations.models import Reservation
from users.models import RestifyUser
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from rest_framework.response import Response
from comments.models import Comment
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import CreateAPIView, ListAPIView, DestroyAPIView
from comments.serializers import ListCommentsSerializer, AddCommentSerializer
# https://auganrymkhan.com/tutorial/implementing-a-custom-configured-pagination-in-django-rest-framework-using-listapiview-and-apiview
from comments.paginations import CustomPagination

# Create your views here.

class ListUserCommentsView(ListAPIView):
    """ Host views comments about a potential guest """
    serializer_class = ListCommentsSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    
    def get_queryset(self):
        user = get_object_or_404(RestifyUser, id=self.kwargs['user_id'])
        return user.comments_about_user.all()

    def get(self, request, *args, **kwargs):
        guest = get_object_or_404(RestifyUser, id=self.kwargs['user_id'])
        host = get_object_or_404(RestifyUser, id=self.request.user.pk)
        valid_properties = Property.objects.filter(host=host)
        valid_reservations = Reservation.objects.filter(property__in=valid_properties, renter=guest)
        # Can't view user comments who never make a reservation with you
        if not valid_reservations:
            raise PermissionDenied() # Error 403
        return super().get(request)
    #Response(f"{self.request.user.pk}")
        
class AddUserCommentView(CreateAPIView):
    """ Host leaves comments about a past guest """
    serializer_class = AddCommentSerializer
    permission_classes = [IsAuthenticated]
    
    # https://www.django-rest-framework.org/api-guide/generic-views/
    # def get_serializer_class(self):
    #     serializer
    #     return

    def post(self, request, *args, **kwargs):
        guest = get_object_or_404(RestifyUser, id=self.kwargs['user_id'])
        host = get_object_or_404(RestifyUser, id=self.request.user.pk)
        valid_properties = Property.objects.filter(host=host)
        valid_reservations = Reservation.objects.filter(property__in=valid_properties, renter=guest, status__iexact="Completed")
        # User was never a completed guest to host
        if not valid_reservations:
            raise PermissionDenied() # Error 403
        else:
            comments = guest.comments_about_user.filter(written_by=host)
            if (comments.count() == 1):
                return Response("You already left a comment for this user.")
        return super().post(request)

    # https://www.django-rest-framework.org/api-guide/generic-views/
    def get_serializer_context(self):
        return {"user_pk": self.kwargs['user_id'], "writer_pk": self.request.user.pk}
    

class DeleteUserCommentView(DestroyAPIView):
    serializer_class = AddCommentSerializer
    permission_Classes = [IsAuthenticated]

    def get_object(self):
        comment = get_object_or_404(Comment, pk=self.kwargs['pk'])
        if comment.written_by.id != self.request.user.id:
            raise PermissionDenied
        else:
            return comment
    
    def delete(self, request, *args, **kwargs):
        reply_to = get_object_or_404(Comment, pk=self.kwargs['pk'])
        user = RestifyUser.objects.get(pk=self.kwargs['user_id'])
        if reply_to.content_object != user:
            return Response({'Page not found': 'Invalid comment ID & user combination'})
        return super().delete(request)