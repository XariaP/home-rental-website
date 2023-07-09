from rest_framework.serializers import ModelSerializer, ValidationError
from rest_framework import serializers
from .models import Property, Availability
from users.models import RestifyUser

class CreatePropertySerializer(ModelSerializer):
    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    address = serializers.CharField(required=False)
    num_guests = serializers.CharField(required=True)
    num_beds = serializers.CharField(required=True)
    num_baths = serializers.CharField(required=True)
    amenities = serializers.CharField(required=False)
    img = serializers.ImageField(required=False)
    
    class Meta:
        model = Property
        fields = ['name',
                  'description',
                  'address',
                  'num_guests',
                  'num_beds',
                  'num_baths',
                  'amenities',
                  'img']
        
    def create(self, validated_data):
        host_pk = self.context['host_pk']
        host = RestifyUser.objects.get(pk=host_pk)
        validated_data['host'] = host
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.address = validated_data.get('address', instance.address)
        instance.num_guests = validated_data.get('num_guests', instance.num_guests)
        instance.num_beds = validated_data.get('num_beds', instance.num_beds)
        instance.num_baths = validated_data.get('num_baths', instance.num_baths)
        instance.amenities = validated_data.get('amenities', instance.amenities)
        instance.img = validated_data.get('img', instance.img)
        instance.save()
        return instance
    
class RetrievePropertySerializer(ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'
        

class ListPropertySerializer(ModelSerializer):
    class Meta:
        model = Property
        fields = ['id', 'name', 'description', 'address', 'img', 'host']


class CreateAvailableDateSerializer(ModelSerializer):
    start_date = serializers.DateField(required=True)
    end_date = serializers.DateField(required=True)
    price = serializers.FloatField(required=True)

    class Meta:
        model = Availability
        fields = ['start_date', 'end_date', 'price']
        
    def create(self, validated_data):
        property_pk = self.context['property_pk']
        property = Property.objects.get(id=property_pk)
        validated_data['property'] = property
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)
        instance.price = validated_data.get('price', instance.price)
        instance.save()
        return instance