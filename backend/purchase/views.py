# backend/purchase/views.py
from rest_framework import viewsets, status

from rest_framework.response import Response
from django.db import transaction

from backend.authentication.mixins import RoleRequiredMixin
from backend.product.models import Inventory
from backend.purchase.models import InventoryPurchase
from backend.purchase.serializers import InventoryPurchaseSerializer

class InventoryPurchaseViewSet(RoleRequiredMixin, viewsets.ModelViewSet):
    allowed_roles = [1, 2]  # Purchaseperson=1, Manager=2
    queryset = InventoryPurchase.objects.all()
    serializer_class = InventoryPurchaseSerializer

    def destroy(self, request, *args, **kwargs):
        purchase = self.get_object()
        with transaction.atomic():
            for itm in purchase.purchaseitem_set.all():
                inv = Inventory.objects.filter(product=itm.product).first()

                inv.quantity = str(int(inv.quantity) - itm.quantity_purchased)
                inv.save()
            purchase.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
