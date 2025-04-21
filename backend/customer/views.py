from django.shortcuts import render
from rest_framework import viewsets

from backend.authentication.mixins import RoleRequiredMixin
from backend.customer.models import Membership, MemberAddress
from backend.customer.serializers import MembershipSerializer, CustomerAddressSerializer


# Create your views here.

class MembershipViewSet(RoleRequiredMixin, viewsets.ModelViewSet):
    """
    API endpoint that allows memberships to be viewed or edited.
    Only salesperson and manager are allowed to view the customer address.
    """
    allowed_roles = [0,2]
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer



class CustomerAddressViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows memberships to be viewed or edited.
    Only salesperson and manager are allowed to view the customer address.
    """
    allowed_roles = [0,2]
    queryset = MemberAddress.objects.all()
    serializer_class = CustomerAddressSerializer


    def get_queryset(self):
        """
        Optionally filter addresses by membership (use ?membership=<id>)
        """
        queryset = MemberAddress.objects.all()
        membership_id = self.request.query_params.get('membership_id')

        if membership_id:
            queryset = queryset.filter(membership_id=membership_id)
        return queryset

