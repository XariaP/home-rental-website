from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework import serializers
from users.models import RestifyUser
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate

class CreateUserSerializer(ModelSerializer):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = serializers.CharField(
        required = True,
        write_only = True,
        label= "Password",
        validators=[validate_password]
        # widget=forms.PasswordInput(attrs={"autocomplete": "new-password"}),
        # help_text=password_validation.password_validators_help_text_html(),
    )
    password2 = serializers.CharField(
        required = True,
        write_only = True,
        label= "Confirm Password",
        # widget=forms.PasswordInput(attrs={"autocomplete": "new-password"}),
        # help_text="Enter the same password as before, for verification.",
    )

    class Meta:
        model = RestifyUser
        fields = ['email', 'password1', 'password2', 'first_name', 'last_name']
        # field_classes = {
        #     "email": forms.EmailField,
        #     "password1" : forms.PasswordInput,
        #     "password2" : forms.PasswordInput,
        # } Not sure if this works or is necessary

    def validate(self, attrs):
        # Check that the two password entries match
        password1 = attrs['password1']
        password2 = attrs['password2']
        if password1 != password2:
            raise ValidationError(
                {"password1": "The two password fields didn't match."}
            )
        return attrs
    
    def create(self, validated_data):
        user = RestifyUser.objects.create(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        user.set_password(validated_data['password1'])
        user.save()
        return user