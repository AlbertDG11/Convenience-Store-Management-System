from django.shortcuts import render
from rest_framework import viewsets

from backend.customer.models import Membership, MemberAddress
from backend.customer.serializers import MembershipSerializer, CustomerAddressSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from backend.employee.permissions import IsSalesPersonOrManager

# Create your views here.

class MembershipViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows memberships to be viewed or edited.
    Only salesperson and manager are allowed to view the customer address.
    """
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    # permission_classes = [IsAuthenticated, IsSalesPersonOrManager]
    # # permission_classes = [AllowAny]


class CustomerAddressViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows memberships to be viewed or edited.
    Only salesperson and manager are allowed to view the customer address.
    """
    queryset = MemberAddress.objects.all()
    serializer_class = CustomerAddressSerializer
    # permission_classes = [IsAuthenticated, IsSalesPersonOrManager]
    # # permission_classes = [AllowAny]

    def get_queryset(self):
        """
        Optionally filter addresses by membership (use ?membership=<id>)
        """
        queryset = MemberAddress.objects.all()
        membership_id = self.request.query_params.get('membership_id')

        if membership_id:
            queryset = queryset.filter(membership_id=membership_id)
        return queryset

