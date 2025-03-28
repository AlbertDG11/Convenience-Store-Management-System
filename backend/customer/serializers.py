from rest_framework import serializers
from .models import Membership, CustomerAddress

class CustomerAddressSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomerAddress
    """
    class Meta:
        model = CustomerAddress
        fields = ['id', 'membership', 'street', 'city', 'province', 'postal_code', 'country']

class MembershipSerializer(serializers.ModelSerializer):
    """
    Serializer for Membership
    """
    address = CustomerAddressSerializer(many=True, read_only=True)
    class Meta:
        model = Membership
        fields = ['id', 'name', 'address', 'email', 'phone']


