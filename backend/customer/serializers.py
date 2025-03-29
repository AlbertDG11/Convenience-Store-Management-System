from rest_framework import serializers
from .models import Membership, CustomerAddress

class CustomerAddressSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomerAddress
    """
    class Meta:
        model = CustomerAddress
        fields = '__all__'

class MembershipSerializer(serializers.ModelSerializer):
    """
    Serializer for Membership
    """
    address = CustomerAddressSerializer(many=True, read_only=True)
    class Meta:
        model = Membership
        fields = '__all__'


