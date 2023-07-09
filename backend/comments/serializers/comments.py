from notifications.models import Notification
from properties.models import Property
from users.models import RestifyUser
from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework import serializers
from comments.models import Comment, Reply

class ListRepliesSerializer(ModelSerializer):
    posted_by = serializers.CharField(source="written_by") # comment.written_by returns null
    
    class Meta:
        model = Reply
        fields = ['id', 'written_by', 'posted_by', 'date', 'content']

class ListCommentsSerializer(ModelSerializer):
    """Display a list of comments"""
    # userID = serializers.IntegerField(source="written_by");
    # Prints First name + Last name
    posted_by = serializers.CharField(source="written_by") # comment.written_by returns null
    replies = ListRepliesSerializer(many=True)
    
    class Meta:
        model = Comment
        # fields = ['id', 'userID', 'posted_by', 'date', 'rating', 'content', 'replies']
        fields = ['id', 'written_by', 'posted_by', 'date', 'rating', 'content', 'replies']

class AddCommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content', 'rating']

    def validate(self, attrs):
        if "rating" in attrs:
            if attrs['rating'] < 0 or attrs['rating'] > 5:
                raise ValidationError(
                    {"rating": "Rating must be 0 to 5 (inclusive)!"}
                )
        return attrs

    def create(self, validated_data):
        obj_about = None
        
        # Get user the comment is about
        if "user_pk" in self.context:
            obj_about = RestifyUser.objects.get(pk=self.context['user_pk'])
        # Get Property comment is for
        elif "property_pk" in self.context:
            obj_about = Property.objects.get(pk=self.context['property_pk'])

        # User who wrote the comment
        writer_obj = RestifyUser.objects.get(pk=self.context['writer_pk'])

        comment = Comment.objects.create(
            content_object=obj_about,
            written_by=writer_obj,
            content=validated_data['content'],
            rating=validated_data['rating'],
        )
        comment.save()

        if "property_pk" in self.context:
            notification = Notification(user=obj_about.host, title='There\'s a new comment about your property!', message=f'{writer_obj} left a comment about your property \'{obj_about.name}\'.')
            notification.save()
        return comment
    
class AddReplySerializer(ModelSerializer):
    class Meta:
        model = Reply
        fields = ['content']

    def create(self, validated_data):
        # User who wrote the comment
        writer_obj = RestifyUser.objects.get(pk=self.context['writer_pk'])
        prev = Comment.objects.get(pk=self.context['comment_pk'])

        comment = Reply.objects.create(
            reply_to = prev,
            written_by = writer_obj,
            content = validated_data['content'],
        )
        comment.save()
        if "property_pk" in self.context:
            obj_about = Property.objects.get(pk=self.context['property_pk'])

            guest = prev.written_by
            host = obj_about.host

            # Host Replied
            # if (self.context['writer_pk'] == host):
            recipient = guest
            user = host
            
            # Renter Replied
            if (self.context['writer_pk'] == guest):
                recipient = host
                user = guest

            notification = Notification(user=recipient, title='There\'s a reply to your comment!', message=f'{user} left you a reply about the property \'{obj_about.name}\'.')
            notification.save()
        return comment