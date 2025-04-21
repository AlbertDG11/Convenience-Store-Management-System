from rest_framework import serializers
from .models import Membership, MemberAddress

class CustomerAddressSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomerAddress
    """
    class Meta:
        model = MemberAddress
        fields = ['id', 'membership', 'street_address', 'city', 'province', 'postal_code']

class MembershipSerializer(serializers.ModelSerializer):
    """
    Serializer for membership
    """
    address = CustomerAddressSerializer(source='memberaddress_set', many=True, read_only=True)
    class Meta:
        model = Membership
        fields = ['membership_id', 'name', 'address', 'email', 'phone_number']


