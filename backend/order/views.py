from django.db import transaction
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.employee.permissions import IsSalesPersonOrManager
from backend.order.models import Orders
from backend.order.serializers import OrderSerializer

# Create your views here.

class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Order Model
    """

    queryset = Orders.objects.all()
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

    @action(detail=True, methods=['post'], url_path = 'cancel')
    def cancel_order(self, request):
        """
        Cancel an order, sets the status to Canceled and restocks inventory
        """
        order = self.get_object()

        if order.status == 'Canceled':
            return Response({'detail: Order has been canceled'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            for item in order.items.all():
                product = item.product
                product.stock += item.quantity
                product.save()

            order.status = 'Canceled'
            order.save()

        # Return updated data
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)