from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from backend.employee.permissions import IsSalesPersonOrManager
from backend.order.models import Order
from backend.order.serializers import OrderSerializer


# Create your views here.


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Order Model
    """

    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    permission_classes = [IsAuthenticated, IsSalesPersonOrManager]

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given queryset.
        """

        queryset = self.queryset
        membership_id = self.request.query_params.get('membership')
        if membership_id:
            queryset = queryset.filter(membership_id=membership_id)
        return queryset



