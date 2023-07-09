from django.shortcuts import get_object_or_404
from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework import serializers
from users.models import RestifyUser
from django.contrib.auth.password_validation import validate_password
import re;

class EditUserSerializer(ModelSerializer):
    # new_email = serializers.EmailField(
    #     required=False,
    #     label="Email"
    # )

    password1 = serializers.CharField(
        required=False,
        label= "Password",
        validators=[validate_password]
    )

    password2 = serializers.CharField(
        required=False,
        write_only = True,
        label= "Confirm Password",
    )

    class Meta:
        model = RestifyUser
        # fields = ['new_email', 'email', 'password1', 'password2', 'first_name', 'last_name', 'phone_number', 'avatar']
        fields = ['email', 'password1', 'password2', 'first_name', 'last_name', 'phone_number', 'avatar']

    def validate(self, attrs):
        # Check that the two password entries match
        if "password1" in attrs:
            if "password2" not in attrs:
                raise ValidationError(
                    {"password2": "This field is required."}
                )
            password1 = attrs['password1']
            password2 = attrs['password2']
            if password1 != password2:
                raise ValidationError(
                    {"password1": "The two password fields didn't match."}
                )
        if "phone_number" in attrs:
            if (not re.search("^[0-9]{3}-[0-9]{3}-[0-9]{4}$", attrs['phone_number'])):
                raise ValidationError({"phone_number": "Please use the format XXX-XXX-XXXX"})
        return attrs
    
class DisplayUserSerializer(ModelSerializer):
    class Meta:
        model = RestifyUser
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'avatar']
# renter -> ratings comments
# host -> listings
