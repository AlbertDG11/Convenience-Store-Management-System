# backend/order/views.py

from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from backend.authentication.mixins import RoleRequiredMixin
from .models import Orders
from .serializers import OrderSerializer
from backend.product.models import Inventory

class OrderViewSet(RoleRequiredMixin, viewsets.ModelViewSet):
    allowed_roles = [0, 2]  # Salesperson=0, Manager=2
    queryset = Orders.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        member_id = self.request.query_params.get('member')
        if member_id:
            qs = qs.filter(member_id=member_id)
        return qs

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel_order(self, request, pk=None):
        order = self.get_object()
        if order.order_status == 'Canceled':
            # idempotent: already canceled
            serializer = self.get_serializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)

        with transaction.atomic():
            for item in order.orderitem_set.all():
                inv = Inventory.objects.filter(product=item.product).first()
                inv.quantity = str(int(inv.quantity) + item.quantity_ordered)
                inv.save()
            order.order_status = 'Canceled'
            order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)
