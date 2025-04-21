from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from backend.employee.permissions import IsPurchasePersonOrManager
from backend.product.models import Inventory
from backend.purchase.models import InventoryPurchase
from backend.purchase.serializers import InventoryPurchaseSerializer


# Create your views here.

class InventoryPurchaseViewSet(viewsets.ModelViewSet):
    """
    ViewSet for InventoryPurchase and Item Model
    """

    allowed_roles = [1,2]
    queryset = InventoryPurchase.objects.all()
    serializer_class = InventoryPurchaseSerializer



    def destroy(self, request, *args, **kwargs):
        """
        delete and rollback InventoryPurchase
        """
        purchase = self.get_object()
        from django.db import transaction
        with transaction.atomic():
            for item in purchase.purchase.orderitem_set.all():
                product = item.product
                quantity = item.quantity_purchased

                inv = Inventory.objects.filter(product=product).first()
                inv.quantity = str(int(inv.quantity) + quantity)
                inv.save()

            purchase.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)






