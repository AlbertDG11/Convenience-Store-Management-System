from django.shortcuts import render
from rest_framework import viewsets

from backend.customer.models import Membership, CustomerAddress
from backend.customer.serializers import MembershipSerializer, CustomerAddressSerializer
from rest_framework.permissions import IsAuthenticated
from backend.employee.permissions import IsSalesPersonOrManager

# Create your views here.

class MembershipViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows memberships to be viewed or edited.
    Only salesperson and manager are allowed to view the customer address.
    """
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticated, IsSalesPersonOrManager]


class CustomerAddressViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows memberships to be viewed or edited.
    Only salesperson and manager are allowed to view the customer address.
    """
    queryset = CustomerAddress.objects.all()
    serializer_class = CustomerAddressSerializer
    permission_classes = [IsAuthenticated, IsSalesPersonOrManager]

    def get_queryset(self):
        """
        Optionally filter addresses by membership (use ?membership=<id>)
        """
        queryset = CustomerAddress.objects.all()
        membership_id = self.request.query_params.get('membership_id')
        if membership_id:
            queryset = queryset.filter(membership_id=membership_id)
        return queryset

