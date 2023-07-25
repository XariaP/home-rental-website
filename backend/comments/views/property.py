from django.http import Http404
from django.shortcuts import render
from comments.models import Comment
from properties.models import Property
from users.models import RestifyUser
from reservations.models import Reservation
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import CreateAPIView, ListAPIView, DestroyAPIView
from comments.serializers import ListCommentsSerializer, AddCommentSerializer, AddReplySerializer
from django.db.models import Q
from django.core.exceptions import PermissionDenied
from rest_framework.response import Response
from comments.paginations import CustomPagination

# Create your views here.
class ListPropertyCommentsView(ListAPIView):
    """ Display comments left by 'terminated' and 'completed renters for this property """
    serializer_class = ListCommentsSerializer
    permission_classes = [AllowAny]
    pagination_class = CustomPagination
    
    def get_queryset(self):
        rental = get_object_or_404(Property, id=self.kwargs['property_id'])
        return rental.comments.all()

class AddPropertyCommentView(CreateAPIView):
    """ User whose request was 'terminated' or 'completed adds a comment for this property """
    serializer_class = AddCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {"property_pk": self.kwargs['property_id'], "writer_pk": self.request.user.pk}
    
    def post(self, request, *args, **kwards):
        property = get_object_or_404(Property, id=self.kwargs['property_id'])
        guest = get_object_or_404(RestifyUser, pk=self.request.user.pk)
        # user_reservations = Reservation.objects.filter(Q(property=property), Q(renter=guest), Q(status__iexact="Completed") | Q(status__iexact="terminated"))
        user_reservations = guest.reservation_set.filter(Q(property=property), Q(status__iexact="Completed") | Q(status__iexact="terminated"))
        # Can't add comment to property you didnt stay at
        if not user_reservations:
            raise PermissionDenied() # Error 403
        else:
            comments = property.comments.filter(written_by=guest)
            # Add constraint for only one comment
            if (user_reservations.count() == comments.count()):
                return Response("You already left a comment for this reservation.")
        return super().post(request)


    
class ReplyPropertyCommentView(CreateAPIView):
    """ Host replies to a comment left by a renter for this property OR user replies to host on their comment """
    serializer_class = AddReplySerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {"property_pk": self.kwargs['property_id'], "writer_pk": self.request.user.pk, "comment_pk": self.kwargs['comment_id']}
    
    def post(self, request, *args, **kwargs):
        reply_to = get_object_or_404(Comment, pk=self.kwargs['comment_id'])
        property = Property.objects.get(pk=self.kwargs['property_id'])
        # Comment is valid
        if reply_to and reply_to.content_object != property:
            return Response({'Page not found': 'Invalid comment ID & property combination'})
        # Allow if host
        if (property.host != request.user):
            guest = get_object_or_404(RestifyUser, id=self.request.user.pk)
            #user_reservations = guest.reservation_set.filter(Q(property=property), Q(status__iexact="Completed") | Q(status__iexact="terminated"))

            # User has no reservations with this property
            if reply_to.written_by != guest:# or not user_reservations:
                raise PermissionDenied() # Error 403
            
            # Prevent adding replies to comments unless a host replied
            if reply_to.replies.count() > 0:
                last_comment = reply_to.replies.latest('date')
                if last_comment.written_by == request.user:
                    return Response("You can\'t reply to your own comment.")
            else:
                return Response("You can\'t reply to your own comment.")
        return super().post(request)
    

class DeletePropertyCommentView(DestroyAPIView):
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
        property = Property.objects.get(pk=self.kwargs['property_id'])
        if reply_to.content_object != property:
            return Response({'Page not found': 'Invalid comment ID & property combination'})
        return super().delete(request)
